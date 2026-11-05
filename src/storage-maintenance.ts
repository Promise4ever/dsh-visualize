/** Explicit maintenance only. Historical HTML, sidecars, live/unknown locks and unknown files are never deleted. */
import { createHash } from 'node:crypto'
import { lstat, opendir, unlink } from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'
import { assertPlainStorePath, checkedStoreRoot, isMissing, readPlainStoreText } from './storage-safety.ts'
import { MAX_LOCK_BYTES, parseCardLock } from './storage-lock.ts'

export interface StorageInventoryOptions {
  /** At least one minute; defaults to a conservative day. */
  minTempAgeMs?: number
  /** Bound inventory work; an incomplete inventory can never authorize deletion. */
  maxEntries?: number
  /** Opt-in only: recover recognized, dead-process, expired locks after confirmation. */
  includeStaleLocks?: boolean
}
export interface StorageInventoryEntry {
  path: string
  kind: 'card' | 'metadata' | 'temporary' | 'lock' | 'other' | 'directory' | 'symlink'
  size: number
  modifiedAt: number
  /** Opaque freshness comparison; not a permission or a content integrity claim. */
  fingerprint: string
  cleanupEligible: boolean
  lockOwner?: { pid: number; createdAt: number; nonce: string; status: 'live' | 'dead' }
  reason?: string
}
export interface StorageInventory {
  root: string
  minTempAgeMs: number
  includeStaleLocks: boolean
  complete: boolean
  entries: StorageInventoryEntry[]
  confirmationToken: string
}
export interface StorageCleanupResult {
  status: 'dry-run' | 'completed' | 'partial'
  inventory: StorageInventory
  removed: string[]
  error?: { code: string; message: string }
}

const TEMP_NAME = /^(.+\.html(?:\.meta\.json)?)\.([1-9][0-9]*)\.([0-9a-f]{12})\.tmp$/u
const DEFAULT_MIN_AGE = 24 * 60 * 60 * 1000
function fingerprint(info: Awaited<ReturnType<typeof lstat>>): string {
  return [info.dev, info.ino, info.size, info.mtimeMs, info.ctimeMs, info.nlink].join(':')
}
function processAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ESRCH') return false
    if (code === 'EPERM') return true
    throw error
  }
}
async function exists(path: string): Promise<boolean> {
  try { await lstat(path); return true } catch (error) { if (isMissing(error)) return false; throw error }
}
function validatedRoot(root: string): string {
  const absolute = checkedStoreRoot(root)
  if (basename(absolute) !== 'visualize' || absolute === dirname(absolute)) {
    throw new Error('maintenance root must be the explicit visualize store directory')
  }
  return absolute
}

/** Read-only, non-following inventory. A missing store is reported empty, never created. */
export async function inventoryCardStore(root: string, options: StorageInventoryOptions = {}): Promise<StorageInventory> {
  root = validatedRoot(root)
  const minTempAgeMs = options.minTempAgeMs ?? DEFAULT_MIN_AGE
  const maxEntries = options.maxEntries ?? 10_000
  const includeStaleLocks = options.includeStaleLocks === true
  if (!Number.isSafeInteger(minTempAgeMs) || minTempAgeMs < 60_000) throw new Error('temporary retention must be at least one minute')
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1 || maxEntries > 100_000) throw new Error('invalid maintenance inventory limit')
  const entries: StorageInventoryEntry[] = []
  let complete = true
  const now = Date.now()
  const inspect = async (directory: string, depth: number): Promise<void> => {
    await assertPlainStorePath(root, directory)
    const dir = await opendir(directory)
    for await (const entry of dir) {
      if (entries.length >= maxEntries) { complete = false; break }
      const path = join(directory, entry.name)
      const info = await lstat(path)
      const relativePath = relative(root, path).replaceAll('\\', '/')
      let kind: StorageInventoryEntry['kind'] = 'other'
      let cleanupEligible = false
      let reason: string | undefined
      let lockOwner: StorageInventoryEntry['lockOwner']
      if (info.isSymbolicLink()) kind = 'symlink'
      else if (info.isDirectory()) kind = 'directory'
      else if (info.isFile()) {
        if (entry.name.endsWith('.html')) kind = 'card'
        else if (entry.name.endsWith('.html.meta.json')) kind = 'metadata'
        else if (entry.name.endsWith('.html.lock')) {
          kind = 'lock'
          if (depth !== 2) reason = 'outside-session-card-directory'
          else if (info.nlink !== 1 || info.size > MAX_LOCK_BYTES) reason = 'unknown-lock-format'
          else {
            const metadata = parseCardLock(await readPlainStoreText(root, path, MAX_LOCK_BYTES), entry.name.slice(0, -5))
            if (metadata === undefined) reason = 'unknown-lock-format'
            else {
              const live = processAlive(metadata.pid)
              lockOwner = { pid: metadata.pid, createdAt: metadata.createdAt, nonce: metadata.nonce, status: live ? 'live' : 'dead' }
              if (live) reason = 'owner-process-live'
              else if (now - info.mtimeMs < minTempAgeMs || now - metadata.createdAt < minTempAgeMs) reason = 'recent-lock'
              else if (!includeStaleLocks) reason = 'stale-lock-requires-explicit-recovery'
              else cleanupEligible = true
            }
          }
        }
        const temporary = TEMP_NAME.exec(entry.name)
        if (temporary !== null) {
          kind = 'temporary'
          const pid = Number(temporary[2])
          const cardName = temporary[1]!.replace(/\.meta\.json$/u, '')
          if (depth !== 2) reason = 'outside-session-card-directory'
          else if (info.nlink !== 1) reason = 'hard-linked-file'
          else if (!Number.isSafeInteger(pid) || pid > 0x7fffffff) reason = 'invalid-owner-pid'
          else if (now - info.mtimeMs < minTempAgeMs) reason = 'recent-temporary'
          else if (await exists(join(directory, cardName + '.lock'))) reason = 'card-lock-present'
          else if (processAlive(pid)) reason = 'owner-process-live'
          else cleanupEligible = true
        }
      }
      entries.push({ path: relativePath, kind, size: info.size, modifiedAt: info.mtimeMs,
        fingerprint: fingerprint(info), cleanupEligible, ...reason === undefined ? {} : { reason }, ...lockOwner === undefined ? {} : { lockOwner } })
      // Inspect exactly the store/sessions/session levels, never unknown trees or links.
      if (!info.isSymbolicLink() && info.isDirectory()
        && ((depth === 0 && entry.name === 'sessions') || depth === 1)) await inspect(path, depth + 1)
      if (!complete) break
    }
  }
  try { await assertPlainStorePath(root, root) } catch (error) {
    if (!isMissing(error)) throw error
    return { root, minTempAgeMs, includeStaleLocks, complete: true, entries, confirmationToken: token(root, minTempAgeMs, true, entries, includeStaleLocks) }
  }
  await inspect(root, 0)
  entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)
  return { root, minTempAgeMs, includeStaleLocks, complete, entries, confirmationToken: token(root, minTempAgeMs, complete, entries, includeStaleLocks) }
}

function token(root: string, retention: number, complete: boolean, entries: StorageInventoryEntry[], includeStaleLocks: boolean): string {
  return createHash('sha256').update(JSON.stringify({ root, retention, complete, entries, includeStaleLocks })).digest('hex')
}

/** Default is dry-run. Confirmation must match a fresh, complete inventory, not arbitrary paths. */
export async function cleanupCardStoreTemps(
  root: string, options: StorageInventoryOptions & { confirm?: string } = {},
): Promise<StorageCleanupResult> {
  const inventory = await inventoryCardStore(root, options)
  if (options.confirm === undefined) return { status: 'dry-run', inventory, removed: [] }
  if (!inventory.complete) throw new Error('incomplete storage inventory cannot authorize cleanup')
  if (options.confirm !== inventory.confirmationToken) throw new Error('storage inventory changed or confirmation token is invalid; run dry-run again')
  const removed: string[] = []
  for (const entry of inventory.entries.filter(item => item.cleanupEligible)) {
    const path = join(inventory.root, entry.path)
    try {
      await assertPlainStorePath(inventory.root, path)
      const current = await lstat(path)
      if (!current.isFile() || current.nlink !== 1 || fingerprint(current) !== entry.fingerprint) {
        throw new Error('maintenance file changed after cleanup confirmation')
      }
      if (entry.kind === 'lock') {
        const metadata = parseCardLock(await readPlainStoreText(inventory.root, path, MAX_LOCK_BYTES), basename(path).slice(0, -5))
        if (!inventory.includeStaleLocks || metadata === undefined || entry.lockOwner === undefined || metadata.nonce !== entry.lockOwner.nonce
          || metadata.pid !== entry.lockOwner.pid || processAlive(metadata.pid)
          || Date.now() - current.mtimeMs < inventory.minTempAgeMs || Date.now() - metadata.createdAt < inventory.minTempAgeMs) {
          throw new Error('owned lock became active or changed after cleanup confirmation')
        }
      } else {
        const name = TEMP_NAME.exec(basename(path))
        if (entry.kind !== 'temporary' || name === null) throw new Error('not a recognized visualization temporary')
        const pid = Number(name[2])
        if (Date.now() - current.mtimeMs < inventory.minTempAgeMs || processAlive(pid)
          || await exists(join(dirname(path), name[1]!.replace(/\.meta\.json$/u, '') + '.lock'))) {
          throw new Error('temporary file became active after cleanup confirmation')
        }
      }
      await unlink(path)
      removed.push(entry.path)
    } catch (error) {
      if (removed.length === 0) throw error
      return { status: 'partial', inventory, removed, error: {
        code: (error as NodeJS.ErrnoException).code ?? 'CLEANUP_CHANGED', message: (error as Error).message,
      } }
    }
  }
  return { status: 'completed', inventory, removed }
}

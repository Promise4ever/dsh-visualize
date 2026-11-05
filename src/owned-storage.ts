/** Node-only owned-card attributes, optimistic updates, and paired persistence. */
import { createHash } from 'node:crypto'
import { lstat, open, unlink } from 'node:fs/promises'
import { basename } from 'node:path'
import { MAX_LOCK_BYTES, newCardLock, parseCardLock } from './storage-lock.ts'
import { MAX_META_FRAGMENT_BYTES } from './codec.ts'
import { isVisualizeMode, type VisualizeMode } from './fragment.ts'
import { STYLE_IDS, type StyleId } from './style.ts'
import { assertPlainStorePath, ensureStoreParent, isMissing, readPlainStoreText, writePlainStoreText } from './storage-safety.ts'

export interface CardProperties {
  title: string
  mode: VisualizeMode
  style: StyleId
  summary?: string
}
export const CARD_METADATA_SUFFIX = '.meta.json'
const MAX_SIDECAR_BYTES = 16 * 1024
const QUEUES = new Map<string, Promise<void>>()

export function cardContentHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

function propertiesFrom(value: unknown): CardProperties | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const record = value as Record<string, unknown>
  if (typeof record['title'] !== 'string' || record['title'].length > 4096 || !isVisualizeMode(record['mode'])
    || !STYLE_IDS.includes(record['style'] as StyleId)
    || (record['summary'] !== undefined && (typeof record['summary'] !== 'string' || record['summary'].length > 200))) return undefined
  return {
    title: record['title'], mode: record['mode'], style: record['style'] as StyleId,
    ...record['summary'] === undefined ? {} : { summary: record['summary'] as string },
  }
}

export async function readOwnedMetadata(root: string, path: string, content: string): Promise<CardProperties | undefined> {
  let text: string
  try { text = await readPlainStoreText(root, path + CARD_METADATA_SUFFIX, MAX_SIDECAR_BYTES) } catch (error) {
    if (isMissing(error)) return undefined
    throw error
  }
  let record: Record<string, unknown>
  try { record = JSON.parse(text) as Record<string, unknown> } catch { return undefined }
  if (typeof record !== 'object' || record === null || record['version'] !== 1
    || record['contentHash'] !== cardContentHash(content)) return undefined
  return propertiesFrom(record)
}

/** Serializes callers in-process; the exclusive lock refuses concurrent other processes. */
async function locked<T>(root: string, path: string, run: () => Promise<T>): Promise<T> {
  const previous = QUEUES.get(path) ?? Promise.resolve()
  let release!: () => void
  const next = new Promise<void>(resolve => { release = resolve })
  QUEUES.set(path, next)
  await previous
  const lockPath = path + '.lock'
  let lock: Awaited<ReturnType<typeof open>> | undefined
  const owner = newCardLock(basename(path))
  let lockWritten = false
  try {
    await ensureStoreParent(root, path)
    try { lock = await open(lockPath, 'wx', 0o600) } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        throw Object.assign(new Error('visualization card is locked; inspect inventoryCardStore and explicitly confirm stale owned-lock recovery if its process has exited'), { code: 'EEXIST' })
      }
      throw error
    }
    await lock.writeFile(JSON.stringify(owner), 'utf8')
    lockWritten = true
    return await run()
  } finally {
    try {
      if (lock !== undefined) {
        const held = await lock.stat()
        await lock.close()
        await assertPlainStorePath(root, lockPath)
        const current = await lstat(lockPath)
        if (held.ino !== current.ino || held.dev !== current.dev) throw new Error('visualization card lock changed')
        if (lockWritten) {
          const metadata = parseCardLock(await readPlainStoreText(root, lockPath, MAX_LOCK_BYTES), owner.card)
          if (metadata?.nonce !== owner.nonce) throw new Error('visualization card lock owner changed')
        }
        await unlink(lockPath)
      }
    } finally {
      release()
      if (QUEUES.get(path) === next) QUEUES.delete(path)
    }
  }
}

/** Sidecar first, HTML commit last. On failure restore attributes; hash binding also covers crashes. */
export async function writeOwnedCard(
  root: string, path: string, content: string, properties?: CardProperties, expectedContent?: string,
): Promise<void> {
  if (Buffer.byteLength(content, 'utf8') > MAX_META_FRAGMENT_BYTES) throw new Error('visualization exceeds the 4 MiB replay limit')
  const normalized = properties === undefined ? undefined : propertiesFrom(properties)
  if (properties !== undefined && normalized === undefined) throw new Error('invalid visualization card attributes')
  await locked(root, path, async () => {
    let current: string | undefined
    try { current = await readPlainStoreText(root, path, MAX_META_FRAGMENT_BYTES) } catch (error) {
      if (!isMissing(error)) throw error
    }
    if (expectedContent !== undefined && current !== expectedContent) throw new Error('visualization card changed since it was read; read it again before patching')
    // A create cannot silently overwrite an earlier card that has since been patched.
    if (expectedContent === undefined && current !== undefined && current !== content) {
      throw new Error('visualization create would overwrite an existing card; create a new card identity instead')
    }
    const sidecar = path + CARD_METADATA_SUFFIX
    let previousMetadata: string | undefined
    try { previousMetadata = await readPlainStoreText(root, sidecar, MAX_SIDECAR_BYTES) } catch (error) {
      if (!isMissing(error)) throw error
    }
    const metadata = normalized === undefined ? undefined : JSON.stringify({ version: 1, contentHash: cardContentHash(content), ...normalized })
    if (metadata !== undefined && Buffer.byteLength(metadata, 'utf8') > MAX_SIDECAR_BYTES) throw new Error('visualization attributes exceed their size limit')
    if (metadata !== undefined) await writePlainStoreText(root, sidecar, metadata)
    try {
      if (expectedContent !== undefined) {
        const latest = await readPlainStoreText(root, path, MAX_META_FRAGMENT_BYTES)
        if (latest !== expectedContent) throw new Error('visualization card changed during patch; no content was written')
      }
      await writePlainStoreText(root, path, content)
    } catch (error) {
      if (metadata !== undefined) {
        try {
          if (previousMetadata !== undefined) await writePlainStoreText(root, sidecar, previousMetadata)
          else { await assertPlainStorePath(root, sidecar); await unlink(sidecar) }
        } catch (rollback) {
          throw new AggregateError([error, rollback], 'visualization write failed and metadata rollback failed; content hash prevents stale attributes')
        }
      }
      throw error
    }
  })
}

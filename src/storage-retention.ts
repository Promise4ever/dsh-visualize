/**
 * Conservative retention for plugin-owned card files.
 *
 * Every card is also persisted in the session log as a replayable fragment, so
 * an old card file is not needed to render the conversation again; it is only
 * needed if the model patches that same card later. The store would otherwise
 * grow with every session forever, so the plugin prunes whole per-session
 * directories once every file in them is older than the configured retention.
 *
 * The sweep is deliberately all-or-nothing per session directory:
 * - it only walks `visualize/sessions/<segment>/`, never links or unknown trees;
 * - a directory is pruned only when it contains solely plugin card files
 *   (`<slug>.html` / `<slug>.html.meta.json`), all plain single-link files;
 * - locks, temporary files, backups and unknown names make the directory
 *   ineligible (the explicit `lib/maintenance.mjs` command handles those);
 * - the newest mtime of the directory and its files must be older than the
 *   cutoff, which keeps an active session's files out of reach;
 * - every file is re-checked immediately before deletion, and the directory
 *   mtime must not have changed, so a writer cannot race the sweep.
 *
 * The caller decides whether retention is enabled (0 disables it).
 *
 * @module @nagi-ovo/dsh-visualize/storage-retention
 */

import { lstat, opendir, rmdir, unlink } from 'node:fs/promises'
import type { Stats } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { assertPlainStorePath, checkedStoreRoot, isMissing } from './storage-safety.ts'

/** One day in milliseconds. */
export const DAY_MS = 24 * 60 * 60 * 1000

/** Options for one retention sweep. */
export interface RetentionOptions {
  /** Whole days to keep; at least 1. The plugin disables the sweep with 0. */
  retentionDays?: number
  /** Bound directory work; an incomplete sweep deletes nothing further. */
  maxSessions?: number
  /** Injectable clock for tests. */
  now?: number
}

/** One session directory kept by the sweep. */
export interface PreservedSession {
  /** Directory name, relative to `sessions/`. */
  session: string
  /** Why it was not pruned. */
  reason: 'recent' | 'lock' | 'temporary' | 'unknown-file' | 'subdirectory' | 'link' | 'hard-link' | 'changed' | 'unreadable'
}

/** The outcome of one sweep. */
export interface RetentionResult {
  /** Absolute store root. */
  root: string
  /** Effective retention in days. */
  retentionDays: number
  /** Epoch ms before which a session must be to qualify. */
  cutoff: number
  /** False when the session bound was hit; fewer directories were inspected. */
  complete: boolean
  /** Session directories removed, relative to `sessions/`. */
  pruned: string[]
  /** Session directories kept, with the reason. */
  preserved: PreservedSession[]
  /** Individual files removed (cards plus sidecars). */
  removedFiles: number
}

const SESSION_NAME = /^(?:[A-Za-z0-9_-]|~[0-9a-f]{6})+$/u
const CARD_NAME = /^[a-z0-9][a-z0-9._-]*\.html$/u
const META_NAME = /^[a-z0-9][a-z0-9._-]*\.html\.meta\.json$/u
const MAX_SESSIONS = 100_000
const MAX_FILES_PER_SESSION = 1_000

interface FileSnapshot {
  name: string
  path: string
  fingerprint: string
  size: number
  mtimeMs: number
}

interface SessionSnapshot {
  dir: string
  dirMtimeMs: number
  files: FileSnapshot[]
  newest: number
}

function fingerprint(info: Stats): string {
  return [info.dev, info.ino, info.size, info.mtimeMs, info.ctimeMs, info.nlink].join(':')
}

function validRoot(root: string): string {
  const absolute = checkedStoreRoot(root)
  if (basename(absolute) !== 'visualize' || dirname(absolute) === absolute) {
    throw new Error('retention root must be the explicit visualize store directory')
  }
  return absolute
}

/**
 * Inspect one session directory without following links. Returns either a
 * complete snapshot of plain card files, or a reason the directory is not
 * eligible for automatic deletion.
 */
async function inspectSession(dir: string): Promise<SessionSnapshot | PreservedSession['reason']> {
  const dirInfo = await lstat(dir)
  if (dirInfo.isSymbolicLink()) return 'link'
  if (!dirInfo.isDirectory()) return 'unknown-file'
  const files: FileSnapshot[] = []
  let newest = dirInfo.mtimeMs
  for await (const entry of await opendir(dir)) {
    if (files.length >= MAX_FILES_PER_SESSION) return 'unknown-file'
    const path = join(dir, entry.name)
    const info = await lstat(path)
    if (info.isSymbolicLink()) return 'link'
    if (info.isDirectory()) return 'subdirectory'
    if (!info.isFile()) return 'unknown-file'
    if (!CARD_NAME.test(entry.name) && !META_NAME.test(entry.name)) {
      if (entry.name.endsWith('.lock')) return 'lock'
      if (entry.name.endsWith('.tmp')) return 'temporary'
      return 'unknown-file'
    }
    if (info.nlink !== 1) return 'hard-link'
    files.push({ name: entry.name, path, fingerprint: fingerprint(info), size: info.size, mtimeMs: info.mtimeMs })
    newest = Math.max(newest, info.mtimeMs)
  }
  return { dir, dirMtimeMs: dirInfo.mtimeMs, files, newest }
}

function unchanged(before: FileSnapshot, after: Stats): boolean {
  return after.isFile() && after.nlink === 1 && fingerprint(after) === before.fingerprint
}

/**
 * Remove expired per-session card directories. Never creates the store, never
 * follows links, and removes nothing when any part of the directory is not a
 * plain plugin card file.
 * @param root - absolute `visualize` store root.
 * @param options - retention in days and an optional clock.
 * @returns what was inspected, kept and removed.
 */
export async function pruneExpiredSessions(root: string, options: RetentionOptions = {}): Promise<RetentionResult> {
  const absolute = validRoot(root)
  const retentionDays = options.retentionDays ?? 90
  if (!Number.isSafeInteger(retentionDays) || retentionDays < 1) throw new Error('retention must be a whole number of days, at least 1')
  const maxSessions = options.maxSessions ?? MAX_SESSIONS
  if (!Number.isSafeInteger(maxSessions) || maxSessions < 1 || maxSessions > 100_000) throw new Error('invalid retention session limit')
  const now = options.now ?? Date.now()
  if (!Number.isSafeInteger(now) || now < 0) throw new Error('invalid retention clock')
  const cutoff = now - retentionDays * DAY_MS
  const result: RetentionResult = {
    root: absolute, retentionDays, cutoff, complete: true, pruned: [], preserved: [], removedFiles: 0,
  }
  const sessionsDir = join(absolute, 'sessions')
  let sessionsInfo: Stats
  try {
    sessionsInfo = await lstat(sessionsDir)
  } catch (error) {
    if (isMissing(error)) return result
    throw error
  }
  if (sessionsInfo.isSymbolicLink()) throw new Error('visualization sessions directory must not be a link')
  if (!sessionsInfo.isDirectory()) throw new Error('visualization sessions path is not a directory')
  await assertPlainStorePath(absolute, sessionsDir)

  let inspected = 0
  for await (const entry of await opendir(sessionsDir)) {
    if (inspected >= maxSessions) { result.complete = false; break }
    inspected += 1
    if (!SESSION_NAME.test(entry.name)) continue
    const dir = join(sessionsDir, entry.name)
    let snapshot: SessionSnapshot | PreservedSession['reason']
    try {
      snapshot = await inspectSession(dir)
    } catch {
      result.preserved.push({ session: entry.name, reason: 'unreadable' })
      continue
    }
    if (typeof snapshot === 'string') {
      result.preserved.push({ session: entry.name, reason: snapshot })
      continue
    }
    if (snapshot.newest >= cutoff) {
      result.preserved.push({ session: entry.name, reason: 'recent' })
      continue
    }
    try {
      // Revalidate immediately before the first unlink; a concurrent write
      // changes the directory mtime or a file fingerprint and aborts the whole
      // directory rather than leaving it half-deleted.
      const before = await lstat(dir)
      if (!before.isDirectory() || before.mtimeMs !== snapshot.dirMtimeMs) {
        result.preserved.push({ session: entry.name, reason: 'changed' })
        continue
      }
      const current = await Promise.all(snapshot.files.map(async file => await lstat(file.path)))
      if (current.some((info, index) => !unchanged(snapshot.files[index]!, info))) {
        result.preserved.push({ session: entry.name, reason: 'changed' })
        continue
      }
      for (const file of snapshot.files) {
        await assertPlainStorePath(absolute, file.path)
        await unlink(file.path)
        result.removedFiles += 1
      }
      await rmdir(dir)
      result.pruned.push(entry.name)
    } catch (error) {
      // A file that vanished between the check and the unlink is already
      // equivalent to success for that file; other failures leave a partial
      // directory and are reported rather than retried in a loop.
      result.preserved.push({ session: entry.name, reason: isMissing(error) ? 'changed' : 'unreadable' })
    }
  }
  return result
}

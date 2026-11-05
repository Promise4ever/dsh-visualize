/** Recognizable crash-recovery metadata; a filename alone never authorizes lock removal. */
import { randomBytes } from 'node:crypto'

export type CardLockMetadata = {
  kind: 'dsh-visualize-lock'
  version: 1
  pid: number
  createdAt: number
  nonce: string
  card: string
}
export const MAX_LOCK_BYTES = 4096
export function newCardLock(card: string): CardLockMetadata {
  return { kind: 'dsh-visualize-lock', version: 1, pid: process.pid, createdAt: Date.now(), nonce: randomBytes(16).toString('hex'), card }
}
export function parseCardLock(text: string, card: string): CardLockMetadata | undefined {
  let value: unknown
  try { value = JSON.parse(text) } catch { return undefined }
  if (typeof value !== 'object' || value === null) return undefined
  const record = value as Record<string, unknown>
  if (record['kind'] !== 'dsh-visualize-lock' || record['version'] !== 1 || record['card'] !== card
    || typeof record['pid'] !== 'number' || !Number.isSafeInteger(record['pid']) || record['pid'] < 1 || record['pid'] > 0x7fffffff
    || typeof record['createdAt'] !== 'number' || !Number.isSafeInteger(record['createdAt']) || record['createdAt'] < 1
    || typeof record['nonce'] !== 'string' || !/^[0-9a-f]{32}$/u.test(record['nonce'])) return undefined
  return { kind: 'dsh-visualize-lock', version: 1, pid: record['pid'], createdAt: record['createdAt'], nonce: record['nonce'], card }
}

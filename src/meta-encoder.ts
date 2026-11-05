/** Node-only encoder; never import this module from the browser dependency graph. */
import { gzipSync } from 'node:zlib'
import { MAX_META_FRAGMENT_BYTES, MAX_META_GZIP_BYTES, type WireFragment } from './codec.ts'

/** Keep small/incompressible input verbatim, accounting for the whole JSON envelope. */
export function encodeWireFragment(fragment: string): WireFragment {
  const bytes = Buffer.from(fragment, 'utf8')
  if (bytes.byteLength > MAX_META_FRAGMENT_BYTES) throw new Error('visualization exceeds the 4 MiB replay limit')
  // Preserve lone surrogate code units instead of replacing them during UTF-8 encoding.
  if (bytes.length < 8192 || bytes.toString('utf8') !== fragment) return fragment
  const compressed = gzipSync(bytes, { level: 6 })
  if (compressed.byteLength > MAX_META_GZIP_BYTES) return fragment
  const envelope = { encoding: 'gzip-base64' as const, data: compressed.toString('base64'), byteLength: bytes.byteLength }
  const rawSize = Buffer.byteLength(JSON.stringify(fragment), 'utf8')
  const encodedSize = Buffer.byteLength(JSON.stringify(envelope), 'utf8')
  return encodedSize + Math.max(64, Math.ceil(rawSize * 0.05)) < rawSize ? envelope : fragment
}

/** Browser-safe, synchronous replay codec. Node encoding lives in meta-encoder.ts. */
import { gunzipSync } from 'fflate'

/** Hard replay ceiling, independent of a deployment's configurable authoring limit. */
export const MAX_META_FRAGMENT_BYTES = 4 * 1024 * 1024
export const MAX_META_GZIP_BYTES = MAX_META_FRAGMENT_BYTES
export const MAX_META_BASE64_CHARS = Math.ceil(MAX_META_GZIP_BYTES / 3) * 4

export type GzipFragmentEnvelope = {
  encoding: 'gzip-base64'
  data: string
  byteLength: number
}
export type WireFragment = string | GzipFragmentEnvelope

/** UTF-8 byte count without allocating an attacker-sized byte buffer. */
export function fragmentByteLength(value: string): number {
  let bytes = 0
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    if (code < 0x80) bytes += 1
    else if (code < 0x800) bytes += 2
    else if (code >= 0xd800 && code <= 0xdbff && i + 1 < value.length
      && value.charCodeAt(i + 1) >= 0xdc00 && value.charCodeAt(i + 1) <= 0xdfff) {
      bytes += 4
      i += 1
    } else bytes += 3
    if (bytes > MAX_META_FRAGMENT_BYTES) return bytes
  }
  return bytes
}

/** Decode only our bounded single-member gzip envelope; legacy strings remain valid. */
export function decodeWireFragment(value: unknown): string | undefined {
  try {
    if (typeof value === 'string') {
      return value.length <= MAX_META_FRAGMENT_BYTES && fragmentByteLength(value) <= MAX_META_FRAGMENT_BYTES ? value : undefined
    }
    if (typeof value !== 'object' || value === null) return undefined
    const envelope = value as Record<string, unknown>
    if (envelope['encoding'] !== 'gzip-base64' || typeof envelope['data'] !== 'string') return undefined
    const size = envelope['byteLength']
    if (typeof size !== 'number' || !Number.isSafeInteger(size) || size < 0 || size > MAX_META_FRAGMENT_BYTES) return undefined
    const data = base64Bytes(envelope['data'])
    // The encoder emits a fixed header (no optional gzip header fields).
    if (data === undefined || data.length < 20 || data[0] !== 0x1f || data[1] !== 0x8b || data[2] !== 8 || data[3] !== 0) return undefined
    const trailer = new DataView(data.buffer, data.byteOffset + data.length - 8, 8)
    if (trailer.getUint32(4, true) !== size) return undefined
    // fflate's fixed-output inflater truncates excess output rather than throwing.
    // Count the actual DEFLATE output first, refusing excess work and trailing members.
    if (!validDeflateSize(data.subarray(10, -8), size)) return undefined
    const output = gunzipSync(data, { out: new Uint8Array(size + 1) })
    if (output.length !== size || crc32(output) !== trailer.getUint32(0, true)) return undefined
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(output)
  } catch {
    return undefined
  }
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
function base64Bytes(text: string): Uint8Array | undefined {
  if (text.length === 0 || text.length > MAX_META_BASE64_CHARS || text.length % 4 !== 0) return undefined
  if (/[^A-Za-z0-9+/=]/u.test(text)) return undefined
  const padding = text.endsWith('==') ? 2 : text.endsWith('=') ? 1 : 0
  if (text.slice(0, text.length - padding).includes('=')) return undefined
  const size = text.length / 4 * 3 - padding
  if (size > MAX_META_GZIP_BYTES) return undefined
  // Canonical padding bits prevent multiple spellings of the same input.
  if (padding === 2 && (ALPHABET.indexOf(text[text.length - 3]!) & 15) !== 0) return undefined
  if (padding === 1 && (ALPHABET.indexOf(text[text.length - 2]!) & 3) !== 0) return undefined
  const bytes = new Uint8Array(size)
  let at = 0
  for (let i = 0; i < text.length; i += 4) {
    const bits = ALPHABET.indexOf(text[i]!) << 18 | ALPHABET.indexOf(text[i + 1]!) << 12
      | (text[i + 2] === '=' ? 0 : ALPHABET.indexOf(text[i + 2]!)) << 6
      | (text[i + 3] === '=' ? 0 : ALPHABET.indexOf(text[i + 3]!))
    bytes[at++] = bits >>> 16
    if (at < size) bytes[at++] = bits >>> 8
    if (at < size) bytes[at++] = bits
  }
  return bytes
}

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let crc = index
  for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 0xedb88320 ^ crc >>> 1 : crc >>> 1
  return crc >>> 0
})
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 255]! ^ crc >>> 8
  return (crc ^ 0xffffffff) >>> 0
}

interface Huffman { table: Int32Array; bits: number }
function huffman(lengths: readonly number[]): Huffman {
  const max = Math.max(...lengths)
  if (max === 0 || max > 15) throw new Error('invalid huffman tree')
  const counts = new Uint16Array(16)
  for (const length of lengths) if (length > 0) counts[length] = counts[length]! + 1
  const next = new Uint16Array(16)
  let code = 0
  for (let bits = 1; bits <= max; bits += 1) {
    code = (code + counts[bits - 1]!) * 2
    if (code + counts[bits]! > 1 << bits) throw new Error('oversubscribed huffman tree')
    next[bits] = code
  }
  const table = new Int32Array(1 << max)
  for (let symbol = 0; symbol < lengths.length; symbol += 1) {
    const length = lengths[symbol]!
    if (length === 0) continue
    let reversed = 0
    let canonical = next[length]!
    next[length] = canonical + 1
    for (let i = 0; i < length; i += 1) { reversed = reversed * 2 + (canonical & 1); canonical >>>= 1 }
    for (let index = reversed; index < table.length; index += 1 << length) table[index] = symbol << 5 | length
  }
  return { table, bits: max }
}
const FIXED_LITERAL = huffman(Array.from({ length: 288 }, (_, i) => i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8))
const FIXED_DISTANCE = huffman(Array.from({ length: 32 }, () => 5))
const LENGTH_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258]
const LENGTH_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
const DISTANCE_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]
const DISTANCE_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
const DYNAMIC_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]

/** Structural preflight counts output without materializing it, stopping at the declared bound. */
function validDeflateSize(data: Uint8Array, expected: number): boolean {
  let position = 0
  let produced = 0
  const read = (bits: number): number => {
    if (position + bits > data.length * 8) throw new Error('truncated deflate')
    const at = position >>> 3
    const value = ((data[at] ?? 0) | (data[at + 1] ?? 0) << 8 | (data[at + 2] ?? 0) << 16) >>> (position & 7)
    position += bits
    return value & (1 << bits) - 1
  }
  const symbol = (tree: Huffman): number => {
    const at = position >>> 3
    const value = ((data[at] ?? 0) | (data[at + 1] ?? 0) << 8 | (data[at + 2] ?? 0) << 16) >>> (position & 7)
    const entry = tree.table[value & (1 << tree.bits) - 1]!
    const length = entry & 31
    if (length === 0) throw new Error('invalid deflate code')
    read(length)
    return entry >>> 5
  }
  let final = 0
  do {
    final = read(1)
    const type = read(2)
    if (type === 0) {
      position = Math.ceil(position / 8) * 8
      const size = read(16)
      if ((size ^ read(16)) !== 0xffff || produced + size > expected) return false
      position += size * 8
      if (position > data.length * 8) return false
      produced += size
      continue
    }
    if (type === 3) return false
    let literal = FIXED_LITERAL
    let distance = FIXED_DISTANCE
    if (type === 2) {
      const literals = read(5) + 257
      const distances = read(5) + 1
      const codes = read(4) + 4
      if (literals > 286) return false
      const lengths = Array.from({ length: 19 }, () => 0)
      for (let i = 0; i < codes; i += 1) lengths[DYNAMIC_ORDER[i]!] = read(3)
      const tree = huffman(lengths)
      const values: number[] = []
      while (values.length < literals + distances) {
        const value = symbol(tree)
        if (value < 16) values.push(value)
        else {
          if (value === 16 && values.length === 0) return false
          const count = value === 16 ? read(2) + 3 : value === 17 ? read(3) + 3 : read(7) + 11
          if (values.length + count > literals + distances) return false
          const repeated = value === 16 ? values[values.length - 1]! : 0
          for (let i = 0; i < count; i += 1) values.push(repeated)
        }
      }
      if (!values[256]) return false
      literal = huffman(values.slice(0, literals))
      const distanceLengths = values.slice(literals)
      // An unused all-zero distance tree is legal for a literal-only block.
      distance = distanceLengths.some(Boolean) ? huffman(distanceLengths) : { table: new Int32Array(1), bits: 0 }
    }
    for (;;) {
      const value = symbol(literal)
      if (value === 256) break
      if (value < 256) produced += 1
      else {
        if (value > 285) return false
        const index = value - 257
        const length = LENGTH_BASE[index]! + read(LENGTH_EXTRA[index]!)
        const dist = symbol(distance)
        if (dist > 29 || DISTANCE_BASE[dist]! + read(DISTANCE_EXTRA[dist]!) > produced) return false
        produced += length
      }
      if (produced > expected) return false
    }
  } while (final === 0)
  return produced === expected && Math.ceil(position / 8) === data.length
}

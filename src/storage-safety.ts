/** Shared fail-closed filesystem checks for plugin-owned storage and maintenance. */
import { constants, type Stats } from 'node:fs'
import { lstat, mkdir, open, rename, unlink } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { randomBytes } from 'node:crypto'

export function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === 'ENOENT'
}
export function insidePath(root: string, target: string): boolean {
  const rel = relative(root, target)
  return rel.length > 0 && rel !== '..' && !rel.startsWith('..' + sep) && !isAbsolute(rel)
}

/** Never follow a link in the store root, a session directory, or the leaf. */
export async function assertPlainStorePath(root: string, target: string, allowMissing = false): Promise<void> {
  if (!isAbsolute(root) || !isAbsolute(target) || (target !== root && !insidePath(root, target))) {
    throw new Error('visualization path escapes its store')
  }
  const parts = relative(root, target).split(sep).filter(Boolean)
  let current = root
  for (let index = 0; index <= parts.length; index += 1) {
    if (index > 0) current = join(current, parts[index - 1]!)
    let info: Stats
    try { info = await lstat(current) } catch (error) {
      if (allowMissing && isMissing(error)) return
      throw error
    }
    if (info.isSymbolicLink() || (index < parts.length ? !info.isDirectory() : !info.isDirectory() && !info.isFile())) {
      throw new Error('visualization store links and special files are not allowed')
    }
    if (info.isFile() && info.nlink !== 1) throw new Error('visualization store hard links are not allowed')
  }
}

export async function ensureStoreParent(root: string, target: string): Promise<void> {
  await assertPlainStorePath(root, target, true)
  await mkdir(dirname(target), { recursive: true, mode: 0o700 })
  await assertPlainStorePath(root, target, true)
}

/** A bounded read also checks the opened inode, rather than trusting a prior path lookup. */
export async function readPlainStoreText(root: string, path: string, maxBytes: number): Promise<string> {
  await assertPlainStorePath(root, path)
  const before = await lstat(path)
  if (!before.isFile() || before.size > maxBytes) throw new Error('visualization store file exceeds its size limit')
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0))
  try {
    const opened = await handle.stat()
    if (!opened.isFile() || opened.nlink !== 1 || before.ino !== opened.ino || before.dev !== opened.dev) {
      throw new Error('visualization store file changed while opening')
    }
    const bytes = Buffer.alloc(Math.min(opened.size + 1, maxBytes + 1))
    let offset = 0
    for (;;) {
      const { bytesRead } = await handle.read(bytes, offset, bytes.length - offset, offset)
      offset += bytesRead
      if (bytesRead === 0 || offset === bytes.length) break
    }
    if (offset > maxBytes || offset !== opened.size) throw new Error('visualization store file changed while reading')
    const after = await handle.stat()
    if (after.size !== opened.size || after.mtimeMs !== opened.mtimeMs || after.ctimeMs !== opened.ctimeMs) {
      throw new Error('visualization store file changed while reading')
    }
    await assertPlainStorePath(root, path)
    return bytes.subarray(0, offset).toString('utf8')
  } finally { await handle.close() }
}

/** The filename is also the only temporary-file grammar maintenance will consider. */
export async function writePlainStoreText(root: string, path: string, content: string): Promise<void> {
  await ensureStoreParent(root, path)
  const temp = path + '.' + process.pid + '.' + randomBytes(6).toString('hex') + '.tmp'
  let created = false
  try {
    const handle = await open(temp, 'wx', 0o600)
    created = true
    try { await handle.writeFile(content, 'utf8') } finally { await handle.close() }
    await assertPlainStorePath(root, path, true)
    await assertPlainStorePath(root, temp)
    await rename(temp, path)
  } finally {
    if (created) {
      // Only remove our unique temp, and never turn a failed check into a second route.
      try {
        await assertPlainStorePath(root, temp)
        await unlink(temp)
      } catch (error) { if (!isMissing(error)) throw error }
    }
  }
}

export function checkedStoreRoot(root: string): string {
  if (!isAbsolute(root)) throw new Error('visualization store root must be absolute')
  return resolve(root)
}

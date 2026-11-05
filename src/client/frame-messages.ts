/** Height reports come from opaque sandbox origins, so bind them to the frame window and token. */
import { HEIGHT_MESSAGE_TYPE } from '../shell.ts'

export function frameHeight(
  event: MessageEvent,
  frame: HTMLIFrameElement | null,
  token: string,
  minimum: number,
  maximum: number,
): number | undefined {
  const source = frame?.contentWindow
  // Do not compare event.origin with the host: sandbox=allow-scripts reports "null".
  if (source == null || event.source !== source) return undefined
  const data: unknown = event.data
  if (typeof data !== 'object' || data === null) return undefined
  const report = data as { type?: unknown; token?: unknown; height?: unknown }
  if (report.type !== HEIGHT_MESSAGE_TYPE || report.token !== token) return undefined
  if (typeof report.height !== 'number' || !Number.isFinite(report.height) || report.height < 0) return undefined
  return Math.max(minimum, Math.min(Math.ceil(report.height), maximum))
}

/** Each mounted shell has its own token, including concurrent previews in different sessions. */
export function frameToken(scope: string): string {
  const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
  return scope + ':' + random
}

/** Host-version tolerant ownership. No stream frame or module-global event guess. */
import { isVisualizeSessionId, isVisualizeTurn } from './fragment.ts'

export interface ExecutionOwner {
  readonly agent?: {
    readonly turn?: unknown
    readonly session: { readonly id?: unknown; readonly header?: { readonly id?: unknown; readonly cwd?: string } }
  }
}

export function executionIdentity(exec: ExecutionOwner): { turn?: number; sessionId?: string } {
  const session = exec.agent?.session
  const id = session?.id
  const headerId = session?.header?.id
  if (isVisualizeSessionId(id) && isVisualizeSessionId(headerId) && id !== headerId) {
    throw new Error('visualization session identity disagrees with its header')
  }
  const sessionId = isVisualizeSessionId(id) ? id : isVisualizeSessionId(headerId) ? headerId : undefined
  const turn = exec.agent?.turn
  return {
    ...sessionId === undefined ? {} : { sessionId },
    ...isVisualizeTurn(turn) ? { turn } : {},
  }
}

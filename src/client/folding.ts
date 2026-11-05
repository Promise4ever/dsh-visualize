/**
 * Canonical-tail availability. The historical filename is kept for consumers,
 * but transcript modes and collapse timing no longer decide card ownership.
 */

/** Optional service lookup, including hosts predating the Conversation API. */
export interface FoldingHost {
  get(name: string): unknown
}

export interface SnapshotSource<Value> {
  getSnapshot(): Value
  subscribe(listener: () => void): () => void
}

export interface VisualizeTailSource extends SnapshotSource<boolean> {
  /** Set only after all canonical tail registrations have succeeded. */
  setRegistered(registered: boolean): void
}

/** Each apply call owns its own lifecycle; neither hosts nor sessions share it. */
export function createVisualizeTailSource(): VisualizeTailSource {
  let registered = false
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => registered,
    subscribe: listener => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    setRegistered: next => {
      if (next === registered) return
      registered = next
      for (const listener of listeners) listener()
    },
  }
}

export const NO_VISUALIZE_TAIL: SnapshotSource<boolean> = {
  getSnapshot: () => false,
  subscribe: () => () => undefined,
}

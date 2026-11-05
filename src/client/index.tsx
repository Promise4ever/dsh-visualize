/** Browser registration: one canonical tail, a light tool record, and the live dock. */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-tool/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ConversationNodeDefinition, ConversationViewDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { VisualizeCard } from './VisualizeCard.tsx'
import { StreamingPreview, streamDefinition } from './StreamingPreview.tsx'
import { createVisualizeTailSource, type FoldingHost, type SnapshotSource } from './folding.ts'
import {
  EMPTY_TURN_CARDS, TURN_CARDS_KEY, turnCardsDefinition, turnCardsViewDefinition, TurnCards,
  type TurnCardsSnapshot,
} from './TurnCards.tsx'
import { registerSettingsSection } from './settings.tsx'
import { registerOpenPageTarget } from './open-page.ts'

export const name = 'dsh-visualize'
export const inject = ['slots']

type Dispose = () => void
interface ConversationEvents {
  register(definition: ConversationNodeDefinition): Dispose
}
interface ConversationRuntime {
  readonly events: ConversationEvents
  readonly views: { register(definition: ConversationViewDefinition): Dispose }
  binding(sessionId: string): { target?(target: string): SnapshotSource<TurnCardsSnapshot | undefined> }
}
interface LocaleService extends SnapshotSource<{ active: string }> {}
interface SidebarBrowserFace {
  openTab(kind: string, options?: { params?: { url?: string } }): void
}

function lookup(host: FoldingHost, name: string): unknown {
  try { return host.get(name) } catch { return undefined }
}

function conversationEvents(host: FoldingHost): ConversationEvents | undefined {
  const service = lookup(host, 'uiConversation') as { events?: Partial<ConversationEvents> } | undefined
  return typeof service?.events?.register === 'function' ? service.events as ConversationEvents : undefined
}

/** Old hosts remain usable through the complete toolview instead of a dead tail. */
function conversationRuntime(host: FoldingHost): ConversationRuntime | undefined {
  const service = lookup(host, 'uiConversation') as Partial<ConversationRuntime> | undefined
  return typeof service?.events?.register === 'function' && typeof service.views?.register === 'function' && typeof service.binding === 'function'
    ? service as ConversationRuntime : undefined
}

function localeOf(host: FoldingHost): LocaleService | undefined {
  const locale = lookup(host, 'locale') as Partial<LocaleService> | undefined
  return typeof locale?.getSnapshot === 'function' && typeof locale.subscribe === 'function' ? locale as LocaleService : undefined
}

/** target.subscribe activates the private View using the official Session binding API. */
export function turnCardsSource(host: FoldingHost, sessionId: string): SnapshotSource<TurnCardsSnapshot | undefined> | undefined {
  try {
    const source = conversationRuntime(host)?.binding(sessionId).target?.(TURN_CARDS_KEY)
    return typeof source?.getSnapshot === 'function' && typeof source.subscribe === 'function' ? source : undefined
  } catch { return undefined }
}

/** Never hide a tool's output just because a host declares a tail-shaped slot. */
export function tailSourceFor(host: FoldingHost, sessionId: string, registered: SnapshotSource<boolean>): SnapshotSource<boolean> {
  return {
    getSnapshot: () => registered.getSnapshot() && turnCardsSource(host, sessionId) !== undefined,
    subscribe: listener => registered.subscribe(listener),
  }
}

const EMPTY_CARDS_SOURCE: SnapshotSource<TurnCardsSnapshot | undefined> = {
  getSnapshot: () => EMPTY_TURN_CARDS,
  subscribe: () => () => undefined,
}

function turnTailOptions(host: FoldingHost) {
  const locale = localeOf(host)
  return {
    name: 'conversation.chat.turnTail',
    id: 'dsh-visualize-cards',
    order: 100,
    // Intentionally no chain selector: older chain tails cannot read the
    // session-bound private View before mounting. Registration then falls back
    // without suppressing their toolview, rather than claiming unrelated turns.
    inject: (sessionId: string) => ({ hooks: {
      visualizeCards: turnCardsSource(host, sessionId) ?? EMPTY_CARDS_SOURCE,
      ...locale === undefined ? {} : { locale },
    } }),
  } as const
}

export function apply(ctx: ClientContext): void {
  const tail = createVisualizeTailSource()
  ctx.slots.inject('tool.call.toolview', () => {
    const locale = localeOf(ctx)
    return ctx.slots.register({
      name: 'tool.call.toolview', key: 'visualize',
      inject: (sessionId: string) => ({ hooks: {
        visualizeTail: tailSourceFor(ctx, sessionId, tail),
        ...locale === undefined ? {} : { locale },
      } }),
    }, VisualizeCard)
  })
  ctx.inject(['uiConversation'], (scope: ClientContext) => {
    conversationEvents(scope)?.register(streamDefinition as ConversationNodeDefinition)
  })
  ctx.slots.inject('conversation.input.dock', () => {
    const locale = localeOf(ctx)
    return ctx.slots.register({
      name: 'conversation.input.dock', id: 'visualize-stream', order: 30,
      inject: () => locale === undefined ? {} : { hooks: { locale } },
    }, StreamingPreview)
  })
  ctx.slots.inject('conversation.chat.turnTail', () => {
    const runtime = conversationRuntime(ctx)
    if (runtime === undefined) return () => undefined
    const disposers: Dispose[] = []
    try {
      disposers.push(runtime.events.register(turnCardsDefinition as ConversationNodeDefinition))
      disposers.push(runtime.views.register(turnCardsViewDefinition as ConversationViewDefinition))
      disposers.push(ctx.slots.register(turnTailOptions(ctx), TurnCards))
      tail.setRegistered(true)
    } catch (error) {
      tail.setRegistered(false)
      for (const dispose of [...disposers].reverse()) dispose()
      // A legacy chain requires a selector unavailable at session-independent
      // registration time. Keep the complete toolview on those hosts.
      console.warn('[dsh-visualize] Canonical tail unavailable; retaining tool cards.', error)
      return () => undefined
    }
    let disposed = false
    return () => {
      if (disposed) return
      disposed = true
      tail.setRegistered(false)
      for (const dispose of [...disposers].reverse()) dispose()
    }
  }) 
  // The desktop host denies popup windows; publish the page and show it in the
  // in-app browser tab when the sidebar service is present. The node half
  // falls back to the operating system browser when this target is absent.
  ctx.inject(['sidebarRight'], (scope: ClientContext) => {
    const sidebar = (scope as unknown as { sidebarRight?: SidebarBrowserFace }).sidebarRight
    if (typeof sidebar?.openTab !== 'function') return
    const dispose = registerOpenPageTarget(url => {
      sidebar.openTab('browser', { params: { url } })
      return true
    })
    scope.effect(() => dispose, 'dsh-visualize: in-app open target')
  })
  // Settings retain their independent optional-host compatibility.
  registerSettingsSection(ctx)
}

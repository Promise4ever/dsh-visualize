/**
 * Replay-safe visualization output, owned by the completed-turn tail.
 *
 * A root call and its PTC dispatches share one call-id Context. The Context's
 * complete evidence can resolve a turn even when history begins at a result,
 * and the host's View builder combines those independent Contexts per turn.
 * No Definition writes another Context's Location key or keeps session state
 * in module globals.
 */

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type {
  ConversationMatch, ConversationNodeContext, ConversationNodeDefinition,
  ConversationViewDefinition, ConversationViewNode, TurnLocation,
} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { HostObservable, InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the turn-tail SlotMap declaration.
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import { visualizeMetaFrom, type VisualizeMeta } from '../fragment.ts'
import { Frame } from './VisualizeCard.tsx'
import { useVisualizeLanguage, type VisualizeLocaleHook } from './frame-locale.ts'

/** Definition kind and private Conversation View target. */
export const TURN_CARDS_KEY = 'dsh-visualize'

/** One replayable result version, addressed by its actual producing call. */
export interface TurnCard {
  readonly callId: string
  readonly seq: number
  readonly meta: VisualizeMeta
}

export interface VisualizeTurnData {
  readonly cards: readonly TurnCard[]
}

/** Immutable publication assembled independently for each host Session. */
export interface TurnCardsSnapshot {
  readonly byTurn: ReadonlyMap<number, readonly TurnCard[]>
}

declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
  interface ConversationTurnDataMap {
    /** Read-only compatibility with Location data published by older clients. */
    'dsh-visualize': VisualizeTurnData
  }
  interface ConversationViewSnapshotMap {
    'dsh-visualize': TurnCardsSnapshot
  }
}

export interface TurnCardsState extends VisualizeTurnData {
  readonly turn: number | undefined
}

interface TurnCardsNode extends ConversationViewNode {
  readonly target: typeof TURN_CARDS_KEY
  readonly data: TurnCardsState
}

const EMPTY_CARDS: readonly TurnCard[] = []
export const EMPTY_TURN_CARDS: TurnCardsSnapshot = { byTurn: new Map() }
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isTurn = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0
const idOf = (value: unknown): string | undefined => typeof value === 'string' && value.length > 0
  ? value : typeof value === 'number' && Number.isSafeInteger(value) ? String(value) : undefined

type Event = ConversationMatch['event']

/** Keep malformed/foreign event payloads out of the Definition. */
function dataOf(event: Event): Record<string, unknown> | undefined {
  return isRecord(event.data) ? event.data : undefined
}

function rootCallId(event: Event): string | undefined {
  const data = dataOf(event)
  if (data === undefined) return undefined
  if (event.type === 'tool/call') return idOf(data.callId)
  if (event.type === 'tool/ptc-dispatch') return idOf(data.parentCallId)
  if (event.type !== 'tool/result' || !isRecord(data.message) || !isRecord(data.message.source)) return undefined
  return idOf(data.message.source.callId)
}

function cardFromEvent(event: Event): TurnCard | undefined {
  const data = dataOf(event)
  if (data === undefined) return undefined
  let callId: string | undefined
  if (event.type === 'tool/ptc-dispatch') {
    if (data.isError === true) return undefined
    callId = idOf(data.subCallId)
  } else if (event.type === 'tool/result') {
    if (!isRecord(data.message) || data.message.isError === true) return undefined
    callId = rootCallId(event)
  } else return undefined
  if (callId === undefined) return undefined
  const meta = visualizeMetaFrom(data.meta)
  return meta === undefined ? undefined : { callId, seq: event.seq, meta }
}

/**
 * Explicit parent/root coordinates outrank dispatch placement. In a partial
 * window a later outer result can already name the parent turn, so start reads
 * all collected matches, not just its first event. Prepend replays this lookup.
 */
export function contextTurn(matches: readonly ConversationMatch[]): number | undefined {
  for (const type of ['tool/call', 'tool/result']) {
    for (const match of matches) {
      const data = dataOf(match.event)
      if (match.event.type === type && isTurn(data?.turn)) return data.turn
    }
  }
  for (const match of matches) {
    const data = dataOf(match.event)
    if (isTurn(data?.turn)) return data.turn
    const meta = cardFromEvent(match.event)?.meta as (VisualizeMeta & { turn?: unknown }) | undefined
    if (isTurn(meta?.turn)) return meta.turn
  }
  for (const match of matches) {
    if (match.location.kind === 'turn' || match.location.kind === 'step') return match.location.turn.turn
  }
  return undefined
}

function sameMeta(left: VisualizeMeta, right: VisualizeMeta): boolean {
  return left === right || (left.path === right.path && left.fragment === right.fragment && left.title === right.title
    && left.mode === right.mode && left.style === right.style && left.summary === right.summary)
}

function sameCard(left: TurnCard, right: TurnCard): boolean {
  return left === right || (left.callId === right.callId && left.seq === right.seq && sameMeta(left.meta, right.meta))
}

/** Idempotently retain one version per call; do not discard older path versions. */
function recordCard(cards: readonly TurnCard[], card: TurnCard): readonly TurnCard[] {
  const index = cards.findIndex(existing => existing.callId === card.callId)
  if (index === -1) return [...cards, card]
  const existing = cards[index]!
  if (card.seq < existing.seq || sameCard(existing, card)) return cards
  return cards.map((value, at) => at === index ? card : value)
}

/**
 * Combine chronological results for display. An update replaces its path in
 * place, while duplicate surfaces of the same call remain one card. Replaying
 * an identical result preserves identity; replacing its payload updates it.
 */
export function foldCard(cards: readonly TurnCard[], card: TurnCard): readonly TurnCard[] {
  const index = cards.findIndex(existing => existing.callId === card.callId || existing.meta.path === card.meta.path)
  if (index === -1) return [...cards, card]
  const existing = cards[index]!
  if (card.seq < existing.seq || sameCard(existing, card)) return cards
  return cards.map((value, at) => at === index ? card : value)
}

function reduceCard(context: ConversationNodeContext<TurnCardsState>, match: ConversationMatch): TurnCardsState {
  const turn = contextTurn(context.matches)
  const previous = context.state
  const card = cardFromEvent(match.event)
  const cards = card === undefined ? previous?.cards ?? EMPTY_CARDS : recordCard(previous?.cards ?? EMPTY_CARDS, card)
  return previous !== undefined && previous.turn === turn && previous.cards === cards ? previous : { turn, cards }
}

/** Every accepted event may initialize its call Context in a partial window. */
export const turnCardsDefinition: ConversationNodeDefinition<TurnCardsState> = {
  kind: TURN_CARDS_KEY,
  target: TURN_CARDS_KEY,
  match: (event) => {
    if (event.type !== 'tool/call' && event.type !== 'tool/result' && event.type !== 'tool/ptc-dispatch') return null
    if (event.type === 'tool/ptc-dispatch' && cardFromEvent(event) === undefined) return null
    const callId = rootCallId(event)
    return callId === undefined ? null : { id: callId, role: 'start' }
  },
  start: reduceCard,
  update: reduceCard,
  buildViewNode: (context) => context.state === undefined ? null : {
    key: context.key, kind: TURN_CARDS_KEY, id: context.id, target: TURN_CARDS_KEY, data: context.state,
  },
}

function sameCards(left: readonly TurnCard[] | undefined, right: readonly TurnCard[]): boolean {
  return left !== undefined && left.length === right.length && left.every((card, index) => sameCard(card, right[index]!))
}

/** Public factory also makes replay/replace behavior independently testable. */
export function createTurnCardsBuilder() {
  const nodes = new Map<string, TurnCardsNode>()
  let snapshot = EMPTY_TURN_CARDS
  const materialize = (): TurnCardsSnapshot => {
    const grouped = new Map<number, TurnCard[]>()
    for (const node of nodes.values()) {
      if (!isTurn(node.data.turn) || node.data.cards.length === 0) continue
      const cards = grouped.get(node.data.turn) ?? []
      cards.push(...node.data.cards)
      grouped.set(node.data.turn, cards)
    }
    const byTurn = new Map<number, readonly TurnCard[]>()
    for (const [turn, cards] of grouped) {
      cards.sort((left, right) => left.seq - right.seq || left.callId.localeCompare(right.callId))
      const previous = snapshot.byTurn.get(turn)
      byTurn.set(turn, sameCards(previous, cards) ? previous! : cards)
    }
    if (byTurn.size === snapshot.byTurn.size && [...byTurn].every(([turn, cards]) => snapshot.byTurn.get(turn) === cards)) return snapshot
    snapshot = { byTurn }
    return snapshot
  }
  return {
    empty: EMPTY_TURN_CARDS,
    replace: ({ nodes: next }: { readonly nodes: readonly TurnCardsNode[] }) => {
      nodes.clear()
      for (const node of next) if (node.data.cards.length > 0) nodes.set(node.key, node)
      return materialize()
    },
    apply: ({ upserts }: { readonly upserts: readonly TurnCardsNode[] }) => {
      let changed = false
      for (const node of upserts) {
        const previous = nodes.get(node.key)
        if (node.data.cards.length === 0) { changed = nodes.delete(node.key) || changed; continue }
        if (previous !== undefined && previous.data.turn === node.data.turn && previous.data.cards === node.data.cards) continue
        nodes.set(node.key, node)
        changed = true
      }
      return changed ? materialize() : snapshot
    },
  }
}

/** The host creates a fresh builder for each Session, with no cross-session maps. */
export const turnCardsViewDefinition: ConversationViewDefinition<TurnCardsNode, TurnCardsSnapshot> = {
  target: TURN_CARDS_KEY,
  create: createTurnCardsBuilder,
}

/** Only deduplicate after the sequence boundary, so later updates cannot hide an earlier answer's version. */
export function cardsBefore(turn: TurnLocation | undefined, seq: number, snapshot?: TurnCardsSnapshot): readonly TurnCard[] {
  if (turn === undefined) return EMPTY_CARDS
  const cards = snapshot === undefined ? turn.data?.get(TURN_CARDS_KEY)?.cards ?? EMPTY_CARDS : snapshot.byTurn.get(turn.turn) ?? EMPTY_CARDS
  let visible: readonly TurnCard[] = EMPTY_CARDS
  for (const card of cards) if (card.seq < seq) visible = foldCard(visible, card)
  return visible
}

/** Canonical output includes tools settling after the closing assistant message. */
export function cardsForTurn(turn: TurnLocation | undefined, snapshot?: TurnCardsSnapshot): readonly TurnCard[] {
  return cardsBefore(turn, Infinity, snapshot)
}

/** Legacy selector remains pure; modern list tails select inside their component. */
export function selectTurnCards(owner: { turn?: TurnLocation; seq: number }): readonly TurnCard[] | null {
  const cards = cardsBefore(owner.turn, owner.seq)
  return cards.length === 0 ? null : cards
}

export type TurnCardsInjected = InjectFace<{
  readonly hooks: { readonly visualizeCards: HostObservable<TurnCardsSnapshot | undefined> }
}> & { readonly useLocale?: VisualizeLocaleHook }

const listStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, margin: '8px 0 4px', minWidth: 0 }
const disclosureStyle: CSSProperties = { minWidth: 0, border: '1px solid var(--border, #8884)', borderRadius: 8, padding: '8px 10px' }

/** Stable keyed groups survive prepend and never unload a visited frame on close. */
function CardGroup({ card, primary, useLocale }: { card: TurnCard; primary: boolean; useLocale?: VisualizeLocaleHook }) {
  const [open, setOpen] = useState(primary)
  const [visited, setVisited] = useState(primary)
  const lang = useVisualizeLanguage(useLocale)
  useEffect(() => { if (primary) { setOpen(true); setVisited(true) } }, [primary])
  return (
    <details style={primary ? { minWidth: 0 } : disclosureStyle} open={primary || open} onToggle={event => {
      const expanded = event.currentTarget.open
      if (!primary) setOpen(expanded)
      if (expanded) setVisited(true)
    }}>
      <summary style={primary ? { display: 'none' } : { cursor: 'pointer', fontSize: 12 }}>
        {card.meta.title || (lang === 'en' ? 'Visualization' : '可视化')}
      </summary>
      {(primary || visited) && <div style={primary ? undefined : { paddingTop: 8 }}>
        <Frame meta={card.meta} callId={'turn-tail:' + card.callId} useLocale={useLocale} />
      </div>}
    </details>
  )
}

/** Canonical in every transcript mode; it never follows collapseTiming or work-details settings. */
export function TurnCards({ turn, useVisualizeCards, useLocale }: PropsRuntime<'conversation.chat.turnTail'> & TurnCardsInjected) {
  const snapshot = useVisualizeCards((value: TurnCardsSnapshot | undefined) => value ?? EMPTY_TURN_CARDS)
  const cards = useMemo(() => cardsForTurn(turn, snapshot), [turn, snapshot])
  if (cards.length === 0) return null
  return (
    <div style={listStyle} data-visualize-tail="true">
      {cards.map((card, index) => <CardGroup key={card.meta.path} card={card} primary={index === 0} useLocale={useLocale} />)}
    </div>
  )
}

/**
 * The `visualize` toolview: renders the persisted fragment from the call's
 * durable meta inside `<iframe sandbox="allow-scripts">` with the frame's own
 * CSP. Replay-stable by construction — everything drawn derives from the
 * logged call slice, never from the fragment file.
 *
 * Theme bridge: the card resolves the host's `--dsw-alias-*` design tokens
 * (whale-blue brand accent included) at render time and injects them into the
 * frame document as `--dsh-viz-*` variables; a mutation of the root element's
 * attributes or an OS appearance flip re-resolves them, so the frame follows
 * live theme switches. The frame body stays transparent to blend with the
 * conversation surface.
 *
 * Height: a sandboxed frame's document is unreachable from the parent, so the
 * frame posts its scroll height (tagged with this call's id) and the card
 * sizes the iframe, capped per mode with internal scrolling past the cap.
 *
 * Open in new window: the header's icon button reopens the same frame
 * document full-size in its own tab, wrapped in a script-free page whose only
 * content is the identically sandboxed iframe (see window-doc.ts).
 *
 * Page mode: a `page` card is built for a whole browser tab, so the chat shows
 * a launcher instead — title, summary, a live but inert thumbnail of the page
 * laid out at desktop width and scaled into the card, and a button that opens
 * the page through the same script-free wrapper. A secondary toggle shows the
 * page in the conversation, for browsers or hosts that will not open a tab.
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client'
import { visualizeMetaFrom, visualizeMetaFromArgs, type VisualizeMeta } from '../fragment.ts'
import { buildFrameDoc, type FrameVariant } from '../shell.ts'
import { buildWindowDoc, FRAME_SANDBOX } from '../window-doc.ts'
import { resolveTheme } from './theme.ts'
import { liveStyle, noteSettledStyle } from './style.ts'
import { frameHeight, frameToken } from './frame-messages.ts'
import { useFirstVisible } from './frame-lifecycle.ts'
import { frameLabels, useVisualizeLanguage, type VisualizeLocaleHook } from './frame-locale.ts'
import { canOpenPageViaHost, openPageViaHost } from './open-page.ts'
import type { SettingsLang } from './settings-locale.ts'

/** Iframe height bounds; content beyond the cap scrolls inside the frame. */
const MIN_HEIGHT = 48
const HEIGHT_CAP: Record<VisualizeMeta['mode'], number> = { inline: 800, wide: 1200, page: 800 }

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
  fontSize: 12,
  opacity: 0.65,
  margin: '2px 0 6px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}

/**
 * The card never widens its column: `minWidth: 0` lets the card shrink as a
 * flex or grid item (whose automatic minimum is its min-content width, here
 * the whole no-wrap header), so a long path truncates instead of stretching
 * the frame past the transcript.
 */
const cardStyle: CSSProperties = { minWidth: 0, maxWidth: '100%' }

/** Title keeps its width until it alone fills the row; the path yields first. */
const titleStyle: CSSProperties = {
  fontWeight: 500,
  flexShrink: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const pathStyle: CSSProperties = { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }

/** Icon button at the header's end; it never yields width to the path. */
const openStyle: CSSProperties = {
  alignSelf: 'center',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginLeft: 'auto',
  width: 22,
  height: 22,
  padding: 0,
  border: 0,
  borderRadius: 4,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  // The header clips its overflow; keep the focus ring inside the button.
  outlineOffset: -2,
}

/** A navigation request is not proof a native WebView displayed a window. */
export type WindowOpenResult = 'opened' | 'requested' | 'unconfirmed' | 'unavailable'

/**
 * Reserve a trusted blank tab synchronously, sever its opener, THEN navigate
 * to the script-free wrapper. Calling open(url, ..., 'noopener') instead
 * returns null even on successful browser opens, so it cannot detect failure.
 * Successful Blob URLs live until the host page unloads, allowing tab reloads.
 */
export function openInWindow(meta: VisualizeMeta, callId: string): WindowOpenResult {
  if (!canOpenWindow()) return 'unavailable'
  let popup: Window | null = null
  let url: string | undefined
  try {
    popup = window.open('about:blank', '_blank')
    if (popup === null || popup.closed) return 'unconfirmed'
    // The only document with an opener is our trusted, empty about:blank.
    popup.opener = null
    if (popup.opener !== null) throw new Error('Could not isolate the new window')
    url = URL.createObjectURL(new Blob([buildCardPage(meta, callId)], { type: 'text/html' }))
    popup.location.replace(url)
    // Native hosts may return a handle without creating a visible window.
    // Without a confirmed host window API, keep the in-chat fallback available.
    return '__TAURI_INTERNALS__' in window || '__TAURI__' in window ? 'unconfirmed' : 'requested'
  } catch {
    try {
      if (url !== undefined && typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(url)
    } catch { /* Cleanup must not hide the usable in-chat fallback. */ }
    try { popup?.close() } catch { /* A native host may reject close as well. */ }
    return 'unconfirmed'
  }
}

/** Build the standalone, script-free page shared by popup and loopback opens. */
function buildCardPage(meta: VisualizeMeta, callId: string): string {
  const { themeVars, colorScheme } = resolveTheme()
  const variant = variantOf(meta)
  const frameDoc = buildFrameDoc({
    fragment: meta.fragment, title: meta.title, themeVars, colorScheme,
    style: meta.style, reportToken: frameToken('window:' + callId), variant,
  })
  const background = (variant === 'page' ? themeVars.page : themeVars.card) ?? ''
  return buildWindowDoc({ frameDoc, title: meta.title, colorScheme, background, variant })
}

/**
 * Open a card outside the conversation. The desktop host denies popups before
 * navigation, so try its loopback page first; a browser keeps the Blob tab.
 * @param meta - settled card metadata.
 * @param callId - stable id used to scope height messages.
 * @returns whether a page was opened, requested from a browser, or failed.
 */
export function openCardPage(meta: VisualizeMeta, callId: string): WindowOpenResult | Promise<WindowOpenResult> {
  if (!canOpenPageViaHost()) return openInWindow(meta, callId)
  return openPageViaHost(buildCardPage(meta, callId), meta.title)
    .then(opened => opened ? 'opened' as const : openInWindow(meta, callId))
    .catch(() => openInWindow(meta, callId))
}

/** Apply a synchronous browser result or wait for the desktop page round-trip. */
function settleOpen(attempt: WindowOpenResult | Promise<WindowOpenResult>, done: (result: WindowOpenResult) => void): void {
  if (typeof attempt === 'string') done(attempt)
  else void attempt.then(done)
}

/** Feature detection only: actual open/navigation errors are handled on click. */
function canOpenWindow(): boolean {
  return typeof window !== 'undefined' && typeof window.open === 'function'
    && typeof URL.createObjectURL === 'function'
}

/** The frame variant a card's mode lays its document out for. */
function variantOf(meta: VisualizeMeta): FrameVariant {
  return meta.mode === 'page' ? 'page' : 'card'
}

/** Arrow-out-of-box glyph, sized to the 12px header text. */
function OpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2.5h4v4" />
      <path d="M13.5 2.5 7.5 8.5" />
      <path d="M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
    </svg>
  )
}

const frameStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  border: 0,
  background: 'transparent',
}

/** First text line of the durable result content, for the error row. */
function firstResultLine(content: readonly { type: string; text?: string }[], fallback: string): string {
  for (const block of content) {
    if (block.type === 'text' && typeof block.text === 'string' && block.text.length > 0) {
      const newline = block.text.indexOf('\n')
      return newline === -1 ? block.text : block.text.slice(0, newline)
    }
  }
  return fallback
}

/**
 * Re-render trigger for host theme switches: bumped whenever the host flips
 * appearance, so each frame document re-resolves the bridged palette.
 * @returns a counter that changes on every theme change.
 */
export function useThemeTick(): number {
  const [themeTick, setThemeTick] = useState(0)
  useEffect(() => {
    const bump = () => setThemeTick(tick => tick + 1)
    const observer = new MutationObserver(records => {
      // A locale change must not reload an interactive frame.
      if (records.some(record => record.attributeName !== 'lang')) bump()
    })
    // Both mount points: DSH toggles dark via a body attribute, other hosts
    // conventionally re-theme via root-element attributes.
    observer.observe(document.documentElement, { attributes: true })
    observer.observe(document.body, { attributes: true })
    const media = matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', bump)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', bump)
    }
  }, [])
  return themeTick
}

/** One built frame document and the scheme baked into it. */
interface FrameDoc {
  doc: string
  /**
   * The `color-scheme` the document's root declares. The iframe element must
   * use the same one: where the two differ, the browser paints an opaque
   * canvas behind the document instead of letting the card's transparent
   * background show the chat surface (a near-black slab in dark mode).
   * Chrome reads a sandboxed (out-of-process) frame's scheme when the element
   * loads, and misses a change that lands together with a new `srcdoc`, so
   * the frames key on it: a theme switch mounts a fresh iframe, which reloads
   * just as the new `srcdoc` alone would.
   */
  colorScheme: 'light' | 'dark'
}

/**
 * The frame document for one card, rebuilt on theme changes.
 * @param meta - the card.
 * @param reportToken - height-report correlation token.
 * @param variant - surface the document lays out for.
 * @returns the srcdoc string and its scheme, for the iframe's own `color-scheme`.
 */
function useFrameDoc(meta: VisualizeMeta, reportToken: string, variant: FrameVariant): FrameDoc {
  const themeTick = useThemeTick()
  return useMemo(() => {
    const { themeVars, colorScheme } = resolveTheme()
    const doc = buildFrameDoc({
      fragment: meta.fragment, title: meta.title, themeVars, colorScheme, reportToken, variant, style: meta.style,
    })
    return { doc, colorScheme }
    // themeTick is the deliberate re-resolution trigger for the palette read.
  }, [meta.fragment, meta.title, meta.style, reportToken, variant, themeTick])
}

/** The sandboxed frame, bound to its exact WindowProxy and mounted token. */
function SizedFrame({ meta, callId, thumbnail, width }: {
  meta: VisualizeMeta; callId: string; thumbnail: boolean; width: number
}) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [token] = useState(() => frameToken(callId))
  const [height, setHeight] = useState(MIN_HEIGHT)
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const measured = frameHeight(event, frameRef.current, token, MIN_HEIGHT, Math.max(...Object.values(HEIGHT_CAP)))
      if (measured !== undefined) setHeight(measured)
    }
    addEventListener('message', onMessage)
    return () => removeEventListener('message', onMessage)
  }, [token])
  const { doc, colorScheme } = useFrameDoc(meta, token, variantOf(meta))
  const scale = width > 0 ? width / THUMB_VIEWPORT_WIDTH : 0.5
  return (
    <iframe
      key={colorScheme}
      ref={frameRef}
      sandbox={FRAME_SANDBOX}
      referrerPolicy="no-referrer"
      title={meta.title}
      srcDoc={doc}
      tabIndex={thumbnail ? -1 : undefined}
      aria-hidden={thumbnail || undefined}
      style={thumbnail ? {
        ...frameStyle, position: 'absolute', top: 0, left: 0,
        width: THUMB_VIEWPORT_WIDTH, height: THUMB_VIEWPORT_HEIGHT,
        transform: 'scale(' + scale + ')', transformOrigin: '0 0', pointerEvents: 'none', colorScheme,
      } : { ...frameStyle, height: Math.min(height, HEIGHT_CAP[meta.mode]), colorScheme }}
    />
  )
}

interface FrameProps {
  meta: VisualizeMeta
  callId: string
  useLocale?: VisualizeLocaleHook
}

/** All settled card surfaces share this renderer; the toolview may be only a receipt. */
export function Frame({ meta, callId, useLocale }: FrameProps) {
  const lang = useVisualizeLanguage(useLocale)
  const labels = frameLabels(lang)
  const [windowUnconfirmed, setWindowUnconfirmed] = useState(false)
  const [opening, setOpening] = useState(false)
  if (meta.mode === 'page') return <PageLauncher meta={meta} callId={callId} lang={lang} />
  return (
    <div style={cardStyle}>
      <div style={headerStyle} title={meta.path === '' ? meta.title : meta.path}>
        <span style={titleStyle}>{meta.title}</span>
        {meta.path !== '' && <span style={pathStyle}>{meta.path}</span>}
        <button type="button" style={openStyle} aria-label={labels.openWindow} title={labels.openWindow}
          aria-busy={opening} disabled={opening}
          onClick={() => {
            if (opening) return
            setOpening(true)
            settleOpen(openCardPage(meta, callId), result => {
              setWindowUnconfirmed(result !== 'opened' && result !== 'requested')
              setOpening(false)
            })
          }}>
          <OpenIcon />
        </button>
      </div>
      {windowUnconfirmed && <div role="status" style={noticeStyle}>{labels.windowUnconfirmed}</div>}
      <ManagedFrame meta={meta} callId={callId} lang={lang} />
    </div>
  )
}

/**
 * Thumbnail geometry: the page lays out in a desktop viewport and the frame
 * is scaled down to the launcher's width, then clipped to a fixed height, so
 * the reader sees the top of the real page rather than a reflowed narrow one.
 */
const THUMB_VIEWPORT_WIDTH = 1280
const THUMB_VIEWPORT_HEIGHT = 800
const THUMB_HEIGHT = 220

const hostBorder = '1px solid var(--dsw-alias-border-l2, rgb(127 127 127 / 25%))'

const launcherStyle: CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  border: hostBorder,
  borderRadius: 10,
  overflow: 'hidden',
}

const thumbStyle: CSSProperties = {
  position: 'relative',
  height: THUMB_HEIGHT,
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'var(--dsw-alias-bg-base, transparent)',
  borderBottom: hostBorder,
}

const launcherBarStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 12px',
  padding: '10px 12px',
}

const launcherTextStyle: CSSProperties = { flex: '1 1 220px', minWidth: 0 }

const oneLine: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

const launcherTitleStyle: CSSProperties = { ...oneLine, fontSize: 14, fontWeight: 500, lineHeight: 1.4 }

const launcherSummaryStyle: CSSProperties = { ...oneLine, fontSize: 12, lineHeight: 1.5, opacity: 0.65 }

const actionsStyle: CSSProperties = { display: 'flex', gap: 8, flexShrink: 0, marginLeft: 'auto' }

const buttonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 30,
  padding: '0 12px',
  borderRadius: 8,
  font: 'inherit',
  fontSize: 13,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const primaryButtonStyle: CSSProperties = {
  ...buttonBase,
  border: '1px solid transparent',
  background: 'var(--dsw-alias-brand-primary-new-colorprimary-new-color, rgb(65 118 230))',
  color: 'var(--dsw-alias-label-primary-inverted, rgb(255 255 255))',
  fontWeight: 500,
}

const ghostButtonStyle: CSSProperties = { ...buttonBase, border: hostBorder, background: 'transparent', color: 'inherit' }

const noticeStyle: CSSProperties = { fontSize: 12, lineHeight: 1.5, padding: '6px 12px', opacity: 0.75 }

/** First visibility starts a frame; scrolling out never destroys it. Stop is explicit. */
function ManagedFrame({ meta, callId, lang, thumbnail = false, eager = false, onOpen }: {
  meta: VisualizeMeta; callId: string; lang: SettingsLang; thumbnail?: boolean; eager?: boolean; onOpen?: () => void
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [seen, activate] = useFirstVisible(wrapRef)
  const [stopped, setStopped] = useState(false)
  const [width, setWidth] = useState(0)
  const labels = frameLabels(lang)
  useEffect(() => { if (eager) activate() }, [eager, activate])
  useEffect(() => {
    const wrap = wrapRef.current
    if (wrap === null) return
    const measure = () => setWidth(wrap.clientWidth)
    measure()
    if (typeof ResizeObserver !== 'function') return
    const observer = new ResizeObserver(measure)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])
  const mounted = seen && !stopped
  return (
    <div style={cardStyle}>
      <div ref={wrapRef} style={thumbnail ? thumbStyle : { ...cardStyle, minHeight: MIN_HEIGHT }}
        data-visualize-viewport="" data-state={mounted ? 'running' : stopped ? 'stopped' : 'waiting'}
        onClick={thumbnail && mounted ? onOpen : undefined}>
        {mounted
          ? <SizedFrame meta={meta} callId={callId} thumbnail={thumbnail} width={width} />
          : <div style={{ ...noticeStyle, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>{stopped ? labels.stopped : labels.waiting}</span>
              <button type="button" style={ghostButtonStyle} onClick={event => {
                event.stopPropagation()
                setStopped(false)
                activate()
              }}>{stopped ? labels.restart : labels.load}</button>
            </div>}
      </div>
      {mounted && <div style={{ padding: '3px 6px', textAlign: 'right' }}>
        <button type="button" style={{ ...ghostButtonStyle, height: 24, fontSize: 11 }}
          title={labels.releaseHint} aria-label={labels.release + ' — ' + labels.releaseHint}
          onClick={() => setStopped(true)}>{labels.release}</button>
      </div>}
    </div>
  )
}

/** One frame switches between inert thumbnail and expanded view without a reload. */
function PageLauncher({ meta, callId, lang }: { meta: VisualizeMeta; callId: string; lang: SettingsLang }) {
  const opens = canOpenWindow() || canOpenPageViaHost()
  const [expanded, setExpanded] = useState(!opens)
  const [requestedInline, setRequestedInline] = useState(false)
  const [windowUnconfirmed, setWindowUnconfirmed] = useState(false)
  const [opening, setOpening] = useState(false)
  const labels = frameLabels(lang)
  const open = () => {
    if (opening) return
    setOpening(true)
    settleOpen(openCardPage(meta, callId), result => {
      const failed = result === 'unconfirmed' || result === 'unavailable'
      setWindowUnconfirmed(failed)
      setOpening(false)
      if (failed) { setRequestedInline(true); setExpanded(true) }
    })
  }
  return (
    <div style={launcherStyle} data-visualize-launcher="">
      <ManagedFrame meta={meta} callId={callId} lang={lang} thumbnail={!expanded} eager={requestedInline}
        onOpen={opens ? open : () => { setRequestedInline(true); setExpanded(true) }} />
      {windowUnconfirmed && <div role="status" style={noticeStyle}>{labels.windowFallback}</div>}
      <div style={launcherBarStyle}>
        <div style={launcherTextStyle} title={meta.path === '' ? meta.title : meta.path}>
          <div style={launcherTitleStyle}>{meta.title}</div>
          <div style={launcherSummaryStyle}>{meta.summary ?? labels.kind}</div>
        </div>
        <div style={actionsStyle}>
          <button type="button" style={ghostButtonStyle} aria-expanded={expanded} onClick={() => { setRequestedInline(true); setExpanded(on => !on) }}>
            {expanded ? labels.hide : labels.show}
          </button>
          {opens && <button type="button" style={primaryButtonStyle} onClick={open}
            aria-busy={opening} disabled={opening}>
            <OpenIcon />{labels.openPage}
          </button>}
        </div>
      </div>
    </div>
  )
}

/**
 * Keyed toolview for the `visualize` tool. Running calls and malformed or
 * failed results stay quiet single lines. Completed cards use a lightweight
 * receipt when the canonical tail owns presentation; older hosts keep the
 * full frame from durable metadata or the call's own arguments.
 */
const noTail = (selector: (value: boolean) => boolean): boolean => selector(false)

export function VisualizeCard({ callId, block, useVisualizeTail, useLocale }: ToolCallViewProps & {
  useVisualizeTail?: (selector: (value: boolean) => boolean) => boolean
  useLocale?: VisualizeLocaleHook
}) {
  // Always invoke the injected hook. It changes reactively as the canonical tail registers/disposes.
  const tailOwnsCard = (useVisualizeTail ?? noTail)(value => value)
  const labels = frameLabels(useVisualizeLanguage(useLocale))
  // dsh 0.1.7 adds a preparing phase whose block carries no arguments yet.
  const argsRaw = 'kind' in block ? block.call?.argsRaw : 'argsRaw' in block ? block.argsRaw : undefined
  if (!('kind' in block)) {
    // The canonical host's dock owns in-flight preview; never mount a second copy here.
    if (tailOwnsCard) return <div style={headerStyle}>{labels.rendering}</div>
    const live = visualizeMetaFromArgs(argsRaw)
    if (live !== undefined) return <Frame meta={{ ...live, style: liveStyle() }} callId={callId} useLocale={useLocale} />
    return <div style={headerStyle}>{labels.rendering}</div>
  }
  if (block.isError) {
    return <div style={headerStyle}>{firstResultLine(block.content, labels.failed)}</div>
  }
  const persisted = visualizeMetaFrom(block.meta)
  if (persisted !== undefined) noteSettledStyle(persisted.style, argsRaw)
  const fromArgs = persisted === undefined ? visualizeMetaFromArgs(argsRaw) : undefined
  const meta = persisted ?? (fromArgs === undefined ? undefined : { ...fromArgs, style: liveStyle() })
  if (meta === undefined) {
    // A settled call without a descriptor uses its durable text, never guessed markup.
    return <div style={headerStyle}>{firstResultLine(block.content, labels.failed)}</div>
  }
  // Only durable metadata is collected by the tail. Args-only recovery must stay visible here.
  if (tailOwnsCard && persisted !== undefined) return <div style={headerStyle} data-visualize-receipt="" title={meta.title}>
    <span style={titleStyle}>{meta.title}</span><span>{labels.settled}</span>
  </div>
  return <Frame meta={meta} callId={callId} useLocale={useLocale} />
}

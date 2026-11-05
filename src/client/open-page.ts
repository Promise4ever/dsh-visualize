/**
 * Browser half of the “open page” action.
 *
 * A normal browser can show a Blob tab, but the desktop host denies popups in
 * its native window policy. There the card publishes its finished, script-free
 * window document to the plugin's authenticated loopback route, then opens the
 * resulting http URL in the in-app browser tab or, when that tab is not
 * available, asks the node half to hand it to the operating system.
 *
 * @module @nagi-ovo/dsh-visualize/client/open-page
 */

import {
  OPEN_PAGE_PATH,
  type OpenPageResponse,
} from '../open-protocol.ts'

/** Whether this build is running inside the desktop shell rather than a browser. */
export function isDesktopHost(): boolean {
  if (typeof window === 'undefined') return false
  if ('__TAURI_INTERNALS__' in window || '__TAURI__' in window) return true
  return typeof navigator !== 'undefined' && /\bElectron\//u.test(navigator.userAgent)
}

/** A sidebar tab opener supplied by the host's sidebar service. */
export type OpenPageTarget = (url: string) => boolean

let target: OpenPageTarget | undefined

/**
 * Install the in-app browser opener for this session, returning a disposer.
 * The plugin registers it once the sidebar service becomes available; before
 * that, or on hosts without a sidebar, the system browser remains the fallback.
 * @param next - opener; returns false when no browser tab was created.
 * @returns unregister function.
 */
export function registerOpenPageTarget(next: OpenPageTarget): () => void {
  target = next
  return () => {
    if (target === next) target = undefined
  }
}

/** Try the in-app browser tab. Any host failure falls through to the OS. */
function openInSidebar(url: string): boolean {
  const opener = target
  if (opener === undefined) return false
  try {
    return opener(url) === true
  } catch {
    return false
  }
}

/** Publish one finished window document. */
async function publish(html: string, title: string): Promise<{ url: string; token: string } | undefined> {
  if (typeof fetch !== 'function') return undefined
  try {
    const response = await fetch(OPEN_PAGE_PATH, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'page', html, title }),
    })
    if (!response.ok) return undefined
    const body = await response.json() as OpenPageResponse
    if (body.ok !== true || body.mode !== 'page') return undefined
    return { url: body.url, token: body.token }
  } catch {
    return undefined
  }
}

/** Ask the node half to open a published page in the system browser. */
async function openSystem(token: string): Promise<boolean> {
  try {
    const response = await fetch(OPEN_PAGE_PATH, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mode: 'system', token }),
    })
    if (!response.ok) return false
    const body = await response.json() as OpenPageResponse
    return body.ok === true && body.mode === 'system' && body.opened === true
  } catch {
    return false
  }
}

/**
 * Open a finished page through the desktop host when possible.
 * @param html - the self-contained window document.
 * @param title - document title.
 * @returns true when an in-app or system browser accepted the page.
 */
export async function openPageViaHost(html: string, title: string): Promise<boolean> {
  if (!isDesktopHost()) return false
  const published = await publish(html, title)
  if (published === undefined) return false
  if (openInSidebar(published.url)) return true
  return await openSystem(published.token)
}

/** Whether the desktop publish path can be attempted at all. */
export function canOpenPageViaHost(): boolean {
  return isDesktopHost() && typeof fetch === 'function'
}

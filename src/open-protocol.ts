/**
 * Wire contract shared by the browser half and the node half for opening a
 * rendered card as a real page outside the conversation sandbox.
 *
 * The desktop host denies `window.open` popups (its native window policy has
 * no popup handler), so a card cannot rely on a Blob tab there. The node half
 * serves the already-built, script-free window document from a random
 * loopback URL; the browser either shows it in the in-app browser tab or asks
 * the node half to hand that URL to the operating system's default browser.
 *
 * @module @nagi-ovo/dsh-visualize/open-protocol
 */

/** Exact authenticated route that publishes a window document. */
export const OPEN_PAGE_PATH = '/api/visualize/open'

/** Largest window document accepted by the route. Matches the metadata cap. */
export const MAX_OPEN_PAGE_BYTES = 4 * 1024 * 1024

/** How long one published page stays reachable. */
export const OPEN_PAGE_TTL_MS = 60 * 60 * 1000

/** Publish one page, or ask the host to open an already-published page. */
export type OpenPageRequest =
  | { mode: 'page'; html: string; title: string }
  | { mode: 'system'; token: string }

/** The route's successful answer. */
export type OpenPageResponse =
  | { ok: true; mode: 'page'; url: string; token: string }
  | { ok: true; mode: 'system'; opened: boolean }
  | { ok: false; error: string; message?: string }

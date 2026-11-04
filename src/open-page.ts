/**
 * The loopback page host behind the card's “open page” action.
 *
 * A window document is already a script-free wrapper around a sandboxed
 * iframe (see `window-doc.ts`), so serving it from a random loopback origin
 * grants no host privileges: the embedded frame keeps its opaque origin and
 * its own CSP. The route that publishes a document runs on the host's
 * authenticated `/api` channel; the page itself needs only an unguessable
 * bearer token in its URL, because it contains no session data beyond what the
 * reader's card already shows.
 *
 * Publishing never opens anything. Keeping the two steps apart lets the
 * browser first try the in-app browser tab and fall back to the operating
 * system only when that tab is unavailable.
 *
 * @module @nagi-ovo/dsh-visualize/open-page
 */

import { randomBytes } from 'node:crypto'
import { spawn } from 'node:child_process'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import {
  MAX_OPEN_PAGE_BYTES,
  OPEN_PAGE_PATH,
  OPEN_PAGE_TTL_MS,
  type OpenPageRequest,
  type OpenPageResponse,
} from './open-protocol.ts'

/** One published document. */
interface PublishedPage {
  html: string
  title: string
  expires: number
  /** Page origin allowed to embed this document, when known. */
  frameAncestor?: string
}

/** What the route needs from the host. */
export interface OpenPageHost {
  /** Publish one document and return its bearer URL and token. */
  publish(html: string, title: string, frameAncestor?: string): Promise<{ url: string; token: string }>
  /** Hand an already-published page to the operating system. */
  openSystem(token: string): Promise<boolean>
  /** Stop the loopback listener and forget every page. */
  dispose(): void
}

/** Injectable seams for tests. */
export interface OpenPageOptions {
  /** Current time; defaults to `Date.now`. */
  now?: () => number
  /** Opens a URL with the platform's default browser; resolves false on failure. */
  openExternal?: (url: string) => Promise<boolean>
  /** Page lifetime; defaults to one hour. */
  ttlMs?: number
  /** Maximum retained documents; defaults to 16. */
  maxPages?: number
}

/** A JSON response with no-store caching. */
function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

/** Escape text for an HTML title. */
function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Send one loopback response. */
function reply(res: ServerResponse, status: number, body: string, headers: Record<string, string> = {}): void {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
    ...headers,
  })
  res.end(body)
}

/**
 * Create the loopback host. The HTTP listener starts lazily on the first
 * publish, so a host that never opens a page pays no port or handle cost.
 * @param options - injectable clock, opener, and limits.
 * @returns the host.
 */
export function createOpenPageHost(options: OpenPageOptions = {}): OpenPageHost {
  const now = options.now ?? Date.now
  const ttlMs = options.ttlMs ?? OPEN_PAGE_TTL_MS
  const maxPages = options.maxPages ?? 16
  const openExternal = options.openExternal ?? openWithSystemBrowser
  const pages = new Map<string, PublishedPage>()
  let server: Server | undefined
  let port = 0
  let listening: Promise<void> | undefined

  const prune = (): void => {
    const time = now()
    for (const [token, page] of pages) if (page.expires <= time) pages.delete(token)
    while (pages.size > maxPages) {
      const oldest = pages.keys().next().value
      if (oldest === undefined) break
      pages.delete(oldest)
    }
  }

  const ensureServer = async (): Promise<void> => {
    if (listening !== undefined) return await listening
    server = createServer((req, res) => { void serve(req, res) })
    server.unref()
    listening = new Promise<void>((resolve, reject) => {
      server?.once('error', reject)
      server?.listen(0, '127.0.0.1', () => {
        const address = server?.address()
        if (address === null || address === undefined || typeof address === 'string') {
          reject(new Error('loopback page host did not get a port'))
          return
        }
        port = address.port
        resolve()
      })
    })
    try {
      await listening
    } catch (error) {
      server?.close()
      server = undefined
      listening = undefined
      throw error
    }
  }

  const serve = (req: IncomingMessage, res: ServerResponse): void => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      reply(res, 405, 'method not allowed')
      return
    }
    const path = (req.url ?? '').split('?', 1)[0] ?? ''
    const match = /^\/p\/([A-Za-z0-9_-]{16,128})$/u.exec(path)
    if (match === null) {
      reply(res, 404, 'not found')
      return
    }
    const page = pages.get(match[1]!)
    if (page === undefined || page.expires <= now()) {
      pages.delete(match[1]!)
      reply(res, 404, 'expired')
      return
    }
    // The document is a script-free wrapper; embedding is allowed only for
    // the application origin that published it, never for arbitrary sites.
    const frameAncestors = page.frameAncestor === undefined ? "'none'" : `'self' ${page.frameAncestor}`
    reply(res, 200, page.html, {
      'content-security-policy': `frame-ancestors ${frameAncestors}`,
    })
  }

  return {
    async publish(html, title, frameAncestor) {
      if (typeof html !== 'string' || Buffer.byteLength(html, 'utf8') > MAX_OPEN_PAGE_BYTES) {
        throw new Error(`page exceeds ${MAX_OPEN_PAGE_BYTES} bytes`)
      }
      await ensureServer()
      prune()
      const token = randomBytes(24).toString('base64url')
      pages.set(token, {
        html,
        title,
        expires: now() + ttlMs,
        ...frameAncestor === undefined ? {} : { frameAncestor },
      })
      prune()
      return { url: `http://127.0.0.1:${port}/p/${token}`, token }
    },
    async openSystem(token) {
      const page = pages.get(token)
      if (page === undefined || page.expires <= now()) return false
      return await openExternal(`http://127.0.0.1:${port}/p/${token}`)
    },
    dispose() {
      pages.clear()
      server?.close()
      server = undefined
      listening = undefined
      port = 0
    },
  }
}

/**
 * Hand one loopback URL to the operating sys
tem's default browser.
 * @param url - a URL this process just published.
 * @returns true when the platform accepted the launch request.
 */
export async function openWithSystemBrowser(url: string): Promise<boolean> {
  const command = process.platform === 'win32'
    ? 'rundll32.exe'
    : process.platform === 'darwin' ? 'open' : 'xdg-open'
  const args = process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url]
  return await new Promise<boolean>(resolve => {
    let settled = false
    const finish = (value: boolean): void => {
      if (settled) return
      settled = true
      resolve(value)
    }
    try {
      const child = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true })
      child.once('error', () => finish(false))
      child.once('spawn', () => {
        child.unref()
        // `spawn` only proves the launcher exists; the browser itself is the
        // OS's responsibility. Report success so the card does not race the
        // user with an inline fallback.
        finish(true)
      })
    } catch {
      finish(false)
    }
  })
}

/** The exact authenticated route registry (dsh 0.1.7+). */
export interface OpenPageConnection {
  register(route: {
    path: string
    methods: readonly ('GET' | 'HEAD' | 'POST')[]
    requestBody: 'buffered' | 'streaming'
    fetch: (request: Request) => Promise<Response>
  }): () => unknown
}

/**
 * Answer one POST on {@link OPEN_PAGE_PATH}. The host's connection channel has
 * already authenticated the browser and checked Host/Origin before this runs.
 * @param host - the loopback host.
 * @param request - the authenticated request.
 * @returns the route's JSON answer.
 */
export async function handleOpenPage(host: OpenPageHost, request: Request): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method-not-allowed' } satisfies OpenPageResponse)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false, error: 'unsupported-media-type' } satisfies OpenPageResponse)
  }
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(declared) && declared > MAX_OPEN_PAGE_BYTES + 64 * 1024) {
    return json(413, { ok: false, error: 'too-large' } satisfies OpenPageResponse)
  }
  let body: OpenPageRequest
  try {
    body = await request.json() as OpenPageRequest
  } catch {
    return json(400, { ok: false, error: 'invalid-json' } satisfies OpenPageResponse)
  }
  if (typeof body !== 'object' || body === null) return json(400, { ok: false, error: 'invalid-request' } satisfies OpenPageResponse)
  try {
    if (body.mode === 'page') {
      if (typeof body.html !== 'string' || typeof body.title !== 'string') {
        return json(400, { ok: false, error: 'invalid-page' } satisfies OpenPageResponse)
      }
      const frameAncestor = request.headers.get('origin') ?? undefined
      const published = await host.publish(body.html, body.title, frameAncestor)
      return json(200, { ok: true, mode: 'page', ...published } satisfies OpenPageResponse)
    }
    if (body.mode === 'system') {
      if (typeof body.token !== 'string') return json(400, { ok: false, error: 'invalid-token' } satisfies OpenPageResponse)
      const opened = await host.openSystem(body.token)
      return json(200, { ok: true, mode: 'system', opened } satisfies OpenPageResponse)
    }
    return json(400, { ok: false, error: 'unknown-mode' } satisfies OpenPageResponse)
  } catch (error) {
    return json(500, {
      ok: false,
      error: 'publish-failed',
      message: error instanceof Error ? error.message : String(error),
    } satisfies OpenPageResponse)
  }
}

/** Title fallback for a window document when the card has none. */
export function pageTitle(title: string): string {
  return title.trim().length === 0 ? 'Visualization' : title
}

/** Exported for the route registration and tests. */
export { OPEN_PAGE_PATH, escapeHtml }

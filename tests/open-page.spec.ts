import { afterEach, describe, expect, it } from 'vitest'
import { createOpenPageHost, handleOpenPage, type OpenPageHost } from '../src/open-page.ts'
import { MAX_OPEN_PAGE_BYTES, OPEN_PAGE_PATH } from '../src/open-protocol.ts'

const hosts: OpenPageHost[] = []

function makeHost(options: Parameters<typeof createOpenPageHost>[0] = {}): OpenPageHost {
  const host = createOpenPageHost(options)
  hosts.push(host)
  return host
}

afterEach(() => {
  for (const host of hosts.splice(0)) host.dispose()
})

function route(body: unknown, headers: Record<string, string> = { 'content-type': 'application/json' }): Request {
  return new Request(`http://127.0.0.1:3080${OPEN_PAGE_PATH}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}

describe('loopback page host', () => {
  it('publishes a page at a random loopback URL and serves it with a frame-ancestors policy', async () => {
    const host = makeHost()
    const published = await host.publish('<html><body>hello</body></html>', 'Hello', 'http://127.0.0.1:3080')
    expect(published.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/p\/[A-Za-z0-9_-]{32}$/u)
    expect(published.token).toHaveLength(32)
    const response = await fetch(published.url)
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('hello')
    expect(response.headers.get('content-security-policy')).toBe("frame-ancestors 'self' http://127.0.0.1:3080")
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 404 for unknown and expired tokens', async () => {
    let now = 1_000_000
    const host = makeHost({ now: () => now, ttlMs: 1000 })
    const published = await host.publish('<html></html>', 'X')
    expect((await fetch(published.url.replace(/\/p\/.*$/u, '/p/unknown-token-0000000000000000'))).status).toBe(404)
    now += 1001
    expect((await fetch(published.url)).status).toBe(404)
    expect(await host.openSystem(published.token)).toBe(false)
  })

  it('routes page publishing and system opening through the authenticated handler', async () => {
    const opened: string[] = []
    const host = makeHost({ openExternal: async url => { opened.push(url); return true } })
    const page = await handleOpenPage(host, route({ mode: 'page', html: '<html>ok</html>', title: 'OK' }))
    expect(page.status).toBe(200)
    const published = await page.json() as { ok: boolean; mode: string; url: string; token: string }
    expect(published.ok).toBe(true)
    expect(published.mode).toBe('page')
    const system = await handleOpenPage(host, route({ mode: 'system', token: published.token }))
    expect(system.status).toBe(200)
    expect(await system.json()).toEqual({ ok: true, mode: 'system', opened: true })
    expect(opened).toEqual([published.url])
  })

  it('rejects wrong methods, media types, malformed bodies, oversized pages and unknown modes', async () => {
    const host = makeHost()
    expect((await handleOpenPage(host, new Request(`http://x${OPEN_PAGE_PATH}`))).status).toBe(405)
    expect((await handleOpenPage(host, route({ mode: 'page', html: '', title: '' }, { 'content-type': 'text/plain' }))).status).toBe(415)
    const malformed = new Request(`http://x${OPEN_PAGE_PATH}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })
    expect((await handleOpenPage(host, malformed)).status).toBe(400)
    const huge = new Request(`http://x${OPEN_PAGE_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': String(MAX_OPEN_PAGE_BYTES + 100_000) },
      body: '{}',
    })
    expect((await handleOpenPage(host, huge)).status).toBe(413)
    expect((await handleOpenPage(host, route({ mode: 'other' }))).status).toBe(400)
  })

  it('keeps at most maxPages documents and disposes the listener', async () => {
    const host = makeHost({ maxPages: 2 })
    const first = await host.publish('one', '1')
    const second = await host.publish('two', '2')
    const third = await host.publish('three', '3')
    expect((await fetch(first.url)).status).toBe(404)
    expect((await fetch(second.url)).status).toBe(200)
    expect((await fetch(third.url)).status).toBe(200)
    host.dispose()
    await expect(fetch(third.url)).rejects.toBeTruthy()
  })
})

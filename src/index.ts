/**
 * dsh-visualize, node half: registers the `visualize` tool on `ctx.tools` and
 * the bundled `visualize` skill on `ctx.skills`. The browser half
 * (`src/client/`) registers the sandboxed card under the same wire name; a
 * client without it falls back to the tool's generic result text — the
 * documented render-intent degradation, so TUI and headless surfaces keep
 * working with the fragment path alone.
 *
 * @module @nagi-ovo/dsh-visualize
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { visualizeTool } from './tool.ts'
import { MAX_META_FRAGMENT_BYTES } from './codec.ts'
import { visualizeSkillProvider } from './skill.ts'
import { styleFileLocations } from './style-guide.ts'
import { PAGE_CONFIG_GLOBAL, STYLE_FILES_PATH, type StyleId } from './style.ts'
import { readStyle, styleFieldSchema, type StyleSetting } from './style-setting.ts'
import { handleStyleFiles, styleFilesHost } from './style-files.ts'
import { storeRoot } from './storage.ts'
import { DAY_MS, pruneExpiredSessions } from './storage-retention.ts'
import { createOpenPageHost, handleOpenPage, type OpenPageHost } from './open-page.ts'
import { OPEN_PAGE_PATH } from './open-protocol.ts'

export { VISUALIZE_TOOL_NAME } from './tool.ts'
export { visualizeMetaFrom, type VisualizeMeta, type VisualizeMode } from './fragment.ts'
export { validateFragment } from './lint.ts'
export { STYLE_IDS, type StyleId } from './style.ts'
export { readStyle, type StyleSetting } from './style-setting.ts'
export { STYLE_FILES_PATH } from './style.ts'
export { inventoryCardStore, cleanupCardStoreTemps, type StorageInventory, type StorageInventoryOptions, type StorageCleanupResult } from './storage-maintenance.ts'

/** Cordis plugin name. */
export const name = 'dsh-visualize'
/** Required services: the tool registry, the skill registry, and the fs seam. */
export const inject = ['tools', 'skills', 'fs']

/** Deployment configuration. */
export interface Config {
  /**
   * Size ceiling in bytes for one fragment file. Oversized fragments are
   * rejected at execute time with guidance to downsample inline data; the
   * same ceiling bounds what one call adds to the session log.
   */
  maxFragmentBytes: number
  /**
   * Card style for new cards: colours, fonts and chart defaults the frame
   * applies, plus a style guide appended to the skill. Each card keeps the
   * style it was created with. The field is volatile, so the host's settings
   * form can change it while the plugin runs: read it with
   * {@link readStyle}, never once at startup.
   */
  style: StyleSetting
  /**
   * Days to keep settled card files in the per-session store. Every card's
   * fragment is also in the session log, so an expired file is not needed to
   * replay the conversation; retention only limits disk growth. Set to 0 to
   * keep files forever and clean them manually with `lib/maintenance.mjs`.
   */
  cardRetentionDays: number
}

/** Schemastery configuration validated by the Loader. */
export const Config: z<Config> = z.object({
  maxFragmentBytes: z.natural().max(MAX_META_FRAGMENT_BYTES).default(1_000_000),
  style: styleFieldSchema(),
  cardRetentionDays: z.natural().max(3650).default(90),
}) as unknown as z<Config>

/**
 * Register the tool, the bundled skill provider, the page config, and the
 * style-file route of the settings page.
 * @param ctx - registrant context.
 * @param config - validated deployment configuration.
 */
export function apply(ctx: Context, config: Config): void {
  const style = () => readStyle(config.style)
  // The tool's description names the style, so it is rebuilt when the
  // setting changes; calls already read the style per call.
  let toolStyle = style()
  let disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style))
  const events = ctx as unknown as { on(name: 'loader/volatile-update', listener: () => void): unknown }
  events.on('loader/volatile-update', () => {
    if (style() === toolStyle) return
    disposeTool()
    toolStyle = style()
    disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style))
  })
  ctx.skills.registerProvider(() => visualizeSkillProvider(style, cwd => styleFileLocations(ctx, cwd)))
  injectPageConfig(ctx, style)
  registerStyleFiles(ctx)
  const openPages = createOpenPageHost()
  ctx.effect(() => () => openPages.dispose(), 'dsh-visualize: open page host')
  registerOpenPage(ctx, openPages)
  declineGeneratedSettingsPage(ctx)
  scheduleCardRetention(ctx, config.cardRetentionDays)
}

/**
 * Prune expired whole-session card directories in the background, once shortly
 * after startup and then daily. Card fragments live in the session log, so the
 * files are only needed for later `update` calls; keeping them forever would
 * grow the store without bound. A sweep never deletes a directory containing a
 * lock, temporary file, unknown name, link or subdirectory, and revalidates
 * every file before unlinking, so it cannot race an active write.
 * @param ctx - registrant context.
 * @param days - retention in whole days; 0 (or a host without a home path) disables the sweep.
 */
function scheduleCardRetention(ctx: Context, days: number): void {
  if (!Number.isSafeInteger(days) || days <= 0) return
  const root = storeRoot(ctx)
  if (root === undefined) return
  const logger = ctx.logger('dsh-visualize')
  const run = (): void => {
    void pruneExpiredSessions(root, { retentionDays: days }).then((result) => {
      if (result.pruned.length > 0) {
        logger.info('card retention: removed %d expired session(s), %d file(s)', result.pruned.length, result.removedFiles)
      }
    }).catch((error: unknown) => {
      logger.warn('card retention skipped: %s', error instanceof Error ? error.message : String(error))
    })
  }
  ctx.effect(() => {
    const initial = setTimeout(run, 15_000)
    initial.unref()
    const timer = setInterval(run, DAY_MS)
    timer.unref()
    return () => {
      clearTimeout(initial)
      clearInterval(timer)
    }
  }, 'dsh-visualize: card retention')
}

/** The structured index row this plugin contributes (see `@deepseek-ai/dsh-host-webserver`). */
interface GlobalRow {
  kind: 'global'
  name: string
  value: unknown
}

/**
 * Tell the browser half the configured style through the web server's index
 * injection table (dsh 0.1.1+): a card still streaming has no persisted meta
 * yet, and nothing else in the tool call carries server data before it
 * settles. Each page render reads the setting then, so a reload picks up a
 * change; the settings page also updates the value on its own page when it
 * saves. Hosts without a web server never emit the event, and the listener is
 * inert there.
 * @param ctx - registrant context.
 * @param style - reads the configured card style.
 */
function injectPageConfig(ctx: Context, style: () => StyleId): void {
  // The event is declared by the host web server, which this package does not depend on.
  const events = ctx as unknown as { on(name: 'webserver/index-inject', listener: (table: GlobalRow[]) => void): unknown }
  events.on('webserver/index-inject', (table) => {
    table.push({ kind: 'global', name: PAGE_CONFIG_GLOBAL, value: { style: style() } })
  })
}

/** The exact-route registry on the host's authenticated `/api` channel (dsh 0.1.7+). */
interface ConnectionFetch {
  register(route: {
    path: string
    methods: readonly ('GET' | 'HEAD' | 'POST')[]
    requestBody: 'buffered' | 'streaming'
    fetch: (request: Request) => Promise<Response>
  }): () => unknown
}

/**
 * Serve the settings page's style-file editor on the host's `/api` channel,
 * which authenticates the browser and checks Host/Origin before the route
 * runs. Optional: a host without the channel, or with an older connection
 * service, simply has no editor, and the page says where the files are.
 * @param ctx - registrant context.
 */
function registerStyleFiles(ctx: Context): void {
  const host = styleFilesHost(ctx)
  ctx.inject(['connection'], (scope) => {
    const fetch = (scope.get('connection') as { fetch?: Partial<ConnectionFetch> } | undefined)?.fetch
    if (typeof fetch?.register !== 'function') return
    const register = fetch.register.bind(fetch) as ConnectionFetch['register']
    scope.effect(() => register({
      path: STYLE_FILES_PATH,
      methods: ['GET', 'POST'],
      requestBody: 'buffered',
      fetch: async request => await handleStyleFiles(host, request),
    }), 'dsh-visualize: style files route')
  })
}

/**
 * Route a finished card page through the authenticated `/api` channel. The
 * desktop shell denies popup windows before navigation, so this is how a card
 * can still become a real page: the browser publishes the document here, then
 * opens the returned loopback URL in the in-app browser or system browser.
 * Optional, like the style route.
 * @param ctx - registrant context.
 * @param host - loopback page host shared by every request.
 */
function registerOpenPage(ctx: Context, host: OpenPageHost): void {
  ctx.inject(['connection'], (scope) => {
    const fetch = (scope.get('connection') as { fetch?: Partial<ConnectionFetch> } | undefined)?.fetch
    if (typeof fetch?.register !== 'function') return
    const register = fetch.register.bind(fetch) as ConnectionFetch['register']
    scope.effect(() => register({
      path: OPEN_PAGE_PATH,
      methods: ['POST'],
      requestBody: 'buffered',
      fetch: async request => await handleOpenPage(host, request),
    }), 'dsh-visualize: open page route')
  })
}

/**
 * Tell the host's settings service that this plugin ships its own page for
 * its volatile field, so a client that generates forms from schemas does not
 * add a second one. Optional, like the service.
 * @param ctx - registrant context.
 */
function declineGeneratedSettingsPage(ctx: Context): void {
  ctx.inject(['settings'], (scope) => {
    const settings = scope.get('settings') as { configure?: (policy: { auto: boolean }, owner: unknown) => () => void } | undefined
    if (typeof settings?.configure !== 'function') return
    const configure = settings.configure.bind(settings)
    scope.effect(() => configure({ auto: false }, ctx.fiber), 'dsh-visualize: settings page policy')
  })
}

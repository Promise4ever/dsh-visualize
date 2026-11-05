import { useSyncExternalStore } from 'react'
import { documentLang, settingsLang, type SettingsLang } from './settings-locale.ts'

export type VisualizeLocaleHook = <T>(selector: (snapshot: { active: string }) => T) => T

function subscribeDocumentLang(notify: () => void): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver !== 'function') return () => undefined
  const observer = new MutationObserver(notify)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
  return () => observer.disconnect()
}

function useDocumentLang<T>(selector: (snapshot: { active: string }) => T): T {
  const lang = useSyncExternalStore(subscribeDocumentLang, documentLang, () => 'zh' as SettingsLang)
  return selector({ active: lang })
}

/** Read the service on the first render; old hosts react to document.lang changes instead. */
export function useVisualizeLanguage(useLocale: VisualizeLocaleHook = useDocumentLang): SettingsLang {
  return useLocale(snapshot => settingsLang(snapshot.active))
}

const EN = {
  openWindow: 'Open in new window', openPage: 'Open page', show: 'Show here', hide: 'Collapse',
  kind: 'Standalone page', rendering: 'Visualize · rendering…', settled: 'Visualize · shown below the answer',
  failed: 'Visualization failed', load: 'Load visualization', waiting: 'Loads when visible',
  release: 'Stop and release', releaseHint: 'Unload the frame. Reloading resets its interaction state.',
  stopped: 'Stopped. Reloading resets the interaction state.', restart: 'Reload visualization',
  windowFallback: 'This host could not confirm a new window. The page is expanded here instead.',
  windowUnconfirmed: 'This host could not confirm a new window. You can still use the visualization here.',
  streaming: 'Visualize · streaming preview', composing: 'Visualize · composing…',
  previewTitle: 'Visualization streaming preview',
}
const ZH: Record<keyof typeof EN, string> = {
  openWindow: '在新窗口打开', openPage: '打开页面', show: '在对话中展开', hide: '收起',
  kind: '独立页面', rendering: '可视化 · 生成中…', settled: '可视化 · 已在回答下方展示',
  failed: '可视化生成失败', load: '加载可视化', waiting: '进入可见区域后加载',
  release: '停止并释放', releaseHint: '卸载此框架；重新加载会重置交互状态。',
  stopped: '已停止；重新加载会重置交互状态。', restart: '重新加载可视化',
  windowFallback: '当前宿主无法确认新窗口是否打开，已在对话中展开。',
  windowUnconfirmed: '当前宿主无法确认新窗口是否打开，可继续在对话中使用。',
  streaming: '可视化 · 实时预览', composing: '可视化 · 正在构建…', previewTitle: '可视化实时预览',
}

export function frameLabels(lang: SettingsLang): Record<keyof typeof EN, string> {
  return lang === 'en' ? EN : ZH
}

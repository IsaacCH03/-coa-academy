export type ExtensionId = 'excel-viewer'
export type ExtensionState = Record<ExtensionId, { installed: boolean; enabled: boolean }>

const KEY = 'coa-studio-extensions-v1'
export const DEFAULT_EXTENSIONS: ExtensionState = { 'excel-viewer': { installed: false, enabled: false } }

export function normalizeExtensions(value: unknown): ExtensionState {
  const excel = value && typeof value === 'object' ? (value as Partial<ExtensionState>)['excel-viewer'] : undefined
  return { 'excel-viewer': { installed: excel?.installed === true, enabled: excel?.installed === true && excel?.enabled !== false } }
}
export function loadExtensions(): ExtensionState {
  try { return normalizeExtensions(JSON.parse(localStorage.getItem(KEY) ?? 'null')) }
  catch { return normalizeExtensions(null) }
}
export function saveExtensions(value: ExtensionState) { localStorage.setItem(KEY, JSON.stringify(value)) }

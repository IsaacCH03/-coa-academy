export type AccentTheme = 'coa' | 'blue' | 'purple' | 'pink' | 'red' | 'green' | 'orange' | 'mono' | 'custom'
export type SpecialStyle = 'none' | 'vscode' | 'eclipse' | 'onlinegdb' | 'python' | 'cmd' | 'pixel'
export type BackgroundKind = 'none' | 'city' | 'forest' | 'sunset' | 'space' | 'cyberpunk' | 'stars' | 'rain' | 'custom'
export type QuickAction = typeof QUICK_ACTIONS[number]

export const QUICK_ACTIONS = ['Tab', 'Desindentar', ':', ';', '()', '[]', '{}', '""', "''", '=', '==', '!=', '>', '<', '>=', '<=', '+', '-', '*', '/', '%', '#', '_', '.', '←', '→', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'print()', 'input()', 'range()', 'if', 'elif', 'else', 'for', 'while', 'def', 'return'] as const
export const DEFAULT_QUICK_BAR: QuickAction[] = ['Tab', ':', '()', '[]', '{}', '""', "''", '=', '+', '-', '*', '/', '#', '←', '→']

export interface StudioSettings {
  accent: AccentTheme
  customColor: string
  style: SpecialStyle
  background: BackgroundKind
  backgroundOpacity: number
  wallpaperVisibility: number
  interfaceTransparency: number
  backgroundBlur: number
  backgroundDarkness: number
  backgroundFit: 'cover' | 'contain' | 'center' | 'repeat'
  animation: 'off' | 'soft' | 'normal'
  reduceMobileAnimation: boolean
  pauseHidden: boolean
  fontSize: number
  fontFamily: 'Consolas' | 'Monaco' | 'monospace'
  lineHeight: number
  minimap: boolean
  wordWrap: boolean
  lineNumbers: boolean
  highlightLine: boolean
  autoCloseBrackets: boolean
  autoCloseQuotes: boolean
  density: 'compact' | 'normal' | 'large'
  mobileFocus: boolean
  quickBar: QuickAction[]
  reduceMotion: boolean
  highContrast: boolean
  cmdPrompt: string
}

export interface AppearanceProfile { id: string; name: string; settings: StudioSettings }

export const DEFAULT_SETTINGS: StudioSettings = {
  accent: 'coa', customColor: '#5f8ff5', style: 'none', background: 'none',
  backgroundOpacity: 70, wallpaperVisibility: 70, interfaceTransparency: 48, backgroundBlur: 2, backgroundDarkness: 38,
  backgroundFit: 'cover', animation: 'soft', reduceMobileAnimation: true,
  pauseHidden: true, fontSize: 15, fontFamily: 'Consolas', lineHeight: 1.55,
  minimap: false, wordWrap: true, lineNumbers: true, highlightLine: true,
  autoCloseBrackets: true, autoCloseQuotes: true, density: 'normal',
  mobileFocus: true, quickBar: DEFAULT_QUICK_BAR, reduceMotion: false,
  highContrast: false, cmdPrompt: 'C:\\COA\\Proyecto>',
}

const ACCENTS: Record<AccentTheme, string> = {
  coa: '#6599ff', blue: '#398cff', purple: '#9a68ff', pink: '#f25fa9',
  red: '#ed5b62', green: '#36b87a', orange: '#ed8d32', mono: '#aeb7c4', custom: '#6599ff',
}

export function normalizeSettings(value: unknown): StudioSettings {
  if (!value || typeof value !== 'object') return { ...DEFAULT_SETTINGS }
  const next = { ...DEFAULT_SETTINGS, ...(value as Partial<StudioSettings>) }
  next.fontSize = Math.min(24, Math.max(11, Number(next.fontSize) || 15))
  next.lineHeight = Math.min(2.2, Math.max(1.2, Number(next.lineHeight) || 1.55))
  next.wallpaperVisibility = Math.min(100, Math.max(20, Number(next.wallpaperVisibility) || 70))
  next.interfaceTransparency = Math.min(72, Math.max(0, Number(next.interfaceTransparency) || 48))
  next.quickBar = Array.isArray(next.quickBar) ? next.quickBar.filter((item): item is QuickAction => QUICK_ACTIONS.includes(item as QuickAction)) : [...DEFAULT_QUICK_BAR]
  if (!next.quickBar.length) next.quickBar = [...DEFAULT_QUICK_BAR]
  return next
}

export function accentColor(settings: StudioSettings) {
  return settings.accent === 'custom' ? settings.customColor : ACCENTS[settings.accent]
}

export function derivedColors(hex: string) {
  const safe = /^#[0-9a-f]{6}$/i.test(hex) ? hex : '#6599ff'
  const n = Number.parseInt(safe.slice(1), 16)
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const mix = (to: number, amount: number) => `#${rgb.map((v) => Math.round(v + (to - v) * amount).toString(16).padStart(2, '0')).join('')}`
  return {
    accent: safe, hover: mix(255, .16), selection: mix(0, .52), subtle: mix(0, .7),
    background: mix(0, .88), backgroundSecondary: mix(0, .82), surface: mix(0, .76),
    surfaceElevated: mix(0, .68), editor: mix(0, .91), console: mix(0, .86),
    sidebar: mix(0, .8), header: mix(0, .84), status: mix(0, .58),
    tab: mix(0, .83), tabActive: mix(0, .72), border: mix(0, .57),
    text: mix(255, .88), textSecondary: mix(255, .62),
  }
}

export function quickInsertion(action: QuickAction) {
  const pairs: Partial<Record<QuickAction, string>> = { '()': '()', '[]': '[]', '{}': '{}', '""': '""', "''": "''", 'print()': 'print()', 'input()': 'input()', 'range()': 'range()' }
  const text = pairs[action] ?? (['if', 'elif', 'else', 'for', 'while', 'def', 'return'].includes(action) ? `${action} ` : action)
  return { text, cursorBack: pairs[action] ? 1 : 0 }
}

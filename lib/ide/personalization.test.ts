import { describe, expect, it } from 'vitest'
import { DEFAULT_QUICK_BAR, DEFAULT_SETTINGS, accentColor, derivedColors, normalizeSettings, quickInsertion } from './personalization'

describe('Studio personalization', () => {
  it('restores safe defaults', () => expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS))
  it('keeps valid settings', () => expect(normalizeSettings({ accent: 'pink' }).accent).toBe('pink'))
  it('limits small fonts', () => expect(normalizeSettings({ fontSize: 2 }).fontSize).toBe(11))
  it('limits large fonts', () => expect(normalizeSettings({ fontSize: 80 }).fontSize).toBe(24))
  it('limits line height', () => expect(normalizeSettings({ lineHeight: 9 }).lineHeight).toBe(2.2))
  it('removes unknown shortcuts', () => expect(normalizeSettings({ quickBar: ['Tab', 'oops'] }).quickBar).toEqual(['Tab']))
  it('does not allow an empty quick bar', () => expect(normalizeSettings({ quickBar: [] }).quickBar).toEqual(DEFAULT_QUICK_BAR))
  it('uses custom accent', () => expect(accentColor({ ...DEFAULT_SETTINGS, accent: 'custom', customColor: '#123456' })).toBe('#123456'))
  it('uses the selected palette accent', () => expect(accentColor({ ...DEFAULT_SETTINGS, accent: 'pink' })).toBe('#f25fa9'))
  it('derives different hover and selection colors', () => { const colors=derivedColors('#ff0000'); expect(colors.hover).not.toBe(colors.selection) })
  it('falls back from invalid color', () => expect(derivedColors('red').accent).toBe('#6599ff'))
  it('inserts paired parentheses with inner cursor', () => expect(quickInsertion('()')).toEqual({ text: '()', cursorBack: 1 }))
  it('inserts Python calls with inner cursor', () => expect(quickInsertion('print()')).toEqual({ text: 'print()', cursorBack: 1 }))
  it('inserts Python keywords predictably', () => expect(quickInsertion('return')).toEqual({ text: 'return ', cursorBack: 0 }))
  it('inserts ordinary symbols literally', () => expect(quickInsertion('==')).toEqual({ text: '==', cursorBack: 0 }))
})

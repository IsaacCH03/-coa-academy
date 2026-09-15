const widgets = new Set(['Tk', 'Label', 'Entry', 'Button', 'Frame'])
const messageDialogs = new Set(['showinfo', 'showwarning', 'showerror', 'askyesno', 'askokcancel'])
const simpleDialogs = new Set(['askstring', 'askinteger', 'askfloat'])

function codeMask(source: string) {
  let result = ''
  let quote = ''
  let triple = false
  let comment = false
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (comment) {
      if (char === '\n') { comment = false; result += '\n' } else result += ' '
      continue
    }
    if (quote) {
      if (char === '\\') { result += ' '; if (index + 1 < source.length) { result += ' '; index++ } }
      else if (triple && source.slice(index, index + 3) === quote.repeat(3)) { result += '   '; index += 2; quote = ''; triple = false }
      else if (!triple && char === quote) { result += ' '; quote = '' }
      else result += char === '\n' ? '\n' : ' '
      continue
    }
    if (char === '#') { comment = true; result += ' '; continue }
    if (char === '"' || char === "'") {
      triple = source.slice(index, index + 3) === char.repeat(3)
      quote = char
      result += triple ? '   ' : ' '
      if (triple) index += 2
      continue
    }
    result += char
  }
  return result
}

export function coaGuiAlias(source: string) {
  const mask = codeMask(source)
  const match = /^\s*import\s+coa_gui(?:\s+as\s+([A-Za-z_]\w*))?\s*$/m.exec(mask)
  if (!match) return null
  const alias = match[1] || 'coa_gui'
  return new RegExp(`\\b${alias}\\s*\\.\\s*[A-Za-z_]\\w*`).test(mask) ? alias : null
}

export function usesCoaGui(source: string) {
  return coaGuiAlias(source) !== null
}

export function convertCoaGuiToTkinter(source: string) {
  const mask = codeMask(source)
  const importMatch = /^\s*import\s+coa_gui(?:\s+as\s+([A-Za-z_]\w*))?\s*$/m.exec(mask)
  if (!importMatch || importMatch.index === undefined)
    throw new Error('El archivo activo no contiene una importación compatible de COA GUI.')
  const alias = importMatch[1] || 'coa_gui'
  const memberPattern = new RegExp(`\\b${alias}(\\s*\\.\\s*)([A-Za-z_]\\w*)`, 'g')
  const replacements: Array<{ start: number; end: number; value: string }> = []
  let needsMessagebox = false
  let needsSimpledialog = false
  for (const match of mask.matchAll(memberPattern)) {
    if (match.index === undefined) continue
    const member = match[2]
    let owner = ''
    if (widgets.has(member)) owner = 'tk'
    else if (messageDialogs.has(member)) { owner = 'messagebox'; needsMessagebox = true }
    else if (simpleDialogs.has(member)) { owner = 'simpledialog'; needsSimpledialog = true }
    if (owner) replacements.push({ start: match.index, end: match.index + match[0].length, value: `${owner}.${member}` })
  }
  const imports = ['import tkinter as tk']
  const dialogImports = [needsMessagebox && 'messagebox', needsSimpledialog && 'simpledialog'].filter(Boolean)
  if (dialogImports.length) imports.push(`from tkinter import ${dialogImports.join(', ')}`)
  replacements.push({ start: importMatch.index, end: importMatch.index + importMatch[0].length, value: imports.join('\n') })
  return replacements.sort((a, b) => b.start - a.start).reduce(
    (result, item) => result.slice(0, item.start) + item.value + result.slice(item.end), source,
  )
}

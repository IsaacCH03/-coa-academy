/** Preserve offsets while hiding comments and string contents, including docstrings. */
export function pythonCodeMask(source: string) {
  let result = '', quote = '', triple = false
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (quote) {
      if (char === '\\') { result += ' '; if (++index < source.length) result += source[index] === '\n' ? '\n' : ' '; continue }
      if (source.startsWith(triple ? quote.repeat(3) : quote, index)) {
        result += triple ? '   ' : ' '; index += triple ? 2 : 0; quote = ''; continue
      }
      result += char === '\n' ? '\n' : ' '
    } else if (char === '#') {
      while (index < source.length && source[index] !== '\n') { result += ' '; index++ }
      if (index < source.length) result += '\n'
    } else if (/[rubf]/i.test(char) && !/[\w]/.test(source[index - 1] ?? '') && /^[rubf]{1,2}(?=["'])/i.test(source.slice(index))) {
      const prefix = source.slice(index).match(/^[rubf]{1,2}(?=["'])/i)![0]
      result += ' '.repeat(prefix.length); index += prefix.length - 1
    } else if (char === '"' || char === "'") {
      quote = char; triple = source.startsWith(char.repeat(3), index)
      result += triple ? '   ' : ' '; index += triple ? 2 : 0
    } else result += char
  }
  return result
}

export function moduleImportEdit(source: string, statements: string[]) {
  const lines = source.split(/\r?\n/), mask = pythonCodeMask(source).split(/\r?\n/)
  const existing = new Set<string>()
  for (const line of mask) {
    if (/^import\s/.test(line)) for (const item of line.slice(7).split(',')) existing.add('import ' + item.trim().replace(/\s+/g, ' '))
    const from = line.match(/^from\s+([\w.]+)\s+import\s+(.+)$/)
    if (from) for (const item of from[2].split(',')) {
      if (/^\s*\w+(?:\s+as\s+\w+)?\s*$/.test(item)) existing.add(`from ${from[1]} import ${item.trim().replace(/\s+/g, ' ')}`)
    }
  }
  const missing = [...new Set(statements)].filter((statement) => !existing.has(statement))
  if (!missing.length) return null
  let at = 0
  // Comments, the module docstring, future imports and existing multiline imports
  // stay ahead of new imports. Never scan into a class or function body.
  while (at < lines.length && !lines[at].trim()) at++
  while (at < lines.length && lines[at].trimStart().startsWith('#')) at++
  if (/^\s*(?:[ru])?["']/.test(lines[at] ?? '') && !mask[at]?.trim()) {
    at++
    while (at < lines.length && !mask[at].trim()) at++
  }
  while (at < lines.length) {
    if (!lines[at].trim() || lines[at].trimStart().startsWith('#')) { at++; continue }
    if (!/^(?:from|import)\s/.test(mask[at])) break
    let depth = 0
    do {
      depth += (mask[at].match(/\(/g)?.length ?? 0) - (mask[at].match(/\)/g)?.length ?? 0)
      const continued = mask[at].trimEnd().endsWith('\\')
      at++
      if (!depth && !continued) break
    } while (at < lines.length)
  }
  const eof = at >= lines.length
  return {
    range: { startLineNumber: eof ? lines.length : at + 1, endLineNumber: eof ? lines.length : at + 1, startColumn: eof ? lines.at(-1)!.length + 1 : 1, endColumn: eof ? lines.at(-1)!.length + 1 : 1 },
    text: (eof && lines.at(-1) ? '\n' : '') + missing.join('\n') + '\n',
  }
}

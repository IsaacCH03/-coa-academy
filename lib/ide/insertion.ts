import { moduleImportEdit } from './python-source'

export type CursorRange = {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}

/** One plan for every cursor insertion; Monaco applies it as one undo operation. */
export function builderInsertion(source: string, range: CursorRange, code: string, options?: { tabSize: number; insertSpaces: boolean }) {
  source = source.replace(/\r\n/g, '\n')
  const lines = code.replace(/\r\n/g, '\n').split('\n')
  const imports: string[] = []
  while (lines.length && (/^(?:import\s+[\w.]+(?:\s+as\s+\w+)?|from\s+[\w.]+\s+import\s+\w+(?:\s+as\s+\w+)?)$/.test(lines[0]) || !lines[0].trim())) {
    const line = lines.shift()!
    if (line.trim()) imports.push(line)
  }
  const edit = insertionAt(source, range, lines.join('\n'), options)
  const offsetAt = (line: number, column: number) => source.split('\n').slice(0, line - 1).reduce((offset, text) => offset + text.length + 1, 0) + column - 1
  let start = offsetAt(edit.range.startLineNumber, edit.range.startColumn)
  const end = offsetAt(edit.range.endLineNumber, edit.range.endColumn)
  const retained = source.slice(0, start) + source.slice(start, end).replace(/[^\n]/g, ' ') + source.slice(end)
  const importEdit = moduleImportEdit(retained, imports)
  const placeholder = /^\s*(pass)\s*$/m.exec(edit.text)
  const placeholderAt = placeholder ? placeholder.index + placeholder[0].indexOf('pass') : -1
  const relative = placeholderAt < 0 ? edit.text.length : placeholderAt
  const edits = [edit]
  if (importEdit) {
    const importOffset = offsetAt(importEdit.range.startLineNumber, importEdit.range.startColumn)
    if (importOffset >= start && importOffset <= end) {
      edit.text = importEdit.text + edit.text
      start += importEdit.text.length
    }
    else edits.push(importEdit)
    if (importOffset < offsetAt(edit.range.startLineNumber, edit.range.startColumn)) start += importEdit.text.length
  }
  return { edits, cursorOffset: start + relative, selectionLength: placeholderAt < 0 ? 0 : 4 }
}
export function insertionAt(
  source: string,
  range: CursorRange,
  snippet: string,
  options?: { tabSize: number; insertSpaces: boolean },
) {
  const lines = source.split(/\r?\n/)
  const line = lines[range.startLineNumber - 1] ?? ''
  const before = line.slice(0, range.startColumn - 1)
  const leading = line.match(/^[\t ]*/)?.[0] ?? ''
  const unit = options ? (options.insertSpaces ? ' '.repeat(options.tabSize) : '\t') : leading.includes('\t') ? '\t' : '    '
  // Builder templates use four spaces per level. Translate every relative level,
  // not just the first line, to the active model's indentation options.
  snippet = snippet.replace(/\r\n/g, '\n').split('\n').map((text) => {
    const prefix = text.match(/^[\t ]*/)?.[0] ?? ''
    const width = prefix.replaceAll('\t', '    ').length
    return unit.repeat(Math.floor(width / 4)) + ' '.repeat(width % 4) + text.slice(prefix.length)
  }).join('\n')
  let indent = before.trim() ? leading : before
  const previous = lines[range.startLineNumber - 2] ?? ''
  if (
    !line.trim() &&
    previous.trimEnd().endsWith(':') &&
    indent.length <= (previous.match(/^\s*/)?.[0].length ?? 0)
  )
    indent = (previous.match(/^[\t ]*/)?.[0] ?? '') + unit
  const hasSelection =
    range.startLineNumber !== range.endLineNumber ||
    range.startColumn !== range.endColumn
  if (hasSelection)
    return { range, text: (range.startColumn === 1 ? leading : '') + snippet.split('\n').join('\n' + leading) }
  if (line.trimEnd().endsWith(':') && before.trim()) indent += unit
  // Replace a block's placeholder when the cursor is on it.
  if (line.trim() === 'pass') return {
    range: { ...range, startColumn: 1, endColumn: line.length + 1 },
    text: snippet.split('\n').map((text) => leading + text).join('\n'),
  }
  if (!before.trim())
    return {
      range: { ...range, startColumn: 1, endColumn: line.trim() ? range.endColumn : line.length + 1 },
      text:
        snippet
          .split('\n')
          .map((l) => indent + l)
          .join('\n') +
        '\n' +
        indent,
    }
  return {
    // Keep the surrounding expression intact if the cursor is in the middle
    // of a nonempty line: insert immediately below that line instead.
    range: {
      ...range,
      startColumn: line.length + 1,
      endColumn: line.length + 1,
    },
    text:
      '\n' +
      snippet
        .split('\n')
        .map((l) => indent + l)
        .join('\n') +
      '\n' +
      indent,
  }
}

export type CursorRange = {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}
export function insertionAt(
  source: string,
  range: CursorRange,
  snippet: string,
) {
  const lines = source.split('\n')
  const line = lines[range.startLineNumber - 1] ?? ''
  const before = line.slice(0, range.startColumn - 1)
  let indent = line.match(/^\s*/)?.[0] ?? ''
  const previous = lines[range.startLineNumber - 2] ?? ''
  if (
    !line.trim() &&
    previous.trimEnd().endsWith(':') &&
    indent.length <= (previous.match(/^\s*/)?.[0].length ?? 0)
  )
    indent = (previous.match(/^\s*/)?.[0] ?? '') + '    '
  const hasSelection =
    range.startLineNumber !== range.endLineNumber ||
    range.startColumn !== range.endColumn
  if (hasSelection)
    return { range, text: snippet.split('\n').join('\n' + indent) }
  if (line.trimEnd().endsWith(':') && before.trim()) indent += '    '
  if (!before.trim())
    return {
      range: { ...range, startColumn: 1 },
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

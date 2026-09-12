import { expect, it } from 'vitest'
import { insertionAt } from './insertion'
const cursor = (line: number, column: number) => ({
  startLineNumber: line,
  startColumn: column,
  endLineNumber: line,
  endColumn: column,
})
it('inserts inside a condition with four spaces', () =>
  expect(
    insertionAt('if edad >= 18:\n', cursor(2, 1), 'print("Hola")').text,
  ).toBe('    print("Hola")\n    '))
it('respects current indentation and multiline snippets', () =>
  expect(
    insertionAt('if True:\n    ', cursor(2, 5), 'if edad > 1:\n    print(edad)')
      .text,
  ).toBe('    if edad > 1:\n        print(edad)\n    '))
it('replaces the selected code instead of appending at the end', () => {
  const range = { ...cursor(1, 1), endColumn: 6 }
  const edit = insertionAt('print(1)', range, 'hello')
  expect(edit.range).toEqual(range)
  expect(edit.text).toBe('hello')
})
it('does not break strings when inserting with the cursor inside a line', () => {
  const edit = insertionAt('print("hola")', cursor(1, 10), 'edad = 20')
  expect(edit.range.startColumn).toBe(14)
  expect(edit.text).toBe('\nedad = 20\n')
})
it('indents after the end of a block header', () => {
  expect(insertionAt('if True:', cursor(1, 9), 'print(1)').text).toBe(
    '\n    print(1)\n    ',
  )
})

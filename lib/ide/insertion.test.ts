import { expect, it } from 'vitest'
import { insertionAt } from './insertion'
import { actions, generateCode } from './builder'
const cursor = (line: number, column: number) => ({
  startLineNumber: line,
  startColumn: column,
  endLineNumber: line,
  endColumn: column,
})
it('converts every existing template and generator to the active tab style', () => {
  for (const action of actions) {
    const values = Object.fromEntries(action.fields.map((field) => [field.key, field.value]))
    for (const snippet of [action.template, generateCode(action, values)]) {
      const edit = insertionAt('def ejecutar():\n\tif activo:\n\t\tfor i in range(5):\n\t\t\t', cursor(4, 4), snippet, { tabSize: 4, insertSpaces: false })
      const output = edit.text.split('\n')
      expect(output[0], action.id).toBe('\t\t\t' + snippet.split('\n')[0])
      expect(output.every((line) => !/^\t+ {4}/.test(line)), action.id).toBe(true)
    }
  }
})
it('uses two spaces and replaces a pass placeholder in its block', () => {
  expect(insertionAt('if True:\n  pass', cursor(2, 3), 'while True:\n    pass', { tabSize: 2, insertSpaces: true }).text).toBe('  while True:\n    pass')
})
it('uses the cursor column when it is inside existing whitespace', () => {
  expect(insertionAt('if True:\n    print(1)\n        ', cursor(3, 5), 'while True:\n    pass').text).toBe('    while True:\n        pass\n    ')
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
it('keeps nested indentation for all snippets and preserves tabs', () => {
  expect(
    insertionAt(
      'for i in range(5):\n    while True:\n        ',
      cursor(3, 9),
      'if condicion:\n    pass',
    ).text,
  ).toBe('        if condicion:\n            pass\n        ')
  expect(
    insertionAt('\t', cursor(1, 2), 'while condicion:\n\tprint("Texto")').text,
  ).toBe('\twhile condicion:\n\t\tprint("Texto")\n\t')
  expect(insertionAt('', cursor(1, 1), 'while condicion:\n    pass').text).toBe(
    'while condicion:\n    pass\n',
  )
})

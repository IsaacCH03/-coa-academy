import { expect, it } from 'vitest'
import { educationalHints, explainCode } from './education'
import { matchesOutput } from './exercises'
it('explains simple input and does not invent unknown structures', () => {
  expect(explainCode('edad = int(input("Edad: "))')).toHaveLength(3)
  expect(explainCode('await desconocido()')[0]).toContain(
    'todavía no está disponible',
  )
})
it('suggests common corrections without changing the source', () => {
  expect(educationalHints('if edad = 18:')[0]).toContain('==')
  expect(
    educationalHints('edad = input("Edad")\nif edad >= 18:\n    pass').join(
      ' ',
    ),
  ).toContain('devuelve texto')
  expect(educationalHints('import tkinter').join(' ')).toContain('escritorio')
})
it('compares exact exercise output after trimming whitespace', () => {
  expect(matchesOutput('10\r\n', '10')).toBe(true)
  expect(matchesOutput('110', '10')).toBe(false)
})

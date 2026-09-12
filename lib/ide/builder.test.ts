import { describe, expect, it } from 'vitest'
import {
  actions,
  detectedVariables,
  generateCode,
  isPythonName,
} from './builder'
const generate = (id: string, values: Record<string, string>) => {
  const action = actions.find((a) => a.id === id)!
  return generateCode(action, {
    ...Object.fromEntries(action.fields.map((f) => [f.key, f.value])),
    ...values,
  })
}
describe('Python Builder', () => {
  it('quotes text without allowing inserted newlines to become code', () => {
    expect(generate('text', { name: 'nombre', text: 'Evelio' })).toBe(
      'nombre = "Evelio"',
    )
    expect(generate('text', { text: '\"\nprint(123)' })).toBe(
      'nombre = "\\\"\\nprint(123)"',
    )
  })
  it('generates numbers, input and conditions', () => {
    expect(generate('number', {})).toBe('edad = 20')
    expect(generate('input-number', {})).toBe(
      'edad = int(input("Digite su edad: "))',
    )
    expect(generate('if', {})).toBe(
      'if edad >= 18:\n    print("Es mayor de edad")',
    )
    expect(generate('if-else', {})).toContain('\nelse:\n    print(')
  })
  it('includes the last number in ascending and descending ranges', () => {
    expect(generate('range', {})).toContain('range(1, 11)')
    expect(generate('range', { start: '10', end: '1' })).toContain(
      'range(10, 0, -1)',
    )
  })
  it('generates parameters and lists', () => {
    expect(generate('parameters', {})).toBe(
      'def saludar(nombre):\n    print(f"Hola {nombre}")',
    )
    expect(generate('list', {})).toBe('nombres = ["Ana", "Luis"]')
  })
  it.each(['2nombre', 'if', 'a b', 'x;print(1)', '', 'True'])(
    'rejects invalid name %s',
    (value) => expect(isPythonName(value)).toBe(false),
  )
  it.each(['edad', '_nombre', 'a2', 'año'])('accepts name %s', (value) =>
    expect(isPythonName(value)).toBe(true),
  )
  it('rejects invalid numeric values and duplicate parameters', () => {
    expect(() => generate('number', { value: '01' })).toThrow()
    expect(() => generate('number', { value: 'NaN' })).toThrow()
    expect(() => generate('parameters', { params: 'nombre,nombre' })).toThrow()
    expect(() => generate('while', { step: '0' })).toThrow()
  })
  it('detects assignments without executing student code', () =>
    expect(
      detectedVariables(
        'nombre = "Evelio"\nedad = 20\nif edad == 20:\n    nota = 85',
      ),
    ).toEqual(['nombre', 'edad', 'nota']))
  it('has valid defaults and a template for every action', () => {
    for (const action of actions) {
      expect(
        generateCode(
          action,
          Object.fromEntries(action.fields.map((f) => [f.key, f.value])),
        ),
      ).toBeTruthy()
      expect(action.template).toBeTruthy()
    }
  })
})

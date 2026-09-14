import { describe, expect, it } from 'vitest'
import {
  actions,
  actionsWithAnalysis,
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
  it('generates the required intelligent and level 2 structures', () => {
    const analysis = {
      valid: true,
      variables: [
        { name: 'edad', kind: 'number' },
        { name: 'limite', kind: 'number' },
        { name: 'nombres', kind: 'list' },
      ],
      classes: [
        { name: 'Persona', parameters: ['nombre', 'edad'], methods: ['mostrar_datos'], bases: [] },
      ],
    }
    const intelligent = actionsWithAnalysis(analysis)
    const build = (id: string, values: Record<string, string>) => {
      const action = intelligent.find((item) => item.id === id)!
      return generateCode(action, { ...Object.fromEntries(action.fields.map((field) => [field.key, field.value])), ...values })
    }
    expect(build('if', { name: 'edad', op: '>=', value: '18' })).toBe('if edad >= 18:\n    pass')
    expect(build('while', { name: 'edad', op: '<=', value: 'limite' })).toBe('while edad <= limite:\n    pass')
    expect(build('for', { name: 'nombre', items: 'nombres', traversal: 'Por elemento' })).toBe('for nombre in nombres:\n    pass')
    expect(build('for', { name: 'i', items: 'nombres', traversal: 'Por índice' })).toBe('for i in range(len(nombres)):\n    pass')
    expect(build('class', {})).toContain('def __init__(self, nombre, edad):\n        self.nombre = nombre\n        self.edad = edad')
    expect(build('object', { arguments: '"Ana", 20' })).toBe('persona1 = Persona("Ana", 20)')
    expect(build('inheritance', {})).toContain('super().__init__(nombre, edad)')
    expect(build('polymorphism', {})).toContain('def mostrar_datos(self):\n        pass')
    expect(build('try-except', {})).toContain('except ValueError:')
    expect(build('dictionary', {})).toBe('estudiante = {\n    "nombre": "Ana",\n    "edad": 20\n}')
    expect(build('dictionary-list', {})).toContain('estudiantes = [\n    {')
  })
})

import { describe, expect, it } from 'vitest'
import { explainRuntimeError } from './diagnostics'

describe('Diagnósticos de ejecución', () => {
  it.each([
    ["NameError: name 'nomre' is not defined", 'no está definido'],
    ["ValueError: invalid literal for int() with base 10: 'hola'", 'convertir "hola"'],
    ['ZeroDivisionError: division by zero', 'dividir entre cero'],
    ['IndexError: list index out of range', 'posición que no existe'],
    ["KeyError: 'edad'", 'clave "edad"'],
    ["FileNotFoundError: [Errno 2] No such file or directory: 'x.txt'", 'archivo solicitado'],
    ["ModuleNotFoundError: No module named 'business.loggic'", 'módulo "business.loggic"'],
    ["AttributeError: 'Persona' object has no attribute 'mostar_datos'", 'mostar_datos'],
  ])('explains %s in Spanish', (technical, expected) => {
    const diagnostic = explainRuntimeError(technical)
    expect(diagnostic.title).toContain(expected)
    expect(diagnostic.technical).toBe(technical)
  })
  it('keeps unknown technical details', () => {
    const diagnostic = explainRuntimeError('RuntimeError: caso especial')
    expect(diagnostic.title).toContain('todavía no puede explicar')
    expect(diagnostic.technical).toContain('RuntimeError')
  })
})

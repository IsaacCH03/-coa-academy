import { describe, expect, it } from 'vitest'
import { explainRuntimeError } from './diagnostics'

describe('Diagnósticos de ejecución', () => {
  it.each([
    ["NameError: name 'nomre' is not defined", 'no está definido'],
    ["ValueError: invalid literal for int() with base 10: 'hola'", 'convertir "hola"'],
    ['ZeroDivisionError: division by zero', 'dividir entre cero'],
    ['IndexError: list index out of range', 'posición que no existe'],
    ["KeyError: 'edad'", 'clave "edad"'],
    ["FileNotFoundError: [Errno 2] No such file or directory: 'x.txt'", 'archivo "x.txt"'],
    ["ModuleNotFoundError: No module named 'business.loggic'", 'módulo "business.loggic"'],
    ["AttributeError: 'Persona' object has no attribute 'mostar_datos'", 'mostar_datos'],
  ])('explains %s in Spanish', (technical, expected) => {
    const diagnostic = explainRuntimeError(technical)
    expect(diagnostic.title).toContain(expected)
    expect(diagnostic.technical).toBe(technical)
  })
  it('explains RuntimeError and keeps technical details', () => {
    const diagnostic = explainRuntimeError('RuntimeError: caso especial')
    expect(diagnostic.title).toContain('durante la ejecución')
    expect(diagnostic.technical).toContain('RuntimeError')
  })
  it('extracts the deepest project file and line from a traceback', () => {
    const diagnostic = explainRuntimeError('File "/home/coa/main.py", line 2\nFile "/home/coa/business/logic.py", line 10\nZeroDivisionError: division by zero')
    expect(diagnostic.path).toBe('business/logic.py')
    expect(diagnostic.line).toBe(10)
  })
  it.each([
    ["TypeError: unsupported operand type(s) for +: 'int' and 'str'", 'número y un texto'],
    ["TypeError: saludar() missing 1 required positional argument: 'nombre'", 'Faltan argumentos'],
    ['TypeError: sumar() takes 2 positional arguments but 3 were given', 'más argumentos'],
    ['PermissionError: acceso denegado', 'permiso'],
    ['OverflowError: math range error', 'demasiado grande'],
    ['StopIteration', 'recorrido ya terminó'],
    ['AssertionError', 'assert'],
  ])('provides a specific explanation for %s', (technical, expected) => {
    expect(explainRuntimeError(technical).title).toContain(expected)
  })
})

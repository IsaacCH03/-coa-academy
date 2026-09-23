import { describe, expect, it } from 'vitest'
import { isValidEmail, normalizeEmail, readText, validatePassword } from './validation'

describe('validación de cuentas', () => {
  it('normaliza correos sin alterar el nombre', () => {
    expect(normalizeEmail('  Persona@Ejemplo.COM ')).toBe('persona@ejemplo.com')
    expect(readText('  Ana María  ')).toBe('Ana María')
  })

  it('rechaza correos inválidos', () => {
    expect(isValidEmail('persona@ejemplo.com')).toBe(true)
    expect(isValidEmail('persona@')).toBe(false)
  })

  it('exige una contraseña de ocho caracteres con letra y número', () => {
    expect(validatePassword('corta1')).toMatch(/8/)
    expect(validatePassword('sololetras')).toMatch(/letra y un número/)
    expect(validatePassword('segura123')).toBeNull()
  })
})

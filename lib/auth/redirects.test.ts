import { describe, expect, it } from 'vitest'
import { safeAuthDestination } from './redirects'

const origin = 'https://cursoscoa.com'

describe('destinos seguros de autenticación', () => {
  it.each(['/mi-coa', '/admin', '/cuenta/restablecer'])('permite %s', (path) => {
    expect(safeAuthDestination(path, origin)).toBe(path)
  })

  it.each([
    'https://evil.example', '//evil.example', '/\\evil.example', '/%5cevil.example',
    '/%5C%5Cevil.example', 'javascript:alert(1)', 'data:text/html,hello',
    '/mi-coa?redirect=https://evil.example', '/ruta-no-permitida',
  ])('rechaza %s', (value) => {
    expect(safeAuthDestination(value, origin)).toBe('/mi-coa')
  })
})

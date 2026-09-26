import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({ exchange: vi.fn(), verify: vi.fn() }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession: mocks.exchange, verifyOtp: mocks.verify } }),
}))
vi.mock('@/lib/supabase/config', () => ({ getSiteUrl: () => 'https://www.cursoscoa.com' }))

import { GET } from './route'

describe('callback de autenticación', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.exchange.mockResolvedValue({ data: { session: { access_token: 'redacted' }, redirectType: 'signup' }, error: null })
  })

  it('termina una confirmación normal en el inicio y no en registro', async () => {
    const response = await GET(new NextRequest('https://www.cursoscoa.com/auth/callback?code=valid'))
    expect(response.headers.get('location')).toBe('https://www.cursoscoa.com/')
    expect(response.headers.get('location')).not.toContain('/cuenta/registro')
  })

  it('conserva un next seguro de inscripción', async () => {
    const response = await GET(new NextRequest('https://www.cursoscoa.com/auth/callback?code=valid&next=%2Finscripcion%2Fpython-practico'))
    expect(response.headers.get('location')).toBe('https://www.cursoscoa.com/inscripcion/python-practico')
  })

  it('bloquea un next externo y vuelve al inicio', async () => {
    const response = await GET(new NextRequest('https://www.cursoscoa.com/auth/callback?code=valid&next=https%3A%2F%2Fevil.example'))
    expect(response.headers.get('location')).toBe('https://www.cursoscoa.com/')
  })

  it('lleva al login con mensaje humano si la confirmación no produce sesión', async () => {
    mocks.exchange.mockResolvedValue({ data: { session: null, redirectType: 'signup' }, error: null })
    const response = await GET(new NextRequest('https://www.cursoscoa.com/auth/callback?code=valid'))
    expect(response.headers.get('location')).toBe('https://www.cursoscoa.com/cuenta/iniciar-sesion?confirmacion=correcta')
  })

  it('distingue un enlace expirado informado por Supabase', async () => {
    const response = await GET(new NextRequest('https://www.cursoscoa.com/auth/callback?error=access_denied&error_code=otp_expired'))
    expect(response.headers.get('location')).toBe('https://www.cursoscoa.com/cuenta/error?motivo=enlace-vencido')
  })
})

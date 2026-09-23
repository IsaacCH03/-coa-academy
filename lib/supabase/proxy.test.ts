import { afterEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { applyTransportSecurity } from './proxy'

afterEach(() => vi.unstubAllEnvs())

describe('HSTS', () => {
  it('se envía solamente en producción HTTPS', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const response = applyTransportSecurity(NextResponse.next(), new NextRequest('https://cursoscoa.com/'))
    expect(response.headers.get('strict-transport-security')).toContain('max-age=31536000')
  })

  it('no se envía en localhost HTTP', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const response = applyTransportSecurity(NextResponse.next(), new NextRequest('http://localhost:3000/'))
    expect(response.headers.get('strict-transport-security')).toBeNull()
  })
})

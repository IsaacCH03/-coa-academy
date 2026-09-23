import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSupabaseCookieOptions } from './config'

afterEach(() => vi.unstubAllEnvs())

describe('cookies de Supabase', () => {
  it('usa Secure en producción', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(getSupabaseCookieOptions()).toMatchObject({ secure: true, sameSite: 'lax', path: '/' })
  })

  it('permite localhost HTTP durante desarrollo', () => {
    vi.stubEnv('NODE_ENV', 'development')
    expect(getSupabaseCookieOptions()).toMatchObject({ secure: false, sameSite: 'lax', path: '/' })
  })
})

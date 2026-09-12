import { afterEach, expect, it, vi } from 'vitest'
import { GET } from './route'
const jar = vi.hoisted(() => ({ set: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: async () => jar }))
afterEach(() => {
  vi.unstubAllEnvs()
  jar.set.mockClear()
})
it('stays unavailable without external credentials', async () => {
  vi.stubEnv('GITHUB_CLIENT_ID', '')
  expect((await GET()).status).toBe(503)
  expect(jar.set).not.toHaveBeenCalled()
})
it('starts OAuth with PKCE and a short lived protected state cookie', async () => {
  vi.stubEnv('GITHUB_CLIENT_ID', 'test-id')
  vi.stubEnv('GITHUB_CLIENT_SECRET', 'test-secret')
  vi.stubEnv('COA_SESSION_SECRET', 'unit-tests-only-12345678901234567890')
  vi.stubEnv('COA_APP_URL', 'https://cursoscoa.com')
  const response = await GET()
  const redirect = new URL(response.headers.get('location')!)
  expect(redirect.origin).toBe('https://github.com')
  expect(redirect.searchParams.get('code_challenge_method')).toBe('S256')
  expect(redirect.searchParams.get('state')).toHaveLength(64)
  expect(redirect.searchParams.get('client_secret')).toBeNull()
  expect(jar.set).toHaveBeenCalledWith(
    'coa-gh-flow',
    expect.any(String),
    expect.objectContaining({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600,
    }),
  )
})

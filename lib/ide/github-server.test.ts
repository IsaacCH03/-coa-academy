import { afterEach, expect, it, vi } from 'vitest'
import {
  limitedRequestText,
  assertOrigin,
  githubConfigured,
  repositoryPath,
  seal,
  unseal,
} from './github-server'
afterEach(() => vi.unstubAllEnvs())
it('does not claim to be configured without credentials', () => {
  vi.stubEnv('GITHUB_CLIENT_ID', '')
  expect(githubConfigured()).toBe(false)
})
it('encrypts tokens and rejects tampering and expired sessions', () => {
  vi.stubEnv('COA_SESSION_SECRET', 'test-only-secret-for-unit-tests-1234567890')
  const encrypted = seal({ token: 'sensitive', exp: Date.now() + 10000 })
  expect(encrypted).not.toContain('sensitive')
  expect(unseal(encrypted)?.token).toBe('sensitive')
  expect(unseal((encrypted[0] === 'x' ? 'y' : 'x') + encrypted.slice(1))).toBeNull()
  expect(unseal(seal({ exp: Date.now() - 1 }))).toBeNull()
})
it('rejects cross-site writes and malformed repository names', () => {
  vi.stubEnv('COA_APP_URL', 'https://cursoscoa.com')
  expect(() =>
    assertOrigin(
      new Request('https://cursoscoa.com/api/ide/github/project', {
        headers: { origin: 'https://other.example' },
      }),
    ),
  ).toThrow()
  expect(() => repositoryPath('../bad')).toThrow()
  expect(repositoryPath('coa/proyecto')).toBe('/repos/coa/proyecto')
})
it('enforces the request limit even without Content-Length', async () => {
  await expect(
    limitedRequestText(
      new Request('http://localhost', { method: 'POST', body: 'abcdef' }),
      3,
    ),
  ).rejects.toThrow('demasiado grande')
})

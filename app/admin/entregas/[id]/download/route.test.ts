import { beforeEach, describe, expect, it, vi } from 'vitest'

const getCurrentAccount = vi.fn()
const createClient = vi.fn()
vi.mock('@/lib/auth/session', () => ({ getCurrentAccount }))
vi.mock('@/lib/supabase/server', () => ({ createClient }))

describe('private academic download authorization', () => {
  beforeEach(() => { vi.resetAllMocks() })

  it('does not resolve a file ID for a student', async () => {
    getCurrentAccount.mockResolvedValue({ user: { id: 'student-a' }, profile: { role: 'student' } })
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/admin/entregas/file-b/download'), { params: Promise.resolve({ id: 'file-b' }) })
    expect(response.status).toBe(403)
    expect(createClient).not.toHaveBeenCalled()
  })

  it('does not resolve a file ID for an anonymous request', async () => {
    getCurrentAccount.mockResolvedValue(null)
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/admin/entregas/file-b/download'), { params: Promise.resolve({ id: 'file-b' }) })
    expect(response.status).toBe(403)
    expect(createClient).not.toHaveBeenCalled()
  })
})

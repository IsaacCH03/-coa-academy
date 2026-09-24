import { beforeEach, describe, expect, it, vi } from 'vitest'

const getCurrentAccount = vi.fn()
const createClient = vi.fn()
vi.mock('@/lib/auth/session', () => ({ getCurrentAccount }))
vi.mock('@/lib/supabase/server', () => ({ createClient }))

describe('academic admin review authorization', () => {
  beforeEach(() => { vi.resetAllMocks() })

  it('rejects an anonymous request before accessing Supabase', async () => {
    getCurrentAccount.mockResolvedValue(null)
    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost/api/academic/admin/review', { method: 'POST', body: '{}' }))
    expect(response.status).toBe(401)
    expect(createClient).not.toHaveBeenCalled()
  })

  it('rejects a student request before accepting review fields', async () => {
    getCurrentAccount.mockResolvedValue({ user: { id: 'student-a' }, profile: { role: 'student' } })
    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost/api/academic/admin/review', { method: 'POST', body: JSON.stringify({ studentId: 'student-b', activityId: 'logica-m1-ejercicios-1-4', status: 'approved' }) }))
    expect(response.status).toBe(403)
    expect(createClient).not.toHaveBeenCalled()
  })
})

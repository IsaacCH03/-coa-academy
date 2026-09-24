import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialEnrollmentState } from '@/lib/academic'

const insert = vi.hoisted(() => vi.fn(async () => ({ error: null })))
vi.mock('next/navigation', () => ({ redirect: (path: string) => { throw new Error(`REDIRECT:${path}`) } }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/auth/session', () => ({ requireAccount: vi.fn(async () => ({ user: { id: 'u1' }, profile: { role: 'student' } })) }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => {
      if (table === 'enrollments') return { insert }
      const builder = {
        select: () => builder,
        eq: () => builder,
        maybeSingle: async () => ({ data: { id: 'c1', slug: 'python-practico', status: 'published' }, error: null }),
        single: async () => ({ data: { id: 'u1', full_name: 'Estudiante', identification: '123456789', country: 'Costa Rica', phone: '88888888' }, error: null }),
      }
      return builder
    },
  })),
}))

import { enrollInCourseAction } from './actions'

describe('successful enrollment navigation', () => {
  beforeEach(() => insert.mockClear())

  it('returns to the known course flow so the student gets an Ir al curso action', async () => {
    const form = new FormData(); form.set('slug', 'python-practico')
    await expect(enrollInCourseAction(initialEnrollmentState, form)).rejects.toThrow('REDIRECT:/inscripcion/python-practico?estado=inscrito')
    expect(insert).toHaveBeenCalledWith({ student_id: 'u1', course_id: 'c1' })
  })
})

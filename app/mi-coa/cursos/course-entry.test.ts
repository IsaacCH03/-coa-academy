import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ role: 'student' as 'student' | 'admin', enrollment: { id: 'e1' } as { id: string } | null, clientCalls: 0 }))

vi.mock('next/navigation', () => ({
  redirect: (path: string) => { throw new Error(`REDIRECT:${path}`) },
  notFound: () => { throw new Error('NOT_FOUND') },
}))
vi.mock('@/lib/auth/session', () => ({ requireAccount: vi.fn(async () => ({ user: { id: 'u1' }, profile: { role: state.role } })) }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => { state.clientCalls += 1; return ({
    from: () => {
      const builder = { select: () => builder, eq: () => builder, maybeSingle: async () => ({ data: state.enrollment }) }
      return builder
    },
  }) }),
}))

import AcademicCoursePage from './[slug]/page'

describe('Mi COA course entry', () => {
  beforeEach(() => { state.role = 'student'; state.enrollment = { id: 'e1' }; state.clientCalls = 0 })

  it('sends an actively enrolled student to the existing real course', async () => {
    await expect(AcademicCoursePage({ params: Promise.resolve({ slug: 'python-practico' }) })).rejects.toThrow('REDIRECT:/cursos/python-practico/curso')
  })

  it('denies a student without active enrollment', async () => {
    state.enrollment = null
    await expect(AcademicCoursePage({ params: Promise.resolve({ slug: 'python-practico' }) })).rejects.toThrow('REDIRECT:/mi-coa?sin-acceso=curso')
  })

  it('lets an admin inspect real content without creating an enrollment', async () => {
    state.role = 'admin'; state.enrollment = null
    await expect(AcademicCoursePage({ params: Promise.resolve({ slug: 'desarrollo-web-django' }) })).rejects.toThrow('REDIRECT:/cursos/desarrollo-web-django/curso')
    expect(state.clientCalls).toBe(0)
  })

  it('does not open a coming-soon course to students', async () => {
    await expect(AcademicCoursePage({ params: Promise.resolve({ slug: 'programacion-con-ia' }) })).rejects.toThrow('NOT_FOUND')
  })
})

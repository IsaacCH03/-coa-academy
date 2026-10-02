import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  account: null as null | { user: { id: string }; profile: { role: 'student' | 'admin' } },
  data: [] as unknown[],
  error: null as null | { message: string },
  eq: vi.fn(),
  order: vi.fn(),
  createClient: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({ getCurrentAccount: vi.fn(async () => state.account) }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: state.createClient.mockImplementation(async () => {
    const builder = {
      select: vi.fn(() => builder),
      eq: state.eq.mockImplementation(() => builder),
      order: state.order.mockImplementation(async () => ({ data: state.data, error: state.error })),
    }
    return { from: vi.fn(() => builder) }
  }),
}))

import { accessibleEnrollments, dashboardEnrollments, getCurrentStudentEnrollments, type StudentEnrollment } from './student-enrollments'

const enrollment = (status: StudentEnrollment['status'], courseStatus = 'published', slug = 'python-practico'): StudentEnrollment => ({
  id: `${status}-${slug}`,
  status,
  enrolled_at: '2026-09-25T00:00:00Z',
  courses: { id: `course-${slug}`, slug, title: slug, status: courseStatus },
})

describe('current student enrollments', () => {
  beforeEach(() => {
    state.account = null
    state.data = []
    state.error = null
    state.eq.mockClear()
    state.order.mockClear()
    state.createClient.mockClear()
  })

  it('does not query enrollments for visitors or administrators', async () => {
    await expect(getCurrentStudentEnrollments()).resolves.toEqual({ status: 'guest', enrollments: [] })
    state.account = { user: { id: 'admin-1' }, profile: { role: 'admin' } }
    await expect(getCurrentStudentEnrollments()).resolves.toEqual({ status: 'not-student', enrollments: [] })
    expect(state.createClient).not.toHaveBeenCalled()
  })

  it('derives the student id from the authenticated account and keeps enrollment order stable', async () => {
    state.account = { user: { id: 'student-1' }, profile: { role: 'student' } }
    state.data = [enrollment('active')]
    const result = await getCurrentStudentEnrollments()
    expect(result.status).toBe('success')
    expect(state.eq).toHaveBeenCalledWith('student_id', 'student-1')
    expect(state.order).toHaveBeenCalledWith('enrolled_at', { ascending: false })
  })

  it('only treats active enrollments in published courses as accessible', () => {
    const rows = [
      enrollment('active', 'published', 'python-practico'),
      enrollment('completed', 'published', 'sql-bases-datos'),
      enrollment('cancelled', 'published', 'desarrollo-web-django'),
      enrollment('active', 'draft', 'programacion-con-ia'),
      { ...enrollment('active', 'published', 'python-nivel-1'), courses: { id: 'live-course', slug: 'python-nivel-1', title: 'Python en vivo', status: 'published', delivery_mode: 'live_group' as const } },
    ]
    expect(accessibleEnrollments(rows).map((row) => row.courses?.slug)).toEqual(['python-practico'])
  })

  it('hides a live base course only after assignment to its active group', () => {
    const asyncCourse=enrollment('active','published','python-practico')
    const liveCourse={...enrollment('active','published','python-nivel-1'),courses:{id:'live-course',slug:'python-nivel-1',title:'Python Nivel 1',status:'published',delivery_mode:'live_group' as const}}
    expect(dashboardEnrollments([asyncCourse,liveCourse],new Set()).map(row=>row.courses?.slug)).toEqual(['python-practico','python-nivel-1'])
    expect(dashboardEnrollments([asyncCourse,liveCourse],new Set(['live-course'])).map(row=>row.courses?.slug)).toEqual(['python-practico'])
  })
})

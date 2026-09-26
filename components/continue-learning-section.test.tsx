// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ result: { status: 'guest', enrollments: [] } as { status: string; enrollments: unknown[] } }))

vi.mock('@/lib/student-enrollments', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/student-enrollments')>()
  return { ...original, getCurrentStudentEnrollments: vi.fn(async () => state.result) }
})
vi.mock('@/components/course-rail', () => ({
  CourseRail: ({ courses }: { courses: { slug: string; title: string }[] }) => (
    <div>{courses.map((course) => <a key={course.slug} href={`/mi-coa/cursos/${course.slug}`}>{course.title}</a>)}</div>
  ),
}))

import { ContinueLearningSection } from './continue-learning-section'

const row = (slug: string, status = 'active', courseStatus = 'published') => ({
  id: slug,
  status,
  enrolled_at: '2026-09-25T00:00:00Z',
  courses: { slug, title: slug, status: courseStatus },
})

describe('ContinueLearningSection', () => {
  beforeEach(() => { state.result = { status: 'guest', enrollments: [] } })
  afterEach(cleanup)

  it('does not render for visitors or students without enrollments', async () => {
    const { container, rerender } = render(await ContinueLearningSection())
    expect(container.innerHTML).toBe('')
    state.result = { status: 'success', enrollments: [] }
    rerender(await ContinueLearningSection())
    expect(container.innerHTML).toBe('')
  })

  it('renders the real enrolled course and links to its existing guarded entry', async () => {
    state.result = { status: 'success', enrollments: [row('python-practico')] }
    render(await ContinueLearningSection())
    expect(screen.getByRole('heading', { name: 'Continúa aprendiendo' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Python Práctico' }).getAttribute('href')).toBe('/mi-coa/cursos/python-practico')
    expect(screen.getByRole('link', { name: /Ver todos/ }).getAttribute('href')).toBe('/mi-coa')
  })

  it('shows only active published courses from the authenticated student', async () => {
    state.result = { status: 'success', enrollments: [
      row('python-practico'),
      row('sql-bases-datos'),
      row('desarrollo-web-django', 'cancelled'),
      row('programacion-con-ia', 'active', 'draft'),
    ] }
    render(await ContinueLearningSection())
    expect(screen.getByRole('link', { name: 'Python Práctico' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'SQL y Bases de Datos Relacionales' })).toBeTruthy()
    expect(screen.queryByText(/Django/)).toBeNull()
    expect(screen.queryByText(/Inteligencia Artificial/)).toBeNull()
  })
})

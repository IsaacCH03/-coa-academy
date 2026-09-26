// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, expect, it, vi } from 'vitest'
import { CourseRail } from './course-rail'

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  })
})
afterEach(cleanup)

const courses = [
  { slug: 'python-practico', title: 'Python Práctico', category: 'Programación', image: '/courses/python-practico.svg' },
  { slug: 'sql-bases-datos', title: 'SQL', category: 'Tecnología', image: '/courses/sql-bases-datos.svg' },
]

it('supports horizontal scrolling, accessible arrows and course links', () => {
  render(<CourseRail courses={courses} />)
  const rail = screen.getByLabelText('Cursos matriculados')
  Object.defineProperties(rail, {
    clientWidth: { configurable: true, value: 500 },
    scrollWidth: { configurable: true, value: 1000 },
    scrollLeft: { configurable: true, writable: true, value: 0 },
  })
  const scrollBy = vi.fn()
  Object.defineProperty(rail, 'scrollBy', { configurable: true, value: scrollBy })
  fireEvent.scroll(rail)

  expect(screen.getByRole('button', { name: 'Cursos siguientes' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Cursos anteriores' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Cursos siguientes' }))
  expect(scrollBy).toHaveBeenCalledWith({ left: 400, behavior: 'smooth' })
  expect(screen.getByRole('link', { name: /Python Práctico/ }).getAttribute('href')).toBe('/mi-coa/cursos/python-practico')
  expect(rail.className).toContain('overflow-x-auto')
  expect(rail.className).toContain('snap-x')
})

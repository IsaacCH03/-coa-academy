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

it('reuses the traditional course card in catalog rails', () => {
  render(<CourseRail variant="catalog" actionLabel="Ver curso" courses={[{
    slug:'python-nivel-1',title:'Python Nivel 1',category:'Lenguajes de programación',image:'/courses/python-nivel-1.svg',
    subtitle:'Aprende desde cero.',duration:'8 semanas',lessons:8,price:'₡10.000',billing:'por mes',href:'/cursos/python-nivel-1',
  }]}/>)
  expect(screen.getByText('₡10.000')).toBeTruthy()
  expect(screen.getByText('por mes')).toBeTruthy()
  expect(screen.getByText('8 semanas')).toBeTruthy()
  expect(screen.getByText('8 lecciones')).toBeTruthy()
  expect(screen.getByRole('link',{name:/Ver curso/}).getAttribute('href')).toBe('/cursos/python-nivel-1')
})

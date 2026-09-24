import { describe, expect, it } from 'vitest'
import { academicAccessAllowed, contentCourseSlug, courseContentPath } from './course-access'

describe('academic course access', () => {
  it('maps every implemented course to its single real content entry', () => {
    expect(courseContentPath('logica-de-programacion')).toBe('/cursos/logica-de-programacion/curso')
    expect(courseContentPath('desarrollo-web-moderno')).toBe('/cursos/desarrollo-web-moderno/curso')
    expect(courseContentPath('python-practico')).toBe('/cursos/python-practico/curso')
    expect(courseContentPath('sql-bases-datos')).toBe('/cursos/sql-bases-datos/curso')
    expect(courseContentPath('desarrollo-web-django')).toBe('/cursos/desarrollo-web-django/curso')
    expect(courseContentPath('programacion-con-ia')).toBe('/cursos/programacion-con-ia/curso')
    expect(courseContentPath('python-nivel-1')).toBeNull()
  })

  it('recognizes entry and module routes without matching public landing pages', () => {
    expect(contentCourseSlug('/cursos/python-practico/curso')).toBe('python-practico')
    expect(contentCourseSlug('/cursos/python-practico/curso/modulo-4')).toBe('python-practico')
    expect(contentCourseSlug('/cursos/python-practico')).toBeNull()
  })

  it('requires active enrollment for students and lets admins inspect without enrollment', () => {
    expect(academicAccessAllowed('python-practico', 'student', true)).toBe(true)
    expect(academicAccessAllowed('python-practico', 'student', false)).toBe(false)
    expect(academicAccessAllowed('python-practico', 'admin', false)).toBe(true)
  })

  it('keeps the coming-soon course closed to students while allowing admin inspection', () => {
    expect(academicAccessAllowed('programacion-con-ia', 'student', true)).toBe(false)
    expect(academicAccessAllowed('programacion-con-ia', 'admin', false)).toBe(true)
  })
})

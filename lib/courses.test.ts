import { describe, expect, it } from 'vitest'
import { courseEnrollmentHref, courses, getCourse, usesWhatsAppEnrollment } from './courses'

const expectedCatalogCategories = {
  'logica-de-programacion': 'Fundamentos',
  'python-nivel-1': 'Lenguajes de programación',
  'python-intermedio': 'Lenguajes de programación',
  'python-practico': 'Ruta profesional',
  'sql-bases-datos': 'Ruta profesional',
  'desarrollo-software-python': 'Ruta profesional',
  'desarrollo-web-django': 'Ruta profesional',
  'desarrollo-web-moderno': 'Tecnología',
  'programacion-con-ia': 'Tecnología',
} as const

describe('clasificación del catálogo', () => {
  it('clasifica explícitamente todos los cursos por slug', () => {
    expect(Object.fromEntries(courses.map(course => [course.slug, course.catalogCategory])))
      .toEqual(expectedCatalogCategories)
  })
})

describe('destino de inscripción de cursos', () => {
  it('conserva la inscripción interna para un curso gratuito', () => {
    const course = getCourse('python-practico')!
    expect(usesWhatsAppEnrollment(course)).toBe(false)
    expect(courseEnrollmentHref(course)).toBe('/inscripcion/python-practico')
  })

  it('envía un curso en vivo al flujo interno sin conceder un grupo', () => {
    const course = getCourse('python-nivel-1')!
    const href = courseEnrollmentHref(course)
    expect(usesWhatsAppEnrollment(course)).toBe(false)
    expect(href).toBe('/inscripcion/python-nivel-1')
  })

  it('envía Python Intermedio al mismo flujo interno', () => {
    const course = getCourse('python-intermedio')!
    expect(course.deliveryMode).toBe('live_group')
    expect(usesWhatsAppEnrollment(course)).toBe(false)
    expect(courseEnrollmentHref(course)).toBe('/inscripcion/python-intermedio')
  })

  it('mantiene identificado el curso coming soon', () => {
    expect(getCourse('programacion-con-ia')?.comingSoon).toBe(true)
  })
})

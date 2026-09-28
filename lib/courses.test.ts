import { describe, expect, it } from 'vitest'
import { courseEnrollmentHref, getCourse, usesWhatsAppEnrollment } from './courses'

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

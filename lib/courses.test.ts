import { describe, expect, it } from 'vitest'
import { courseEnrollmentHref, getCourse, usesWhatsAppEnrollment } from './courses'

describe('destino de inscripción de cursos', () => {
  it('conserva la inscripción interna para un curso gratuito', () => {
    const course = getCourse('python-practico')!
    expect(usesWhatsAppEnrollment(course)).toBe(false)
    expect(courseEnrollmentHref(course)).toBe('/inscripcion/python-practico')
  })

  it('envía un curso pago a WhatsApp con su nombre y sin ruta interna', () => {
    const course = getCourse('python-nivel-1')!
    const href = courseEnrollmentHref(course)
    expect(usesWhatsAppEnrollment(course)).toBe(true)
    expect(href).toMatch(/^https:\/\/wa\.me\/50660045660\?text=/)
    expect(decodeURIComponent(href)).toContain('Python Nivel 1')
    expect(href).not.toContain('/inscripcion/')
  })

  it('mantiene identificado el curso coming soon', () => {
    expect(getCourse('programacion-con-ia')?.comingSoon).toBe(true)
  })
})

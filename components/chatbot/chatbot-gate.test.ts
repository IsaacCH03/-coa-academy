import { describe, expect, it } from 'vitest'
import { isChatbotRoute } from './chatbot-gate'

describe('rutas públicas del asistente', () => {
  it.each(['/', '/cursos/python-nivel-1', '/proyectos', '/proyectos/proyecto-demo', '/solicitudes', '/solicitudes/python', '/certificados', '/certificados/COA-1', '/experiencia-profesional'])('permite %s', (path) => {
    expect(isChatbotRoute(path)).toBe(true)
  })

  it.each(['/admin', '/admin/entregas', '/mi-coa', '/cuenta/iniciar-sesion', '/ide', '/api/test', '/cursos/python-practico/curso', '/cursos/python-practico/curso/modulo-2', '/proyectos/guardados', '/terminos-y-condiciones'])('excluye %s', (path) => {
    expect(isChatbotRoute(path)).toBe(false)
  })
})

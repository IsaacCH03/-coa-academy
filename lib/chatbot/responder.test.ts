import { describe, expect, it } from 'vitest'
import { localChatResponder, normalizeQuestion } from './responder'

describe('asistente local de COA', () => {
  it('normaliza mayúsculas, tildes y puntuación', () => {
    expect(normalizeQuestion(' ¿CUÁNTO cuesta Python Básico? ')).toBe('cuanto cuesta python basico')
    expect(normalizeQuestion('Presio de python')).toBe('precio de python')
  })

  it('responde el precio real del curso solicitado', () => {
    const response = localChatResponder.respond('¿Cuánto cuesta Python Básico?')
    expect(response.text).toContain('₡10.000')
    expect(response.links?.[0].href).toBe('/cursos/python-nivel-1')
  })

  it('enumera cursos y enlaza al catálogo', () => {
    const response = localChatResponder.respond('¿Qué cursos tienen?')
    expect(response.text).toContain('Lógica de Programación')
    expect(response.links?.some((link) => link.href === '/#cursos')).toBe(true)
  })

  it('recomienda opciones reales a principiantes', () => {
    const response = localChatResponder.respond('Soy principiante, ¿por dónde empiezo?')
    expect(response.text).toContain('Lógica de Programación')
    expect(response.links?.some((link) => link.href === '/cursos/python-nivel-1')).toBe(true)
  })

  it('deriva preguntas desconocidas a WhatsApp incluyendo la consulta', () => {
    const response = localChatResponder.respond('¿Hay parqueo para bicicletas?')
    expect(response.text).toMatch(/No tengo información suficiente/)
    expect(response.links?.[0].href).toContain('wa.me')
    expect(decodeURIComponent(response.links?.[0].href ?? '')).toContain('¿Hay parqueo para bicicletas?')
  })

  it('responde saludos, agradecimientos y despedidas sin derivar a WhatsApp', () => {
    for (const question of ['Hola', 'Buenas', 'Gracias', 'Adiós']) {
      expect(localChatResponder.respond(question).links?.some((link) => link.href.includes('wa.me'))).not.toBe(true)
    }
  })

  it('conserva el curso para una pregunta de seguimiento', () => {
    const first = localChatResponder.respond('¿Cuánto cuesta Python Básico?')
    const followUp = localChatResponder.respond('¿Y cuánto dura?', first.context)
    expect(followUp.text).toContain('Python Nivel 1')
    expect(followUp.text).toContain('8 semanas')
  })

  it('distingue Python Intermedio de Python Nivel 1', () => {
    const response = localChatResponder.respond('¿Cuánto cuesta Python Intermedio?')
    expect(response.text).toContain('Python Intermedio')
    expect(response.links?.[0].href).toBe('/cursos/python-intermedio')
  })

  it('responde preguntas combinadas con datos publicados', () => {
    const response = localChatResponder.respond('¿Cuánto cuesta y cuánto dura Python Básico?')
    expect(response.text).toContain('₡10.000')
    expect(response.text).toContain('8 semanas')
  })

  it('deriva confirmaciones administrativas sin afirmar resultados', () => {
    const response = localChatResponder.respond('¿Ya recibieron mi pago?')
    expect(response.text).toMatch(/revisión administrativa/)
    expect(response.links?.[0].href).toContain('wa.me')
  })
})

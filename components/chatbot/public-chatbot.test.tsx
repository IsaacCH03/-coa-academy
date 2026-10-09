// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { PublicChatbot } from './public-chatbot'

afterEach(cleanup)

it('abre, conversa y cierra con Escape', () => {
  render(<PublicChatbot />)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir Asistente Virtual COA' }))
  expect(screen.getByRole('dialog', { name: 'Asistente Virtual COA' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Precios' }))
  expect(screen.getAllByText('Precios').length).toBeGreaterThan(1)
  expect(screen.getByText(/Precios publicados/)).toBeTruthy()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).toBeNull()
})

it('permite escribir una pregunta y ofrece WhatsApp cuando no conoce la respuesta', () => {
  render(<PublicChatbot />)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir Asistente Virtual COA' }))
  fireEvent.change(screen.getByLabelText('Escriba su pregunta'), { target: { value: '¿Tienen transporte?' } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar pregunta' }))
  const link = screen.getByRole('link', { name: 'Abrir WhatsApp' })
  expect(link.getAttribute('href')).toContain('wa.me')
  expect(link.getAttribute('target')).toBe('_blank')
})

it('mantiene el contexto inmediato del curso', () => {
  render(<PublicChatbot />)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir Asistente Virtual COA' }))
  const input = screen.getByLabelText('Escriba su pregunta')
  fireEvent.change(input, { target: { value: '¿Cuánto cuesta Python Básico?' } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar pregunta' }))
  fireEvent.change(input, { target: { value: '¿Y cuánto dura?' } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar pregunta' }))
  expect(screen.getByText(/Python Nivel 1 tiene una duración publicada de 8 semanas/)).toBeTruthy()
})

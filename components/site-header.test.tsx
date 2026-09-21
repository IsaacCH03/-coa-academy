// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { SiteHeader } from './site-header'

afterEach(cleanup)

it('opens and closes Más by click, outside click and Escape',()=>{
  render(<SiteHeader />)
  const more=screen.getByRole('button',{name:/Más/})
  fireEvent.click(more)
  expect(more.getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByRole('menu').textContent).toContain('Certificados')
  fireEvent.keyDown(document,{key:'Escape'})
  expect(more.getAttribute('aria-expanded')).toBe('false')
  fireEvent.click(more);fireEvent.pointerDown(document.body)
  expect(more.getAttribute('aria-expanded')).toBe('false')
})
it('keeps desktop and mobile destinations available',()=>{
  render(<SiteHeader />)
  fireEvent.click(screen.getByRole('button',{name:'Abrir menú'}))
  expect(screen.getAllByRole('link',{name:/Certificados/}).some(link=>link.getAttribute('href')==='/certificados')).toBe(true)
  expect(screen.getAllByRole('link',{name:/Beneficios/}).some(link=>link.getAttribute('href')==='/#beneficios')).toBe(true)
  expect(screen.getAllByRole('link',{name:/Términos/}).some(link=>link.getAttribute('href')==='/terminos-y-condiciones')).toBe(true)
  expect(screen.getAllByRole('link',{name:'Experiencia'}).some(link=>link.getAttribute('href')==='/experiencia-profesional')).toBe(true)
})

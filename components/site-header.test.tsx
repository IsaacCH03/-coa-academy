// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { SiteHeaderClient } from './site-header-client'

afterEach(cleanup)

it('opens and closes Más by click, outside click and Escape',()=>{
  render(<SiteHeaderClient />)
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
  render(<SiteHeaderClient />)
  fireEvent.click(screen.getByRole('button',{name:'Abrir menú'}))
  expect(screen.getAllByRole('link',{name:/Certificados/}).some(link=>link.getAttribute('href')==='/certificados')).toBe(true)
  expect(screen.getAllByRole('link',{name:/Beneficios/}).some(link=>link.getAttribute('href')==='/#beneficios')).toBe(true)
  expect(screen.getAllByRole('link',{name:/Términos/}).some(link=>link.getAttribute('href')==='/terminos-y-condiciones')).toBe(true)
  expect(screen.getAllByRole('link',{name:'Experiencia'}).some(link=>link.getAttribute('href')==='/experiencia-profesional')).toBe(true)
})

it('makes login, registration and WhatsApp available to visitors on desktop and mobile',()=>{
  render(<SiteHeaderClient />)
  expect(screen.getByRole('link',{name:'Iniciar sesión'}).getAttribute('href')).toBe('/cuenta/iniciar-sesion')
  expect(screen.getByRole('link',{name:'Registrarse'}).getAttribute('href')).toBe('/cuenta/registro')
  expect(screen.getByRole('link',{name:'Escríbenos'}).getAttribute('href')).toContain('wa.me')

  fireEvent.click(screen.getByRole('button',{name:'Abrir menú'}))
  expect(screen.getAllByRole('link',{name:'Iniciar sesión'}).some(link=>link.getAttribute('href')==='/cuenta/iniciar-sesion')).toBe(true)
  expect(screen.getAllByRole('link',{name:'Registrarse'}).some(link=>link.getAttribute('href')==='/cuenta/registro')).toBe(true)
  expect(screen.getByRole('link',{name:'Escríbenos por WhatsApp'}).getAttribute('href')).toContain('wa.me')
})

it('sends a visitor from Mi COA to login',()=>{
  render(<SiteHeaderClient />)
  fireEvent.click(screen.getByRole('button',{name:/Más/}))
  expect(screen.getByRole('menuitem',{name:/Mi COA/}).getAttribute('href')).toBe('/cuenta/iniciar-sesion')
})

it('shows the student account and links Mi COA to the student panel',()=>{
  render(<SiteHeaderClient account={{fullName:'Evelio Josué Chevez Powell',role:'student'}} />)
  const accountButton=screen.getByRole('button',{name:/Evelio Josué/})
  fireEvent.click(accountButton)
  expect(screen.getByText('Evelio Josué Chevez Powell')).toBeTruthy()
  expect(screen.getByText('Estudiante')).toBeTruthy()
  expect(screen.getByRole('menuitem',{name:'Mi COA'}).getAttribute('href')).toBe('/mi-coa')
  expect(screen.getByRole('menuitem',{name:'Cerrar sesión'})).toBeTruthy()
  expect(screen.queryByRole('menuitem',{name:'Panel de administración'})).toBeNull()
})

it('shows the admin account and links to the administration panel',()=>{
  render(<SiteHeaderClient account={{fullName:'Administración COA',role:'admin'}} />)
  fireEvent.click(screen.getByRole('button',{name:/Administración COA/}))
  expect(screen.getByText('Administrador')).toBeTruthy()
  expect(screen.getByRole('menuitem',{name:'Panel de administración'}).getAttribute('href')).toBe('/admin')
})

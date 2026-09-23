// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { AccountShell } from './account-shell'

afterEach(cleanup)

it('offers an explicit return to the public site from account panels',()=>{
  render(<AccountShell title="Mi COA" eyebrow="Panel del estudiante"><p>Contenido</p></AccountShell>)

  expect(screen.getByRole('link',{name:'Volver al sitio'}).getAttribute('href')).toBe('/')
  expect(screen.getByRole('link',{name:/C\.O\.A/}).getAttribute('href')).toBe('/')
  expect(screen.getByRole('heading',{name:'Mi COA'})).toBeTruthy()
})

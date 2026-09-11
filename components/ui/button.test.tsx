// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Link from 'next/link'
import { Button } from './button'

afterEach(cleanup)
it('renders a linked button as a single anchor with its text and destination', () => {
  render(<Button asChild><Link href="/cursos/python-practico">Ver curso</Link></Button>)
  const link = screen.getByRole('link', { name: 'Ver curso' })
  expect(link.getAttribute('href')).toBe('/cursos/python-practico')
  expect(link.closest('button')).toBeNull()
})
it('preserves regular button content', () => {
  render(<Button>Guardar</Button>)
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeTruthy()
})
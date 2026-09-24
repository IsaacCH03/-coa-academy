// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { EnrollmentForm } from './enrollment-form'

vi.mock('@/app/inscripcion/actions', () => ({ enrollInCourseAction: vi.fn() }))

afterEach(cleanup)

const profile = {
  id: 'student-a',
  full_name: 'Ana Estudiante',
  identification: null,
  country: null,
  phone: null,
}

it('selecciona Costa Rica por defecto y ofrece la lista cerrada', () => {
  render(<EnrollmentForm slug="python-practico" profileComplete={false} profile={profile} />)
  const country = screen.getByRole('combobox', { name: 'País' }) as HTMLSelectElement
  expect(country.value).toBe('Costa Rica')
  expect(screen.getByRole('option', { name: 'Brasil' })).toBeTruthy()
  expect(screen.getAllByRole('option')).toHaveLength(22)
})

it('conserva seleccionado un país válido ya guardado', () => {
  render(<EnrollmentForm slug="python-practico" profileComplete={false} profile={{ ...profile, country: 'México' }} />)
  expect((screen.getByRole('combobox', { name: 'País' }) as HTMLSelectElement).value).toBe('México')
})

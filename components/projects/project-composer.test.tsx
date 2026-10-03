// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./project-create-form', () => ({ ProjectCreateForm: () => <div>Formulario reutilizado</div> }))
import { ProjectComposer } from './project-composer'

describe('ProjectComposer', () => {
  const showModal = vi.fn()
  beforeEach(() => {
    showModal.mockClear()
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: showModal })
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: vi.fn() })
  })
  afterEach(cleanup)

  it('abre el mismo diálogo desde el campo y el botón crear', () => {
    render(<ProjectComposer account={{ fullName: 'Josue Chevez', avatarUrl: null }} courses={[]}/>)
    fireEvent.click(screen.getByRole('button', { name: '¿Qué proyecto quieres compartir, Josue?' }))
    fireEvent.click(screen.getByRole('button', { name: 'Crear proyecto' }))
    expect(showModal).toHaveBeenCalledTimes(2)
    expect(screen.getByText('Formulario reutilizado')).toBeTruthy()
  })

  it('envía al login a visitantes y conserva el regreso a proyectos', () => {
    render(<ProjectComposer account={null} courses={[]}/>)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links.every(link => link.getAttribute('href') === '/cuenta/iniciar-sesion?next=%2Fproyectos%3Fcrear%3D1')).toBe(true)
  })
})

// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/app/phase3-actions', () => ({ createProject: vi.fn() }))
import { ProjectCreateForm } from './project-create-form'

describe('ProjectCreateForm', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn((file: File) => `blob:${file.name}`) })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
  })
  afterEach(cleanup)

  it('oculta el input nativo y conserva restricciones y campos', () => {
    const { container } = render(<ProjectCreateForm courses={[{ id: 'course', title: 'Python' }]} returnTo="/proyectos"/>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(screen.getByText('Agregar imágenes')).toBeTruthy()
    expect(screen.getByText('PNG/JPG/WEBP · máximo 5 imágenes · 5 MB cada una')).toBeTruthy()
    expect(input.className).toContain('sr-only')
    expect(input.multiple).toBe(true)
    expect(input.accept).toBe('image/png,image/jpeg,image/webp')
    expect((container.querySelector('input[name="return_to"]') as HTMLInputElement).value).toBe('/proyectos')
  })

  it('crea previews locales sin subir al seleccionar', () => {
    const { container } = render(<ProjectCreateForm courses={[]}/>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(['one'], 'uno.png', { type: 'image/png' }), new File(['two'], 'dos.webp', { type: 'image/webp' })] } })
    expect(screen.getByAltText('Vista previa 1')).toBeTruthy()
    expect(screen.getByAltText('Vista previa 2')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Quitar imagen 1' })).toBeTruthy()
  })

  it('rechaza más de cinco imágenes antes del envío', () => {
    const { container } = render(<ProjectCreateForm courses={[]}/>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const files = Array.from({ length: 6 }, (_, index) => new File(['x'], `${index}.png`, { type: 'image/png' }))
    fireEvent.change(input, { target: { files } })
    expect(screen.getByRole('alert').textContent).toContain('máximo de 5 imágenes')
  })
})

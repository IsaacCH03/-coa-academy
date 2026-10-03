// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfilePhotoPicker } from './profile-photo-picker'

describe('ProfilePhotoPicker', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:preview') })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('oculta el control nativo y mantiene formatos y formulario', () => {
    const { container } = render(<ProfilePhotoPicker currentUrl={null} fullName="Josue Chevez" formId="profile-form"/>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(screen.getByText('Cambiar foto')).toBeTruthy()
    expect(screen.getByText('(opcional, PNG/JPG/WEBP, máximo 5 MB)')).toBeTruthy()
    expect(input.className).toContain('sr-only')
    expect(input.accept).toBe('image/png,image/jpeg,image/webp')
    expect(input.getAttribute('form')).toBe('profile-form')
  })

  it('rechaza archivos mayores de 5 MB antes del envío', () => {
    const { container } = render(<ProfilePhotoPicker currentUrl={null} fullName="Josue Chevez" formId="profile-form"/>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'foto.png', { type: 'image/png' })] } })
    expect(screen.getByRole('alert').textContent).toContain('supera el máximo de 5 MB')
  })

  it('muestra una preview local sin subir automáticamente', () => {
    const { container } = render(<ProfilePhotoPicker currentUrl={null} fullName="Josue Chevez" formId="profile-form"/>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [new File(['foto'], 'foto.webp', { type: 'image/webp' })] } })
    expect(screen.getByText('Imagen seleccionada')).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
  })
})

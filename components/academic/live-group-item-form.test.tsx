// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/app/admin/grupos/actions', () => ({ createItem: vi.fn() }))
import { LiveGroupItemForm } from './live-group-item-form'

afterEach(cleanup)

describe('formulario de contenido de grupo', () => {
  it.each([
    ['text', ['Contenido'], ['Archivo', 'URL', 'Fecha límite']],
    ['file', ['Descripción opcional', 'Archivo'], ['URL', 'Fecha límite', 'Máximo de archivos']],
    ['link', ['Descripción opcional', 'URL'], ['Archivo', 'Fecha límite', 'Máximo de archivos']],
    ['assignment', ['Instrucciones / descripción', 'Fecha límite', 'Hora límite', 'Máximo de archivos', 'MB por archivo'], ['URL', 'Archivo']],
  ])('muestra solamente los campos de %s', (type, visible, hidden) => {
    render(<LiveGroupItemForm groupId="group" sectionId="section" />)
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: type } })
    for (const label of visible) expect(screen.getByLabelText(label)).not.toBeNull()
    for (const label of hidden) expect(screen.queryByLabelText(label)).toBeNull()
  })
})

// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const createItemForm=vi.hoisted(()=>vi.fn(async()=>({error:null as string|null,success:true})))
vi.mock('@/app/admin/grupos/actions', () => ({ createItemForm }))
import { LiveGroupItemForm } from './live-group-item-form'

afterEach(cleanup)
beforeEach(()=>createItemForm.mockReset().mockResolvedValue({error:null,success:true}))

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
  it('mantiene el resultado de la acción dentro del formulario',()=>{render(<LiveGroupItemForm groupId="group" sectionId="section"/>);expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('button',{name:'Añadir contenido'})).not.toBeNull()})
  it('muestra un fallo recuperable sin sustituir la página',async()=>{createItemForm.mockResolvedValue({error:'No pudimos crear el contenido. Revisa el diagnóstico de la terminal.',success:false});const{container}=render(<LiveGroupItemForm groupId="group" sectionId="section"/>);fireEvent.change(screen.getByLabelText('Tipo'),{target:{value:'assignment'}});fireEvent.change(screen.getByLabelText('Título'),{target:{value:'Entrega Tarea 1'}});fireEvent.change(screen.getByLabelText('Fecha límite'),{target:{value:'2026-11-08'}});fireEvent.submit(container.querySelector('form')!);await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('No pudimos crear el contenido'));expect(screen.getByRole('button',{name:'Añadir contenido'})).not.toBeNull()})
})

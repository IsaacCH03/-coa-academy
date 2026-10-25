// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const action = vi.hoisted(()=>vi.fn(async (...args:[unknown,FormData]) => {void args;return { error: 'Error controlado para mantener el formulario.' }}))
vi.mock('@/app/phase3-actions', () => ({ submitProject: action }))
import { ProjectCreateForm } from './project-create-form'

describe('ProjectCreateForm', () => {
  beforeEach(() => {
    action.mockClear()
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

  it('acumula selecciones 1+1+1 y omite archivos duplicados', () => {
    const { container } = render(<ProjectCreateForm courses={[]}/>), input = container.querySelector('input[type="file"]') as HTMLInputElement
    const files = ['uno.png','dos.png','tres.png'].map(name=>new File(['x'],name,{type:'image/png',lastModified:1}))
    files.forEach(file=>fireEvent.change(input,{target:{files:[file]}}))
    fireEvent.change(input,{target:{files:[files[0]]}})
    expect(screen.getByText('3 de 5 imágenes')).toBeTruthy()
    expect(screen.getAllByAltText(/Vista previa/)).toHaveLength(3)
  })

  it('combina arrastrar y soltar con selección y permite eliminar', () => {
    const { container } = render(<ProjectCreateForm courses={[]}/>), input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input,{target:{files:[new File(['a'],'a.png',{type:'image/png'})]}})
    fireEvent.drop(screen.getByText('Arrastra y suelta imágenes aquí'),{dataTransfer:{files:[new File(['b'],'b.webp',{type:'image/webp'})]}})
    expect(screen.getByText('2 de 5 imágenes')).toBeTruthy()
    fireEvent.click(screen.getByRole('button',{name:'Quitar imagen 1'}))
    expect(screen.getByText('1 de 5 imágenes')).toBeTruthy()
    fireEvent.change(input,{target:{files:[new File(['a'],'a.png',{type:'image/png'})]}})
    expect(screen.getByText('2 de 5 imágenes')).toBeTruthy()
  })

  it('explica formato y tamaño inválidos', () => {
    const { container } = render(<ProjectCreateForm courses={[]}/>), input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input,{target:{files:[new File(['x'],'vector.svg',{type:'image/svg+xml'})]}})
    expect(screen.getByRole('alert').textContent).toContain('vector.svg')
    fireEvent.change(input,{target:{files:[new File([new Uint8Array(5*1024*1024+1)],'grande.png',{type:'image/png'})]}})
    expect(screen.getByRole('alert').textContent).toContain('supera el límite de 5 MB')
  })

  it('envía exactamente la colección visible y bloquea clics repetidos',async()=>{
    action.mockImplementation((...args:[unknown,FormData])=>{void args;return new Promise(()=>{})})
    const{container}=render(<ProjectCreateForm courses={[]}/>),input=container.querySelector('input[type="file"]')as HTMLInputElement,form=container.querySelector('form')!
    fireEvent.change(screen.getByLabelText('Título'),{target:{value:'Proyecto'}});fireEvent.change(screen.getByLabelText('Cuéntanos sobre tu proyecto'),{target:{value:'Descripción suficientemente larga'}})
    fireEvent.change(input,{target:{files:[new File(['a'],'a.png',{type:'image/png'}),new File(['b'],'b.webp',{type:'image/webp'})]}})
    fireEvent.submit(form);fireEvent.submit(form);fireEvent.submit(form);fireEvent.submit(form);fireEvent.submit(form)
    await waitFor(()=>expect(action).toHaveBeenCalledTimes(1))
    const data=action.mock.calls[0][1] as FormData
    expect(data.getAll('images').map(value=>(value as File).name)).toEqual(['a.png','b.webp'])
    expect(screen.getByRole('button',{name:/Enviando proyecto/}).hasAttribute('disabled')).toBe(true)
  })
})

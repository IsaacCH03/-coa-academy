// @vitest-environment jsdom
import{cleanup,fireEvent,render,screen}from'@testing-library/react'
import{afterEach,expect,it}from'vitest'
import{LiveGroupCoverInput,LiveGroupPublicFields}from'./live-group-public-fields'
afterEach(cleanup)
it('muestra opciones públicas sólo al seleccionar acceso público',()=>{render(<LiveGroupPublicFields/>);expect(screen.queryByText('Mostrar como banner destacado')).toBeNull();fireEvent.change(screen.getByLabelText('Tipo de acceso'),{target:{value:'public'}});expect(screen.getByText('Mostrar como banner destacado')).toBeTruthy();expect(screen.getByText('Mostrar en catálogo de cursos')).toBeTruthy()})
it('rechaza una portada mayor a 5 MB antes de enviarla',()=>{render(<LiveGroupCoverInput label="Portada"/>);const input=screen.getByLabelText(/Portada/) as HTMLInputElement;fireEvent.change(input,{target:{files:[new File([new Uint8Array(5*1024*1024+1)],'portada.png',{type:'image/png'})]}});expect(input.validationMessage).toMatch(/5 MB/);expect(screen.getByText(/supera el límite/)).toBeTruthy()})
it('no permite convertir en privado un grupo independiente',()=>{render(<LiveGroupPublicFields accessType="public" allowPrivate={false}/>);expect(screen.queryByRole('option',{name:'Privado'})).toBeNull();expect((screen.getByLabelText('Tipo de acceso') as HTMLSelectElement).value).toBe('public')})

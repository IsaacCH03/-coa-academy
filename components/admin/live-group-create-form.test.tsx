// @vitest-environment jsdom
import{cleanup,fireEvent,render,screen}from'@testing-library/react'
import{afterEach,expect,it,vi}from'vitest'
vi.mock('@/app/admin/grupos/actions',()=>({createGroup:vi.fn()}))
import{LiveGroupCreateForm}from'./live-group-create-form'
afterEach(cleanup)

it('exige curso base para un grupo privado',()=>{render(<LiveGroupCreateForm courses={[{id:'course-1',title:'Python Nivel 1'}]}/>);const select=screen.getByLabelText('Curso base') as HTMLSelectElement;expect(select.required).toBe(true);expect(select.value).toBe('course-1')})
it('oculta y omite el curso base para un grupo público',()=>{render(<LiveGroupCreateForm courses={[{id:'course-1',title:'Python Nivel 1'}]}/>);fireEvent.change(screen.getByLabelText('Tipo de acceso'),{target:{value:'public'}});expect(screen.queryByLabelText('Curso base')).toBeNull();expect(screen.getByText('Mostrar como banner destacado')).toBeTruthy();expect(screen.getByText('Mostrar en catálogo de cursos')).toBeTruthy()})

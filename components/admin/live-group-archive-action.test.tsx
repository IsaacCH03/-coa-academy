// @vitest-environment jsdom
import{cleanup,fireEvent,render,screen}from'@testing-library/react'
import{afterEach,describe,expect,it,vi}from'vitest'
import{LiveGroupArchiveAction}from'./live-group-archive-action'
vi.mock('@/app/admin/grupos/actions',()=>({archiveGroup:vi.fn(),restoreGroup:vi.fn()}))
afterEach(cleanup)
describe('acción de archivo de grupos',()=>{
  it('pide confirmación antes de archivar y explica qué se conserva',()=>{render(<LiveGroupArchiveAction groupId="group-1" archived={false}/>);fireEvent.click(screen.getByRole('button',{name:'Archivar grupo'}));expect(screen.getByRole('dialog')).toBeTruthy();expect(screen.getByText(/estado, visibilidad, contenido, participantes y datos académicos se conservarán/i)).toBeTruthy()})
  it('permite restaurar desde la vista archivada',()=>{render(<LiveGroupArchiveAction groupId="group-1" archived/>);fireEvent.click(screen.getByRole('button',{name:'Restaurar grupo'}));expect(screen.getByRole('dialog')).toBeTruthy();expect(screen.getByText(/volverá a aparecer en la lista principal/i)).toBeTruthy()})
})

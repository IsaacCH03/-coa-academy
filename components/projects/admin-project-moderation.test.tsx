// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('@/app/phase3-actions',()=>({moderateProject:vi.fn()}))
import { AdminProjectModeration, type AdminProject } from './admin-project-moderation'

const projects:AdminProject[]=[
 {id:'one',slug:'pendiente',title:'Proyecto pendiente',description:'Descripción pendiente',technologies:['Python'],youtube_id:'abcdefghijk',github_url:'https://github.com/coa/project',status:'pending',rejection_reason:null,created_at:'2026-10-04T12:00:00Z',author:{full_name:'Eva Valverde'},course:{title:'Python Intermedio'},student_project_images:[]},
 {id:'two',slug:'publicado',title:'Proyecto publicado',description:'Descripción publicada',technologies:[],youtube_id:null,github_url:null,status:'published',rejection_reason:null,created_at:'2026-10-03T12:00:00Z',author:{full_name:'Josue Chevez'},course:null,student_project_images:[]},
 {id:'three',slug:'rechazado',title:'Proyecto rechazado',description:'Descripción rechazada',technologies:[],youtube_id:null,github_url:null,status:'rejected',rejection_reason:'Falta documentación',created_at:'2026-10-02T12:00:00Z',author:null,course:null,student_project_images:[]},
]

describe('AdminProjectModeration',()=>{
 beforeAll(()=>{Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:vi.fn(function(this:HTMLDialogElement){this.open=true})});Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:vi.fn(function(this:HTMLDialogElement){this.open=false})})})
 afterEach(cleanup)
 it('muestra Pendientes por defecto y contadores dinámicos en español',()=>{render(<AdminProjectModeration projects={projects}/>);expect(screen.getByRole('tab',{name:'Pendientes 1'}).getAttribute('aria-selected')).toBe('true');expect(screen.getAllByText('Proyecto pendiente')).toHaveLength(2);expect(screen.queryByText('Proyecto publicado')).toBeNull()})
 it('cambia a una sola categoría y conserva proyectos sin curso ni imágenes',()=>{render(<AdminProjectModeration projects={projects}/>);fireEvent.click(screen.getByRole('tab',{name:'Publicados 1'}));expect(screen.getAllByText('Proyecto publicado')).toHaveLength(2);expect(screen.getByText('Sin imágenes')).toBeTruthy();expect(screen.queryByText('Proyecto pendiente')).toBeNull()})
 it('abre el detalle con autor, curso, enlaces y acciones',()=>{render(<AdminProjectModeration projects={projects}/>);fireEvent.click(screen.getByRole('button',{name:'Ver proyecto'}));expect(screen.getAllByText('Eva Valverde')).toHaveLength(2);expect(screen.getByText('Python Intermedio')).toBeTruthy();expect(screen.getByText('Descripción pendiente')).toBeTruthy();expect(screen.getAllByRole('button',{name:'Aprobar'}).length).toBeGreaterThan(0);expect(screen.getByText('YouTube')).toBeTruthy()})
 it('distingue el empty state de una consulta válida',()=>{render(<AdminProjectModeration projects={[]}/>);expect(screen.getByText('No hay proyectos pendientes de revisión.')).toBeTruthy()})
})

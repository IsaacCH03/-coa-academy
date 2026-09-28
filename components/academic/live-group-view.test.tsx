// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('./submission-uploader', () => ({ SubmissionUploader: () => <div>SUBMISSION_UPLOADER</div> }))
import { LiveGroupView, type LiveGroupViewSection } from './live-group-view'

const draftSections:LiveGroupViewSection[]=[{id:'section',title:'Semana 1',status:'draft',display_order:1,live_group_items:[{id:'assignment',item_type:'assignment',title:'Práctica 1',content:'Resuelve el ejercicio',url:null,original_filename:null,activity_id:'live-activity',due_at:'2026-10-18T05:59:00.000Z',max_files:3,max_file_size_bytes:20*1024*1024,status:'draft',display_order:1}]}]

describe('renderer compartido del grupo',()=>{
  it('permite al preview mostrar borradores sin simular una entrega',()=>{
    render(<LiveGroupView preview slug="python-h-26" tab="curso" tabBaseHref="/admin/grupos/id/preview" sections={draftSections} members={[]} announcements={[]} records={[]}/>)
    expect(screen.getByText('Vista previa como estudiante')).not.toBeNull()
    expect(screen.getByText('Semana 1')).not.toBeNull()
    expect(screen.getByText('Práctica 1')).not.toBeNull()
    expect(screen.queryByText('SUBMISSION_UPLOADER')).toBeNull()
  })

  it('mantiene el formulario real en la vista de miembro',()=>{
    render(<LiveGroupView slug="python-h-26" tab="curso" tabBaseHref="/mi-coa/grupos/python-h-26" sections={[{...draftSections[0],status:'published',live_group_items:[{...draftSections[0].live_group_items[0],status:'published'}]}]} members={[]} announcements={[]} records={[]}/>)
    expect(screen.getByText('SUBMISSION_UPLOADER')).not.toBeNull()
  })

  it('muestra la portada firmada cuando está disponible',()=>{
    render(<LiveGroupView coverUrl="https://signed.example/cover.png" slug="python-h-26" tab="curso" tabBaseHref="/mi-coa/grupos/python-h-26" sections={[]} members={[]} announcements={[]} records={[]}/>)
    expect(decodeURIComponent(screen.getByRole('img',{name:'Portada del grupo'}).getAttribute('src')??'')).toContain('signed.example/cover.png')
  })
})

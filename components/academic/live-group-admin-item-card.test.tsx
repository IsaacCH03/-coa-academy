// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/app/admin/grupos/actions', () => ({ archiveItem: vi.fn(), moveItem: vi.fn() }))
vi.mock('./live-group-item-editor', () => ({ LiveGroupItemEditor: () => <button>Editar</button> }))
vi.mock('./confirm-submit-button', () => ({ ConfirmSubmitButton: ({label}:{label:string}) => <button>{label}</button> }))
import { LiveGroupAdminItemCard } from './live-group-admin-item-card'

describe('tarjeta administrativa de contenido', () => {
  it('presenta la etiqueta humana y la información principal sin filtrar text', () => {
    render(<LiveGroupAdminItemCard groupId="group" item={{id:'item',item_type:'text',title:'Información general',content:'Profesor: Evelio',url:null,due_at:null,max_files:null,max_file_size_bytes:null,original_filename:null,status:'published',activity_id:null,display_order:1}} />)
    expect(screen.getByText('Texto')).not.toBeNull()
    expect(screen.getByText('Información general')).not.toBeNull()
    expect(screen.getByText('Profesor: Evelio')).not.toBeNull()
    expect(screen.queryByText('text')).toBeNull()
  })
})

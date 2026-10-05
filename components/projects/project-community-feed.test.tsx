// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/app/phase3-actions',()=>({toggleProjectSave:vi.fn(async()=>({saved:true}))}))
vi.mock('next/navigation',()=>({useRouter:()=>({push:vi.fn()})}))
import { ProjectCommunityFeed } from './project-community-feed'

const longDescription='Esta es una descripción extensa '.repeat(20)
const project={id:'project',slug:'demo',title:'Proyecto de prueba',description:longDescription,technologies:['Python','SQLite'],githubUrl:'https://github.com/coa/demo',youtubeId:null,createdAt:'2026-10-05T12:00:00Z',author:{name:'Ana Ruiz',slug:'ana-ruiz',avatarUrl:null},courseTitle:null,images:[]}
describe('ProjectCommunityFeed',()=>{
 beforeEach(()=>{Object.assign(navigator,{clipboard:{writeText:vi.fn(async()=>undefined)}})})
 afterEach(cleanup)
 it('muestra avatar de iniciales, tecnologías y acciones útiles sin imagen',()=>{render(<ProjectCommunityFeed projects={[project]} canSave={false} savedIds={[]} empty="vacío"/>);expect(screen.getByLabelText('Iniciales de Ana Ruiz').textContent).toBe('AR');expect(screen.getByText('Python')).toBeTruthy();expect(screen.getByText('GitHub')).toBeTruthy();expect(screen.getByText('Ver proyecto')).toBeTruthy();expect(screen.queryByText('Sin imágenes')).toBeNull()})
 it('expande y contrae una descripción larga en la misma publicación',()=>{render(<ProjectCommunityFeed projects={[project]} canSave savedIds={[]} empty="vacío"/>);fireEvent.click(screen.getByRole('button',{name:'Ver más'}));expect(screen.getByRole('button',{name:'Ver menos'})).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'Ver menos'}));expect(screen.getByRole('button',{name:'Ver más'})).toBeTruthy()})
 it('abre acciones de copiar y guardar sin añadir acciones sociales',()=>{render(<ProjectCommunityFeed projects={[project]} canSave savedIds={[]} empty="vacío"/>);fireEvent.click(screen.getByLabelText('Más acciones para Proyecto de prueba'));expect(screen.getByText('Guardar proyecto')).toBeTruthy();expect(screen.getByText('Copiar enlace')).toBeTruthy();expect(screen.queryByText('Reportar')).toBeNull()})
 it('adapta galería de una, dos y más imágenes y abre el visor',()=>{const withImages={...project,images:[{url:'https://example.test/one.png',alt:'uno'},{url:'https://example.test/two.png',alt:'dos'},{url:'https://example.test/three.png',alt:'tres'},{url:'https://example.test/four.png',alt:'cuatro'}]};render(<ProjectCommunityFeed projects={[withImages]} canSave savedIds={[]} empty="vacío"/>);expect(screen.getAllByLabelText('Ver todas las imágenes del proyecto')).toHaveLength(3);expect(screen.getByText(/\+1/)).toBeTruthy();fireEvent.click(screen.getAllByLabelText('Ver todas las imágenes del proyecto')[0]);expect(screen.getByRole('dialog',{name:'Imágenes de Proyecto de prueba'})).toBeTruthy()})
 it('muestra un estado vacío específico',()=>{render(<ProjectCommunityFeed projects={[]} canSave savedIds={[]} empty="Guarda proyectos que quieras consultar más adelante."/>);expect(screen.getByText('Guarda proyectos que quieras consultar más adelante.')).toBeTruthy()})
})

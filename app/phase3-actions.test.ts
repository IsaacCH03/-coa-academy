import { beforeEach, describe, expect, it, vi } from 'vitest'

class RedirectSignal extends Error {
  constructor(readonly url: string) { super(url) }
}

const state = vi.hoisted(() => ({
  authenticated: true,
  projectInsertError: null as null | Record<string, string>,
  uploadErrorAt: -1,
  imageRecordErrorAt: -1,
  uploadCalls: [] as Array<{ path: string; file: File; options: { contentType: string } }>,
  removeCalls: [] as string[][],
  removeError: false,
  projectPayloads: [] as Array<Record<string, unknown>>,
  imagePayloads: [] as Array<Record<string, unknown>>,
  deletedProjectIds: [] as string[],
  saved: false,
  saveInserts: [] as Array<Record<string, unknown>>,
  projectAvailable: true,
  projectsByKey: new Map<string, { id: string; upload_state: string; created_at:string }>(),
  admin: true,
  archiveCalls: [] as Array<{ p_projects: string[]; p_archived: boolean }>,
  moderateCalls: [] as Array<Record<string, unknown>>,
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: (url: string) => { throw new RedirectSignal(url) } }))
vi.mock('@/lib/auth/session', () => ({
  requireAccount: vi.fn(async () => {
    if (!state.authenticated) throw new RedirectSignal('/cuenta/iniciar-sesion')
    return { user: { id: 'user-1' }, profile: { role: 'student' } }
  }),
  requireAdmin: vi.fn(async () => { if (!state.admin) throw new Error('admin required'); return { user: { id: 'admin-1' } } }),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from(table: string) {
      if (table === 'student_projects') return {
        insert(payload: Record<string, unknown>) {
          state.projectPayloads.push(payload)
          return { select: () => ({ single: async () => {
            if(state.projectInsertError)return{data:null,error:state.projectInsertError}
            const key=String(payload.submission_key);if(state.projectsByKey.has(key))return{data:null,error:{code:'23505',message:'duplicate key'}}
            const project={id:`project-${state.projectsByKey.size+1}`,upload_state:'uploading',created_at:new Date().toISOString()};state.projectsByKey.set(key,project);return{data:{id:project.id},error:null}
          } }) }
        },
        delete: () => ({ eq: async (_column: string, id: string) => {
          state.deletedProjectIds.push(id)
          for(const[key,project]of state.projectsByKey)if(project.id===id)state.projectsByKey.delete(key)
          state.imagePayloads=state.imagePayloads.filter(row=>row.project_id!==id)
          return { error: null }
        } }),
        select: (columns:string) => ({ eq: () => ({ eq: (...args:[string,string]) => ({ maybeSingle: async () => columns.includes('upload_state') ? {data:state.projectsByKey.get(args[1])??null,error:null} : state.projectAvailable ? { data: { id: 'project-public' }, error: null } : { data: null, error: null } }) }) }),
      }
      if (table === 'student_project_saves') return {
        select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: state.saved ? { project_id: 'project-public' } : null, error: null }) }) }) }),
        insert: async (payload: Record<string, unknown>) => { state.saved = true; state.saveInserts.push(payload); return { error: null } },
        delete: () => ({ eq: () => ({ eq: async () => { state.saved = false; return { error: null } } }) }),
      }
      if (table === 'student_project_images') return {
        insert: async (payload: Record<string, unknown>) => {
          const index = state.imagePayloads.length
          state.imagePayloads.push(payload)
          return index === state.imageRecordErrorAt
            ? { error: { code: '42501', message: 'image row denied' } }
            : { error: null }
        },
        select: () => ({ eq: async (_column:string,projectId:string) => ({data:state.imagePayloads.filter(row=>row.project_id===projectId).map(row=>({storage_path:row.storage_path})),error:null}) }),
      }
      throw new Error(`Unexpected table ${table}`)
    },
    rpc: async (name:string,args:Record<string,unknown>) => {if(name==='set_own_project_upload_state'){for(const project of state.projectsByKey.values())if(project.id===args.p_project)project.upload_state=String(args.p_state);return{data:true,error:null}}if(name==='moderate_student_project'){state.moderateCalls.push(args);return{data:null,error:null}}if(name!=='set_student_projects_archived')throw new Error(`Unexpected rpc ${name}`);const archiveArgs=args as {p_projects:string[];p_archived:boolean};state.archiveCalls.push(archiveArgs);return{data:[{project_id:archiveArgs.p_projects[0],changed:true}],error:null}},
    storage: { from: (bucket: string) => {
      if (bucket !== 'phase3-media') throw new Error(`Unexpected bucket ${bucket}`)
      return {
        upload: async (path: string, file: File, options: { contentType: string }) => {
          const index = state.uploadCalls.length
          state.uploadCalls.push({ path, file, options })
          return index === state.uploadErrorAt
            ? { error: { statusCode: '403', message: 'storage denied' } }
            : { error: null }
        },
        remove: async (paths: string[]) => { state.removeCalls.push(paths); return { error: state.removeError ? {message:'remove failed'} : null } },
      }
    } },
  })),
}))

import { createProject, toggleProjectSave } from './phase3-actions'

function form(overrides: { course?: string; files?: File[]; status?: string; key?: string } = {}) {
  const data = new FormData()
  data.set('title', 'Proyecto Python')
  data.set('description', 'Una descripción suficientemente larga.')
  data.set('technologies', 'Python, Tkinter')
  data.set('course_id', overrides.course ?? '')
  data.set('submission_key', overrides.key ?? '11111111-1111-4111-8111-111111111111')
  if (overrides.status) data.set('status', overrides.status)
  for (const file of overrides.files ?? []) data.append('images', file)
  return data
}

async function redirected(action: Promise<unknown>) {
  try { await action } catch (error) {
    if (error instanceof RedirectSignal) return decodeURIComponent(error.url)
    throw error
  }
  throw new Error('Expected redirect')
}

describe('createProject', () => {
  beforeEach(() => {
    state.authenticated = true
    state.projectInsertError = null
    state.uploadErrorAt = -1
    state.imageRecordErrorAt = -1
    state.uploadCalls = []
    state.removeCalls = []
    state.removeError = false
    state.projectPayloads = []
    state.imagePayloads = []
    state.deletedProjectIds = []
    state.saved = false
    state.saveInserts = []
    state.projectAvailable = true
    state.projectsByKey = new Map()
    state.admin = true
    state.archiveCalls = []
    state.moderateCalls = []
    vi.restoreAllMocks()
  })

  it('crea como pending sin imagen y permite course_id nulo', async () => {
    expect(await redirected(createProject(form({ status: 'published' })))).toBe('/mi-coa/proyectos?enviado=1')
    expect(state.projectPayloads).toHaveLength(1)
    expect(state.projectPayloads[0]).toMatchObject({ author_id: 'user-1', course_id: null, status: 'pending' })
    expect(state.projectPayloads[0]).not.toHaveProperty('id')
    expect(state.uploadCalls).toHaveLength(0)
  })

  it('conserva un course_id válido en el payload', async () => {
    await redirected(createProject(form({ course: 'course-python-intermedio' })))
    expect(state.projectPayloads[0].course_id).toBe('course-python-intermedio')
  })

  it('crea con una imagen usando el id devuelto por Postgres y la ruta admitida por Storage', async () => {
    const image = new File(['image'], 'captura.png', { type: 'image/png' })
    await redirected(createProject(form({ files: [image] })))
    expect(state.uploadCalls[0]).toMatchObject({ options: { contentType: 'image/png' } })
    expect(state.uploadCalls[0].path).toMatch(/^user-1\/project-1\//)
    expect(state.imagePayloads[0]).toMatchObject({ project_id: 'project-1', display_order: 1 })
  })

  it('rechaza más de cinco imágenes antes del INSERT', async () => {
    const files = Array.from({ length: 6 }, (_, index) => new File(['x'], `${index}.png`, { type: 'image/png' }))
    expect(await redirected(createProject(form({ files })))).toContain('Máximo 5 imágenes')
    expect(state.projectPayloads).toHaveLength(0)
  })

  it('rechaza tamaño y MIME inválidos antes del INSERT', async () => {
    const tooLarge = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'grande.png', { type: 'image/png' })
    expect(await redirected(createProject(form({ files: [tooLarge] })))).toContain('supera 5 MB')
    expect(await redirected(createProject(form({ files: [new File(['x'], 'x.svg', { type: 'image/svg+xml' })] })))).toContain('no está permitido')
    expect(state.projectPayloads).toHaveLength(0)
  })

  it('registra el error real del INSERT y devuelve un error controlado', async () => {
    state.projectInsertError = { code: '42501', message: 'permission denied for table student_projects' }
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    expect(await redirected(createProject(form()))).toContain('PROJECT-INSERT-PERMISSION')
    expect(log).toHaveBeenCalledWith('[Proyectos COA] create project failed', expect.objectContaining({ stage: 'project_insert', code: '42501', diagnosticId: expect.stringMatching(/^[0-9a-f]{8}$/) }))
    expect(log.mock.calls[0][1]).not.toHaveProperty('details')
  })

  it('distingue caché de esquema y curso inválido sin exponer el error interno', async () => {
    state.projectInsertError = { code: 'PGRST204', message: "Could not find the 'submission_key' column" }
    expect(await redirected(createProject(form()))).toContain('PROJECT-SCHEMA-CACHE')
    state.projectInsertError = { code: '23503', message: 'foreign key violation with internal details' }
    const message = await redirected(createProject(form()))
    expect(message).toContain('curso seleccionado ya no está disponible')
    expect(message).not.toContain('internal details')
  })

  it('limpia proyecto e imágenes previas si falla Storage', async () => {
    state.uploadErrorAt = 1
    const files = [new File(['a'], 'a.png', { type: 'image/png' }), new File(['b'], 'b.png', { type: 'image/png' })]
    expect(await redirected(createProject(form({ files })))).toContain('no pudimos subir una de las imágenes')
    expect(state.removeCalls[0]).toHaveLength(2)
    expect(state.deletedProjectIds).toEqual(['project-1'])
  })

  it('limpia el objeto subido y el proyecto si falla el registro de imagen', async () => {
    state.imageRecordErrorAt = 0
    expect(await redirected(createProject(form({ files: [new File(['a'], 'a.webp', { type: 'image/webp' })] })))).toContain('no pudimos registrar una de las imágenes')
    expect(state.removeCalls).toHaveLength(0)
    expect(state.deletedProjectIds).toEqual(['project-1'])
  })

  it('impide que un usuario anónimo llegue al INSERT', async () => {
    state.authenticated = false
    expect(await redirected(createProject(form()))).toBe('/cuenta/iniciar-sesion')
    expect(state.projectPayloads).toHaveLength(0)
  })

  it('reconoce un reintento completado con la misma clave sin crear otro proyecto',async()=>{const data=form();expect(await redirected(createProject(data))).toBe('/mi-coa/proyectos?enviado=1');expect(await redirected(createProject(form()))).toBe('/mi-coa/proyectos?enviado=1');expect(state.projectsByKey).toHaveLength(1)})
  it('dos solicitudes concurrentes con la misma clave reservan un solo proyecto',async()=>{await Promise.all([redirected(createProject(form())),redirected(createProject(form()))]);expect(state.projectsByKey.size).toBe(1)})
  it('permite dos publicaciones legítimas con el mismo título si tienen claves distintas',async()=>{await redirected(createProject(form({key:'11111111-1111-4111-8111-111111111111'})));await redirected(createProject(form({key:'22222222-2222-4222-8222-222222222222'})));expect(state.projectsByKey).toHaveLength(2)})
  it('conserva referencias si Storage no puede compensar y recupera el mismo intento después',async()=>{state.uploadErrorAt=0;state.removeError=true;const image=new File(['a'],'a.png',{type:'image/png'});expect(await redirected(createProject(form({files:[image]})))).toContain('no pudimos subir');expect([...state.projectsByKey.values()][0].upload_state).toBe('failed');expect(state.deletedProjectIds).toHaveLength(0);state.uploadErrorAt=-1;state.removeError=false;expect(await redirected(createProject(form({files:[image]})))).toBe('/mi-coa/proyectos?enviado=1');expect(state.projectsByKey.size).toBe(1)})
})

describe('archivado administrativo',()=>{beforeEach(()=>{state.admin=true;state.archiveCalls=[]});it('archiva varios proyectos sin invocar moderación',async()=>{const{archiveProjects}=await import('./phase3-actions');const data=new FormData();data.append('project_ids','one');data.append('project_ids','two');data.set('mode','archive');await expect(archiveProjects({message:null,error:null,failed:[]},data)).resolves.toMatchObject({message:expect.stringContaining('2 proyectos'),failed:[]});expect(state.archiveCalls).toEqual([{p_projects:['one'],p_archived:true},{p_projects:['two'],p_archived:true}])});it('exige permisos administrativos',async()=>{state.admin=false;const{archiveProjects}=await import('./phase3-actions');await expect(archiveProjects({message:null,error:null,failed:[]},new FormData())).rejects.toThrow('admin required')})})

describe('moderación administrativa',()=>{beforeEach(()=>{state.admin=true;state.moderateCalls=[]});it('envía al RPC el contrato completo para aprobar',async()=>{const{moderateProject}=await import('./phase3-actions'),data=new FormData();data.set('project_id','project-1');data.set('status','published');await moderateProject(data);expect(state.moderateCalls).toEqual([{p_project:'project-1',p_status:'published',p_reason:null}])});it('rechaza una acción incompleta antes del RPC',async()=>{const{moderateProject}=await import('./phase3-actions'),data=new FormData();data.set('project_id','project-1');expect(await redirected(moderateProject(data))).toContain('acción de moderación no es válida');expect(state.moderateCalls).toHaveLength(0)})})

describe('toggleProjectSave', () => {
  beforeEach(() => { state.authenticated = true; state.saved = false; state.saveInserts = []; state.projectAvailable = true })
  it('guarda una vez y después la elimina sin duplicados', async () => {
    await expect(toggleProjectSave('project-public')).resolves.toEqual({ saved: true })
    await expect(toggleProjectSave('project-public')).resolves.toEqual({ saved: false })
    expect(state.saveInserts).toEqual([{ user_id: 'user-1', project_id: 'project-public' }])
  })
  it('no guarda un proyecto que no está publicado', async () => {
    state.projectAvailable = false
    await expect(toggleProjectSave('project-hidden')).resolves.toEqual({ error: 'Este proyecto ya no está disponible.' })
    expect(state.saveInserts).toHaveLength(0)
  })
  it('requiere sesión para guardar', async () => {
    state.authenticated = false
    expect(await redirected(toggleProjectSave('project-public'))).toBe('/cuenta/iniciar-sesion')
  })
})

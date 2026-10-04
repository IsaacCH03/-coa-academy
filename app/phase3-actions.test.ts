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
  projectPayloads: [] as Array<Record<string, unknown>>,
  imagePayloads: [] as Array<Record<string, unknown>>,
  deletedProjectIds: [] as string[],
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: (url: string) => { throw new RedirectSignal(url) } }))
vi.mock('@/lib/auth/session', () => ({
  requireAccount: vi.fn(async () => {
    if (!state.authenticated) throw new RedirectSignal('/cuenta/iniciar-sesion')
    return { user: { id: 'user-1' }, profile: { role: 'student' } }
  }),
  requireAdmin: vi.fn(),
}))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from(table: string) {
      if (table === 'student_projects') return {
        insert(payload: Record<string, unknown>) {
          state.projectPayloads.push(payload)
          return { select: () => ({ single: async () => state.projectInsertError
            ? { data: null, error: state.projectInsertError }
            : { data: { id: 'project-1' }, error: null } }) }
        },
        delete: () => ({ eq: async (_column: string, id: string) => {
          state.deletedProjectIds.push(id)
          return { error: null }
        } }),
      }
      if (table === 'student_project_images') return {
        insert: async (payload: Record<string, unknown>) => {
          const index = state.imagePayloads.length
          state.imagePayloads.push(payload)
          return index === state.imageRecordErrorAt
            ? { error: { code: '42501', message: 'image row denied' } }
            : { error: null }
        },
      }
      throw new Error(`Unexpected table ${table}`)
    },
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
        remove: async (paths: string[]) => { state.removeCalls.push(paths); return { error: null } },
      }
    } },
  })),
}))

import { createProject } from './phase3-actions'

function form(overrides: { course?: string; files?: File[]; status?: string } = {}) {
  const data = new FormData()
  data.set('title', 'Proyecto Python')
  data.set('description', 'Una descripción suficientemente larga.')
  data.set('technologies', 'Python, Tkinter')
  data.set('course_id', overrides.course ?? '')
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
    state.projectPayloads = []
    state.imagePayloads = []
    state.deletedProjectIds = []
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
    expect(await redirected(createProject(form()))).toContain('No pudimos crear el proyecto.')
    expect(log).toHaveBeenCalledWith('[Proyectos COA] create project failed', expect.objectContaining({ stage: 'project_insert', code: '42501' }))
  })

  it('limpia proyecto e imágenes previas si falla Storage', async () => {
    state.uploadErrorAt = 1
    const files = [new File(['a'], 'a.png', { type: 'image/png' }), new File(['b'], 'b.png', { type: 'image/png' })]
    expect(await redirected(createProject(form({ files })))).toContain('no pudimos subir una de las imágenes')
    expect(state.removeCalls[0]).toHaveLength(1)
    expect(state.deletedProjectIds).toEqual(['project-1'])
  })

  it('limpia el objeto subido y el proyecto si falla el registro de imagen', async () => {
    state.imageRecordErrorAt = 0
    expect(await redirected(createProject(form({ files: [new File(['a'], 'a.webp', { type: 'image/webp' })] })))).toContain('no pudimos registrar una de las imágenes')
    expect(state.removeCalls[0]).toHaveLength(1)
    expect(state.deletedProjectIds).toEqual(['project-1'])
  })

  it('impide que un usuario anónimo llegue al INSERT', async () => {
    state.authenticated = false
    expect(await redirected(createProject(form()))).toBe('/cuenta/iniciar-sesion')
    expect(state.projectPayloads).toHaveLength(0)
  })
})

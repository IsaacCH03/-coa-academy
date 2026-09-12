export type HelpMode = 'guided' | 'assisted' | 'free'
export type ProjectEntry = {
  path: string
  kind: 'file' | 'folder'
  content: string
}
export type Project = {
  version: 1
  entries: ProjectEntry[]
  active: string
  tabs: string[]
  consoleHeight: number
  consoleCollapsed: boolean
  helpMode: HelpMode
}
export const extensions = ['py', 'txt', 'csv', 'json', 'md']
export const MAX_FILE_SIZE = 1024 * 1024
export const MAX_PROJECT_SIZE = 8 * 1024 * 1024
export function newProject(): Project {
  return {
    version: 1,
    entries: [
      {
        path: 'main.py',
        kind: 'file',
        content: '# Hola desde COA\n\nprint("Hola mundo")\n',
      },
    ],
    active: 'main.py',
    tabs: ['main.py'],
    consoleHeight: 240,
    consoleCollapsed: false,
    helpMode: 'guided',
  }
}
export function validPath(path: string, kind: ProjectEntry['kind'] = 'file') {
  if (
    !path ||
    path.length > 240 ||
    path
      .split('/')
      .some(
        (part) =>
          !part ||
          part === '.' ||
          part === '..' ||
          !/^[\p{L}\p{N}_. -]+$/u.test(part) ||
          part.endsWith('.') ||
          part.endsWith(' '),
      )
  ) {
    throw new Error(
      'Usa un nombre sin rutas absolutas, .. ni caracteres especiales. Ejemplo: datos/ejemplo.py',
    )
  }
  if (
    kind === 'file' &&
    !extensions.includes(path.split('.').pop()?.toLowerCase() ?? '')
  )
    throw new Error('Puedes abrir archivos .py, .txt, .csv, .json y .md.')
  return path
}
export function validateEntries(entries: ProjectEntry[]) {
  if (entries.length > 300)
    throw new Error('El proyecto admite hasta 300 archivos y carpetas.')
  const seen = new Set<string>()
  let size = 0
  for (const entry of entries) {
    validPath(entry.path, entry.kind)
    if (seen.has(entry.path))
      throw new Error('Ya existe un archivo o carpeta con ese nombre.')
    seen.add(entry.path)
    const bytes = new TextEncoder().encode(entry.content).length
    if (bytes > MAX_FILE_SIZE)
      throw new Error('Cada archivo puede ocupar hasta 1 MB.')
    size += bytes
    if (
      entries.some(
        (other) =>
          other.kind === 'file' && entry.path.startsWith(other.path + '/'),
      )
    )
      throw new Error('Un archivo no puede contener otros archivos.')
  }
  if (size > MAX_PROJECT_SIZE)
    throw new Error('El proyecto puede ocupar hasta 8 MB.')
  return entries
}
export function addEntries(
  project: Project,
  incoming: ProjectEntry[],
): Project {
  const entries = [...project.entries, ...incoming]
  for (const entry of incoming) {
    const parts = entry.path.split('/')
    parts.pop()
    while (parts.length) {
      const path = parts.join('/')
      if (!entries.some((e) => e.path === path))
        entries.push({ path, kind: 'folder', content: '' })
      parts.pop()
    }
  }
  validateEntries(entries)
  const file = incoming.find((e) => e.kind === 'file')?.path
  return {
    ...project,
    entries,
    active: file ?? project.active,
    tabs: file ? [...new Set([...project.tabs, file])] : project.tabs,
  }
}
export function renameEntry(
  project: Project,
  from: string,
  to: string,
): Project {
  const entry = project.entries.find((e) => e.path === from)
  if (!entry) throw new Error('No se encuentra el archivo.')
  validPath(to, entry.kind)
  if (to.startsWith(from + '/'))
    throw new Error('No puedes mover una carpeta dentro de sí misma.')
  const rename = (p: string) =>
    p === from || p.startsWith(from + '/') ? to + p.slice(from.length) : p
  const entries = project.entries.map((e) => ({ ...e, path: rename(e.path) }))
  validateEntries(entries)
  // Create missing parent folders, including when moving into a new directory.
  const normalized = addEntries({ ...project, entries: [] }, entries)
  return {
    ...project,
    entries: normalized.entries,
    active: rename(project.active),
    tabs: project.tabs.map(rename),
  }
}
export function deleteEntry(project: Project, path: string): Project {
  const entries = project.entries.filter(
    (e) => e.path !== path && !e.path.startsWith(path + '/'),
  )
  const tabs = project.tabs.filter((p) =>
    entries.some((e) => e.path === p && e.kind === 'file'),
  )
  const active = entries.some((e) => e.path === project.active)
    ? project.active
    : (tabs[0] ?? entries.find((e) => e.kind === 'file')?.path ?? '')
  return {
    ...project,
    entries,
    active,
    tabs: active ? [...new Set([...tabs, active])] : [],
  }
}
export function restoreProject(value: unknown): Project {
  if (!value || typeof value !== 'object')
    throw new Error('El proyecto guardado no es válido.')
  const p = value as Partial<Project>
  if (
    p.version !== 1 ||
    !Array.isArray(p.entries) ||
    !p.entries.every(
      (e) =>
        e &&
        typeof e.path === 'string' &&
        typeof e.content === 'string' &&
        ['file', 'folder'].includes(e.kind),
    )
  )
    throw new Error('El formato guardado no es compatible.')
  validateEntries(p.entries)
  const files = p.entries.filter((e) => e.kind === 'file').map((e) => e.path)
  const active = files.includes(p.active ?? '') ? p.active! : (files[0] ?? '')
  const tabs = Array.isArray(p.tabs)
    ? p.tabs.filter((t) => files.includes(t))
    : []
  return {
    version: 1,
    entries: p.entries,
    active,
    tabs: [...new Set([...tabs, ...(active ? [active] : [])])],
    consoleHeight: Math.min(500, Math.max(120, Number(p.consoleHeight) || 240)),
    consoleCollapsed: p.consoleCollapsed === true,
    helpMode:
      p.helpMode && ['guided', 'assisted', 'free'].includes(p.helpMode)
        ? p.helpMode
        : 'guided',
  }
}

// Preserve edits/imports completed after the execution snapshot was taken.
export function mergeRuntimeEntries(
  start: Project,
  current: Project,
  runtimeEntries: ProjectEntry[],
): Project {
  validateEntries(runtimeEntries)
  const returned = new Map(runtimeEntries.map((entry) => [entry.path, entry]))
  const original = new Map(start.entries.map((entry) => [entry.path, entry]))
  const entries: ProjectEntry[] = []
  for (const entry of current.entries) {
    const before = original.get(entry.path)
    if (
      !before ||
      before.content !== entry.content ||
      before.kind !== entry.kind
    )
      entries.push(entry)
    else {
      const result = returned.get(entry.path)
      if (result) entries.push(result)
    }
    returned.delete(entry.path)
  }
  for (const entry of returned.values()) {
    if (!original.has(entry.path)) entries.push(entry)
  }
  return restoreProject({ ...current, entries })
}

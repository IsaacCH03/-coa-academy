import {
  extensions,
  fileSizeLimit,
  validateEntries,
  type ProjectEntry,
} from './project'
import { bytesToBase64 } from './binary'

export type LocalFileHandle = {
  kind: 'file'
  name: string
  getFile: () => Promise<File>
}
export type LocalDirectoryHandle = {
  kind: 'directory'
  name: string
  values: () => AsyncIterable<LocalFileHandle | LocalDirectoryHandle>
}
export type PickerWindow = Window & {
  showOpenFilePicker?: (options: {
    multiple: boolean
    types: { description: string; accept: Record<string, string[]> }[]
  }) => Promise<LocalFileHandle[]>
  showDirectoryPicker?: (options: {
    mode: 'read'
  }) => Promise<LocalDirectoryHandle>
}
const ignored = new Set([
  '.git',
  'node_modules',
  '.venv',
  'venv',
  '__pycache__',
])
const supported = (path: string) =>
  extensions.includes(path.split('.').pop()?.toLowerCase() ?? '')
async function fileEntry(file: File, path: string): Promise<ProjectEntry> {
  if (file.size > fileSizeLimit(path))
    throw new Error(
      `${file.name} supera el límite de ${path.toLowerCase().endsWith('.xlsx') ? '20 MB' : '5 MB'}.`,
    )
  const bytes = await file.arrayBuffer()
  if (path.toLowerCase().endsWith('.xlsx')) return {
    path,
    kind: 'file',
    content: bytesToBase64(new Uint8Array(bytes)),
    encoding: 'base64',
  }
  try {
    return {
      path,
      kind: 'file',
      content: new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    }
  } catch {
    throw new Error(
      `${file.name} no es texto UTF-8. Guárdalo con esa codificación antes de importarlo.`,
    )
  }
}
export async function importFileList(files: Iterable<File>) {
  const entries: ProjectEntry[] = []
  let skipped = 0
  for (const file of files) {
    const path = file.webkitRelativePath || file.name
    if (path.split('/').some((part) => ignored.has(part)) || !supported(path)) {
      skipped++
      continue
    }
    if (entries.length >= 300)
      throw new Error('Selecciona como máximo 300 archivos compatibles.')
    entries.push(await fileEntry(file, path))
  }
  validateEntries(entries)
  return { entries, skipped }
}
export async function importDirectory(handle: LocalDirectoryHandle) {
  const entries: ProjectEntry[] = []
  let skipped = 0
  let inspected = 0
  async function visit(directory: LocalDirectoryHandle, prefix: string) {
    entries.push({ path: prefix, kind: 'folder', content: '' })
    if (entries.length > 300)
      throw new Error('La carpeta supera el límite de 300 entradas.')
    for await (const child of directory.values()) {
      if (++inspected > 2000)
        throw new Error(
          'La carpeta contiene demasiadas entradas. Selecciona una subcarpeta de tu proyecto.',
        )
      if (ignored.has(child.name)) {
        skipped++
        continue
      }
      const path = `${prefix}/${child.name}`
      if (child.kind === 'directory') await visit(child, path)
      else if (supported(path))
        entries.push(await fileEntry(await child.getFile(), path))
      else skipped++
      validateEntries(entries)
    }
  }
  await visit(handle, handle.name)
  return { entries, skipped }
}

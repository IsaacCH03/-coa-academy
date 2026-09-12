import JSZip from 'jszip'
import type { Project } from './project'

export async function projectZip(project: Project) {
  const zip = new JSZip()
  for (const entry of project.entries) {
    if (entry.kind === 'folder') zip.folder(entry.path)
    else zip.file(entry.path, entry.content)
  }
  return zip.generateAsync({ type: 'blob' })
}
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

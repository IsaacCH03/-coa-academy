export const MAX_SUBMISSION_FILES = 5
export const MAX_SUBMISSION_BYTES = 10 * 1024 * 1024

export type SubmissionFileLike = Pick<File, 'name' | 'size'> & { type?: string }

export function submissionExtension(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase() ?? ''
  return /^[a-z0-9]{1,10}$/.test(extension) ? `.${extension}` : ''
}

export function submissionStoragePath(userId: string, activityId: string, fileId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(userId)) throw new Error('Identificador de usuario inválido.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(activityId)) throw new Error('Identificador de actividad inválido.')
  if (!/^[0-9a-f-]{36}$/i.test(fileId)) throw new Error('Identificador de archivo inválido.')
  return `${userId}/${activityId}/${fileId}`
}

export function safeStoredFilename(fileId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(fileId)) throw new Error('Identificador de archivo inválido.')
  return fileId
}

export function validateSubmissionFiles(files: SubmissionFileLike[], maxFiles = MAX_SUBMISSION_FILES, maxBytes = MAX_SUBMISSION_BYTES) {
  if (files.length < 1) return 'Selecciona al menos un archivo.'
  if (files.length > maxFiles) return `Puedes entregar un máximo de ${maxFiles} archivos.`
  for (const file of files) {
    if (!file.name.trim()) return 'Todos los archivos deben tener nombre.'
    if (file.name.length > 255) return 'Uno de los nombres de archivo es demasiado largo.'
    if (file.size <= 0) return `El archivo ${file.name} está vacío.`
  }
  if (files.reduce((total, file) => total + file.size, 0) > maxBytes) return 'El peso combinado supera el límite de 10 MB.'
  return null
}

export function validateSubmissionFile(file: SubmissionFileLike) {
  return validateSubmissionFiles([file])
}

export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

import type { ProjectEntry } from './project'

export function bytesToBase64(bytes: Uint8Array) {
  let result = ''
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk)
    result += String.fromCharCode(...bytes.subarray(index, index + chunk))
  return btoa(result)
}

export function base64ToBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index)
  return bytes
}

export function entryBytes(entry: ProjectEntry) {
  return entry.encoding === 'base64' ? base64ToBytes(entry.content) : new TextEncoder().encode(entry.content)
}

export function entryBlob(entry: ProjectEntry) {
  const type = entry.path.toLowerCase().endsWith('.xlsx')
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : 'text/plain;charset=utf-8'
  return new Blob([entryBytes(entry) as BlobPart], { type })
}

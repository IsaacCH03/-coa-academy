import { expect, it } from 'vitest'
import { base64ToBytes, bytesToBase64, entryBytes } from './binary'
import { restoreProject, newProject } from './project'

it('round-trips arbitrary XLSX bytes without UTF-8 conversion',()=>{
  const bytes=new Uint8Array([0,80,75,255,128,1]), content=bytesToBase64(bytes)
  expect(base64ToBytes(content)).toEqual(bytes)
  const entry={path:'reporte.xlsx',kind:'file' as const,content,encoding:'base64' as const}
  expect(entryBytes(entry)).toEqual(bytes)
  expect(restoreProject({...newProject(),entries:[entry],active:'reporte.xlsx',tabs:['reporte.xlsx']}).entries[0]).toEqual(entry)
})

import { expect, it } from 'vitest'
import JSZip from 'jszip'
import { projectZip } from './downloads'
import { addEntries, newProject } from './project'
it('downloads a real ZIP preserving text, nested paths and empty directories', async () => {
  const project = addEntries(newProject(), [
    { kind: 'folder', path: 'vacia', content: '' },
    { kind: 'file', path: 'business/logic.py', content: 'print("año")' },
  ])
  const zip = await JSZip.loadAsync(
    await (await projectZip(project)).arrayBuffer(),
  )
  expect(await zip.file('business/logic.py')!.async('string')).toBe(
    'print("año")',
  )
  expect(zip.files['vacia/'].dir).toBe(true)
  expect(zip.file('main.py')).not.toBeNull()
})

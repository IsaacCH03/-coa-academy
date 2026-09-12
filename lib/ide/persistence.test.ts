import 'fake-indexeddb/auto'
import { expect, it } from 'vitest'
import { loadProject, saveProject } from './persistence'
import { newProject } from './project'
it('restores files, folders, active tabs and preferences from IndexedDB', async () => {
  const p = newProject()
  p.helpMode = 'assisted'
  p.consoleHeight = 180
  p.entries.push({ path: 'datos', kind: 'folder', content: '' })
  p.entries[0].content = 'print("guardado")'
  await saveProject(p)
  expect(await loadProject()).toEqual(p)
})

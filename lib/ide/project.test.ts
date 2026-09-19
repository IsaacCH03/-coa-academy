import { expect, it } from 'vitest'
import {
  mergeRuntimeEntries,
  addEntries,
  deleteEntry,
  newProject,
  renameEntry,
  restoreProject,
  validPath,
} from './project'
it('creates missing parent folders and opens the new file', () => {
  const p = addEntries(newProject(), [
    { path: 'business/logic.py', kind: 'file', content: 'value = 1' },
  ])
  expect(
    p.entries.some((e) => e.path === 'business' && e.kind === 'folder'),
  ).toBe(true)
  expect(p.active).toBe('business/logic.py')
})
it('opens new files in the active split group without changing group one', () => {
  const p = addEntries({ ...newProject(), splitEnabled: true, activeEditorGroup: 2 }, [{ path: 'logic.py', kind: 'file', content: '' }])
  expect(p.active).toBe('main.py')
  expect(p.tabs).toEqual(['main.py'])
  expect(p.secondaryActive).toBe('logic.py')
  expect(p.secondaryTabs).toEqual(['logic.py'])
})
it('renames a folder with its contents and tabs', () => {
  const p = addEntries(newProject(), [
    { path: 'business/logic.py', kind: 'file', content: '' },
  ])
  const renamed = renameEntry(p, 'business', 'services')
  expect(renamed.active).toBe('services/logic.py')
  expect(renamed.tabs).toContain('services/logic.py')
  expect(deleteEntry(renamed, 'services').entries.map((e) => e.path)).toEqual([
    'main.py',
  ])
})
it.each([
  '../secret.py',
  '/main.py',
  'a/../b.py',
  'a//b.py',
  'a\\b.py',
  'x.exe',
])('rejects unsafe/unsupported path %s', (path) =>
  expect(() => validPath(path)).toThrow(),
)
it('does not overwrite an existing file or permit files as parents', () => {
  expect(() =>
    addEntries(newProject(), [{ path: 'main.py', kind: 'file', content: '' }]),
  ).toThrow()
  expect(() =>
    addEntries(newProject(), [
      { path: 'main.py/other.py', kind: 'file', content: '' },
    ]),
  ).toThrow()
})
it('repairs invalid saved tabs/preferences and rejects corrupt data', () => {
  const p = restoreProject({
    ...newProject(),
    tabs: ['bad.py'],
    active: 'bad.py',
    consoleHeight: -2,
    helpMode: 'bad',
  })
  expect(p.active).toBe('main.py')
  expect(p.tabs).toEqual(['main.py'])
  expect(p.consoleHeight).toBe(120)
  expect(() => restoreProject({ entries: 'bad' })).toThrow()
})
it('preserves files imported or edited while execution was finishing', () => {
  const start = newProject()
  const current = addEntries(start, [
    { path: 'nuevo.py', kind: 'file', content: 'print(3)' },
  ])
  current.entries = current.entries.map((e) =>
    e.path === 'main.py' ? { ...e, content: 'print(2)' } : e,
  )
  const result = mergeRuntimeEntries(start, current, [
    ...start.entries,
    { path: 'resultado.txt', kind: 'file', content: '1' },
  ])
  expect(result.entries.find((e) => e.path === 'main.py')?.content).toBe(
    'print(2)',
  )
  expect(result.entries.find((e) => e.path === 'nuevo.py')).toBeTruthy()
  expect(result.entries.find((e) => e.path === 'resultado.txt')).toBeTruthy()
})
it('restores old projects and persists valid explorer state', () => {
  const legacy = newProject()
  const restored = restoreProject({
    ...legacy,
    explorerExpanded: undefined,
    selectedFolder: undefined,
  })
  expect(restored.explorerExpanded).toEqual([])
  expect(restored.selectedFolder).toBe('')
  const nested = addEntries(restored, [
    { path: 'Proyecto/business/data/files.py', kind: 'file', content: 'print(1)' },
  ])
  expect(nested.entries.map((entry) => entry.path)).toContain('Proyecto/business/data')
  expect(nested.explorerExpanded).toContain('Proyecto/business')
})

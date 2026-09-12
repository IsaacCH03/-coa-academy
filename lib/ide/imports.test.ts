import { expect, it } from 'vitest'
import {
  importDirectory,
  importFileList,
  type LocalDirectoryHandle,
} from './imports'
it('imports UTF-8 files and skips unsupported files', async () => {
  const result = await importFileList([
    new File(['print("Hola")'], 'clase.py'),
    new File(['binary'], 'foto.png'),
  ])
  expect(result.entries).toEqual([
    { path: 'clase.py', kind: 'file', content: 'print("Hola")' },
  ])
  expect(result.skipped).toBe(1)
})
it('preserves native directory hierarchy and empty folders', async () => {
  const empty: LocalDirectoryHandle = {
    kind: 'directory',
    name: 'datos',
    async *values() {},
  }
  const root: LocalDirectoryHandle = {
    kind: 'directory',
    name: 'proyecto',
    async *values() {
      yield empty
      yield {
        kind: 'file',
        name: 'main.py',
        getFile: async () => new File(['print(1)'], 'main.py'),
      }
      yield {
        kind: 'directory',
        name: '.git',
        async *values() {
          throw new Error('Must not traverse Git metadata')
        },
      }
    },
  }
  const result = await importDirectory(root)
  expect(result.entries.map((e) => e.path)).toEqual([
    'proyecto',
    'proyecto/datos',
    'proyecto/main.py',
  ])
  expect(result.skipped).toBe(1)
})
it('rejects undecodable content and oversized files before applying changes', async () => {
  await expect(
    importFileList([new File([new Uint8Array([0xff])], 'mal.py')]),
  ).rejects.toThrow('UTF-8')
  await expect(
    importFileList([new File(['a'.repeat(1048577)], 'big.py')]),
  ).rejects.toThrow('1 MB')
})

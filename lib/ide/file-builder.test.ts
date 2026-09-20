import { describe, expect, it } from 'vitest'
import { fileOperations, generateFileCode, projectDataFiles, type FileGeneration } from './file-builder'
import { builderInsertion } from './insertion'
import { builderClassAt, PythonProjectIndex } from './python-intelligence'
import { moduleImportEdit } from './python-source'

const settings: FileGeneration = { form: 'code', method: 'leer', path: 'datos/ventas.csv', pathParameter: false, dataParameter: false }
const cursor = (line: number, column: number) => ({ startLineNumber: line, endLineNumber: line, startColumn: column, endColumn: column })
function apply(source: string, code: string, line: number, column: number) {
  const plan = builderInsertion(source, cursor(line, column), code)
  const offset = (line: number, col: number) => source.split('\n').slice(0, line - 1).reduce((n, text) => n + text.length + 1, 0) + col - 1
  for (const edit of [...plan.edits].sort((a, b) => offset(b.range.startLineNumber, b.range.startColumn) - offset(a.range.startLineNumber, a.range.startColumn))) {
    source = source.slice(0, offset(edit.range.startLineNumber, edit.range.startColumn)) + edit.text + source.slice(offset(edit.range.endLineNumber, edit.range.endColumn))
  }
  return source
}

describe('file generation and shared insertion', () => {
  it.each(fileOperations)('$id uses the cursor, relative indentation and one top-level import', (operation) => {
    const code = generateFileCode(operation, {}, { ...settings, method: operation.method })
    const actual = apply('def ejecutar():\n    if True:\n        ', code, 3, 9)
    expect(actual).not.toMatch(/^\s+import /m)
    expect(actual).toContain('def ejecutar():\n    if True:\n        ')
    const method = generateFileCode(operation, {}, { ...settings, form: 'function', className: 'Files', pathParameter: true, dataParameter: true, method: operation.method })
    expect(method).toContain(`def ${operation.method}(self, ruta${operation.data ? ', dato' : ''}):`)
  })
  it('preserves module headers and deduplicates imports without mistaking strings or local imports', () => {
    const source = '#!/usr/bin/python\n"""Module\nnotes\n"""\nfrom __future__ import annotations\nimport os, csv\n\nif True:\n    '
    const code = generateFileCode(fileOperations.find((item) => item.id === 'csv-read')!, {}, settings)
    expect(apply(source, code, 9, 5).match(/\bimport.*csv/g)).toHaveLength(1)
    expect(moduleImportEdit('"""import csv"""\nif True:\n    import csv\n', ['import csv'])?.range.startLineNumber).toBe(2)
    expect(moduleImportEdit('from __future__ import annotations\nif True:\n    ', ['import csv'])?.range.startLineNumber).toBe(2)
    expect(apply('', 'import csv\n\nprint(csv)', 1, 1)).toBe('import csv\nprint(csv)\n')
  })
  it('detects file paths and rejects invalid method names and unsafe absolute paths', () => {
    expect(projectDataFiles([{ path: 'datos/clientes.txt', kind: 'file', content: '' }, { path: 'datos/ventas.txt', kind: 'file', content: '' }, { path: 'folder.txt', kind: 'folder', content: '' }], 'TXT')).toEqual(['datos/clientes.txt', 'datos/ventas.txt'])
    const operation = fileOperations[0]
    expect(() => generateFileCode(operation, {}, { ...settings, form: 'function', method: 'class' })).toThrow()
    expect(() => generateFileCode(operation, {}, { ...settings, path: 'C:\\datos.txt' })).toThrow()
  })
  it('detects a direct class body without leaking self into nested functions or later code', () => {
    for (const source of ['class FilesTXT:\n    ', 'class FilesCSV:\n\t', 'class FilesCSV:']) expect(builderClassAt(source, source.length)).toMatch(/^Files/)
    for (const source of ['class Files:\n    def run(self):\n        ', 'class Files:\n    pass\n\n', '"""class Fake:\n    """\n', 'def run():\n    ']) expect(builderClassAt(source, source.length)).toBeUndefined()
  })
  it('keeps CRUD explicit and preserves optional headers', () => {
    for (const id of ['csv-edit', 'csv-delete']) {
      const code = generateFileCode(fileOperations.find((item) => item.id === id)!, {}, settings)
      expect(code).toContain('registros = list(lector)')
      expect(code).toContain('cabecera = next(lector, [])')
      expect(code).toContain('escritor.writerows(actualizados)')
    }
  })
})

describe('standard-library intelligence', () => {
  it('completes CSV aliases, file methods and writer methods without guessing unknown objects', () => {
    const index = new PythonProjectIndex()
    const source = 'import csv as tabla\nwith open("datos.csv", "w") as archivo:\n    escritor = tabla.writer(archivo)\n    escritor.\n'
    index.update([{ path: 'main.py', kind: 'file', content: source }])
    expect(index.members('main.py', 'tabla', 4).map((s) => s.name)).toContain('DictReader')
    expect(index.members('main.py', 'archivo', 4).map((s) => s.name)).toContain('seek')
    expect(index.members('main.py', 'escritor', 4).map((s) => s.name)).toContain('writerows')
    expect(index.members('main.py', 'desconocido', 4)).toEqual([])
    index.updateFile('main.py', 'import csv\ndef f(csv):\n    csv.\n')
    expect(index.members('main.py', 'csv', 3)).toEqual([])
  })
})

describe('Excel generation', () => {
  const excel = () => fileOperations.filter((item) => item.kind === 'Excel')
  it('offers all 39 portable openpyxl operations and detects XLSX files', () => {
    expect(excel()).toHaveLength(39)
    expect(excel().every((item) => generateFileCode(item, {}, { ...settings, path: 'reportes/ventas.xlsx', method: item.method }).includes('openpyxl') || item.id === 'excel-save')).toBe(true)
    expect(projectDataFiles([{path:'ventas.xlsx',kind:'file',content:'',encoding:'base64'},{path:'datos.csv',kind:'file',content:''}], 'Excel')).toEqual(['ventas.xlsx'])
  })
  it('generates loose code, functions and class methods through shared insertion', () => {
    const create=excel().find((item)=>item.id==='excel-create')!
    const loose=generateFileCode(create,{}, {...settings,path:'reporte.xlsx'})
    expect(apply('if generar:\n    ',loose,2,5)).toContain('if generar:\n    wb = Workbook()')
    expect(generateFileCode(create,{}, {...settings,path:'reporte.xlsx',form:'function',method:'crear_reporte'})).toContain('def crear_reporte():')
    expect(generateFileCode(create,{}, {...settings,path:'reporte.xlsx',form:'function',method:'crear_reporte',className:'Reporte'})).toContain('def crear_reporte(self):')
  })
  it('deduplicates openpyxl imports at module level', () => {
    const create=excel().find((item)=>item.id==='excel-create')!
    const generated=generateFileCode(create,{}, {...settings,path:'reporte.xlsx'})
    const result=apply('from openpyxl import Workbook\n\nif True:\n    ',generated,4,5)
    expect(result.match(/from openpyxl import Workbook/g)).toHaveLength(1)
  })
  it('completes openpyxl imports and inferred workbook/worksheet members', () => {
    const source='from openpyxl import Workbook\nwb = Workbook()\nws = wb.active\n'
    const index=new PythonProjectIndex().update([{path:'main.py',kind:'file',content:source}])
    expect(index.completions('main.py',1,'from openpyxl import ').map(item=>item.name)).toEqual(['Workbook','load_workbook'])
    expect(index.completions('main.py',1,'from openpyxl.styles import ').map(item=>item.name)).toContain('PatternFill')
    expect(index.members('main.py','wb',2).map(item=>item.name)).toContain('create_sheet')
    expect(index.members('main.py','ws',3).map(item=>item.name)).toEqual(expect.arrayContaining(['append','iter_rows','max_row']))
  })
})

// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest'
import type { ProjectEntry } from './project'
import type { XlsxBook } from './xlsx-reader'
import { clearXlsxCache, loadXlsxWorkbook, MAX_CACHED_WORKBOOKS, peekXlsxWorkbook, reconcileXlsxCache, xlsxCacheSize } from './xlsx-cache'

const book=(name:string):XlsxBook=>({sheets:[{name,rows:0,columns:0,widths:[],cells:new Map()}]})
const entry=(path:string,content:string):ProjectEntry=>({path,kind:'file',content,encoding:'base64'})
beforeEach(clearXlsxCache)

it('parses once when switching tabs or closing and reopening the same workbook',async()=>{
  const parse=vi.fn(async()=>book('Ventas')),file=entry('ventas.xlsx','QQ==')
  expect(await loadXlsxWorkbook(file,parse)).toBe(await loadXlsxWorkbook(file,parse))
  expect(peekXlsxWorkbook(file)?.sheets[0].name).toBe('Ventas')
  expect(parse).toHaveBeenCalledTimes(1)
})

it('deduplicates concurrent requests while parsing is pending',async()=>{
  let release:(value:XlsxBook)=>void=()=>{}
  const parse=vi.fn(()=>new Promise<XlsxBook>((resolve)=>{release=resolve})),file=entry('ventas.xlsx','QQ==')
  const first=loadXlsxWorkbook(file,parse),second=loadXlsxWorkbook(file,parse)
  await Promise.resolve();release(book('Ventas'))
  expect(await first).toBe(await second)
  expect(parse).toHaveBeenCalledTimes(1)
})

it('misses safely after replacement or a Pyodide/openpyxl content update',async()=>{
  const parse=vi.fn(async()=>book(`v${parse.mock.calls.length}`))
  await loadXlsxWorkbook(entry('ventas.xlsx','QQ=='),parse)
  reconcileXlsxCache([entry('ventas.xlsx','Qg==')])
  expect(peekXlsxWorkbook(entry('ventas.xlsx','QQ=='))).toBeUndefined()
  await loadXlsxWorkbook(entry('ventas.xlsx','Qg=='),parse)
  expect(parse).toHaveBeenCalledTimes(2)
})

it('removes deleted and renamed paths during project reconciliation',async()=>{
  const parse=vi.fn(async()=>book('Datos'))
  await loadXlsxWorkbook(entry('datos.xlsx','QQ=='),parse)
  reconcileXlsxCache([{path:'main.py',kind:'file',content:''}])
  expect(xlsxCacheSize()).toBe(0)
  await loadXlsxWorkbook(entry('datos.xlsx','QQ=='),parse)
  reconcileXlsxCache([entry('movido.xlsx','QQ==')])
  expect(xlsxCacheSize()).toBe(0)
})

it('does not retain parsing failures as valid cache entries',async()=>{
  const failed=vi.fn(async()=>{throw new Error('roto')}),file=entry('roto.xlsx','QQ==')
  await expect(loadXlsxWorkbook(file,failed)).rejects.toThrow('roto')
  expect(xlsxCacheSize()).toBe(0)
  await expect(loadXlsxWorkbook(file,failed)).rejects.toThrow('roto')
  expect(failed).toHaveBeenCalledTimes(2)
})

it('evicts the least recently used resolved workbook after four entries',async()=>{
  const parse=vi.fn(async()=>book('Hoja'))
  const files=Array.from({length:MAX_CACHED_WORKBOOKS+1},(_,index)=>entry(`${index}.xlsx`,btoa(String(index))))
  for(const file of files.slice(0,MAX_CACHED_WORKBOOKS))await loadXlsxWorkbook(file,parse)
  peekXlsxWorkbook(files[0])
  await loadXlsxWorkbook(files[MAX_CACHED_WORKBOOKS],parse)
  expect(peekXlsxWorkbook(files[0])).toBeDefined()
  expect(peekXlsxWorkbook(files[1])).toBeUndefined()
  expect(xlsxCacheSize()).toBe(MAX_CACHED_WORKBOOKS)
})

it('changing sheets reuses the already parsed workbook model',async()=>{
  const result={sheets:[...book('Ventas').sheets,...book('Resumen').sheets]},parse=vi.fn(async()=>result),file=entry('dos.xlsx','QQ==')
  const loaded=await loadXlsxWorkbook(file,parse)
  expect(loaded.sheets[0].name).toBe('Ventas')
  expect(loaded.sheets[1].name).toBe('Resumen')
  expect(await loadXlsxWorkbook(file,parse)).toBe(loaded)
  expect(parse).toHaveBeenCalledTimes(1)
})

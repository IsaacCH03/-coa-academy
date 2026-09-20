'use client'
import { base64ToBytes } from './binary'
import type { ProjectEntry } from './project'
import { readXlsx, type XlsxBook, type XlsxReadMetrics } from './xlsx-reader'

export const MAX_CACHED_WORKBOOKS = 4
type Parser = (bytes: Uint8Array, metrics?: (value: XlsxReadMetrics) => void) => Promise<XlsxBook>
type CacheItem = { path: string; content: string; promise: Promise<XlsxBook>; book?: XlsxBook; used: number }
const cache = new Map<string, Map<string, CacheItem>>()
let clock = 0

export function xlsxCacheKey(entry: Pick<ProjectEntry, 'path' | 'content'>) {
  return { path: entry.path, content: entry.content }
}
function find(entry: Pick<ProjectEntry, 'path' | 'content'>) { return cache.get(entry.path)?.get(entry.content) }
function remove(item: CacheItem) { const versions=cache.get(item.path);versions?.delete(item.content);if(!versions?.size)cache.delete(item.path) }
function trim() {
  const resolved=Array.from(cache.values()).flatMap((versions)=>Array.from(versions.values())).filter((item)=>item.book)
  while(resolved.length>MAX_CACHED_WORKBOOKS) { resolved.sort((a,b)=>a.used-b.used);const oldest=resolved.shift();if(oldest)remove(oldest) }
}
export function peekXlsxWorkbook(entry: Pick<ProjectEntry, 'path' | 'content'>) {
  const item=find(entry);if(!item?.book)return undefined;item.used=++clock;return item.book
}
export function loadXlsxWorkbook(entry: Pick<ProjectEntry, 'path' | 'content'>, parser: Parser=readXlsx) {
  const existing=find(entry)
  if(existing){existing.used=++clock;return existing.promise}
  const started=performance.now();let decodeMs=0;let details:XlsxReadMetrics|undefined
  const item:CacheItem={path:entry.path,content:entry.content,used:++clock,promise:Promise.resolve({sheets:[]})}
  item.promise=Promise.resolve().then(()=>{const decodeStart=performance.now();const bytes=base64ToBytes(entry.content);decodeMs=performance.now()-decodeStart;return parser(bytes,(value)=>{details=value})}).then((book)=>{
    item.book=book;item.used=++clock;trim()
    if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('coa:xlsx-parsed',{detail:{path:entry.path,decodeMs,totalMs:performance.now()-started,...details}}))
    return book
  },(error)=>{remove(item);throw error})
  const versions=cache.get(entry.path)??new Map<string,CacheItem>();versions.set(entry.content,item);cache.set(entry.path,versions)
  return item.promise
}
export function reconcileXlsxCache(entries: Pick<ProjectEntry, 'path' | 'content' | 'kind'>[]) {
  const valid=new Map(entries.filter((entry)=>entry.kind==='file'&&entry.path.toLowerCase().endsWith('.xlsx')).map((entry)=>[entry.path,entry.content]))
  for(const versions of cache.values())for(const item of versions.values())if(valid.get(item.path)!==item.content)remove(item)
}
export function clearXlsxCache() { cache.clear();clock=0 }
export function xlsxCacheSize() { return Array.from(cache.values()).reduce((total,versions)=>total+versions.size,0) }

if(typeof window!=='undefined')window.addEventListener('coa:project-entries',(event)=>reconcileXlsxCache((event as CustomEvent<ProjectEntry[]>).detail))

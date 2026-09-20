'use client'
import { useEffect, useMemo, useState } from 'react'
import type { ProjectEntry } from '@/lib/ide/project'
import { loadXlsxWorkbook, peekXlsxWorkbook } from '@/lib/ide/xlsx-cache'
import { columnLabel } from '@/lib/ide/xlsx-reader'

const ROW_HEIGHT = 29
export default function ExcelViewer({ entry }: { entry: ProjectEntry }) {
  const cached=peekXlsxWorkbook(entry)
  const [loaded,setLoaded]=useState(()=>cached?{path:entry.path,content:entry.content,book:cached}:null), [error,setError]=useState<{path:string;content:string;message:string}|null>(null), [sheetIndex,setSheetIndex]=useState(0), [selected,setSelected]=useState(''), [scrollTop,setScrollTop]=useState(0), [height,setHeight]=useState(500)
  useEffect(()=>{ let active=true; void loadXlsxWorkbook(entry).then((book)=>{if(active)setLoaded({path:entry.path,content:entry.content,book})},(cause)=>{ console.error(`[Excel Viewer] No se pudo interpretar ${entry.path}.`,cause); if(active)setError({path:entry.path,content:entry.content,message:'No se pudo visualizar este archivo Excel. El archivo puede contener una estructura dañada o una característica que Excel Viewer todavía no admite.'}) }); return()=>{active=false} },[entry])
  const book=cached??(loaded?.path===entry.path&&loaded.content===entry.content?loaded.book:null)
  const sheet=book?.sheets[sheetIndex]
  const range=useMemo(()=>{ const start=Math.max(1,Math.floor(scrollTop/ROW_HEIGHT)-8), count=Math.ceil(height/ROW_HEIGHT)+16; return {start,end:Math.min(sheet?.rows??0,start+count)} },[scrollTop,height,sheet?.rows])
  if(error?.path===entry.path&&error.content===entry.content) return <div className="excel-state" role="alert"><strong>{entry.path}</strong><p>{error.message}</p></div>
  if(!book) return <div className="excel-state"><strong>{entry.path}</strong><p>Cargando Excel Viewer…</p></div>
  if(!sheet) return <div className="excel-state"><strong>{entry.path}</strong><p>El libro no contiene hojas visibles.</p></div>
  const columns=Math.max(sheet.columns,1), template=`48px ${Array.from({length:columns},(_,i)=>`${sheet.widths[i]??112}px`).join(' ')}`
  return <div className="excel-viewer" data-testid="excel-viewer">
    <header><strong>{entry.path}</strong><label>Hoja: <select aria-label="Hoja de Excel" value={sheetIndex} onChange={e=>{setSheetIndex(Number(e.target.value));setScrollTop(0)}}>{book.sheets.map((item,index)=><option value={index} key={item.name}>{item.name}</option>)}</select></label><span>{selected||`${sheet.rows} filas · ${sheet.columns} columnas`}</span></header>
    {!sheet.rows?<div className="excel-state"><p>Esta hoja está vacía.</p></div>:<div className="excel-scroll" ref={node=>{if(node&&node.clientHeight!==height)setHeight(node.clientHeight)}} onScroll={e=>setScrollTop(e.currentTarget.scrollTop)}>
      <div className="excel-grid excel-head" style={{gridTemplateColumns:template}}><span className="excel-corner"/>{Array.from({length:columns},(_,i)=><span key={i}>{columnLabel(i+1)}</span>)}</div>
      <div className="excel-canvas" style={{height:sheet.rows*ROW_HEIGHT, width:`calc(${template.replaceAll(' ',' + ')})`}}>
        {Array.from({length:Math.max(0,range.end-range.start+1)},(_,offset)=>{const row=range.start+offset;return <div className="excel-grid excel-row" key={row} style={{gridTemplateColumns:template,top:(row-1)*ROW_HEIGHT}}><span className="excel-row-number">{row}</span>{Array.from({length:columns},(_,columnIndex)=>{const ref=`${columnLabel(columnIndex+1)}${row}`,cell=sheet.cells.get(ref),style=cell?.style;return <button key={ref} title={cell?.value??''} className={selected===ref?'selected':''} onClick={()=>setSelected(ref)} style={{fontWeight:style?.bold?'bold':undefined,color:style?.color?`#${style.color}`:undefined,backgroundColor:style?.background?`#${style.background}`:undefined,textAlign:style?.align as 'left'|'center'|'right'|undefined,borderStyle:style?.border?'solid':undefined,gridColumn:cell?.merge?.columns?`span ${cell.merge.columns}`:undefined}}>{cell?.value??''}</button>})}</div>})}
      </div>
    </div>}
  </div>
}

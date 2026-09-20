'use client'
import { X } from 'lucide-react'
import type { Monaco, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type { ProjectEntry } from '@/lib/ide/project'
import type { StudioSettings } from '@/lib/ide/personalization'
import { CodeEditor } from './code-editor'
import dynamic from 'next/dynamic'

const ExcelViewer = dynamic(() => import('./excel-viewer'), { ssr: false, loading: () => <div className="excel-state">Cargando Excel Viewer…</div> })

export function EditorGroup({ group, path, tabs, entries, readOnly, settings, excelViewerEnabled, onInstallExcelViewer, onActivate, onOpen, onClose, onChange, onMount, onNavigate, onNotice }: {
  group: 1 | 2
  path: string
  tabs: string[]
  entries: ProjectEntry[]
  readOnly: boolean
  settings: StudioSettings
  excelViewerEnabled: boolean
  onInstallExcelViewer: () => void
  onActivate: () => void
  onOpen: (path: string) => void
  onClose: (path: string) => void
  onChange: (path: string, content: string) => void
  onMount: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void
  onNavigate: (path: string, line: number, column: number) => void
  onNotice: (message: string) => void
}) {
  const entry = entries.find((entry) => entry.path === path)
  const content = entry?.content ?? ''
  const excel = path.toLowerCase().endsWith('.xlsx')
  return <section className="ide-editor-group" data-group={group} onPointerDown={onActivate}>
    <div className="ide-tabs" role="tablist" aria-label={`Archivos abiertos · grupo ${group}`}>
      {tabs.map((tab) => <div className={`ide-tab ${tab === path ? 'active' : ''}`} key={tab}>
        <button role="tab" aria-selected={tab === path} onClick={() => onOpen(tab)}><span className="ide-py">{tab.endsWith('.py') ? 'py' : '·'}</span>{tab.split('/').pop()}</button>
        <button aria-label={`Cerrar ${tab} del grupo ${group}`} onClick={() => onClose(tab)}><X size={13}/></button>
      </div>)}
    </div>
    <div className="ide-editor">
      {path ? excel ? excelViewerEnabled && entry ? <ExcelViewer key={entry.path} entry={entry}/> : <div className="excel-state"><strong>Excel Viewer</strong><p>Para visualizar archivos Excel dentro de COA Python Studio instala Excel Viewer.</p><button className="ide-primary" onClick={onInstallExcelViewer}>Instalar Excel Viewer</button></div> : <CodeEditor path={path} content={content} readOnly={readOnly} settings={settings} entries={entries} onFocus={onActivate} onChange={(value)=>onChange(path,value)} onMount={onMount as OnMount} onNavigate={onNavigate} onNotice={onNotice}/> : <div className="ide-empty"><p>Abre un archivo en este grupo.</p></div>}
    </div>
  </section>
}

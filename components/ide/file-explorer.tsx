'use client'
import { useRef, useState, type InputHTMLAttributes } from 'react'
import {
  FileCode2,
  Folder,
  FilePlus2,
  FolderPlus,
  Upload,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronDown,
  Download,
  MoreHorizontal,
  Plus,
  Braces,
  Copy,
  Sheet,
} from 'lucide-react'
import {
  addEntries,
  deleteEntry,
  renameEntry,
  type Project,
  type ProjectEntry,
} from '@/lib/ide/project'
import {
  importDirectory,
  importFileList,
  type PickerWindow,
} from '@/lib/ide/imports'
import { entryBlob } from '@/lib/ide/binary'

export function FileExplorer({
  project,
  onChange,
  onOpen,
  onOpenAside,
  onError,
  onNew,
  disabled,
  explorerLabel = 'EXPLORADOR',
  themedIcons = false,
}: {
  project: Project
  onChange: (p: Project | ((current: Project) => Project)) => void
  onOpen: (path: string) => void
  onOpenAside: (path: string, orientation?: 'right' | 'down') => void
  onError: (text: string) => void
  onNew: () => void
  disabled: boolean
  explorerLabel?: string
  themedIcons?: boolean
}) {
  const [form, setForm] = useState<{
    kind: 'file' | 'folder' | 'rename' | 'delete'
    path?: string
  } | null>(null)
  const [name, setName] = useState('')
  const [importing, setImporting] = useState(false)
  const [classForm, setClassForm] = useState(false)
  const [className, setClassName] = useState('Persona')
  const [classFile, setClassFile] = useState('persona.py')
  const [classDestination, setClassDestination] = useState(project.selectedFolder)
  const [classTemplate, setClassTemplate] = useState('empty')
  const [classConstructor, setClassConstructor] = useState(false)
  const [layersForm, setLayersForm] = useState(false)
  const [layers, setLayers] = useState({ business:true, presentation:true, domain:false, data:false, main:true })
  const [contextPath, setContextPath] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const destination = project.selectedFolder
  const smartDestination = destination || (project.active.includes('/') ? project.active.slice(0, project.active.lastIndexOf('/')) : '')
  const destinationPath = (value: string) =>
    destination ? `${destination}/${value}` : value
  function submit() {
    if (!form) return
    try {
      if (form.kind === 'rename')
        onChange(renameEntry(project, form.path!, name.trim()))
      else if (form.kind === 'delete')
        onChange(deleteEntry(project, form.path!))
      else
        onChange(
          addEntries(project, [
            { path: destinationPath(name.trim()), kind: form.kind, content: '' },
          ]),
        )
      setForm(null)
      setName('')
    } catch (e) {
      onError((e as Error).message)
    }
  }
  function applyImport({
    entries,
    skipped,
  }: {
    entries: ProjectEntry[]
    skipped: number
  }) {
    if (!entries.length) {
      onError(
        'No se encontraron archivos compatibles. Usa .py, .txt, .csv, .json, .md o .xlsx.',
      )
      return
    }
    onChange((current) => addEntries(current, entries))
    if (skipped)
      onError(
        `Proyecto importado. Se omitieron ${skipped} archivos o carpetas incompatibles o de entorno.`,
      )
  }
  function createClass() {
    try {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(className)) throw new Error('Usa un nombre de clase Python válido.')
      const path = classDestination ? `${classDestination}/${classFile.trim()}` : classFile.trim()
      const imported = classTemplate === 'ui' ? 'import coa_gui as gui\n\n' : ''
      const constructor = classConstructor || classTemplate !== 'empty'
      const content = `${imported}class ${className}:\n${constructor ? '    def __init__(self):\n        pass' : '    pass'}\n`
      onChange(addEntries(project,[{path,kind:'file',content}]))
      setClassForm(false)
    } catch (error) { onError((error as Error).message) }
  }
  function createLayers() {
    try {
      const incoming: ProjectEntry[] = []
      for (const folder of ['business','presentation','domain','data'] as const) if (layers[folder] && !project.entries.some((entry)=>entry.path===folder)) incoming.push({path:folder,kind:'folder',content:''})
      if (layers.main && !project.entries.some((entry)=>entry.path.toLowerCase()==='main.py')) incoming.push({path:'Main.py',kind:'file',content:'# Punto de entrada del proyecto\n'})
      if (!incoming.length) { onError('La estructura seleccionada ya existe; no se sobrescribió nada.'); return }
      onChange(addEntries(project,incoming)); setLayersForm(false)
    } catch (error) { onError((error as Error).message) }
  }
  async function downloadEntry(entry: ProjectEntry) {
    const service = await import('@/lib/ide/downloads')
    if (entry.kind === 'folder') service.downloadBlob(await service.folderZip(project,entry.path),`${entry.path.split('/').pop()}.zip`)
    else service.downloadBlob(entryBlob(entry),entry.path.split('/').pop()!)
  }
  function duplicate(entry: ProjectEntry) {
    if (entry.kind !== 'file') return
    const dot=entry.path.lastIndexOf('.'), base=dot<0?entry.path:entry.path.slice(0,dot), ext=dot<0?'':entry.path.slice(dot)
    let path=`${base}-copia${ext}`, number=2
    while(project.entries.some((item)=>item.path===path)) path=`${base}-copia-${number++}${ext}`
    onChange(addEntries(project,[{...entry,path}]))
  }
  async function importFiles(files: FileList | null) {
    if (!files) return
    setImporting(true)
    try {
      applyImport(await importFileList(Array.from(files)))
    } catch (e) {
      onError((e as Error).message)
    } finally {
      setImporting(false)
    }
  }
  async function pick(folder: boolean) {
    const browser = window as PickerWindow
    if (folder ? !browser.showDirectoryPicker : !browser.showOpenFilePicker) {
      ;(folder ? folderInput : fileInput).current?.click()
      return
    }
    setImporting(true)
    try {
      if (folder)
        applyImport(
          await importDirectory(
            await browser.showDirectoryPicker!({ mode: 'read' }),
          ),
        )
      else {
        const handles = await browser.showOpenFilePicker!({
          multiple: true,
          types: [
            {
              description: 'Archivos de COA Python Studio',
              accept: { 'text/plain': ['.py', '.txt', '.csv', '.json', '.md'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
            },
          ],
        })
        applyImport(
          await importFileList(
            await Promise.all(handles.map((h) => h.getFile())),
          ),
        )
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') onError((e as Error).message)
    } finally {
      setImporting(false)
    }
  }
  const directoryAttributes = {
    webkitdirectory: '',
    directory: '',
  } as InputHTMLAttributes<HTMLInputElement>
  return (
    <section className="ide-panel">
      <div className="explorer-compact-header"><div><p className="ide-eyebrow">{explorerLabel}</p><h2>Mi proyecto</h2></div><details onClick={(e)=>{if((e.target as Element).closest('button'))e.currentTarget.open=false}}><summary aria-label="Crear elemento" title="Crear elemento"><Plus size={17}/></summary><div className="explorer-menu"><button onClick={()=>{setForm({kind:'file'});setName('ejercicio.py')}}><FilePlus2 size={15}/>Nuevo archivo</button><button onClick={()=>{setClassDestination(smartDestination);setClassForm(true)}}><Braces size={15}/>Nueva clase Python</button><button onClick={()=>{setForm({kind:'folder'});setName('datos')}}><FolderPlus size={15}/>Nueva carpeta</button><button onClick={()=>setLayersForm(true)}>Crear estructura por capas…</button></div></details><button aria-label="Abrir archivos" title="Abrir archivos" onClick={()=>void pick(false)}><Upload size={17}/></button><button aria-label="Abrir carpeta" title="Abrir carpeta" onClick={()=>void pick(true)}><Folder size={17}/></button></div>
      <p className="ide-tip" data-testid="selected-folder">
        Destino: {destination || 'raíz del proyecto'}
        {destination && (
          <button
            className="ide-text-button"
            onClick={() => onChange((current) => ({ ...current, selectedFolder: '' }))}
          >
            Usar raíz
          </button>
        )}
      </p>
      {importing && <p role="status">Importando archivos…</p>}
      <input
        ref={fileInput}
        type="file"
        multiple
        accept=".py,.txt,.csv,.json,.md"
        hidden
        onChange={(e) => {
          void importFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <input
        ref={folderInput}
        type="file"
        multiple
        hidden
        {...directoryAttributes}
        onChange={(e) => {
          void importFiles(e.target.files)
          e.target.value = ''
        }}
      />
      {form && (
        <form
          className="ide-inline-form"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          {form.kind === 'delete' ? (
            <p>
              ¿Eliminar «{form.path}»
              {project.entries.some((e) => e.path.startsWith(form.path + '/'))
                ? ' y su contenido'
                : ''}
              ?
            </p>
          ) : (
            <label className="ide-field">
              {form.kind === 'rename' ? 'Nuevo nombre o ruta' : 'Nombre o ruta'}
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="datos/ejemplo.py"
              />
            </label>
          )}
          <div className="ide-row">
            <button type="button" onClick={() => setForm(null)}>
              Cancelar
            </button>
            <button
              className={form.kind === 'delete' ? 'ide-danger' : 'ide-primary'}
              disabled={disabled}
              type="submit"
            >
              {form.kind === 'delete'
                ? 'Eliminar'
                : form.kind === 'rename'
                  ? 'Renombrar'
                  : 'Crear'}
            </button>
          </div>
        </form>
      )}
      {classForm&&<form className="ide-inline-form" onSubmit={(e)=>{e.preventDefault();createClass()}}><h3>Nueva clase Python</h3><label className="ide-field">Nombre de la clase<input aria-label="Nombre de la clase" value={className} onChange={(e)=>setClassName(e.target.value)}/></label><label className="ide-field">Nombre del archivo<input aria-label="Nombre del archivo" value={classFile} onChange={(e)=>setClassFile(e.target.value)}/></label><label className="ide-field">Destino<select aria-label="Destino" value={classDestination} onChange={(e)=>setClassDestination(e.target.value)}><option value="">Raíz del proyecto</option>{project.entries.filter(e=>e.kind==='folder').map(e=><option key={e.path}>{e.path}</option>)}</select></label><label className="ide-field">Plantilla<select aria-label="Plantilla" value={classTemplate} onChange={(e)=>setClassTemplate(e.target.value)}><option value="empty">Clase vacía</option><option value="controller">Controller</option><option value="logic">Logic</option><option value="ui">UI / Presentation</option><option value="domain">Entidad / Domain</option><option value="data">Acceso a datos</option></select></label><label className="ide-check"><input type="checkbox" checked={classConstructor} onChange={(e)=>setClassConstructor(e.target.checked)}/>Crear constructor</label><div className="ide-row"><button type="button" onClick={()=>setClassForm(false)}>Cancelar</button><button className="ide-primary" type="submit">Crear clase</button></div></form>}
      {layersForm&&<form className="ide-inline-form" onSubmit={(e)=>{e.preventDefault();createLayers()}}><h3>Estructura por capas COA</h3>{(['business','presentation','domain','data'] as const).map(layer=><label className="ide-check" key={layer}><input type="checkbox" checked={layers[layer]} onChange={(e)=>setLayers({...layers,[layer]:e.target.checked})}/>{layer}</label>)}<label className="ide-check"><input type="checkbox" checked={layers.main} onChange={(e)=>setLayers({...layers,main:e.target.checked})}/>Main.py</label><div className="ide-row"><button type="button" onClick={()=>setLayersForm(false)}>Cancelar</button><button className="ide-primary" type="submit">Crear estructura</button></div></form>}
      <ul className="ide-tree">
        {[...project.entries]
          .sort((a, b) => a.path.localeCompare(b.path))
          .filter((entry) => {
            const parts = entry.path.split('/')
            parts.pop()
            return parts.every((_, index) =>
              project.explorerExpanded.includes(parts.slice(0, index + 1).join('/')),
            )
          })
          .map((entry) => (
            <li
              key={entry.path}
              style={{
                paddingLeft: Math.min(entry.path.split('/').length - 1, 5) * 12,
              }}
              className={
                entry.path === project.active ||
                entry.path === project.secondaryActive ||
                entry.path === project.selectedFolder
                  ? 'selected'
                  : ''
              }
              onContextMenu={(event)=>{event.preventDefault();setContextPath(entry.path)}}
            >
              <button
                title={entry.path}
                aria-expanded={
                  entry.kind === 'folder'
                    ? project.explorerExpanded.includes(entry.path)
                    : undefined
                }
                onClick={() => {
                  if (entry.kind === 'file') onOpen(entry.path)
                  else
                    onChange((current) => ({
                      ...current,
                      selectedFolder: entry.path,
                      explorerExpanded: current.explorerExpanded.includes(entry.path)
                        ? current.explorerExpanded.filter((path) => path !== entry.path)
                        : [...current.explorerExpanded, entry.path],
                    }))
                }}
                className="ide-tree-name"
              >
                {entry.kind === 'folder' ? (
                  <>
                    {project.explorerExpanded.includes(entry.path) ? (
                      <ChevronDown size={13} />
                    ) : (
                      <ChevronRight size={13} />
                    )}
                    <Folder size={16} className={themedIcons ? 'theme-folder-icon' : ''} />
                  </>
                ) : entry.path.toLowerCase().endsWith('.xlsx') ? (
                  <Sheet size={16} className="ide-excel-icon" />
                ) : (
                  <FileCode2 size={16} />
                )}
                <span>{entry.path.split('/').pop()}</span>
              </button>
              <details className="entry-actions" onClick={(e)=>{if((e.target as Element).closest('button'))e.currentTarget.open=false}}><summary aria-label={`Acciones de ${entry.path}`} title="Más acciones"><MoreHorizontal size={15}/></summary><div className="explorer-menu">{entry.kind==='file'&&<><button onClick={()=>onOpen(entry.path)}>Abrir</button><button onClick={()=>onOpenAside(entry.path,'right')}>Abrir a la derecha</button><button onClick={()=>onOpenAside(entry.path,'down')}>Abrir abajo</button><button onClick={()=>duplicate(entry)}><Copy size={13}/>Duplicar</button></>}{entry.kind==='folder'&&<><button onClick={()=>{onChange(p=>({...p,selectedFolder:entry.path}));setClassDestination(entry.path);setClassForm(true)}}>Nueva clase Python</button><button onClick={()=>{onChange(p=>({...p,selectedFolder:entry.path}));setForm({kind:'file'});setName('nuevo.py')}}>Nuevo archivo</button><button onClick={()=>{onChange(p=>({...p,selectedFolder:entry.path}));setForm({kind:'folder'});setName('carpeta')}}>Nueva carpeta</button></>}<button onClick={()=>{setForm({kind:'rename',path:entry.path});setName(entry.path)}}><Pencil size={13}/>Renombrar / mover</button><button onClick={()=>void downloadEntry(entry)}><Download size={13}/>Descargar{entry.kind==='folder'?' ZIP':''}</button><button onClick={()=>setForm({kind:'delete',path:entry.path})}><Trash2 size={13}/>Eliminar</button></div></details>
              {contextPath===entry.path&&<div className="explorer-context" role="menu"><button onClick={()=>{if(entry.kind==='file')onOpen(entry.path);else onChange(p=>({...p,selectedFolder:entry.path}));setContextPath(null)}}>Abrir</button>{entry.kind==='file'&&<><button onClick={()=>{onOpenAside(entry.path,'right');setContextPath(null)}}>Abrir a la derecha</button><button onClick={()=>{onOpenAside(entry.path,'down');setContextPath(null)}}>Abrir abajo</button></>}<button onClick={()=>{setForm({kind:'rename',path:entry.path});setName(entry.path);setContextPath(null)}}>Renombrar / mover</button><button onClick={()=>{setForm({kind:'delete',path:entry.path});setContextPath(null)}}>Eliminar</button></div>}
            </li>
          ))}
      </ul>
      <p className="ide-muted">
        <small>
          .py · .txt · .csv · .json · .md
          <br />
          Los archivos existentes no se sobrescriben al importar. Renombra
          primero si hay coincidencias. El selector de carpetas depende del
          navegador.
        </small>
      </p>
      <button
        className="ide-secondary wide"
        disabled={disabled}
        onClick={onNew}
      >
        Nuevo proyecto
      </button>
    </section>
  )
}

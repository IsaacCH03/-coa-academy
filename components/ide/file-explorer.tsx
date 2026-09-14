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

export function FileExplorer({
  project,
  onChange,
  onOpen,
  onError,
  onNew,
  disabled,
}: {
  project: Project
  onChange: (p: Project | ((current: Project) => Project)) => void
  onOpen: (path: string) => void
  onError: (text: string) => void
  onNew: () => void
  disabled: boolean
}) {
  const [form, setForm] = useState<{
    kind: 'file' | 'folder' | 'rename' | 'delete'
    path?: string
  } | null>(null)
  const [name, setName] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const destination = project.selectedFolder
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
        'No se encontraron archivos compatibles. Usa .py, .txt, .csv, .json o .md.',
      )
      return
    }
    onChange((current) => addEntries(current, entries))
    if (skipped)
      onError(
        `Proyecto importado. Se omitieron ${skipped} archivos o carpetas incompatibles o de entorno.`,
      )
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
              description: 'Archivos de Python y texto',
              accept: { 'text/plain': ['.py', '.txt', '.csv', '.json', '.md'] },
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
      <p className="ide-eyebrow">EXPLORADOR</p>
      <h2>Mi proyecto</h2>
      <p className="ide-muted">Tus archivos se guardan en este navegador.</p>
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
      <div className="ide-file-actions">
        <button
          disabled={disabled}
          onClick={() => {
            setForm({ kind: 'file' })
            setName('ejercicio.py')
          }}
        >
          <FilePlus2 size={16} /> Nuevo archivo
        </button>
        <button
          disabled={disabled}
          onClick={() => {
            setForm({ kind: 'folder' })
            setName('datos')
          }}
        >
          <FolderPlus size={16} /> Nueva carpeta
        </button>
        <button
          disabled={disabled || importing}
          onClick={() => void pick(false)}
        >
          <Upload size={16} /> Abrir archivo
        </button>
        <button
          disabled={disabled || importing}
          onClick={() => void pick(true)}
        >
          <Folder size={16} /> Abrir carpeta
        </button>
      </div>
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
                entry.path === project.active || entry.path === project.selectedFolder
                  ? 'selected'
                  : ''
              }
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
                    <Folder size={16} />
                  </>
                ) : (
                  <FileCode2 size={16} />
                )}
                <span>{entry.path.split('/').pop()}</span>
              </button>
              {entry.kind === 'folder' && (
                <button
                  disabled={disabled}
                  title={`Descargar ${entry.path}`}
                  aria-label={`Descargar ${entry.path}`}
                  onClick={async () => {
                    const service = await import('@/lib/ide/downloads')
                    service.downloadBlob(
                      await service.folderZip(project, entry.path),
                      `${entry.path.split('/').pop()}.zip`,
                    )
                  }}
                >
                  <Download size={13} />
                </button>
              )}
              <button
                disabled={disabled}
                title={`Renombrar ${entry.path}`}
                aria-label={`Renombrar ${entry.path}`}
                onClick={() => {
                  setForm({ kind: 'rename', path: entry.path })
                  setName(entry.path)
                }}
              >
                <Pencil size={13} />
              </button>
              <button
                disabled={disabled}
                title={`Eliminar ${entry.path}`}
                aria-label={`Eliminar ${entry.path}`}
                onClick={() => setForm({ kind: 'delete', path: entry.path })}
              >
                <Trash2 size={13} />
              </button>
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

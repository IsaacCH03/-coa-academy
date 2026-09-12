'use client'
import { useRef, useState, type PointerEvent } from 'react'
import { Copy, FileCode2, Save, Trash2 } from 'lucide-react'
import {
  clampControl,
  generateGuiCode,
  newGuiDesign,
  nextControl,
  restoreGuiDesign,
  validControls,
  type GuiControl,
  type GuiControlType,
  type GuiDesign,
  type GuiImportResult,
  type GuiWindow,
} from '@/lib/ide/gui-designer'
import { ConfirmDialog } from './confirm-dialog'

const types: GuiControlType[] = ['Label', 'Entry', 'Button', 'Frame']

export function GuiDesigner({
  design,
  onChange,
  onSave,
  onAnalyze,
}: {
  design: GuiDesign
  onChange: (design: GuiDesign) => void
  onSave: () => Promise<void>
  onAnalyze: (source: string) => Promise<GuiImportResult>
}) {
  const { window: windowConfig, controls } = design
  const [selected, setSelected] = useState<string | null>(null)
  const [generated, setGenerated] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copiar código')
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importSource, setImportSource] = useState('')
  const [importError, setImportError] = useState('')
  const [importing, setImporting] = useState(false)
  const [pendingImport, setPendingImport] = useState<GuiDesign | null>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const current = controls.find((control) => control.id === selected)

  function change(next: GuiDesign) {
    onChange(next)
    setSaved(false)
  }

  function add(type: GuiControlType, clientX: number, clientY: number) {
    const bounds = canvas.current?.getBoundingClientRect()
    if (!bounds) return
    const x = ((clientX - bounds.left) * windowConfig.width) / bounds.width
    const y = ((clientY - bounds.top) * windowConfig.height) / bounds.height
    const control = nextControl(type, controls, x, y, windowConfig)
    change({ ...design, controls: [...controls, control] })
    setSelected(control.id)
    setGenerated('')
  }

  function updateControl(update: Partial<GuiControl>) {
    change({
      ...design,
      controls: controls.map((control) =>
        control.id === selected
          ? clampControl({ ...control, ...update }, windowConfig)
          : control,
      ),
    })
    setGenerated('')
  }

  function resizeWindow(update: Partial<GuiWindow>) {
    const next = { ...windowConfig, ...update }
    change({
      window: next,
      controls: controls.map((control) => clampControl(control, next)),
    })
    setGenerated('')
  }

  function startMove(event: PointerEvent, control: GuiControl) {
    const bounds = canvas.current?.getBoundingClientRect()
    if (!bounds) return
    const x = ((event.clientX - bounds.left) * windowConfig.width) / bounds.width
    const y = ((event.clientY - bounds.top) * windowConfig.height) / bounds.height
    drag.current = { id: control.id, offsetX: x - control.x, offsetY: y - control.y }
    event.currentTarget.setPointerCapture(event.pointerId)
    setSelected(control.id)
  }

  function move(event: PointerEvent) {
    const bounds = canvas.current?.getBoundingClientRect()
    const moving = drag.current
    if (!bounds || !moving) return
    const x = ((event.clientX - bounds.left) * windowConfig.width) / bounds.width
    const y = ((event.clientY - bounds.top) * windowConfig.height) / bounds.height
    change({
      ...design,
      controls: controls.map((control) =>
        control.id === moving.id
          ? clampControl(
              { ...control, x: x - moving.offsetX, y: y - moving.offsetY },
              windowConfig,
            )
          : control,
      ),
    })
    setGenerated('')
  }

  function createCode(target: 'coa' | 'tkinter') {
    setGenerated(
      generateGuiCode(windowConfig, controls, target, design.importedSource),
    )
    setCopyLabel('Copiar código')
  }

  function applyImport(next: GuiDesign) {
    change(restoreGuiDesign(next))
    setSelected(null)
    setGenerated('')
    setImportOpen(false)
    setPendingImport(null)
    void onSave()
  }

  return (
    <section className="gui-designer" aria-label="Diseñador visual">
      <aside className="gui-palette">
        <p className="ide-eyebrow">COMPONENTES</p>
        <h2>Diseñador</h2>
        <p className="ide-muted">Arrastra un componente hacia la ventana.</p>
        <div className="gui-design-actions">
          <button
            onClick={async () => {
              await onSave()
              setSaved(true)
            }}
          >
            <Save size={15} /> Guardar diseño
          </button>
          <button onClick={() => setConfirmClear(true)}>
            <Trash2 size={15} /> Limpiar diseño
          </button>
          <button
            onClick={() => {
              setImportError('')
              setImportOpen(true)
            }}
          >
            <FileCode2 size={15} /> Importar código COA GUI
          </button>
        </div>
        {saved && <small role="status">Diseño guardado</small>}
        {types.map((type) => (
          <button
            key={type}
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/coa-control', type)}
          >
            {type}
          </button>
        ))}
        <div className="gui-window-fields">
          <h3>Ventana</h3>
          <label>Título<input value={windowConfig.title} onChange={(e) => resizeWindow({ title: e.target.value })} /></label>
          <label>Ancho<input type="number" min="240" max="900" value={windowConfig.width} onChange={(e) => resizeWindow({ width: Math.max(240, Math.min(900, Number(e.target.value) || 240)) })} /></label>
          <label>Alto<input type="number" min="200" max="700" value={windowConfig.height} onChange={(e) => resizeWindow({ height: Math.max(200, Math.min(700, Number(e.target.value) || 200)) })} /></label>
        </div>
      </aside>

      <div className="gui-stage">
        <div className="gui-stage-header">
          <strong>ÁREA DE DISEÑO</strong>
          <div>
            <button className="ide-primary" disabled={!validControls(controls)} onClick={() => createCode('coa')}>Generar código COA GUI</button>
            <button disabled={!validControls(controls)} onClick={() => createCode('tkinter')}>Exportar a Tkinter</button>
          </div>
        </div>
        <div className="gui-canvas-scroll">
          <div
            ref={canvas}
            className="gui-canvas"
            aria-label="Área de diseño"
            style={{ width: windowConfig.width, height: windowConfig.height }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const type = event.dataTransfer.getData('text/coa-control') as GuiControlType
              if (types.includes(type)) add(type, event.clientX, event.clientY)
            }}
            onPointerMove={move}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelected(null)
            }}
          >
            <div className="gui-window-title">{windowConfig.title}</div>
            {controls.map((control) => (
              <div
                key={control.id}
                role="button"
                tabIndex={0}
                aria-label={`${control.type} ${control.variableName}`}
                className={`gui-control gui-${control.type.toLowerCase()} ${selected === control.id ? 'selected' : ''}`}
                style={{ left: control.x, top: control.y, width: control.width, height: control.height }}
                onPointerDown={(event) => startMove(event, control)}
                onClick={(event) => { event.stopPropagation(); setSelected(control.id) }}
              >
                {control.type === 'Entry' ? <span /> : control.type === 'Frame' ? null : control.text}
              </div>
            ))}
          </div>
        </div>
        {generated && (
          <div className="gui-generated">
            <div><strong>CÓDIGO GENERADO</strong><button onClick={async () => { await navigator.clipboard.writeText(generated); setCopyLabel('Copiado') }}><Copy size={15} /> {copyLabel}</button></div>
            <pre data-testid="gui-code"><code>{generated}</code></pre>
          </div>
        )}
      </div>

      <aside className="gui-properties">
        <p className="ide-eyebrow">PROPIEDADES</p>
        {current ? (
          <>
            <h2>{current.type}</h2>
            <label>Nombre de variable<input value={current.variableName} aria-invalid={!/^[A-Za-z_][A-Za-z0-9_]*$/.test(current.variableName)} onChange={(e) => updateControl({ variableName: e.target.value })} /></label>
            {(current.type === 'Label' || current.type === 'Button') && <label>Texto<input value={current.text ?? ''} onChange={(e) => updateControl({ text: e.target.value })} /></label>}
            {(['x', 'y', 'width', 'height'] as const).map((property) => (
              <label key={property}>{property === 'x' ? 'Posición X' : property === 'y' ? 'Posición Y' : property === 'width' ? 'Ancho' : 'Alto'}<input type="number" min={property === 'width' || property === 'height' ? 20 : 0} value={current[property]} onChange={(e) => updateControl({ [property]: Number(e.target.value) || 0 })} /></label>
            ))}
            <button className="gui-delete" onClick={() => { change({ ...design, controls: controls.filter((control) => control.id !== current.id) }); setSelected(null); setGenerated('') }}><Trash2 size={16} /> Eliminar componente</button>
          </>
        ) : <p className="ide-muted">Selecciona un componente para editarlo.</p>}
        {!validControls(controls) && <p className="ide-warning" role="status">Usa nombres válidos, únicos y no vacíos.</p>}
        {design.importedSource?.warning && (
          <p className="ide-warning" role="status">
            Algunas instrucciones no pueden editarse visualmente y se conservarán en el código.
          </p>
        )}
      </aside>
      {importOpen && (
        <section className="gui-import-dialog" role="dialog" aria-label="Importar código COA GUI">
          <h2>Importar código COA GUI</h2>
          <p>Pega el código que quieres cargar en el Diseñador.</p>
          <textarea
            aria-label="Código COA GUI"
            value={importSource}
            onChange={(event) => {
              setImportSource(event.target.value)
              setImportError('')
            }}
            autoFocus
          />
          {importError && <p className="ide-warning" role="status">{importError}</p>}
          <div className="ide-row">
            <button onClick={() => setImportOpen(false)}>Cancelar</button>
            <button
              className="ide-primary"
              disabled={importing || !importSource.trim()}
              onClick={async () => {
                setImporting(true)
                try {
                  const result = await onAnalyze(importSource)
                  if (!result.ok) {
                    setImportError(
                      result.reason === 'syntax'
                        ? 'No se pudo importar el código porque contiene un error de sintaxis.'
                        : 'No se encontró una interfaz COA GUI compatible.',
                    )
                  } else if (controls.length) {
                    setPendingImport(result.design)
                  } else applyImport(result.design)
                } catch {
                  setImportError('No se pudo analizar el código. Inténtalo de nuevo.')
                } finally {
                  setImporting(false)
                }
              }}
            >
              Cargar en diseñador
            </button>
          </div>
        </section>
      )}
      {pendingImport && (
        <ConfirmDialog
          title="Reemplazar diseño actual"
          confirmLabel="Importar"
          onCancel={() => setPendingImport(null)}
          onConfirm={() => applyImport(pendingImport)}
        >
          <p>Importar este código reemplazará el diseño actual.</p>
        </ConfirmDialog>
      )}
      {confirmClear && (
        <ConfirmDialog
          title="Limpiar diseño"
          onCancel={() => setConfirmClear(false)}
          confirmLabel="Limpiar"
          onConfirm={() => {
            change(newGuiDesign())
            setSelected(null)
            setGenerated('')
            setConfirmClear(false)
            void onSave()
          }}
        >
          <p>¿Deseas limpiar el diseño? Se eliminarán todos los componentes.</p>
        </ConfirmDialog>
      )}
    </section>
  )
}

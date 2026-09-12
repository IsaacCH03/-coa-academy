'use client'
import { useRef, useState, type PointerEvent } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import {
  clampControl,
  generateGuiCode,
  nextControl,
  validControls,
  type GuiControl,
  type GuiControlType,
  type GuiWindow,
} from '@/lib/ide/gui-designer'

const types: GuiControlType[] = ['Label', 'Entry', 'Button', 'Frame']

export function GuiDesigner() {
  const [windowConfig, setWindowConfig] = useState<GuiWindow>({
    title: 'Mi interfaz',
    width: 500,
    height: 400,
  })
  const [controls, setControls] = useState<GuiControl[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [generated, setGenerated] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copiar código')
  const canvas = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const current = controls.find((control) => control.id === selected)

  function add(type: GuiControlType, clientX: number, clientY: number) {
    const bounds = canvas.current?.getBoundingClientRect()
    if (!bounds) return
    const x = ((clientX - bounds.left) * windowConfig.width) / bounds.width
    const y = ((clientY - bounds.top) * windowConfig.height) / bounds.height
    const control = nextControl(type, controls, x, y, windowConfig)
    setControls((items) => [...items, control])
    setSelected(control.id)
    setGenerated('')
  }

  function updateControl(change: Partial<GuiControl>) {
    setControls((items) =>
      items.map((control) =>
        control.id === selected
          ? clampControl({ ...control, ...change }, windowConfig)
          : control,
      ),
    )
    setGenerated('')
  }

  function resizeWindow(change: Partial<GuiWindow>) {
    const next = { ...windowConfig, ...change }
    setWindowConfig(next)
    setControls((items) => items.map((control) => clampControl(control, next)))
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
    setControls((items) =>
      items.map((control) =>
        control.id === moving.id
          ? clampControl(
              { ...control, x: x - moving.offsetX, y: y - moving.offsetY },
              windowConfig,
            )
          : control,
      ),
    )
    setGenerated('')
  }

  function createCode(target: 'coa' | 'tkinter') {
    setGenerated(generateGuiCode(windowConfig, controls, target))
    setCopyLabel('Copiar código')
  }

  return (
    <section className="gui-designer" aria-label="Diseñador visual">
      <aside className="gui-palette">
        <p className="ide-eyebrow">COMPONENTES</p>
        <h2>Diseñador</h2>
        <p className="ide-muted">Arrastra un componente hacia la ventana.</p>
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
            <button className="gui-delete" onClick={() => { setControls((items) => items.filter((control) => control.id !== current.id)); setSelected(null); setGenerated('') }}><Trash2 size={16} /> Eliminar componente</button>
          </>
        ) : <p className="ide-muted">Selecciona un componente para editarlo.</p>}
        {!validControls(controls) && <p className="ide-warning" role="status">Usa nombres válidos, únicos y no vacíos.</p>}
      </aside>
    </section>
  )
}

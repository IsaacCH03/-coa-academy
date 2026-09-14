'use client'
import { useMemo, useState } from 'react'
import type { ProjectEntry } from '@/lib/ide/project'
import {
  analyzeLayerClasses,
  architectureStatus,
  buildConnectionChange,
  buildObjectChange,
  buildReturnChange,
  capitalize,
  coaLayers,
  defaultObjectName,
  encapsulationChange,
  layerOf,
  reviewLayerConnections,
  wouldCreateCircularImport,
  type BuilderChange,
  type CoaLayer,
} from '@/lib/ide/layers'

const targetByAction: Record<string, CoaLayer> = {
  'layer-presentation-business': 'business', 'layer-business-data': 'data', 'layer-business-domain': 'domain',
  'layer-object-business': 'business', 'layer-object-data': 'data', 'layer-object-domain': 'domain',
  'layer-ui-controller': 'business', 'layer-controller-ui': 'presentation',
}
export function LayerBuilder({ actionId, entries, active, projectRoot, roots, onProjectRoot, onApply }: {
  actionId: string
  entries: ProjectEntry[]
  active: string
  projectRoot: string | null
  roots: string[]
  onProjectRoot: (root: string) => void
  onApply: (changes: BuilderChange[]) => void
}) {
  const root = projectRoot ?? ''
  const rootAvailable = projectRoot !== null && (root === '' || entries.some((entry) => entry.kind === 'folder' && entry.path === root))
  const classes = useMemo(() => rootAvailable ? analyzeLayerClasses(entries, root) : [], [entries, root, rootAvailable])
  const status = useMemo(() => rootAvailable ? architectureStatus(entries, root) : { presentation: false, business: false, domain: false, data: false }, [entries, root, rootAvailable])
  const currentLayer = rootAvailable ? layerOf(active, root) : null
  const initialTarget = targetByAction[actionId] ?? (currentLayer === 'presentation' ? 'business' : currentLayer === 'business' ? 'domain' : 'business')
  const [targetLayer, setTargetLayer] = useState<CoaLayer>(initialTarget)
  const targets = classes.filter((item) => item.layer === targetLayer)
  const [selectedName, setSelectedName] = useState(targets[0]?.name ?? '')
  const selected = targets.find((item) => item.name === selectedName) ?? targets[0]
  const [objectName, setObjectName] = useState(selected ? defaultObjectName(selected.name) : 'objeto')
  const [methodName, setMethodName] = useState(selected?.methods[0]?.name ?? '')
  const [argumentsText, setArgumentsText] = useState('')
  const [steps, setSteps] = useState({ addImport: true, addObject: true, addCall: true })
  const [plan, setPlan] = useState<BuilderChange[] | null>(null)
  const review = useMemo(() => reviewLayerConnections(entries, root), [entries, root])
  const source = entries.find((entry) => entry.path === active)?.content ?? ''
  const isReview = actionId === 'layer-review'
  const isReturn = actionId === 'layer-return'
  const isCreateMethod = actionId === 'layer-create-method'
  const prepare = () => {
    if (isReturn) {
      const variable = argumentsText.trim() || 'resultado'
      setPlan([buildReturnChange(source, active, variable)])
      return
    }
    if (isCreateMethod) {
      const name = methodName.trim() || 'nuevo_metodo'
      if (new RegExp(`def\\s+${name}\\s*\\(`).test(source)) setPlan([{ path: active, content: source, summary: [`El método ${name} ya existe`] }])
      else setPlan([{ path: active, content: source.replace(/\s*$/, '') + `\n\n    def ${name}(self${argumentsText.trim() ? ', ' + argumentsText : ''}):\n        pass\n`, summary: [`método ${name} con parámetros ${argumentsText || 'ninguno'}`] }])
      return
    }
    if (!selected) return
    const values = argumentsText.split(',').map((item) => item.trim()).filter(Boolean)
    const objectOnly = actionId.startsWith('layer-object-')
    if (actionId === 'layer-controller-ui' && steps.addImport && wouldCreateCircularImport(entries, active, selected)) {
      setPlan([{ path: active, content: source, blocked: true, summary: ['⚠ No se aplicará: este import produciría una dependencia circular clara'] }])
      return
    }
    setPlan([objectOnly ? buildObjectChange(source, active, selected, objectName, values) : buildConnectionChange(source, active, selected, objectName, methodName, values, { ...steps, member: actionId === 'layer-ui-controller' })])
  }
  return <div className="layer-builder">
    <details className="ide-tip" open>
      <summary>ⓘ ARQUITECTURA UTILIZADA POR COA</summary>
      <p>Esta herramienta reconoce la estructura usada en los cursos de COA: <strong>presentation</strong> para la Interfaz de usuario (UI), ventanas, formularios, botones, labels y entradas; <strong>business</strong> para lógica y coordinación; <strong>domain</strong> para clases y objetos principales; y <strong>data</strong> para acceso y persistencia.</p>
      <p>Existen otras arquitecturas válidas. Las ayudas automáticas de esta categoría se limitan a estos cuatro nombres.</p>
    </details>
    <label className="ide-field">📁 Proyecto analizado<select aria-label="Proyecto analizado" value={rootAvailable ? root : '__none'} onChange={(event) => event.target.value !== '__none' && onProjectRoot(event.target.value)}><option value="__none">Selecciona una carpeta</option>{architectureStatus(entries).business || architectureStatus(entries).presentation || architectureStatus(entries).domain || architectureStatus(entries).data ? <option value="">Raíz del Explorador</option> : null}{roots.map((item) => <option key={item}>{item}</option>)}</select></label>
    {!rootAvailable && projectRoot !== null && <p className="ide-warning">El proyecto seleccionado ya no está disponible. Selecciona otra carpeta.</p>}
    <div className="layer-status">
      <strong>ARQUITECTURA COA</strong>
      {coaLayers.map((layer) => <span key={layer}>{status[layer] ? '✓' : '○'} {layer}{!status[layer] && ' — no encontrada'}</span>)}
      <small>{Object.values(status).every(Boolean) ? 'Estructura reconocida correctamente.' : 'Puedes continuar; crea las capas faltantes manualmente desde el Explorador.'}</small>
    </div>
    <p className="ide-tip"><strong>Capa actual:</strong> {currentLayer === 'presentation' ? 'Presentation / UI' : currentLayer ? capitalize(currentLayer) : 'No reconocida por la arquitectura COA'}</p>
    {isReview ? <div className="layer-review">
      <strong>REVISAR CONEXIONES</strong>
      {!review.length ? <p>No se encontraron conexiones para revisar.</p> : review.map((item, index) => <p key={index}>{item.severity === 'ok' ? '✓' : item.severity === 'warning' ? '⚠' : '❌'} {item.path}: {item.message}</p>)}
    </div> : <>
      {!targetByAction[actionId] && !isReturn && !isCreateMethod && <label className="ide-field">Capa destino<select value={targetLayer} onChange={(event) => { setTargetLayer(event.target.value as CoaLayer); setSelectedName('') }}><option value="business">Business</option><option value="domain">Domain</option><option value="data">Data</option><option value="presentation">Presentation</option></select></label>}
      {!isReturn && !isCreateMethod && <>
        <label className="ide-field">Clase<select aria-label="Clase de otra capa" value={selected?.name ?? ''} onChange={(event) => { setSelectedName(event.target.value); setObjectName(defaultObjectName(event.target.value)) }}>{targets.length ? targets.map((item) => <option key={item.path + item.name}>{item.name}</option>) : <option value="">No se encontraron clases</option>}</select></label>
        <label className="ide-field">Objeto<input value={objectName} onChange={(event) => setObjectName(event.target.value)} /></label>
        {!actionId.startsWith('layer-object-') && <label className="ide-field">Método<select value={methodName} onChange={(event) => setMethodName(event.target.value)}><option value="">Sin llamada</option>{selected?.methods.map((method) => <option key={method.name}>{method.name}</option>)}</select></label>}
        {!actionId.startsWith('layer-object-') && <fieldset><legend>Acciones</legend>{([['addImport', 'Agregar import si falta'], ['addObject', 'Crear objeto'], ['addCall', 'Llamar método']] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={steps[key]} onChange={(event) => setSteps((current) => ({ ...current, [key]: event.target.checked }))}/>{label}</label>)}</fieldset>}
        {selected && <p className="ide-tip"><strong>Constructor:</strong> {selected.constructor.join(', ') || 'sin parámetros'}<br/><strong>Método:</strong> {selected.methods.find((item) => item.name === methodName)?.parameters.join(', ') || 'sin parámetros'}</p>}
      </>}
      {(selected?.constructor.length || selected?.methods.find((item) => item.name === methodName)?.parameters.length || isReturn || isCreateMethod) ? <label className="ide-field">{isReturn ? 'Resultado que se devolverá' : isCreateMethod ? 'Parámetros separados por coma' : 'Variables o valores separados por coma'}<input value={argumentsText} onChange={(event) => setArgumentsText(event.target.value)} /></label> : null}
      <div className="layer-flow"><strong>FLUJO</strong><span>Presentation · parámetros</span><b>↓</b><span>Business · lógica</span><b>↓</b><span>Domain · objeto</span><b>↓</b><span>Data · persistencia</span></div>
      <button className="ide-primary wide" disabled={!selected && !isReturn && !isCreateMethod} onClick={prepare}>Previsualizar cambios</button>
      {plan && <div className="layer-plan"><strong>SE REALIZARÁN ESTOS CAMBIOS</strong>{plan.map((change) => <div key={change.path}><b>{change.path}</b>{change.summary.map((summary) => <span key={summary}>+ {summary}</span>)}</div>)}<button className="ide-primary wide" disabled={plan.some((change) => change.blocked)} onClick={() => { onApply(plan); setPlan(null) }}>Aplicar cambios</button></div>}
    </>}
  </div>
}

export function EncapsulationBuilder({ entries, active, onApply }: { entries: ProjectEntry[]; active: string; onApply: (changes: BuilderChange[]) => void }) {
  const classes = analyzeLayerClasses(entries).filter((item) => item.path === active)
  const [className, setClassName] = useState(classes[0]?.name ?? '')
  const selected = classes.find((item) => item.name === className) ?? classes[0]
  const [attributes, setAttributes] = useState<string[]>([])
  const [mode, setMode] = useState<'Getter' | 'Setter' | 'Getter + Setter'>('Getter + Setter')
  const [plan, setPlan] = useState<BuilderChange | null>(null)
  const source = entries.find((entry) => entry.path === active)?.content ?? ''
  return <div className="layer-builder">
    <label className="ide-field">Clase<select value={selected?.name ?? ''} onChange={(event) => { setClassName(event.target.value); setAttributes([]) }}>{classes.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
    <fieldset><legend>Atributos encontrados</legend>{selected?.attributes.map((attribute) => <label key={attribute}><input type="checkbox" checked={attributes.includes(attribute)} onChange={(event) => setAttributes((current) => event.target.checked ? [...current, attribute] : current.filter((item) => item !== attribute))}/>{attribute}</label>)}</fieldset>
    <label className="ide-field">Tipo de encapsulamiento<select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option>Getter</option><option>Setter</option><option>Getter + Setter</option></select></label>
    <button className="ide-primary wide" disabled={!selected || !attributes.length} onClick={() => selected && setPlan(encapsulationChange(source, active, selected.name, attributes, mode))}>Previsualizar cambios</button>
    {plan && <div className="layer-plan"><strong>SE REALIZARÁN ESTOS CAMBIOS</strong><b>{active}</b>{plan.summary.map((summary) => <span key={summary}>+ {summary}</span>)}<small>Las referencias a los atributos seleccionados dentro de este archivo cambiarán al nombre privado.</small><button className="ide-primary wide" onClick={() => { onApply([plan]); setPlan(null) }}>Aplicar cambios</button></div>}
  </div>
}

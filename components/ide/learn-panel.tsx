'use client'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search, Code2, Lightbulb } from 'lucide-react'
import {
  actionsWithAnalysis,
  fallbackBuilderAnalysis,
  generateCode,
  operatorMeaning,
  type BuilderAnalysis,
} from '@/lib/ide/builder'
import type { HelpMode } from '@/lib/ide/project'
import type { ProjectEntry } from '@/lib/ide/project'
import type { BuilderChange } from '@/lib/ide/layers'
import { EncapsulationBuilder, LayerBuilder } from './layer-builder'
import { detectProjectRoot, projectRoots } from '@/lib/ide/layers'
import { FileBuilder } from './file-builder'
import type { FileKind } from '@/lib/ide/file-builder'

export function LearnPanel({
  source,
  mode,
  onMode,
  onInsert,
  onExplain,
  explanation,
  hints,
  disabled,
  cursorOffset,
  onAnalyze,
  entries,
  activePath,
  onApplyChanges,
}: {
  source: string
  mode: HelpMode
  onMode: (mode: HelpMode) => void
  onInsert: (code: string) => void
  onExplain: () => void
  explanation: string[]
  hints: string[]
  disabled: boolean
  cursorOffset: number
  onAnalyze: (source: string, offset: number) => Promise<BuilderAnalysis>
  entries: ProjectEntry[]
  activePath: string
  onApplyChanges: (changes: BuilderChange[]) => void
}) {
  const [query, setQuery] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)
  const [fileKind, setFileKind] = useState<FileKind | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [level, setLevel] = useState<1 | 2 | 3>(1)
  const [analysis, setAnalysis] = useState<BuilderAnalysis>({ valid: false, variables: [], classes: [] })
  const [layerRoot, setLayerRoot] = useState<string | null>(() => {
    try { return localStorage.getItem('coa-builder-project-root') }
    catch { return null }
  })
  useEffect(() => {
    const detected = detectProjectRoot(activePath, entries)
    if ((layerRoot === null || layerRoot === '') && detected) {
      const frame = requestAnimationFrame(() => {
        setLayerRoot(detected)
        try { localStorage.setItem('coa-builder-project-root', detected) } catch { /* Persistence is optional. */ }
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [activePath, entries, layerRoot])
  const changeLayerRoot = (root: string) => {
    setLayerRoot(root)
    try { localStorage.setItem('coa-builder-project-root', root) } catch { /* Persistence is optional. */ }
  }
  useEffect(() => {
    let active = true
    let timer: ReturnType<typeof setTimeout>
    const analyze = () => {
      void onAnalyze(source, cursorOffset).then(
        (result) => active && setAnalysis(result),
        () => {
          if (active) timer = setTimeout(analyze, 150)
        },
      )
    }
    timer = setTimeout(analyze, 80)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [source, cursorOffset, onAnalyze])
  const fallbackAnalysis = useMemo(
    () => fallbackBuilderAnalysis(source.slice(0, cursorOffset)),
    [source, cursorOffset],
  )
  const effectiveAnalysis = analysis.valid ? analysis : fallbackAnalysis
  const availableActions = useMemo(
    () => actionsWithAnalysis(effectiveAnalysis),
    [effectiveAnalysis],
  )
  const action = availableActions.find((item) => item.id === actionId) ?? null
  const resolvedValues = useMemo(
    () =>
      action
        ? {
            ...Object.fromEntries(
              action.fields.map((field) => [field.key, field.value]),
            ),
            ...values,
          }
        : values,
    [action, values],
  )
  const preview = useMemo(() => {
    if (!action) return { code: '', error: '' }
    if (mode === 'assisted') return { code: action.template, error: '' }
    try {
      return { code: generateCode(action, resolvedValues), error: '' }
    } catch (e) {
      return { code: '', error: (e as Error).message }
    }
  }, [action, resolvedValues, mode])
  const normalized = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const filtered = availableActions.filter((a) =>
    (a.level ?? 1) === level &&
    normalized(a.title + ' ' + a.description).includes(normalized(query)),
  )
  return (
    <section className="ide-panel learn-panel">
      <p className="ide-eyebrow">BUILDER</p>
      <h2>COA Python Builder</h2>
      <p className="ide-muted">De tu idea a tu primera línea.</p>
      {effectiveAnalysis.valid && (
        <p className="ide-muted" data-testid="builder-analysis">
          Detectado: {effectiveAnalysis.variables.length} variables y {effectiveAnalysis.classes.length} clases.
        </p>
      )}
      <label className="ide-field">
        Nivel de ayuda
        <select
          value={mode}
          onChange={(e) => onMode(e.target.value as HelpMode)}
        >
          <option value="guided">Guiado · paso a paso</option>
          <option value="assisted">Asistido · plantillas</option>
          <option value="free">Libre · por mi cuenta</option>
        </select>
      </label>
      {mode === 'free' ? (
        <p className="ide-tip">
          El editor es tuyo. Puedes volver al modo guiado cuando necesites
          recordar una estructura.
        </p>
      ) : fileKind ? (
        <>
          <button className="ide-text-button" onClick={() => setFileKind(null)}><ArrowLeft size={15} /> Volver</button>
          <h3>Archivos · {fileKind}</h3>
          <FileBuilder key={fileKind} kind={fileKind} entries={entries} source={source} cursorOffset={cursorOffset} disabled={disabled} onInsert={onInsert} />
        </>
      ) : action ? (
        <>
          <button className="ide-text-button" onClick={() => setActionId(null)}>
            <ArrowLeft size={15} /> Volver
          </button>
          <h3>{action.title}</h3>
          <p className="ide-muted">{action.description}</p>
          {action.id === 'encapsulation' ? (
            <EncapsulationBuilder entries={entries} active={activePath} onApply={onApplyChanges} />
          ) : action.id.startsWith('layer-') ? (
            <LayerBuilder actionId={action.id} entries={entries} active={activePath} projectRoot={layerRoot} roots={[...new Set([...projectRoots(entries), ...entries.filter((entry) => entry.kind === 'folder').map((entry) => entry.path)])]} onProjectRoot={changeLayerRoot} onApply={onApplyChanges} onInsert={onInsert} cursorOffset={cursorOffset} />
          ) : (<>
          {mode === 'guided' &&
            action.fields.filter((field) => !(action.id === 'while-true' && field.key === 'text' && resolvedValues.body === 'Bloque vacío')).map((field) => (
              <label className="ide-field" key={field.key}>
                {field.label}
                {field.options ? (
                  <select
                    value={resolvedValues[field.key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  >
                    {field.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : field.kind ? (
                  <input
                    list={field.suggestions?.length ? `coa-${field.key}-suggestions` : undefined}
                    value={resolvedValues[field.key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                ) : (
                  <textarea
                    rows={2}
                    value={resolvedValues[field.key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                )}
                {field.suggestions?.length ? (
                  <datalist id={`coa-${field.key}-suggestions`}>
                    {field.suggestions.map((suggestion) => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                ) : null}
                {field.hint && <small>{field.hint}</small>}
              </label>
            ))}
          {mode === 'guided' && resolvedValues.op && (
            <p className="ide-tip">
              {resolvedValues.name} {operatorMeaning[resolvedValues.op]} {resolvedValues.value}
            </p>
          )}
          <p className="ide-eyebrow">VISTA PREVIA</p>
          {action.id === 'while' && mode === 'guided' && !preview.error && (
            <dl className="ide-walkthrough">
              {[
                ['Valor inicial', preview.code.split('\n')[0]],
                ['Condición', preview.code.split('\n')[2]],
                ['Acción', preview.code.split('\n')[3]],
                ['Actualización', preview.code.split('\n')[4]],
              ].map(([label, code]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <code>{code?.trim()}</code>
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {preview.error ? (
            <p role="status" className="ide-warning">
              {preview.error}
            </p>
          ) : (
            <pre className="ide-preview">
              <code>{preview.code}</code>
            </pre>
          )}
          <button
            className="ide-primary wide"
            disabled={disabled || !!preview.error}
            onClick={() => onInsert(preview.code)}
          >
            <Code2 size={16} /> Agregar código
          </button>
          <small className="ide-muted">
            Se inserta en el cursor. Puedes deshacer con Ctrl+Z.
          </small>
          </>)}
        </>
      ) : (
        <>
          <label className="ide-search">
            <Search size={16} />
            <input
              aria-label="Buscar acción"
              placeholder="¿Qué quieres hacer?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="builder-levels" aria-label="Niveles del Builder">
            {([1, 2, 3] as const).map((item) => (
              <button
                key={item}
                className={level === item ? 'active' : ''}
                aria-pressed={level === item}
                onClick={() => { setLevel(item); setActionId(null) }}
              >
                Nivel {item}
              </button>
            ))}
          </div>
          {level === 3 ? (
            <p className="ide-tip"><strong>Nivel 3</strong><br />Próximamente</p>
          ) : (
          <>
          {[...new Set(filtered.map((a) => a.category))].map((category) => (
            <details key={category} open>
              <summary title={category === 'Programación por capas' ? 'Ayudas para presentation, business, domain y data según la arquitectura utilizada en COA.' : undefined}>{category}{category === 'Programación por capas' ? ' ⓘ' : ''}</summary>
              <div className="ide-action-list">
                {filtered
                  .filter((a) => a.category === category)
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setActionId(a.id)
                        setValues(
                          Object.fromEntries(
                            a.fields.map((f) => [f.key, f.value]),
                          ),
                        )
                      }}
                    >
                      {a.title}
                      <span>+</span>
                    </button>
                  ))}
              </div>
            </details>
          ))}
          {level === 2 && (
            <details open>
              <summary>Archivos</summary>
              <div className="ide-action-list">
                {(['TXT', 'CSV', 'Excel'] as const).map((name) => <button key={name} onClick={() => setFileKind(name)}>{name}<span>+</span></button>)}
              </div>
            </details>
          )}
          {!filtered.length && (
            <p className="ide-muted">
              No encontramos esa acción. Prueba «número», «lista» o «condición».
            </p>
          )}
          </>
          )}
        </>
      )}
      <div className="ide-education">
        <button className="ide-secondary wide" onClick={onExplain}>
          <Lightbulb size={16} /> Explicar selección o línea
        </button>
        {explanation.map((text, i) => (
          <p key={i} className="ide-tip">
            {text}
          </p>
        ))}
        {hints.map((hint, i) => (
          <p className="ide-warning" key={i}>
            <strong>Posible problema:</strong> {hint}
          </p>
        ))}
      </div>
    </section>
  )
}

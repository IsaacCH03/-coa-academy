'use client'
import { useMemo, useState } from 'react'
import { ArrowLeft, Search, Code2, Lightbulb } from 'lucide-react'
import {
  actions,
  detectedVariables,
  generateCode,
  operatorMeaning,
  type BuilderAction,
} from '@/lib/ide/builder'
import type { HelpMode } from '@/lib/ide/project'

export function LearnPanel({
  source,
  mode,
  onMode,
  onInsert,
  onExplain,
  explanation,
  hints,
  disabled,
}: {
  source: string
  mode: HelpMode
  onMode: (mode: HelpMode) => void
  onInsert: (code: string) => void
  onExplain: () => void
  explanation: string[]
  hints: string[]
  disabled: boolean
}) {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState<BuilderAction | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const variables = useMemo(() => detectedVariables(source), [source])
  const preview = useMemo(() => {
    if (!action) return { code: '', error: '' }
    if (mode === 'assisted') return { code: action.template, error: '' }
    try {
      return { code: generateCode(action, values), error: '' }
    } catch (e) {
      return { code: '', error: (e as Error).message }
    }
  }, [action, values, mode])
  const normalized = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const filtered = actions.filter((a) =>
    normalized(a.title + ' ' + a.description).includes(normalized(query)),
  )
  return (
    <section className="ide-panel learn-panel">
      <p className="ide-eyebrow">APRENDER</p>
      <h2>COA Python Builder</h2>
      <p className="ide-muted">De tu idea a tu primera línea.</p>
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
      ) : action ? (
        <>
          <button className="ide-text-button" onClick={() => setAction(null)}>
            <ArrowLeft size={15} /> Volver
          </button>
          <h3>{action.title}</h3>
          <p className="ide-muted">{action.description}</p>
          {mode === 'guided' &&
            action.fields.map((field) => (
              <label className="ide-field" key={field.key}>
                {field.label}
                {field.options ? (
                  <select
                    value={values[field.key]}
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
                    list={field.kind === 'name' ? 'coa-variables' : undefined}
                    value={values[field.key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                ) : (
                  <textarea
                    rows={2}
                    value={values[field.key]}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                )}
                {field.hint && <small>{field.hint}</small>}
              </label>
            ))}
          <datalist id="coa-variables">
            {variables.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
          {mode === 'guided' && values.op && (
            <p className="ide-tip">
              {values.name} {operatorMeaning[values.op]} {values.value}
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
          {[...new Set(filtered.map((a) => a.category))].map((category) => (
            <details key={category} open>
              <summary>{category}</summary>
              <div className="ide-action-list">
                {filtered
                  .filter((a) => a.category === category)
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setAction(a)
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
          {!filtered.length && (
            <p className="ide-muted">
              No encontramos esa acción. Prueba «número», «lista» o «condición».
            </p>
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

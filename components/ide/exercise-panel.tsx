'use client'
import { useState } from 'react'
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react'
import { exercises, type Exercise } from '@/lib/ide/exercises'
export function ExercisePanel({
  onLoad,
  onCheck,
  results,
  busy,
  ready,
  selected,
  onSelect,
}: {
  onLoad: (exercise: Exercise) => void
  onCheck: (exercise: Exercise) => void
  results: boolean[]
  busy: boolean
  ready: boolean
  selected: string
  onSelect: (id: string) => void
}) {
  const [hint, setHint] = useState(0)
  const [steps, setSteps] = useState<string[]>([])
  const exercise = exercises.find((e) => e.id === selected) ?? exercises[0]
  return (
    <section className="ide-panel">
      <p className="ide-eyebrow">PRACTICA A TU RITMO</p>
      <h2>Modo ejercicio</h2>
      <label className="ide-field">
        Elige un reto
        <select
          disabled={busy}
          value={exercise.id}
          onChange={(e) => {
            onSelect(e.target.value)
            setHint(0)
            setSteps([])
          }}
        >
          {exercises.map((e) => (
            <option value={e.id} key={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </label>
      <h3>{exercise.title}</h3>
      <p>{exercise.description}</p>
      <button
        className="ide-secondary wide"
        disabled={busy}
        onClick={() => onLoad(exercise)}
      >
        Crear archivo para este ejercicio
      </button>
      <p className="ide-eyebrow">TU PLAN · MARCA LO QUE YA HICISTE</p>
      {exercise.steps.map((step) => (
        <label className="ide-check" key={step}>
          <input
            type="checkbox"
            checked={steps.includes(step)}
            onChange={(e) =>
              setSteps((s) =>
                e.target.checked ? [...s, step] : s.filter((x) => x !== step),
              )
            }
          />
          {step}
        </label>
      ))}
      <button
        className="ide-primary wide"
        disabled={busy || !ready}
        onClick={() => onCheck(exercise)}
      >
        {busy ? 'Comprobando…' : 'Comprobar archivo actual'}
      </button>
      <small className="ide-muted">
        Se ejecuta el archivo Python activo con entradas de prueba. Máximo 10
        segundos por caso.
      </small>
      {exercise.tests.map((_, index) => (
        <p key={index} className="ide-test-result">
          {results[index] === true ? (
            <CheckCircle2 size={16} className="ide-success" />
          ) : (
            <Circle size={16} />
          )}{' '}
          Caso {index + 1}:{' '}
          {results[index] === undefined
            ? 'Pendiente'
            : results[index]
              ? 'Correcto'
              : 'Revisa tu programa'}
        </p>
      ))}
      <button
        className="ide-secondary wide"
        disabled={hint >= exercise.hints.length}
        onClick={() => setHint((n) => n + 1)}
      >
        <Lightbulb size={16} /> Necesito una pista
      </button>
      {exercise.hints.slice(0, hint).map((h) => (
        <p className="ide-tip" key={h}>
          {h}
        </p>
      ))}
    </section>
  )
}

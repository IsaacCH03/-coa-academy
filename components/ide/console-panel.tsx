'use client'
import { useEffect, useRef, useState } from 'react'
import {
  Terminal,
  Trash2,
  Maximize2,
  Minimize2,
  CornerDownLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
export function ConsolePanel({
  output,
  waiting,
  onInput,
  onClear,
  expanded,
  onExpand,
  collapsed,
  onCollapse,
}: {
  output: string
  waiting: boolean
  onInput: (value: string) => void
  onClear: () => void
  expanded: boolean
  onExpand: () => void
  collapsed: boolean
  onCollapse: () => void
}) {
  const [value, setValue] = useState('')
  const scroll = useRef<HTMLPreElement>(null)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight
  }, [output])
  useEffect(() => {
    if (waiting) input.current?.focus()
  }, [waiting])
  return (
    <section className="ide-console" aria-label="Consola Python">
      <header>
        <span>
          <Terminal size={15} /> CONSOLA
        </span>
        <div>
          <button
            title={collapsed ? 'Mostrar consola' : 'Contraer consola'}
            aria-label={collapsed ? 'Mostrar consola' : 'Contraer consola'}
            onClick={onCollapse}
            disabled={waiting}
          >
            {collapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button
            title="Limpiar consola"
            aria-label="Limpiar consola"
            onClick={onClear}
          >
            <Trash2 size={15} />
          </button>
          <button
            title={expanded ? 'Restaurar consola' : 'Maximizar consola'}
            aria-label={expanded ? 'Restaurar consola' : 'Maximizar consola'}
            onClick={onExpand}
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>
      <pre
        ref={scroll}
        data-testid="python-output"
        tabIndex={0}
        hidden={collapsed}
      >
        {output || (
          <span className="ide-muted">
            Aquí aparecerán los resultados de tu programa.
          </span>
        )}
      </pre>
      {waiting && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onInput(value)
            setValue('')
          }}
        >
          <span aria-hidden="true">❯</span>
          <input
            ref={input}
            aria-label="Respuesta para Python"
            placeholder="Escribe tu respuesta y presiona Enter"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" aria-label="Enviar respuesta">
            <CornerDownLeft size={18} />
          </button>
        </form>
      )}
    </section>
  )
}

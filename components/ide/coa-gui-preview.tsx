'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import type { CoaGuiPreview as Preview } from '@/lib/ide/runtime'

export function CoaGuiPreview({
  preview,
  onClose,
  onCommand,
}: {
  preview: Preview
  onClose: () => void
  onCommand: (id: number, values: Record<string, string>) => Promise<Preview>
}) {
  const order = { Frame: 0, Label: 1, Entry: 2, Button: 3 }
  const [values, setValues] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  return (
    <section className="coa-gui-preview" aria-label="Vista gráfica COA GUI">
      <header>
        <strong>COA GUI</strong>
        <button onClick={onClose} aria-label="Cerrar vista gráfica">
          <X size={16} />
        </button>
      </header>
      <div className="coa-gui-preview-scroll">
        <div
          className="coa-gui-window"
          style={{ width: preview.width, height: preview.height }}
        >
          <div className="coa-gui-window-title">{preview.title}</div>
          {[...preview.controls]
            .sort((left, right) => order[left.type] - order[right.type])
            .map((control, index) => {
              const style = {
                left: control.x,
                top: control.y,
                width: control.width,
                height: control.height,
              }
              if (control.type === 'Entry')
                return (
                  <input
                    key={control.id}
                    aria-label={`Entrada ${index + 1}`}
                    className="coa-gui-entry"
                    style={style}
                    value={values[control.id] ?? ''}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [control.id]: event.target.value,
                      }))
                    }
                  />
                )
              if (control.type === 'Button')
                return (
                  <button
                    key={control.id}
                    className="coa-gui-button"
                    style={style}
                    disabled={running}
                    onClick={async () => {
                      if (!control.command) return
                      setRunning(true)
                      try {
                        const next = await onCommand(control.id, values)
                        setValues(
                          Object.fromEntries(
                            next.controls
                              .filter(
                                (item) =>
                                  item.type === 'Entry' &&
                                  item.value !== undefined,
                              )
                              .map((item) => [item.id, item.value!]),
                          ),
                        )
                      } finally {
                        setRunning(false)
                      }
                    }}
                  >
                    {control.text}
                  </button>
                )
              return (
                <div
                  key={control.id}
                  className={`coa-gui-${control.type.toLowerCase()}`}
                  style={style}
                >
                  {control.text}
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

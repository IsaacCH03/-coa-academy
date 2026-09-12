'use client'
import { X } from 'lucide-react'
import type { CoaGuiPreview as Preview } from '@/lib/ide/runtime'

export function CoaGuiPreview({
  preview,
  onClose,
}: {
  preview: Preview
  onClose: () => void
}) {
  const order = { Frame: 0, Label: 1, Entry: 2, Button: 3 }
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
                    key={index}
                    aria-label={`Entrada ${index + 1}`}
                    className="coa-gui-entry"
                    style={style}
                  />
                )
              if (control.type === 'Button')
                return (
                  <button key={index} className="coa-gui-button" style={style}>
                    {control.text}
                  </button>
                )
              return (
                <div
                  key={index}
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

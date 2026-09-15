'use client'
import { useState } from 'react'
import { Copy, X } from 'lucide-react'

export function GeneratedCodePanel({ code, title, onClose, testId = 'gui-code' }: {
  code: string
  title: string
  onClose: () => void
  testId?: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <section className="gui-generated" aria-label={title}>
      <div>
        <strong>{title}</strong>
        <span>
          <button onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true) }}>
            <Copy size={15} /> {copied ? 'Copiado' : 'Copiar código'}
          </button>
          <button aria-label={`Cerrar ${title.toLowerCase()}`} title="Cerrar" onClick={onClose}><X size={16} /></button>
        </span>
      </div>
      <pre data-testid={testId} tabIndex={0}><code>{code}</code></pre>
    </section>
  )
}

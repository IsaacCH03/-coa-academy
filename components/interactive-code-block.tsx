'use client'

import { useState } from 'react'
import { Check, Copy, Expand, Minimize2 } from 'lucide-react'

export function InteractiveCodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className={
        expanded
          ? 'fixed inset-4 z-[70] flex flex-col overflow-hidden rounded-2xl bg-foreground shadow-2xl'
          : 'relative my-5 overflow-hidden rounded-2xl bg-foreground'
      }
    >
      <div className="flex items-center justify-between border-b border-background/15 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-background/60">
          Pseudocódigo
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-background/80 transition-colors hover:bg-background/10 hover:text-background"
            aria-label="Copiar bloque"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-background/80 transition-colors hover:bg-background/10 hover:text-background"
            aria-label={expanded ? 'Cerrar vista ampliada' : 'Ampliar bloque'}
          >
            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
            {expanded ? 'Cerrar' : 'Expandir'}
          </button>
        </div>
      </div>
      <pre className={expanded ? 'flex-1 overflow-auto p-6 text-sm leading-7 text-background' : 'overflow-x-auto p-5 text-sm leading-7 text-background'}>
        <code>{children}</code>
      </pre>
    </div>
  )
}

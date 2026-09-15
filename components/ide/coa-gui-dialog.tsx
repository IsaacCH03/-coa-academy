'use client'
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, CircleAlert, CircleHelp, Info, Keyboard } from 'lucide-react'
import type { CoaGuiDialogRequest } from '@/lib/ide/runtime'
import type { CoaGuiDialogPosition } from '@/lib/ide/personalization'

const inputKinds = new Set(['askstring', 'askinteger', 'askfloat'])

export function CoaGuiDialog({ request, onAnswer, useTheme, position }: {
  request: CoaGuiDialogRequest
  onAnswer: (value: string | number | boolean | null) => void
  useTheme: boolean
  position: CoaGuiDialogPosition
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const primary = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLElement>(null)
  const asksInput = inputKinds.has(request.kind)
  const Icon = request.kind === 'showwarning' ? AlertTriangle : request.kind === 'showerror' ? CircleAlert : request.kind.startsWith('ask') && !asksInput ? CircleHelp : asksInput ? Keyboard : Info
  const cancel = () => onAnswer(asksInput ? null : false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => (asksInput ? input.current : primary.current)?.focus())
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); cancel() } }
    document.addEventListener('keydown', escape)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', escape) }
  })
  function confirm() {
    if (!asksInput) { onAnswer(true); return }
    if (request.kind === 'askinteger') {
      if (!/^[+-]?\d+$/.test(value.trim())) { setError('Ingresa un número entero válido.'); return }
      onAnswer(Number.parseInt(value, 10)); return
    }
    if (request.kind === 'askfloat') {
      const parsed = Number(value.trim())
      if (!value.trim() || !Number.isFinite(parsed)) { setError('Ingresa un número válido.'); return }
      onAnswer(parsed); return
    }
    onAnswer(value)
  }
  const information = request.kind.startsWith('show')
  const yesNo = request.kind === 'askyesno'
  return (
    <div className={`coa-dialog-overlay coa-dialog-position-${position}`}>
      <section ref={dialog} className={`coa-dialog coa-dialog-${request.kind}${useTheme ? '' : ' coa-dialog-neutral'}`} role="dialog" aria-modal="true" aria-labelledby="coa-dialog-title" aria-describedby="coa-dialog-message" onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const focusable = [...(dialog.current?.querySelectorAll<HTMLElement>('input, button:not(:disabled)') ?? [])]
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }}>
        <div className="coa-dialog-heading"><Icon aria-hidden="true" /><h2 id="coa-dialog-title">{request.title}</h2></div>
        <p id="coa-dialog-message">{request.message}</p>
        <form onSubmit={(event) => { event.preventDefault(); confirm() }}>
          {asksInput && <label>Respuesta<input ref={input} value={value} onChange={(event) => { setValue(event.target.value); setError('') }} inputMode={request.kind === 'askinteger' ? 'numeric' : request.kind === 'askfloat' ? 'decimal' : 'text'} /></label>}
          {error && <p className="coa-dialog-error" role="alert">{error}</p>}
          <div className="coa-dialog-actions">
            {!information && <button type="button" onClick={cancel}>{yesNo ? 'No' : 'Cancelar'}</button>}
            <button ref={primary} className="ide-primary" type="submit">{information ? 'Aceptar' : yesNo ? 'Sí' : 'Aceptar'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

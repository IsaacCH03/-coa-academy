'use client'

import { useRef, useState } from 'react'

export function ConfirmSubmitButton({ label, title, message, className }: { label: string; title: string; message: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return <>
    <button ref={buttonRef} type="button" onClick={() => setOpen(true)} className={className}>{label}</button>
    {open && <div role="dialog" aria-modal="true" aria-labelledby="confirm-action-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
        <h3 id="confirm-action-title" className="text-xl font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Cancelar</button>
          <button type="button" onClick={() => { setOpen(false); buttonRef.current?.form?.requestSubmit() }} className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">Confirmar</button>
        </div>
      </div>
    </div>}
  </>
}

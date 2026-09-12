'use client'
import { useEffect, useRef, type ReactNode } from 'react'
export function ConfirmDialog({
  title,
  children,
  onCancel,
  onConfirm,
  confirmLabel = 'Confirmar',
}: {
  title: string
  children: ReactNode
  onCancel: () => void
  onConfirm: () => void
  confirmLabel?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    dialog.current?.showModal()
  }, [])
  return (
    <dialog
      ref={dialog}
      className="ide-dialog"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
    >
      <h2>{title}</h2>
      {children}
      <div className="ide-row">
        <button onClick={onCancel} autoFocus>
          Cancelar
        </button>
        <button className="ide-primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

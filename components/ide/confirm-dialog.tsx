'use client'
import { useEffect, useRef, type ReactNode } from 'react'
export function ConfirmDialog({
  title,
  children,
  onCancel,
  onConfirm,
}: {
  title: string
  children: ReactNode
  onCancel: () => void
  onConfirm: () => void
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
          Confirmar
        </button>
      </div>
    </dialog>
  )
}

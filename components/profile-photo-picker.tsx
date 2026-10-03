'use client'

import Image from 'next/image'
import { ImageUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp'])
const maxBytes = 5 * 1024 * 1024

export function ProfilePhotoPicker({ currentUrl, fullName, formId }: { currentUrl: string | null; fullName: string; formId: string }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selected, setSelected] = useState(false)
  const [error, setError] = useState('')
  const initials = fullName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return <div className="mb-6 flex flex-col gap-5 rounded-2xl border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-center gap-4">
      {previewUrl || currentUrl
        ? <Image src={previewUrl ?? currentUrl!} alt="" width={80} height={80} unoptimized className="h-20 w-20 shrink-0 rounded-full object-cover"/>
        : <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">{initials}</span>}
      <div className="min-w-0"><p className="text-sm text-muted-foreground">Nombre de la cuenta</p><h2 className="truncate text-xl font-bold">{fullName}</h2><p className="mt-1 text-sm text-muted-foreground">El nombre se toma automáticamente de tu cuenta.</p></div>
    </div>
    <div className="shrink-0 sm:text-right">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold transition-colors hover:bg-secondary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        <ImageUp className="h-4 w-4 text-primary"/>
        Cambiar foto
        <input
          form={formId}
          className="sr-only"
          name="avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={event => {
            const file = event.currentTarget.files?.[0]
            setError('')
            setSelected(false)
            if (!file) return
            if (!allowedTypes.has(file.type)) {
              event.currentTarget.value = ''
              setError('Selecciona una imagen PNG, JPG o WEBP.')
              return
            }
            if (file.size > maxBytes) {
              event.currentTarget.value = ''
              setError('La imagen supera el máximo de 5 MB.')
              return
            }
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            setPreviewUrl(URL.createObjectURL(file))
            setSelected(true)
          }}
        />
      </label>
      <p className="mt-2 text-xs text-muted-foreground">(opcional, PNG/JPG/WEBP, máximo 5 MB)</p>
      {selected && <p className="mt-1 text-xs font-semibold text-primary">Imagen seleccionada</p>}
      {error && <p role="alert" className="mt-1 max-w-64 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  </div>
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminFileActions({ fileId }: { fileId: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false)
  async function remove() {
    if (!window.confirm('¿Borrar este archivo? La evidencia académica y la revisión se conservarán.')) return
    setBusy(true); const response = await fetch(`/admin/entregas/${fileId}/download`, { method: 'DELETE' }); setBusy(false)
    if (!response.ok) { window.alert('No pudimos borrar el archivo.'); return }
    router.refresh()
  }
  return <span className="inline-flex gap-3"><a className="font-bold text-primary hover:underline" href={`/admin/entregas/${fileId}/download`}>Descargar</a><button type="button" disabled={busy} onClick={() => void remove()} className="font-bold text-destructive hover:underline disabled:opacity-50">{busy ? 'Borrando…' : 'Borrar archivo'}</button></span>
}

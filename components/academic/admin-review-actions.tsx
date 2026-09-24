'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminReviewActions({ studentId, activityId, activityTitle, studentName, fileNames, rubricSummary, hasSubmission }: { studentId: string; activityId: string; activityTitle: string; studentName: string; fileNames: string[]; rubricSummary: string; hasSubmission: boolean }) {
  const router = useRouter()
  const [action, setAction] = useState<'approved' | 'correction' | 'convalidated' | null>(null)
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit() {
    if (!action) return
    setBusy(true); setError('')
    const response = await fetch('/api/academic/admin/review', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ studentId, activityId, status: action, feedback: action === 'convalidated' ? undefined : feedback, convalidationNote: action === 'convalidated' ? feedback : undefined }) })
    const body = await response.json()
    if (!response.ok) { setError(body.error ?? 'No pudimos guardar la revisión.'); setBusy(false); return }
    setAction(null); setFeedback(''); setBusy(false); router.refresh()
  }
  return <div className="mt-4"><div className="flex flex-wrap gap-2">{hasSubmission && <><button type="button" onClick={() => setAction('approved')} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Aprobar</button><button type="button" onClick={() => setAction('correction')} className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white">Corrección</button></>}<button type="button" onClick={() => setAction('convalidated')} className="rounded-lg border border-primary px-3 py-2 text-xs font-bold text-primary">Convalidar</button></div>
    {action && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-6 shadow-xl"><h3 className="text-xl font-bold">{action === 'approved' ? 'Aprobar actividad' : action === 'correction' ? 'Solicitar corrección' : 'Convalidar actividad'}</h3><dl className="mt-4 grid gap-3 rounded-xl bg-secondary/60 p-4 text-sm"><div><dt className="font-bold">Actividad</dt><dd>{activityTitle}</dd></div><div><dt className="font-bold">Estudiante</dt><dd>{studentName}</dd></div><div><dt className="font-bold">Archivos</dt><dd>{fileNames.length ? fileNames.join(', ') : 'Sin archivos nativos'}</dd></div><div><dt className="font-bold">Rúbrica</dt><dd>{rubricSummary}</dd></div></dl><p className="mt-3 text-sm text-muted-foreground">La acción quedará registrada y notificará al estudiante.</p><label className="mt-5 block text-sm font-bold">{action === 'convalidated' ? 'Nota de convalidación' : 'Retroalimentación'}{action === 'correction' && ' (obligatoria)'}<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder={action === 'convalidated' ? 'Entregada anteriormente mediante Google Forms.' : ''} className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-3 font-normal" /></label>{error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setAction(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-bold">Cancelar</button><button type="button" disabled={busy || (action === 'correction' && !feedback.trim())} onClick={() => void submit()} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">Confirmar</button></div></div></div>}
  </div>
}

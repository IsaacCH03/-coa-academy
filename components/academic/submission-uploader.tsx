'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, FileUp, LoaderCircle, X } from 'lucide-react'
import { formatFileSize, MAX_SUBMISSION_BYTES, MAX_SUBMISSION_FILES, validateSubmissionFiles } from '@/lib/submissions'

type SubmissionFile = { id: string; original_filename: string; size_bytes: number; mime_type: string }
type RecordState = { status: 'pending' | 'under_review' | 'approved' | 'correction' | 'convalidated'; feedback: string | null; convalidation_note: string | null }
type Submission = { id: string; submitted_at: string; files: SubmissionFile[]; record?: RecordState | null }

const statusCopy: Record<RecordState['status'], { label: string; detail: string }> = {
  pending: { label: 'Pendiente', detail: 'Todavía no has realizado esta entrega.' },
  under_review: { label: 'En revisión', detail: 'Tu entrega está pendiente de revisión.' },
  approved: { label: 'Aprobado', detail: 'Actividad aprobada.' },
  correction: { label: 'Corrección', detail: 'Se solicitaron correcciones.' },
  convalidated: { label: 'Convalidado', detail: 'Actividad convalidada.' },
}

function formatDate(value: string) { return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) }

export function SubmissionUploader({ activityId }: { activityId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [record, setRecord] = useState<RecordState | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [mode, setMode] = useState<'student' | 'admin'>('student')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(true)
  const [uploading, setUploading] = useState(false)
  const endpoint = `/api/academic/submissions/${encodeURIComponent(activityId)}`

  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal }).then(async (response) => {
      const body = await response.json()
      if (response.ok) { setMode(body.mode ?? 'student'); setSubmission(body.submission); setRecord(body.submission?.record ?? body.record ?? null) }
      else if (response.status === 401) setMessage('Inicia sesión y matricúlate para realizar esta entrega.')
      else { setAvailable(false); setMessage(body.error) }
    }).catch((error) => { if (error.name !== 'AbortError') setMessage('No pudimos consultar tu entrega.') }).finally(() => setLoading(false))
    return () => controller.abort()
  }, [endpoint])

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const next = [...files, ...Array.from(incoming)]
    const error = validateSubmissionFiles(next)
    if (error) { setMessage(error); return }
    setFiles(next); setMessage('')
  }, [files])

  const upload = useCallback(async () => {
    if (uploading || !available) return
    const error = validateSubmissionFiles(files)
    if (error) { setMessage(error); return }
    setUploading(true); setMessage('')
    const formData = new FormData(); files.forEach((file) => formData.append('files', file))
    try {
      const response = await fetch(endpoint, { method: 'POST', body: formData })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'No pudimos completar la entrega.')
      setSubmission(body.submission); setRecord(body.submission.record); setFiles([])
      setMessage('Entrega guardada correctamente. Ahora está en revisión.')
      if (inputRef.current) inputRef.current.value = ''
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'No pudimos completar la entrega.') }
    finally { setUploading(false) }
  }, [available, endpoint, files, uploading])

  if (loading) return <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" /> Consultando entrega…</div>
  if (mode === 'admin') return <div className="mt-6 rounded-xl border border-primary/25 bg-secondary/50 p-5"><h4 className="font-bold">Entrega interna</h4><p className="mt-1 text-sm text-muted-foreground">Vista de inspección administrativa. Revisa las entregas desde el expediente del estudiante.</p></div>
  const effective = record ?? { status: submission ? 'under_review' : 'pending', feedback: null, convalidation_note: null } as RecordState
  const total = files.reduce((sum, file) => sum + file.size, 0)
  const canSubmit = effective.status === 'pending' || effective.status === 'correction' || effective.status === 'under_review'

  return <div className="mt-6 rounded-xl border border-primary/25 bg-background p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="font-bold">Entrega interna</h4><p className="mt-1 text-sm text-muted-foreground">Hasta 5 archivos; máximo combinado de 10 MB.</p></div><span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase"><CheckCircle2 className="h-4 w-4" />{statusCopy[effective.status].label}</span></div>
    <div className="mt-4 rounded-lg bg-secondary/60 p-4 text-sm"><p className="font-semibold">{statusCopy[effective.status].detail}</p>{effective.feedback && <p className="mt-2"><strong>Retroalimentación:</strong> {effective.feedback}</p>}{effective.convalidation_note && <p className="mt-2"><strong>Nota:</strong> {effective.convalidation_note}</p>}</div>
    {submission && <div className="mt-4 text-sm"><p className="font-semibold">Archivos entregados · {formatDate(submission.submitted_at)}</p><ul className="mt-2 space-y-1">{(submission.files ?? []).map((file) => <li key={file.id}>{file.original_filename} · {formatFileSize(file.size_bytes)}</li>)}</ul></div>}
    {canSubmit && <><label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }} className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-primary/30 p-6 text-center hover:border-primary/60"><FileUp className="h-7 w-7 text-primary" /><span className="mt-2 text-sm font-bold">Seleccionar o arrastrar archivos</span><span className="mt-1 text-xs text-muted-foreground">{MAX_SUBMISSION_FILES} archivos · {MAX_SUBMISSION_BYTES / 1024 / 1024} MB combinados</span><input ref={inputRef} multiple type="file" className="sr-only" disabled={uploading || !available} onChange={(event) => event.target.files && addFiles(event.target.files)} /></label>
      {files.length > 0 && <div className="mt-4 rounded-xl border border-border p-4"><p className="font-bold">Archivos seleccionados</p><ul className="mt-3 space-y-2">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate">{file.name} · {formatFileSize(file.size)}</span><button type="button" className="inline-flex items-center gap-1 font-bold text-destructive" onClick={() => setFiles(files.filter((_, itemIndex) => itemIndex !== index))}><X className="h-4 w-4" />Quitar</button></li>)}</ul><p className="mt-3 text-xs text-muted-foreground">{files.length} de {MAX_SUBMISSION_FILES} archivos · {formatFileSize(total)} de 10 MB</p><button type="button" disabled={uploading} onClick={() => void upload()} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">{uploading ? 'Entregando…' : submission ? 'Volver a entregar' : 'Entregar'}</button></div>}</>}
    {message && <p role="status" className="mt-3 text-sm text-muted-foreground">{message}</p>}
  </div>
}

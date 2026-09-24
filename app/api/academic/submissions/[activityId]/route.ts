import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MAX_SUBMISSION_BYTES, MAX_SUBMISSION_FILES, validateSubmissionFiles } from '@/lib/submissions'

const bucket = 'academic-submissions'
type UploadedMetadata = { storage_path: string; original_filename: string; stored_filename: string; size_bytes: number; mime_type: string }
type SupabaseError = { code?: string; message?: string; details?: string; hint?: string } | null

function logSubmissionError(stage: string, activityId: string, error: SupabaseError) {
  console.error('[academic-submission]', {
    stage,
    activityId,
    code: error?.code ?? 'unknown',
    message: error?.message ?? 'No error details returned',
    details: error?.details ?? null,
    hint: error?.hint ?? null,
  })
}

export async function GET(_request: Request, { params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión para consultar tu entrega.' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: 'student' | 'admin' }>()
  if (profile?.role === 'admin') return NextResponse.json({ mode: 'admin', submission: null })
  const { data: activity, error: activityError } = await supabase.from('activities').select('id').eq('id', activityId).maybeSingle()
  if (activityError) return NextResponse.json({ error: 'Las entregas internas todavía no están disponibles.' }, { status: 503 })
  if (!activity) return NextResponse.json({ error: 'Necesitas una matrícula activa para realizar esta entrega.' }, { status: 403 })
  const { data, error } = await supabase.from('submissions')
    .select('id, submitted_at, submission_files(id, original_filename, size_bytes, mime_type, file_deleted_at), student_activity_records(status, feedback, convalidation_note, reviewed_at)')
    .eq('student_id', user.id).eq('activity_id', activityId).maybeSingle()
  const { data: standaloneRecord } = data ? { data: null } : await supabase.from('student_activity_records').select('status, feedback, convalidation_note, reviewed_at').eq('student_id', user.id).eq('activity_id', activityId).maybeSingle()
  if (error) return NextResponse.json({ error: 'Las entregas internas todavía no están disponibles.' }, { status: 503 })
  const submission = data ? { ...data, files: (data.submission_files ?? []).filter((file: { file_deleted_at: string | null }) => !file.file_deleted_at), record: Array.isArray(data.student_activity_records) ? data.student_activity_records[0] : data.student_activity_records } : null
  return NextResponse.json({ mode: 'student', submission, record: submission?.record ?? standaloneRecord, settings: { maxFiles: MAX_SUBMISSION_FILES, maxTotalBytes: MAX_SUBMISSION_BYTES } })
}

export async function POST(request: Request, { params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Debes iniciar sesión para entregar una actividad.' }, { status: 401 })
  const formData = await request.formData()
  const files = formData.getAll('files').filter((item): item is File => item instanceof File)
  const validationError = validateSubmissionFiles(files)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })
  const { data: preparedData, error: prepareError } = await supabase.rpc('prepare_activity_upload', {
    p_activity_id: activityId,
    p_files: files.map((file) => ({ original_filename: file.name, size_bytes: file.size, mime_type: file.type || 'application/octet-stream' })),
  })
  const prepared = Array.isArray(preparedData) ? preparedData[0] : preparedData
  if (prepareError || !prepared || !Array.isArray(prepared.files) || prepared.files.length !== files.length) {
    logSubmissionError('prepare', activityId, prepareError)
    return NextResponse.json({ error: 'No pudimos preparar una carga segura para esta entrega.' }, { status: 403 })
  }
  const batchId = prepared.batch_id as string
  const uploaded: UploadedMetadata[] = []
  for (const [index, file] of files.entries()) {
    const metadata = prepared.files[index] as UploadedMetadata
    const storagePath = metadata.storage_path
    const mimeType = metadata.mime_type
    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, { contentType: mimeType, upsert: false })
    if (error) {
      logSubmissionError('storage-upload', activityId, error)
      if (uploaded.length) await supabase.storage.from(bucket).remove(uploaded.map((item) => item.storage_path))
      await supabase.rpc('cancel_activity_upload', { p_batch_id: batchId })
      return NextResponse.json({ error: 'No pudimos cargar todos los archivos. No se guardó una entrega parcial.' }, { status: 403 })
    }
    uploaded.push(metadata)
  }
  const { data, error } = await supabase.rpc('finalize_activity_upload', { p_activity_id: activityId, p_batch_id: batchId })
  const result = Array.isArray(data) ? data[0] : data
  if (error || !result) {
    logSubmissionError('finalize', activityId, error)
    await supabase.storage.from(bucket).remove(uploaded.map((item) => item.storage_path))
    await supabase.rpc('cancel_activity_upload', { p_batch_id: batchId })
    return NextResponse.json({ error: 'No pudimos registrar la entrega. Los archivos nuevos fueron descartados.' }, { status: 403 })
  }
  const oldPaths = (result.old_storage_paths ?? []).filter((path: string) => !uploaded.some((item) => item.storage_path === path))
  if (oldPaths.length) await supabase.storage.from(bucket).remove(oldPaths)
  return NextResponse.json({ submission: { id: result.submission_id, submitted_at: result.submitted_at, files: uploaded.map((file, index) => ({ id: `new-${index}`, original_filename: file.original_filename, size_bytes: file.size_bytes, mime_type: file.mime_type })), record: { status: 'under_review', feedback: null, convalidation_note: null } } })
}

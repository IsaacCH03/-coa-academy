import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { AdminReviewActions } from '@/components/academic/admin-review-actions'
import { AdminFileActions } from '@/components/academic/admin-file-actions'
import { enrollmentStatusLabel, type EnrollmentStatus } from '@/lib/academic'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

type FileRow = { id: string; original_filename: string; size_bytes: number; file_deleted_at: string | null }
type SubmissionRow = { id: string; activity_id: string; submitted_at: string; submission_files: FileRow[] }
type RecordRow = { activity_id: string; status: string; feedback: string | null; convalidation_note: string | null }
const labels: Record<string, string> = { pending: 'Pendiente', under_review: 'En revisión', approved: 'Aprobado', correction: 'Corrección', convalidated: 'Convalidado' }

export default async function StudentAcademicRecordPage({ params }: { params: Promise<{ slug: string; studentId: string }> }) {
  const { slug, studentId } = await params
  await requireAdmin()
  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('id,title,slug').eq('slug', slug).maybeSingle<{ id: string; title: string; slug: string }>()
  if (!course) notFound()
  const [{ data: enrollment }, { data: profile }, { data: activities }, { data: submissions }, { data: records }, { data: email }] = await Promise.all([
    supabase.from('enrollments').select('status,enrolled_at').eq('student_id', studentId).eq('course_id', course.id).maybeSingle<{ status: EnrollmentStatus; enrolled_at: string }>(),
    supabase.from('profiles').select('full_name,identification,country,phone').eq('id', studentId).maybeSingle<{ full_name: string; identification: string | null; country: string | null; phone: string | null }>(),
    supabase.from('activities').select('id,title,module_number,display_order,original_max_points').eq('course_id', course.id).eq('status', 'active').order('module_number').order('display_order'),
    supabase.from('submissions').select('id,activity_id,submitted_at,submission_files(id,original_filename,size_bytes,file_deleted_at)').eq('student_id', studentId).eq('course_id', course.id),
    supabase.from('student_activity_records').select('activity_id,status,feedback,convalidation_note').eq('student_id', studentId),
    supabase.rpc('get_admin_student_email', { p_student_id: studentId }),
  ])
  if (!enrollment || !profile) notFound()
  const submissionsByActivity = new Map(((submissions ?? []) as unknown as SubmissionRow[]).map((item) => [item.activity_id, item]))
  const recordsByActivity = new Map(((records ?? []) as RecordRow[]).map((item) => [item.activity_id, item]))
  return <AccountShell title={profile.full_name} eyebrow="Expediente académico">
    <Link href={`/admin/cursos/${slug}`} className="text-sm font-bold text-primary hover:underline">← Volver al curso</Link>
    <section className="mt-6 grid gap-3 rounded-2xl border border-border bg-background p-6 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs font-bold uppercase text-muted-foreground">Correo</p><p className="mt-1 break-all font-semibold">{email ?? 'No disponible'}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Identificación</p><p className="mt-1">{profile.identification ?? '—'}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">País / teléfono</p><p className="mt-1">{profile.country ?? '—'} · {profile.phone ?? '—'}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Matrícula</p><p className="mt-1">{enrollmentStatusLabel(enrollment.status)} · {new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(enrollment.enrolled_at))}</p></div><div className="sm:col-span-2 lg:col-span-4"><p className="text-xs font-bold uppercase text-muted-foreground">Curso</p><p className="mt-1 font-semibold">{course.title}</p></div></section>
    <section className="mt-8"><h2 className="text-2xl font-extrabold">Evaluaciones</h2><div className="mt-4 space-y-4">{(activities ?? []).map((activity) => { const submission = submissionsByActivity.get(activity.id); const record = recordsByActivity.get(activity.id); const status = record?.status ?? (submission ? 'under_review' : 'pending'); const files = submission?.submission_files.filter((file) => !file.file_deleted_at) ?? []; return <article key={activity.id} className="rounded-2xl border border-border bg-background p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-primary">Módulo {activity.module_number}</p><h3 className="mt-1 font-bold">{activity.title}</h3></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase">{labels[status] ?? status}</span></div>{files.length ? <div className="mt-4"><p className="text-sm font-bold">{files.length} archivo{files.length === 1 ? '' : 's'}</p><ul className="mt-2 space-y-2">{files.map((file) => <li key={file.id} className="flex flex-wrap items-center gap-3 text-sm"><span>{file.original_filename}</span><AdminFileActions fileId={file.id} /></li>)}</ul></div> : <p className="mt-4 text-sm text-muted-foreground">Sin entrega nativa.</p>}{record?.feedback && <p className="mt-3 text-sm"><strong>Retroalimentación:</strong> {record.feedback}</p>}{record?.convalidation_note && <p className="mt-3 text-sm"><strong>Nota:</strong> {record.convalidation_note}</p>}<AdminReviewActions studentId={studentId} activityId={activity.id} activityTitle={activity.title} studentName={profile.full_name} fileNames={files.map((file) => file.original_filename)} rubricSummary={`Rúbrica aplicable · escala original ${activity.original_max_points} puntos`} hasSubmission={Boolean(submission && files.length)} /></article> })}</div></section>
  </AccountShell>
}

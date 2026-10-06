import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { AdminFileActions } from '@/components/academic/admin-file-actions'
import { AdminReviewActions } from '@/components/academic/admin-review-actions'
import { adminReturnLabel, safeAdminReturnTo } from '@/lib/admin-navigation'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

type Relation<T>=T|T[]|null
const one=<T,>(value:Relation<T>)=>Array.isArray(value)?value[0]??null:value
type Submission={id:string;student_id:string;activity_id:string;submitted_at:string;grade:number|null;feedback:string|null;reviewed_at:string|null;student:Relation<{full_name:string}>;course:Relation<{title:string;slug:string}>;activity:Relation<{title:string;original_max_points:number;live_group:Relation<{name:string}>}>;submission_files:{id:string;original_filename:string;size_bytes:number;file_deleted_at:string|null}[]}

export default async function SubmissionReviewPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{returnTo?:string}>}){
 await requireAdmin()
 const[{id},{returnTo:rawReturnTo}]=await Promise.all([params,searchParams]),returnTo=safeAdminReturnTo(rawReturnTo,'/admin/entregas'),supabase=await createClient()
 const{data}=await supabase.from('submissions').select('id,student_id,activity_id,submitted_at,grade,feedback,reviewed_at,student:profiles!submissions_student_id_fkey(full_name),course:courses!submissions_course_id_fkey(title,slug),activity:activities!submissions_activity_id_fkey(title,original_max_points,live_group:live_groups(name)),submission_files(id,original_filename,size_bytes,file_deleted_at)').eq('id',id).maybeSingle()
 const submission=data as unknown as Submission|null
 if(!submission)notFound()
 const{data:record}=await supabase.from('student_activity_records').select('status,feedback,convalidation_note,reviewed_at').eq('student_id',submission.student_id).eq('activity_id',submission.activity_id).maybeSingle<{status:string;feedback:string|null;convalidation_note:string|null;reviewed_at:string|null}>()
 const student=one(submission.student),course=one(submission.course),activity=one(submission.activity),group=one(activity?.live_group??null),files=submission.submission_files.filter(file=>!file.file_deleted_at),reviewed=record&&['approved','correction','convalidated'].includes(record.status)
 return <AccountShell title={activity?.title??'Revisar entrega'} eyebrow="Entrega académica">
  <div className="flex flex-wrap items-center justify-between gap-3"><Link href={returnTo} className="text-sm font-bold text-primary hover:underline">← {adminReturnLabel(returnTo,'Volver')}</Link>{course&&<Link href={`/admin/cursos/${course.slug}/estudiantes/${submission.student_id}?returnTo=${encodeURIComponent(returnTo)}`} className="text-sm font-bold text-primary hover:underline">Ver expediente completo</Link>}</div>
  <section className="mt-6 grid gap-4 rounded-2xl border bg-background p-6 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs font-bold uppercase text-muted-foreground">Estudiante</p><p className="mt-1 font-semibold">{student?.full_name??'—'}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Curso</p><p className="mt-1">{course?.title??'Sin curso base'}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Grupo</p><p className="mt-1">{group?.name??'—'}</p></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Entregada</p><p className="mt-1">{new Intl.DateTimeFormat('es-CR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(submission.submitted_at))}</p></div></section>
  <section className="mt-6 rounded-2xl border bg-background p-6"><h2 className="text-xl font-bold">Archivos</h2>{files.length?<ul className="mt-4 space-y-3">{files.map(file=><li key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/50 p-3"><span>{file.original_filename}</span><AdminFileActions fileId={file.id}/></li>)}</ul>:<p className="mt-3 text-sm text-muted-foreground">No quedan archivos activos en esta entrega.</p>}
   <AdminReviewActions studentId={submission.student_id} activityId={submission.activity_id} activityTitle={activity?.title??submission.activity_id} studentName={student?.full_name??'Estudiante'} fileNames={files.map(file=>file.original_filename)} rubricSummary={`Rúbrica aplicable · escala original ${activity?.original_max_points??100} puntos`} hasSubmission={files.length>0} existingReview={reviewed?{status:record.status,feedback:record.feedback,convalidationNote:record.convalidation_note,grade:submission.grade,reviewedAt:record.reviewed_at??submission.reviewed_at}:null}/>
  </section>
 </AccountShell>
}

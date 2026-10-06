import Link from 'next/link'
import { Archive, Inbox, RotateCcw } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { archiveSubmission, restoreSubmission } from './actions'

const PAGE_SIZE=20
const statusLabels:Record<string,string>={submitted:'Pendiente',under_review:'En revisión',approved:'Aprobada',correction:'Corrección',convalidated:'Convalidada'}
type Query={view?:string;context?:string;activity?:string;q?:string;page?:string}
type Relation<T>=T|T[]|null
export type ActivityOption={id:string;title:string;course_id:string|null;live_group_id:string|null;courses:Relation<{title:string}>;live_groups:Relation<{name:string}>}
export type AdminSubmission={id:string;student_id:string;activity_id:string;submitted_at:string;admin_archived_at:string|null;status:string;grade:number|null;student:Relation<{full_name:string}>;course:Relation<{title:string;slug:string}>;activity:Relation<{id:string;title:string;course_id:string|null;live_group_id:string|null;live_group:Relation<{id:string;name:string}>}>;submission_files:{id:string;file_deleted_at:string|null}[];review:Relation<{status:string}>}

const one=<T,>(value:Relation<T>)=>Array.isArray(value)?value[0]??null:value
export function submissionGroupName(item:AdminSubmission){return one(one(item.activity)?.live_group)?.name}
export function submissionReviewStatus(item:AdminSubmission){return one(item.review)?.status??(item.status==='reviewed'?'approved':'under_review')}
export function parseSubmissionContext(value:string|undefined){const match=/^(course|group):([0-9a-f-]{36})$/i.exec(value??'');return match?{kind:match[1] as'course'|'group',id:match[2]}:null}
export const submissionInboxHref=(query:Query,updates:Partial<Query>)=>{const values={...query,...updates},params=new URLSearchParams();for(const[key,value]of Object.entries(values))if(value&&!(key==='page'&&value==='1'))params.set(key,value);const text=params.toString();return text?`/admin/entregas?${text}`:'/admin/entregas'}
export const activityMatchesContext=(item:Pick<ActivityOption,'course_id'|'live_group_id'>,context:ReturnType<typeof parseSubmissionContext>)=>!context||(context.kind==='group'?item.live_group_id===context.id:item.course_id===context.id&&!item.live_group_id)
const relationTitle=(value:Relation<{title:string}>)=>one(value)?.title
const relationName=(value:Relation<{name:string}>)=>one(value)?.name

export default async function AdminSubmissionsPage({searchParams}:{searchParams:Promise<Query>}){
 await requireAdmin()
 const raw=await searchParams,view=raw.view==='archived'?'archived':'active',context=parseSubmissionContext(raw.context),activityId=(raw.activity??'').trim(),search=(raw.q??'').trim().slice(0,100),page=Math.max(1,Number.parseInt(raw.page??'1',10)||1)
 const query:Query={view,context:context?`${context.kind}:${context.id}`:undefined,activity:activityId||undefined,q:search||undefined,page:String(page)}
 const supabase=await createClient()
 let submissionsQuery=supabase.from('submissions').select('id,student_id,activity_id,submitted_at,admin_archived_at,status,grade,student:profiles!submissions_student_id_fkey!inner(full_name),course:courses!submissions_course_id_fkey(title,slug),activity:activities!submissions_activity_id_fkey!inner(id,title,course_id,live_group_id,live_group:live_groups(id,name)),submission_files(id,file_deleted_at),review:student_activity_records!student_activity_records_submission_id_fkey(status)',{count:'exact'})
 submissionsQuery=view==='archived'?submissionsQuery.not('admin_archived_at','is',null):submissionsQuery.is('admin_archived_at',null)
 if(context?.kind==='course')submissionsQuery=submissionsQuery.eq('course_id',context.id).is('activity.live_group_id',null)
 if(context?.kind==='group')submissionsQuery=submissionsQuery.eq('activity.live_group_id',context.id)
 if(activityId)submissionsQuery=submissionsQuery.eq('activity_id',activityId)
 if(search)submissionsQuery=submissionsQuery.ilike('student.full_name',`%${search.replaceAll('%','\\%').replaceAll('_','\\_')}%`)
 submissionsQuery=submissionsQuery.order('submitted_at',{ascending:false}).range((page-1)*PAGE_SIZE,page*PAGE_SIZE-1)
 const[{data,error,count},{data:activityRows},{count:activeCount},{count:archivedCount}]=await Promise.all([
  submissionsQuery,
  supabase.from('activities').select('id,title,course_id,live_group_id,courses(title),live_groups(name)').eq('status','active').order('title'),
  supabase.from('submissions').select('id',{head:true,count:'exact'}).is('admin_archived_at',null),
  supabase.from('submissions').select('id',{head:true,count:'exact'}).not('admin_archived_at','is',null),
 ])
 const submissions=(data??[]) as unknown as AdminSubmission[],activities=(activityRows??[]) as unknown as ActivityOption[]
 const courseContexts=new Map<string,string>(),groupContexts=new Map<string,string>()
 for(const item of activities){const courseTitle=relationTitle(item.courses),groupName=relationName(item.live_groups);if(item.live_group_id&&groupName)groupContexts.set(item.live_group_id,groupName);else if(item.course_id&&courseTitle)courseContexts.set(item.course_id,courseTitle)}
 const activityOptions=activities.filter(item=>activityMatchesContext(item,context))
 const total=count??0,totalPages=Math.max(1,Math.ceil(total/PAGE_SIZE)),currentHref=submissionInboxHref(query,{})
 return <AccountShell title="Entregas académicas" eyebrow="Administración">
  <Link href="/admin" className="text-sm font-bold text-primary hover:underline">← Volver al panel</Link>
  <div className="mt-6 flex flex-wrap gap-2" aria-label="Estado de la bandeja"><Link href={submissionInboxHref(query,{view:'active',page:'1'})} className={`rounded-xl px-4 py-2 text-sm font-bold ${view==='active'?'bg-primary text-primary-foreground':'border'}`}>Activas ({activeCount??0})</Link><Link href={submissionInboxHref(query,{view:'archived',page:'1'})} className={`rounded-xl px-4 py-2 text-sm font-bold ${view==='archived'?'bg-primary text-primary-foreground':'border'}`}>Archivadas ({archivedCount??0})</Link></div>
  <form className="mt-5 grid gap-3 rounded-2xl border bg-background p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
   <input type="hidden" name="view" value={view}/>
   <label className="grid gap-2 text-sm font-bold">Contexto<select name="context" defaultValue={query.context??''} className="h-11 rounded-xl border bg-background px-3"><option value="">Todos</option>{courseContexts.size>0&&<optgroup label="Cursos">{[...courseContexts].sort((a,b)=>a[1].localeCompare(b[1],'es')).map(([id,title])=><option key={id} value={`course:${id}`}>{title}</option>)}</optgroup>}{groupContexts.size>0&&<optgroup label="Grupos en vivo">{[...groupContexts].sort((a,b)=>a[1].localeCompare(b[1],'es')).map(([id,name])=><option key={id} value={`group:${id}`}>{name}</option>)}</optgroup>}</select></label>
   <label className="grid gap-2 text-sm font-bold">Actividad<select name="activity" defaultValue={activityId} className="h-11 rounded-xl border bg-background px-3"><option value="">Todas las actividades</option>{activityOptions.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
   <label className="grid gap-2 text-sm font-bold">Estudiante<input name="q" defaultValue={search} placeholder="Buscar estudiante..." className="h-11 rounded-xl border bg-background px-3"/></label>
   <button className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Filtrar</button>
  </form>
  <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-background"><div className="flex items-center gap-3 border-b border-border p-5">{view==='archived'?<Archive className="h-6 w-6 text-primary"/>:<Inbox className="h-6 w-6 text-primary"/>}<div><h2 className="text-xl font-bold">{view==='archived'?'Entregas archivadas':'Bandeja activa'}</h2><p className="text-sm text-muted-foreground">{total} resultado{total===1?'':'s'} · más recientes primero</p></div></div>
   {error?<p role="alert" className="p-5 text-sm text-destructive">No pudimos consultar las entregas. Verifica que la migración de la bandeja esté aplicada.</p>:submissions.length===0?<p className="p-8 text-center text-sm text-muted-foreground">No hay entregas que coincidan con estos filtros.</p>:<div className="divide-y divide-border">{submissions.map(item=>{const student=one(item.student),course=one(item.course),activity=one(item.activity),countFiles=item.submission_files.filter(file=>!file.file_deleted_at).length,status=submissionReviewStatus(item),reviewHref=`/admin/entregas/${item.id}/revisar?returnTo=${encodeURIComponent(currentHref)}`;return <article key={item.id} className="grid gap-3 p-5 lg:grid-cols-[1fr_1fr_1.4fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase text-muted-foreground">Estudiante</p><p className="font-semibold">{student?.full_name??'—'}</p><span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-1 text-xs font-bold">{statusLabels[status]??status}</span></div><div><p className="text-xs font-bold uppercase text-muted-foreground">Curso / grupo</p><p>{course?.title??'Sin curso base'}</p>{submissionGroupName(item)&&<p className="mt-1 text-sm text-muted-foreground">Grupo: {submissionGroupName(item)}</p>}</div><div><p className="text-xs font-bold uppercase text-muted-foreground">Actividad</p><p>{activity?.title??item.activity_id}</p><p className="mt-1 text-xs text-muted-foreground">{countFiles} archivo{countFiles===1?'':'s'} · {new Intl.DateTimeFormat('es-CR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(item.submitted_at))}</p></div><div className="flex flex-wrap gap-2 lg:justify-end"><Link href={reviewHref} className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground">Revisar</Link><form action={view==='archived'?restoreSubmission:archiveSubmission}><input type="hidden" name="submission_id" value={item.id}/><button className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-bold text-primary">{view==='archived'?<><RotateCcw className="h-4 w-4"/>Restaurar</>:<><Archive className="h-4 w-4"/>Archivar</>}</button></form></div></article>})}</div>}
  </section>
  {totalPages>1&&<nav className="mt-5 flex items-center justify-between gap-3" aria-label="Paginación de entregas"><span className="text-sm text-muted-foreground">Página {Math.min(page,totalPages)} de {totalPages}</span><div className="flex gap-2">{page>1&&<Link href={submissionInboxHref(query,{page:String(page-1)})} className="rounded-xl border px-4 py-2 text-sm font-bold">Anterior</Link>}{page<totalPages&&<Link href={submissionInboxHref(query,{page:String(page+1)})} className="rounded-xl border px-4 py-2 text-sm font-bold">Siguiente</Link>}</div></nav>}
 </AccountShell>
}

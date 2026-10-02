import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, LockKeyhole } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { PublicGroupEnrollmentForm } from '@/components/account/public-group-enrollment-form'
import { isAcademicProfileComplete, type AcademicProfile } from '@/lib/academic'
import { requireAccount } from '@/lib/auth/session'
import { resolveLiveGroupCover } from '@/lib/live-groups'
import { createClient } from '@/lib/supabase/server'

export const metadata={title:'Inscripción a grupo | C.O.A'}
export default async function PublicGroupEnrollmentPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{estado?:string}>}){
  const{slug}=await params,{estado}=await searchParams
  const{user,profile:account}=await requireAccount();if(account.role==='admin')redirect('/admin/grupos')
  const supabase=await createClient()
  const{data:group}=await supabase.from('live_groups').select('id,slug,name,starts_on,image_path,public_summary,courses(title)').eq('slug',slug).eq('access_type','public').eq('status','active').maybeSingle()
  if(!group)notFound()
  const[{data:profile},{data:membership}]=await Promise.all([
    supabase.from('profiles').select('id,full_name,identification,country,phone').eq('id',user.id).single<AcademicProfile>(),
    supabase.from('live_group_members').select('group_id').eq('group_id',group.id).eq('student_id',user.id).maybeSingle(),
  ])
  if(!profile)return <AccountShell title="Inscripción no disponible" eyebrow="Grupo público"><p role="alert">No pudimos consultar tu perfil académico.</p></AccountShell>
  const course=Array.isArray(group.courses)?group.courses[0]:group.courses
  const image=await resolveLiveGroupCover(supabase,group.image_path)
  if(membership||estado==='inscrito')return <AccountShell title={group.name} eyebrow="Grupo público"><div className="max-w-2xl rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/35 p-6 text-emerald-950 dark:text-emerald-100"><CheckCircle2 className="h-8 w-8 text-emerald-700"/><h2 className="mt-4 text-xl font-bold">Inscripción completada</h2><p className="mt-2 text-sm">Ya tienes acceso a este grupo en vivo.</p><Link href={`/mi-coa/grupos/${slug}`} className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Entrar al grupo</Link></div></AccountShell>
  return <AccountShell title={group.name} eyebrow="Confirmar inscripción"><div className="grid max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-[1fr_1.1fr]">{image&&<div className="relative min-h-60 bg-secondary"><Image src={image} alt={`Portada de ${group.name}`} fill className="object-cover"/></div>}<div className="p-6 sm:p-8">{course&&<p className="text-sm font-semibold text-primary">{course.title}</p>}{group.public_summary&&<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{group.public_summary}</p>}<div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4 shrink-0 text-primary"/>Al confirmar se activa tu membresía en este grupo público{course?' y la matrícula del curso asociado':''}.</div><PublicGroupEnrollmentForm groupId={group.id} slug={slug} profile={profile} profileComplete={isAcademicProfileComplete(profile)}/></div></div></AccountShell>
}

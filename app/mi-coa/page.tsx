import Link from 'next/link'
import { ArrowRight, BookOpen, FolderKanban, ShieldCheck, UserRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAccount } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { enrollmentStatusLabel } from '@/lib/academic'
import { dashboardEnrollments, getCurrentStudentEnrollments } from '@/lib/student-enrollments'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Mi COA | C.O.A' }

export default async function StudentDashboard({ searchParams }: { searchParams: Promise<{ 'sin-permiso'?: string; 'sin-acceso'?: string; inscripcion?: string }> }) {
  const { profile, user } = await requireAccount()
  if (profile.role === 'admin') redirect('/admin')
  const params = await searchParams
  const result = await getCurrentStudentEnrollments()
  const enrollments = result.enrollments
  const error = result.status === 'error'
  const supabase=await createClient()
  const{data:groupMemberships}=await supabase.from('live_group_members').select('group_id,joined_at,live_groups!inner(slug,name,status,courses(id,title))').eq('student_id',user.id).in('live_groups.status',['active','finished']).order('joined_at',{ascending:false})
  const activeLiveGroupCourseIds=new Set((groupMemberships??[]).flatMap(membership=>{const group=Array.isArray(membership.live_groups)?membership.live_groups[0]:membership.live_groups;const course=Array.isArray(group?.courses)?group.courses[0]:group?.courses;return group?.status==='active'&&course?.id?[course.id]:[]}))
  const visibleEnrollments=dashboardEnrollments(enrollments,activeLiveGroupCourseIds)
  return (
    <AccountShell title={`Hola, ${profile.full_name}`} eyebrow="Panel del estudiante">
      <section className="mb-8 rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm md:flex md:items-center md:justify-between md:gap-8 md:p-8"><div><h2 className="text-2xl font-extrabold">Continúa con tu aprendizaje</h2><p className="mt-2 max-w-2xl text-sm text-primary-foreground/85 md:text-base">Continúa aprendiendo o revisa tus cursos y actividades.</p></div><Link href="#mis-cursos" className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-background px-5 font-bold text-primary md:mt-0">Ver mis cursos <ArrowRight className="h-5 w-5"/></Link></section>
      {params['sin-permiso'] && <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/35 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">No tienes permisos para acceder al panel de administración.</div>}
      {params['sin-acceso'] && <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/35 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">No tienes una matrícula activa para acceder a ese curso.</div>}
      {params.inscripcion && <div role="status" className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/35 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">Tu inscripción se completó correctamente. El curso ya está disponible en Mi COA.</div>}
      <section className="mt-8 scroll-mt-24" aria-labelledby="mis-cursos">
        <div className="flex items-center gap-3"><BookOpen className="h-7 w-7 text-primary" /><h2 id="mis-cursos" className="text-2xl font-extrabold">Mis cursos</h2></div>
        {error ? <p role="alert" className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">No pudimos cargar tus cursos en este momento.</p> : visibleEnrollments.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-8 text-center"><p className="font-bold">{enrollments.length?'Tus cursos en vivo están disponibles en sus grupos.':'Todavía no tienes cursos matriculados.'}</p><p className="mt-2 text-sm text-muted-foreground">{enrollments.length?'Continúa desde la sección Mis grupos en vivo.':'Explora el catálogo y elige el próximo curso que quieres aprender.'}</p>{!enrollments.length&&<Link href="/#cursos" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Explorar cursos</Link>}</div> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEnrollments.map((enrollment) => enrollment.courses && <article key={enrollment.id} className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-primary">{enrollmentStatusLabel(enrollment.status)}</p><h3 className="mt-2 text-lg font-bold">{enrollment.courses.title}</h3>{enrollment.courses.delivery_mode==='live_group'?<div className="mt-5 rounded-xl bg-amber-50 dark:bg-amber-950/35 p-3 text-sm text-amber-900 dark:text-amber-100"><strong className="block">Inscripción recibida</strong><span>Pendiente de asignación a grupo.</span></div>:<><div className="mt-5 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">Progreso disponible próximamente</div><Link href={`/mi-coa/cursos/${enrollment.courses.slug}`} className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Ver curso</Link></>}</article>)}
        </div>}
      </section>
      <section className="mt-10" aria-labelledby="mis-grupos"><div className="flex items-center gap-3"><BookOpen className="h-7 w-7 text-primary"/><h2 id="mis-grupos" className="text-2xl font-extrabold">Mis grupos en vivo</h2></div>{!groupMemberships?.length?<p className="mt-5 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">Todavía no perteneces a un grupo en vivo.</p>:<div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{groupMemberships.map(membership=>{const group=Array.isArray(membership.live_groups)?membership.live_groups[0]:membership.live_groups;return group&&<article key={membership.group_id} className="rounded-2xl border border-border bg-background p-6"><p className="text-xs font-bold uppercase text-primary">{group.courses?.[0]?.title??'Curso en vivo'}</p><h3 className="mt-2 text-lg font-bold">{group.name}</h3><Link href={`/mi-coa/grupos/${group.slug}`} className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Ver grupo</Link></article>})}</div>}</section>
      <section className="mt-12 border-t border-border pt-8" aria-label="Cuenta"><h2 className="text-lg font-bold">Cuenta</h2><div className="mt-4 grid gap-4 md:grid-cols-3"><article className="rounded-2xl border border-border bg-background p-5"><UserRound className="h-6 w-6 text-primary"/><h3 className="mt-3 font-bold">Tu perfil</h3><p className="mt-2 text-sm text-muted-foreground">{user.email}</p></article><article className="rounded-2xl border border-border bg-background p-5"><FolderKanban className="h-6 w-6 text-primary"/><h3 className="mt-3 font-bold">Mis proyectos</h3><p className="mt-2 text-sm text-muted-foreground">Consulta tus publicaciones y estados.</p><Link href="/mi-coa/proyectos" className="mt-3 inline-flex text-sm font-bold text-primary">Ver mis proyectos</Link></article><article className="rounded-2xl border border-border bg-background p-5"><ShieldCheck className="h-6 w-6 text-primary"/><h3 className="mt-3 font-bold">Cuenta protegida</h3><p className="mt-2 text-sm text-muted-foreground">Tu sesión se mantiene de forma segura mediante cookies del servidor.</p></article></div></section>
    </AccountShell>
  )
}

import Link from 'next/link'
import { BookOpen, ShieldCheck, UserRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAccount } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { enrollmentStatusLabel } from '@/lib/academic'
import { getCurrentStudentEnrollments } from '@/lib/student-enrollments'

export const metadata = { title: 'Mi COA | C.O.A' }

export default async function StudentDashboard({ searchParams }: { searchParams: Promise<{ 'sin-permiso'?: string; 'sin-acceso'?: string; inscripcion?: string }> }) {
  const { profile, user } = await requireAccount()
  if (profile.role === 'admin') redirect('/admin')
  const params = await searchParams
  const result = await getCurrentStudentEnrollments()
  const enrollments = result.enrollments
  const error = result.status === 'error'
  return (
    <AccountShell title={`Hola, ${profile.full_name}`} eyebrow="Panel del estudiante">
      {params['sin-permiso'] && <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">No tienes permisos para acceder al panel de administración.</div>}
      {params['sin-acceso'] && <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">No tienes una matrícula activa para acceder a ese curso.</div>}
      {params.inscripcion && <div role="status" className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Tu inscripción se completó correctamente. El curso ya está disponible en Mi COA.</div>}
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-background p-6"><UserRound className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Tu perfil</h2><p className="mt-2 text-sm text-muted-foreground">{user.email}</p><p className="mt-1 text-sm text-muted-foreground">Rol: Estudiante</p></article>
        <article className="rounded-2xl border border-border bg-background p-6"><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Cuenta protegida</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tu sesión se mantiene de forma segura mediante cookies del servidor.</p></article>
      </div>
      <section className="mt-10" aria-labelledby="mis-cursos">
        <div className="flex items-center gap-3"><BookOpen className="h-7 w-7 text-primary" /><h2 id="mis-cursos" className="text-2xl font-extrabold">Mis cursos</h2></div>
        {error ? <p role="alert" className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">No pudimos cargar tus cursos en este momento.</p> : enrollments.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-8 text-center"><p className="font-bold">Todavía no tienes cursos matriculados.</p><p className="mt-2 text-sm text-muted-foreground">Explora el catálogo y elige el próximo curso que quieres aprender.</p><Link href="/#cursos" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Explorar cursos</Link></div> : <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => enrollment.courses && <article key={enrollment.id} className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-primary">{enrollmentStatusLabel(enrollment.status)}</p><h3 className="mt-2 text-lg font-bold">{enrollment.courses.title}</h3><div className="mt-5 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">Progreso disponible próximamente</div><Link href={`/mi-coa/cursos/${enrollment.courses.slug}`} className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">Ver curso</Link></article>)}
        </div>}
      </section>
    </AccountShell>
  )
}

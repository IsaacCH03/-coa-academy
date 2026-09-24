import Link from 'next/link'
import { BookOpen, Inbox, ShieldCheck, UsersRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Administración | C.O.A' }

type AdminCourse = { id: string; title: string; slug: string; status: string; enrollments: { count: number }[] }

export default async function AdminDashboard() {
  const { profile } = await requireAdmin()
  const supabase = await createClient()
  const [{ count }, { data: courseData, error: coursesError }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('id, title, slug, status, enrollments(count)').order('title'),
  ])
  const courses = (courseData ?? []) as unknown as AdminCourse[]
  return (
    <AccountShell title={`Bienvenido, ${profile.full_name}`} eyebrow="Panel de administración">
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-background p-6"><UsersRound className="h-7 w-7 text-primary" /><p className="mt-4 text-3xl font-extrabold">{count ?? 0}</p><h2 className="mt-1 font-bold">Perfiles registrados</h2><p className="mt-2 text-sm text-muted-foreground">Vista inicial de cuentas de estudiantes y administradores.</p></article>
        <article className="rounded-2xl border border-border bg-background p-6"><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Acceso administrativo</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Esta ruta valida el rol en el servidor antes de mostrar cualquier información.</p></article>
      </div>
      <Link href="/admin/entregas" className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/25 bg-background p-5 transition hover:border-primary/50"><Inbox className="h-7 w-7 text-primary" /><div><h2 className="font-bold">Entregas académicas</h2><p className="text-sm text-muted-foreground">Consultar y descargar los archivos enviados por estudiantes.</p></div></Link>
      <section className="mt-10" aria-labelledby="admin-courses">
        <div className="flex items-center gap-3"><BookOpen className="h-7 w-7 text-primary" /><h2 id="admin-courses" className="text-2xl font-extrabold">Cursos</h2></div>
        {coursesError ? <p role="alert" className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">No pudimos cargar los cursos. Verifica que la migración de Fase 2 esté aplicada.</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => <Link key={course.id} href={`/admin/cursos/${course.slug}`} className="rounded-2xl border border-border bg-background p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"><div className="flex items-start justify-between gap-3"><h3 className="font-bold">{course.title}</h3><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">{course.status}</span></div><p className="mt-4 text-2xl font-extrabold text-primary">{course.enrollments[0]?.count ?? 0}</p><p className="text-sm text-muted-foreground">estudiantes matriculados</p></Link>)}
        </div>}
      </section>
    </AccountShell>
  )
}

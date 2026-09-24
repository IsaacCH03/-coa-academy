import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { enrollmentStatusLabel, type EnrollmentStatus } from '@/lib/academic'
import { requireAdmin } from '@/lib/auth/session'
import { courseContentPath } from '@/lib/course-access'
import { createClient } from '@/lib/supabase/server'

type AdminEnrollment = { id: string; student_id: string; status: EnrollmentStatus; enrolled_at: string; profiles: { full_name: string; identification: string | null; country: string | null; phone: string | null } | null }

export default async function AdminCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await requireAdmin()
  const supabase = await createClient()
  const { data: course } = await supabase.from('courses').select('id, title, slug, status').eq('slug', slug).maybeSingle<{ id: string; title: string; slug: string; status: string }>()
  if (!course) notFound()
  const { data, error } = await supabase.from('enrollments').select('id, student_id, status, enrolled_at, profiles!enrollments_student_id_fkey(full_name, identification, country, phone)').eq('course_id', course.id).order('enrolled_at', { ascending: false })
  const enrollments = (data ?? []) as unknown as AdminEnrollment[]
  const contentPath = courseContentPath(slug)
  return <AccountShell title={course.title} eyebrow="Administración del curso">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Link href="/admin" className="text-sm font-bold text-primary hover:underline">← Volver al panel</Link><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase text-muted-foreground">{course.status}</span></div>
    {contentPath && <Link href={contentPath} className="mb-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Ver contenido académico</Link>}
    <section className="overflow-hidden rounded-2xl border border-border bg-background"><div className="border-b border-border p-5"><h2 className="text-xl font-bold">Estudiantes matriculados</h2><p className="mt-1 text-sm text-muted-foreground">{enrollments.length} matrículas registradas</p></div>
      {error ? <p role="alert" className="p-5 text-sm text-destructive">No pudimos consultar las matrículas.</p> : enrollments.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">Este curso todavía no tiene estudiantes matriculados.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="bg-secondary text-xs uppercase text-muted-foreground"><tr><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">Identificación</th><th className="px-5 py-3">País</th><th className="px-5 py-3">Teléfono</th><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3">Acción</th></tr></thead><tbody>{enrollments.map((enrollment) => <tr key={enrollment.id} className="border-t border-border"><td className="px-5 py-4 font-semibold">{enrollment.profiles?.full_name ?? 'Perfil no disponible'}</td><td className="px-5 py-4">{enrollment.profiles?.identification ?? '—'}</td><td className="px-5 py-4">{enrollment.profiles?.country ?? '—'}</td><td className="px-5 py-4">{enrollment.profiles?.phone ?? '—'}</td><td className="px-5 py-4">{new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(enrollment.enrolled_at))}</td><td className="px-5 py-4">{enrollmentStatusLabel(enrollment.status)}</td><td className="px-5 py-4"><Link href={`/admin/cursos/${slug}/estudiantes/${enrollment.student_id}`} className="font-bold text-primary hover:underline">Ver estudiante</Link></td></tr>)}</tbody></table></div>}
    </section>
  </AccountShell>
}

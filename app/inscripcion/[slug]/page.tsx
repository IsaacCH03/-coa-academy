import Link from 'next/link'
import { CheckCircle2, LockKeyhole } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { EnrollmentForm } from '@/components/account/enrollment-form'
import { isAcademicProfileComplete, type AcademicProfile } from '@/lib/academic'
import { requireAccount } from '@/lib/auth/session'
import { courseContentPath } from '@/lib/course-access'
import { getCourse } from '@/lib/courses'
import { createClient } from '@/lib/supabase/server'
import { createWhatsAppLink } from '@/lib/site'

export const metadata = { title: 'Inscripción | C.O.A' }

export default async function EnrollmentPage({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ estado?: string }>
}) {
  const { slug } = await params
  const courseDefinition = getCourse(slug)
  const contentPath = courseContentPath(slug)
  if (!courseDefinition || courseDefinition.comingSoon) notFound()

  const { user, profile: accountProfile } = await requireAccount()
  if (accountProfile.role === 'admin') redirect(contentPath ?? '/admin/grupos')
  const query = await searchParams
  const supabase = await createClient()
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, slug, status, delivery_mode')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle<{ id: string; title: string; slug: string; status: string; delivery_mode: 'self_paced'|'live_group' }>()

  if (courseError) console.error('[course-enrollment]', { operation: 'load-course', slug, code: courseError.code, message: courseError.message, details: courseError.details, hint: courseError.hint })
  if (courseError || !course) return <AccountShell title="Inscripción no disponible" eyebrow="Matrícula"><p role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">No pudimos cargar la información de matrícula de este curso. Inténtalo nuevamente; si el problema continúa, comunícate con COA.</p></AccountShell>
  if (course.delivery_mode === 'self_paced' && !contentPath) notFound()

  const [{ data: profile, error: profileError }, { data: enrollment }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, identification, country, phone').eq('id', user.id).single<AcademicProfile>(),
    supabase.from('enrollments').select('id, status').eq('student_id', user.id).eq('course_id', course.id).maybeSingle<{ id: string; status: string }>(),
  ])

  if (profileError || !profile) return <AccountShell title="Inscripción no disponible" eyebrow="Matrícula"><p role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">No pudimos consultar tu perfil académico.</p></AccountShell>

  if (enrollment || query.estado === 'ya-inscrito') return <AccountShell title={course.title} eyebrow="Matrícula">
    <div className="max-w-2xl rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-950">
      <CheckCircle2 className="h-8 w-8 text-emerald-700" /><h2 className="mt-4 text-xl font-bold">{course.delivery_mode==='live_group'?'Inscripción recibida':'Ya estás inscrito en este curso.'}</h2>
      <p className="mt-2 text-sm leading-relaxed">{course.delivery_mode==='live_group'?`Ya registramos tu inscripción a ${course.title}. Asegúrate de completar el proceso de pago. Cuando confirmemos tu ingreso, te agregaremos al grupo correspondiente y podrás acceder desde COA.`:'Puedes abrirlo desde tu panel de estudiante.'}</p>
      <div className="mt-5 flex flex-wrap gap-3">{course.delivery_mode==='live_group'?<><a href={createWhatsAppLink(`Hola, completé mi inscripción a ${course.title} y deseo confirmar el proceso.`)} target="_blank" rel="noreferrer" className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Hablar por WhatsApp</a><Link href="/" className="inline-flex rounded-xl border border-emerald-700/30 px-4 py-2 text-sm font-bold">Volver al inicio</Link></>:<><Link href={`/mi-coa/cursos/${slug}`} className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Ir al curso</Link><Link href="/mi-coa" className="inline-flex rounded-xl border border-emerald-700/30 px-4 py-2 text-sm font-bold">Ir a Mi COA</Link></>}</div>
    </div>
  </AccountShell>

  const complete = isAcademicProfileComplete(profile)
  return <AccountShell title={course.title} eyebrow="Confirmar inscripción">
    <div className="max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold">{complete ? 'Confirma tu matrícula' : 'Completa tu perfil académico'}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{complete ? 'Revisa el curso seleccionado y confirma para agregarlo inmediatamente a Mi COA.' : 'Necesitamos estos datos mínimos antes de matricularte. Podrás reutilizarlos en futuras inscripciones.'}</p>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Tu identificación, país y teléfono son privados. Solo tú y los administradores autorizados pueden consultarlos.</div>
      <EnrollmentForm slug={slug} profileComplete={complete} profile={profile} />
    </div>
  </AccountShell>
}

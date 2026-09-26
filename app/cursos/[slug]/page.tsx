import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  BookOpen,
  BarChart3,
  User,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { getCurrentAccount } from '@/lib/auth/session'
import { courseContentPath } from '@/lib/course-access'
import { courseEnrollmentHref, courses, getCourse, usesWhatsAppEnrollment } from '@/lib/courses'
import { createPublicMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) return { title: 'Curso no encontrado | C.O.A' }
  return createPublicMetadata({
    title: course.seoTitle ?? `${course.title} | C.O.A`,
    description: course.seoDescription ?? course.short,
    path: `/cursos/${encodeURIComponent(course.slug)}`,
  })
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (slug === 'marketing-digital') {
    redirect('/cursos/python-nivel-1')
  }
  if (slug === 'desarrollo-web') {
    redirect('/cursos/desarrollo-web-moderno')
  }
  if (slug === 'diseno-grafico') {
    redirect('/cursos/desarrollo-web-moderno')
  }
  if (slug === 'finanzas') {
    redirect('/cursos/python-intermedio')
  }
  if (slug === 'ingles') {
    redirect('/cursos/python-practico')
  }
  if (slug === 'excel') {
    redirect('/cursos/sql-bases-datos')
  }

  const course = getCourse(slug)
  if (!course) notFound()
  if (course.comingSoon) notFound()
  const account = await getCurrentAccount()
  const contentPath = courseContentPath(slug)
  const adminContentPath = account?.profile.role === 'admin' ? contentPath : null
  const whatsappEnrollment = usesWhatsAppEnrollment(course)
  const enrollmentHref = courseEnrollmentHref(course)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Encabezado del curso */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
            <Link
              href="/#cursos"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a los cursos
            </Link>

            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {course.category}
                </span>
                <h1 className="text-balance text-3xl font-extrabold md:text-4xl">
                  {course.title}
                </h1>
                <p className="text-pretty leading-relaxed text-primary-foreground/85">
                  {course.detailShort ?? course.short}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/85">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-accent" />
                    {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-accent" />
                    {course.modality ?? `${course.lessons} lecciones`}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-primary-foreground/20">
                <Image
                  src={course.image || '/placeholder.svg'}
                  alt={`Portada del curso ${course.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="flex flex-col gap-10 lg:col-span-2">
              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-foreground">
                  Descripción del curso
                </h2>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-foreground">
                  Lo que aprenderás
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {course.learn.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-secondary text-primary">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {course.modules.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-extrabold text-foreground">
                    Temario
                  </h2>
                  <ol className="flex flex-col gap-3">
                    {course.modules.map((mod, i) => (
                      <li
                        key={mod.title}
                        className="flex gap-4 rounded-2xl border border-border bg-card p-5"
                      >
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-card-foreground">{mod.title}</h3>
                          {mod.detail && (
                            <p className="text-sm text-muted-foreground">{mod.detail}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Tarjeta lateral */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-primary">
                    {course.price}
                  </span>
                  {course.billing !== null && (
                    <span className="pb-1 text-sm text-muted-foreground">
                      {course.billing ?? 'pago único'}
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-3 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Duración: {course.duration}
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {course.modality
                      ? `Modalidad: ${course.modality}`
                      : `${course.lessons} lecciones`}
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    {course.level.startsWith('Nivel ')
                      ? course.level
                      : `Nivel: ${course.level}`}
                  </li>
                  <li className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Instructor: {course.instructor}
                  </li>
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full gap-2 bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Link href={adminContentPath ?? enrollmentHref} target={!adminContentPath && whatsappEnrollment ? '_blank' : undefined} rel={!adminContentPath && whatsappEnrollment ? 'noopener noreferrer' : undefined}>{adminContentPath ? 'Ver curso' : 'Inscribirme'}</Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">{adminContentPath ? 'Acceso de inspección administrativa.' : whatsappEnrollment ? 'Coordina tu inscripción directamente con COA por WhatsApp.' : 'Inicia sesión o crea tu cuenta para continuar.'}</p>
              </div>
            </aside>
          </div>

          {/* Otros cursos */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-extrabold text-foreground">
              Otros cursos que te pueden interesar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((c) => c.slug !== course.slug && !c.comingSoon)
                .slice(0, 3)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cursos/${c.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl">
                      <Image
                        src={c.image || '/placeholder.svg'}
                        alt={`Portada del curso ${c.title}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.category}</p>
                      <p className="font-semibold text-card-foreground group-hover:text-primary">
                        {c.title}
                      </p>
                      <p className="text-sm font-bold text-primary">{c.price}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

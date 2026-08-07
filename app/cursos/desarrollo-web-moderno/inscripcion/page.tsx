import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ClipboardCheck, FileText, GraduationCap, Users } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Inscripción a Desarrollo Web Moderno | C.O.A.',
  description:
    'Complete el formulario de inscripción antes de comenzar el curso gratuito de Desarrollo Web Moderno.',
}

const registrationBenefits = [
  { icon: Users, text: 'Registrar su participación' },
  { icon: ClipboardCheck, text: 'Llevar el control del curso' },
  { icon: GraduationCap, text: 'Preparar la emisión del certificado' },
]

export default function ModernWebCourseRegistrationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium">
              <FileText className="h-4 w-4 text-accent" />
              Antes de comenzar
            </span>
            <h1 className="text-balance text-3xl font-extrabold md:text-4xl">
              Bienvenido al curso de Desarrollo Web Moderno
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-primary-foreground/85">
              Antes de comenzar el curso es necesario completar el formulario de
              inscripción.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-10">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-card-foreground">
                Complete su inscripción
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                El formulario nos permitirá registrar su participación, llevar el
                control del curso y preparar la emisión del certificado posteriormente.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {registrationBenefits.map((benefit) => (
                <div
                  key={benefit.text}
                  className="flex flex-col items-center gap-3 rounded-2xl bg-secondary p-5 text-center"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-secondary-foreground">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <a
                href="https://forms.gle/2yHe7LbXPfmAdNha9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Completar formulario
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/cursos/desarrollo-web-moderno/curso"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Continuar al curso
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

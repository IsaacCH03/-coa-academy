import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Code2,
  GraduationCap,
} from 'lucide-react'
import { CourseMarkdown } from '@/components/course-markdown'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Módulo 1: Interfaces web profesionales con HTML y CSS | C.O.A.',
  description:
    'Primer módulo del curso Desarrollo Web Moderno: HTML5, CSS3, accesibilidad, diseño responsive, Git, GitHub e Inteligencia Artificial.',
}

const moduleOneToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-la-web-y-la-preparacion-del-proyecto', label: '1. Preparación' },
  { id: '2-html5-semantico-y-accesible', label: '2. HTML5' },
  { id: '3-fundamentos-practicos-de-css3', label: '3. CSS3' },
  { id: '4-distribucion-con-flexbox-y-css-grid', label: '4. Flexbox y Grid' },
  { id: '5-diseno-adaptable-con-enfoque-mobile-first', label: '5. Responsive' },
  { id: '6-control-de-versiones-con-git-y-github', label: '6. Git y GitHub' },
  { id: '7-revision-profesional-asistida-por-inteligencia-artificial', label: '7. Revisión con IA' },
  { id: '8-mini-proyecto-tarjeta-profesional-de-un-curso', label: '8. Mini proyecto' },
  { id: '9-proyecto-del-modulo-landing-page-profesional-de-un-curso-coa', label: '9. Proyecto' },
  { id: '10-rubrica-de-evaluacion-del-proyecto', label: '10. Rúbrica' },
  { id: '11-evaluacion-del-modulo', label: '11. Evaluación' },
  { id: '12-retos-adicionales', label: '12. Retos' },
  { id: '13-videos-recomendados-del-modulo', label: '13. Videos' },
  { id: '14-documentacion-y-recursos-de-lectura', label: '14. Lecturas' },
  { id: '15-glosario', label: '15. Glosario' },
  { id: '16-resumen-del-modulo', label: '16. Resumen' },
]

const moduleOneDeliveryVariants = [
  {
    match: 'mini proyecto',
    fileName: 'Juan Pérez - Desarrollo Web - MiniProyecto.zip',
    items: [
      'Nombre completo',
      'Curso: Desarrollo Web Moderno',
      'Módulo 1',
      'Archivos HTML y CSS de la tarjeta',
      'Capturas de la tarjeta en 320 px, 768 px y 1024 px',
    ],
    title: 'Entrega del mini proyecto',
    stepLabel: 'Último paso del mini proyecto',
    description:
      'Una vez completada la tarjeta profesional, reúne los archivos y las capturas en un único archivo ZIP.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar mini proyecto',
  },
  {
    match: 'proyecto del módulo',
    fileName: 'Juan Pérez - Desarrollo Web - Proyecto Módulo 1.pdf',
    items: [
      'Nombre completo',
      'Enlace público al repositorio de GitHub',
      'Captura de la página en pantalla estrecha',
      'Captura de la página en pantalla amplia',
      'Bitácora de uso de Inteligencia Artificial',
      'Reflexión final de 100 a 180 palabras',
    ],
    title: 'Entrega del proyecto del módulo',
    stepLabel: 'Último paso del proyecto',
    description:
      'Cuando la landing page esté terminada y publicada en GitHub, reúne las evidencias en un único documento PDF.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar proyecto',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'desarrollo-web-moderno-modulo-1.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function ModernWebCourseModuleOnePage() {
  const content = getModuleContent()
  const sections = content
    .split(/(?=^#{1,2} )/gm)
    .map((section) => section.trim())
    .filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <Link
              href="/cursos/desarrollo-web-moderno"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la página del curso
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Desarrollo Web Moderno
            </p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 1: Interfaces web profesionales con HTML y CSS
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">6 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Básico</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Programación básica</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyectos</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: HTML5, CSS3, Git, GitHub, ChatGPT o Claude</p>
              <p>Resultado: Una landing page profesional, adaptable y accesible</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['9 prácticas guiadas', '1 mini proyecto', '1 proyecto de módulo', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="desarrollo-web-moderno-modulo-1"
          moduleLabel="Módulo 1"
          items={moduleOneToc}
          nextHref="/cursos/desarrollo-web-moderno/curso/modulo-2"
          nextLabel="Ir al Módulo 2"
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isMiniProject = /^# 8\./.test(heading)
              const isProject = /^# (9|10)\./.test(heading)
              const isEvaluation = /^# 11\./.test(heading)
              const isChallenge = /^# 12\./.test(heading)
              const emphasized =
                isMiniProject || isProject || isEvaluation || isChallenge

              return (
                <section
                  key={heading}
                  className={
                    emphasized
                      ? `rounded-2xl border p-6 shadow-sm md:p-7 ${
                          isChallenge
                            ? 'border-accent/50 bg-accent/5'
                            : isMiniProject || isProject
                              ? 'border-primary/30 bg-secondary/40'
                              : 'border-border bg-card'
                        }`
                      : ''
                  }
                >
                  <CourseMarkdown
                    markdown={section}
                    deliveryVariants={moduleOneDeliveryVariants}
                  />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/desarrollo-web-moderno"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Página del curso
              </Link>
              <Link
                href="/#cursos"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Ver otros cursos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

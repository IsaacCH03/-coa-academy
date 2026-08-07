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
  title: 'Módulo 5: Desarrollo profesional asistido por IA | C.O.A.',
  description:
    'Quinto módulo del curso Desarrollo Web Moderno: desarrollo, diagnóstico, revisión y documentación profesional con Inteligencia Artificial.',
}

const moduleFiveToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-modelo-profesional-de-colaboracion-con-ia', label: '1. Colaboración con IA' },
  { id: '2-herramientas-contexto-privacidad-y-seguridad', label: '2. Contexto y seguridad' },
  { id: '3-instrucciones-eficaces-para-desarrollo', label: '3. Instrucciones eficaces' },
  { id: '4-implementacion-asistida-en-cambios-controlados', label: '4. Cambios controlados' },
  { id: '5-diagnostico-y-depuracion-con-evidencias', label: '5. Diagnóstico' },
  { id: '6-revision-refactorizacion-y-optimizacion', label: '6. Revisión y mejora' },
  { id: '7-flujo-profesional-con-git-documentacion-e-instrucciones', label: '7. Flujo profesional' },
  { id: '8-mini-proyecto-rescate-de-un-selector-defectuoso', label: '8. Mini proyecto' },
  { id: '9-proyecto-del-modulo-sprint-profesional-asistido-por-ia-para-coa', label: '9. Proyecto' },
  { id: '10-evaluacion-del-modulo', label: '10. Evaluación' },
  { id: 'videos-recomendados', label: 'Videos' },
  { id: 'documentacion-y-lecturas', label: 'Lecturas' },
  { id: 'glosario', label: 'Glosario' },
  { id: 'resumen-final', label: 'Resumen' },
  { id: 'cierre-y-requisito-de-avance', label: 'Cierre' },
]

const moduleFiveDeliveryVariants = [
  {
    match: 'mini proyecto',
    fileName: 'Juan Pérez - Desarrollo Web - MiniProyecto Módulo 5.zip',
    items: [
      'Nombre completo',
      'Curso: Desarrollo Web Moderno',
      'Módulo 5',
      'Componente inicial y análisis propio',
      'Prompt de diagnóstico y resumen de la respuesta',
      'Plan final y componente corregido',
      'Tabla de pruebas',
      'Una recomendación aceptada',
      'Una recomendación modificada o rechazada',
      'Explicación de 120 a 180 palabras',
    ],
    title: 'Entrega del mini proyecto',
    stepLabel: 'Último paso del mini proyecto',
    description:
      'Una vez rescatado el selector defectuoso, reúne el análisis, las evidencias, el componente corregido y la explicación en un único ZIP.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar mini proyecto',
  },
  {
    match: 'proyecto del módulo',
    fileName: 'Juan Pérez - Desarrollo Web - Proyecto Módulo 5.pdf',
    items: [
      'Nombre completo',
      'Enlace al repositorio',
      'Enlace a una vista previa',
      'Enlace de producción',
      'Rama o solicitud de cambio utilizada',
      'Especificación inicial, plan final y árbol de componentes',
      'Explicación del flujo de estado',
      'Capturas y evidencia de navegación por teclado',
      'Tabla de pruebas, ESLint y construcción',
      'AI_LOG.md, diagnóstico y dos hallazgos corregidos',
      'Historial de commits',
      'Reflexión final de 250 a 350 palabras',
    ],
    title: 'Entrega del proyecto del módulo',
    stepLabel: 'Último paso del proyecto',
    description:
      'Cuando el sprint profesional asistido por IA esté terminado, reúne los enlaces, las decisiones y las evidencias en un único documento PDF.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar proyecto',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'desarrollo-web-moderno-modulo-5.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function ModernWebCourseModuleFivePage() {
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
              href="/cursos/desarrollo-web-moderno/curso/modulo-4"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 4
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Desarrollo Web Moderno
            </p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 5: Desarrollo profesional asistido por inteligencia artificial
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">7 horas</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Básico</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Módulos 1 al 4 completados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyectos</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: React, Next.js, Tailwind CSS, Git, GitHub, Vercel, ChatGPT, Claude y GitHub Copilot</p>
              <p>Resultado: Una mejora profesional del portal COA asistida, revisada, probada y documentada</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['Prácticas guiadas', '1 mini proyecto', '1 proyecto de módulo', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="desarrollo-web-moderno-modulo-5"
          moduleLabel="Módulo 5"
          items={moduleFiveToc}
          nextHref="/cursos/desarrollo-web-moderno/curso/modulo-6"
          nextLabel="Ir al Módulo 6"
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isMiniProject = /^# 8\./.test(heading)
              const isProject = /^# 9\./.test(heading)
              const isEvaluation = /^# 10\./.test(heading)
              const isChallenge = false
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
                    deliveryVariants={moduleFiveDeliveryVariants}
                  />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/desarrollo-web-moderno/curso/modulo-4"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 4
              </Link>
              <Link
                href="/cursos/desarrollo-web-moderno/curso/modulo-6"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Módulo 6
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

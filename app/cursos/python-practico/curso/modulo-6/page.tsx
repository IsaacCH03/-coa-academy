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
  title: 'Módulo 6: Programas robustos, modulares y documentados | C.O.A.',
  description:
    'Módulo 6 de Python Práctico: excepciones, módulos, argparse, logging y documentación profesional.',
}

const moduleSixToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'conocimientos-que-utilizaras', label: 'Conocimientos previos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-diseno-de-errores-y-excepciones', label: '1. Excepciones' },
  { id: '2-modulos-importaciones-y-espacios-de-nombres', label: '2. Módulos' },
  { id: '3-punto-de-entrada-estructura-y-documentacion', label: '3. Estructura' },
  { id: '4-interfaz-de-terminal-con-argparse', label: '4. argparse' },
  { id: '5-registro-tecnico-con-logging', label: '5. logging' },
  { id: '6-uso-profesional-de-la-documentacion', label: '6. Documentación' },
  { id: '7-practicas-guiadas', label: '7. Prácticas guiadas' },
  { id: '8-actividades-obligatorias', label: '8. Actividades' },
  { id: '9-proyecto-del-modulo-coa-toolkit', label: '9. Proyecto' },
  { id: '10-rubrica-de-evaluacion-del-proyecto', label: '10. Rúbrica' },
  { id: '11-evaluacion-del-modulo', label: '11. Evaluación' },
  { id: '12-soluciones-guiadas', label: '12. Soluciones' },
  { id: '13-retos-adicionales', label: '13. Retos' },
  { id: '14-videos-recomendados', label: '14. Videos' },
  { id: '15-documentacion-y-recursos-de-lectura', label: '15. Lecturas' },
  { id: '16-material-descargable', label: '16. Material' },
  { id: '17-errores-comunes-y-como-corregirlos', label: '17. Errores comunes' },
  { id: '18-glosario', label: '18. Glosario' },
  { id: '19-resumen-final', label: '19. Resumen' },
]

const moduleSixDelivery = [
  {
    match: 'módulo 6',
    fileName: 'juan-perez_python-practico_modulo-6.zip',
    items: [
      'Los módulos main.py, cli.py, operaciones.py, reportes.py, configuracion.py y errores.py',
      'README.md y pruebas.md',
      'Resultados de ejemplo y registro técnico',
      'Evidencias de ayuda, ejecuciones e importación segura',
    ],
    title: 'Entrega del Módulo 6',
    stepLabel: 'Último paso del módulo',
    description:
      'Cuando hayas completado las actividades, el proyecto, las pruebas y la reflexión, reúne todo en un único archivo comprimido.',
    itemsLabel: 'La entrega única debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar Módulo 6',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'python-practico-modulo-6.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function PracticalPythonModuleSixPage() {
  const content = getModuleContent()
  const sections = content
    .split(/(?=^# )/gm)
    .map((section) => section.trim())
    .filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <Link
              href="/cursos/python-practico/curso/modulo-5"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 5
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Python Práctico</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 6: Programas robustos, modulares y documentados
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">2 horas</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Intermedio</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Requisito recomendado</p>
                <p className="text-primary-foreground/80">Módulos 1 al 5 completados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Python y biblioteca estándar</p>
              <p>Resultado: Una caja de herramientas modular para terminal</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['5 prácticas guiadas', '7 actividades obligatorias', '1 proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="python-practico-modulo-6"
          moduleLabel="Módulo 6"
          items={moduleSixToc}
          completionTitle="¡Has completado el Módulo 6 de Python Práctico!"
          completionDescription="¡Felicitaciones por completar Python Práctico! Revisa tu proyecto y confirma la entrega única antes de finalizar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# 7\./.test(heading)
              const isActivities = /^# 8\./.test(heading)
              const isProject = /^# 9\./.test(heading)
              const isEvaluation = /^# (10|11)\./.test(heading)
              const isSolutions = /^# 12\./.test(heading)
              const isChallenges = /^# 13\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de las prácticas guiadas — consultar después de intentarlas
                    </summary>
                    <div className="mt-6 border-t border-border pt-6">
                      <CourseMarkdown markdown={section} deliveryVariants={moduleSixDelivery} />
                    </div>
                  </details>
                )
              }

              return (
                <section
                  key={heading}
                  className={
                    emphasized
                      ? `rounded-2xl border p-6 shadow-sm md:p-7 ${
                          isChallenges
                            ? 'border-accent/50 bg-accent/5'
                            : isProject || isActivities
                              ? 'border-primary/30 bg-secondary/40'
                              : 'border-border bg-card'
                        }`
                      : ''
                  }
                >
                  <CourseMarkdown markdown={section} deliveryVariants={moduleSixDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/python-practico/curso/modulo-5"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 5
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

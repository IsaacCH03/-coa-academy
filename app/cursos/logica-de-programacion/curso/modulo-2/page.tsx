import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, GraduationCap, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseMarkdown } from '@/components/course-markdown'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Módulo 2: Datos, variables y operaciones | C.O.A.',
  description:
    'Módulo 2 del curso de Lógica de Programación: Datos, variables y operaciones.',
}

const moduleTwoToc: ModuleTocItem[] = [
  { id: '1-objetivo-del-modulo', label: 'Objetivo' },
  { id: '2-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: 'parte-1-activacion', label: 'Parte 1: Activación' },
  { id: 'parte-2-datos-y-variables', label: 'Parte 2: Datos y variables' },
  { id: 'parte-3-asignacion-entrada-y-salida', label: 'Parte 3: Entrada y salida' },
  { id: 'parte-4-clases-de-datos-y-nombres-claros', label: 'Parte 4: Clases de datos' },
  { id: 'parte-5-operaciones-y-comparaciones', label: 'Parte 5: Operaciones' },
  { id: 'parte-6-ejemplos-resueltos', label: 'Parte 6: Ejemplos' },
  { id: 'parte-7-errores-comunes', label: 'Parte 7: Errores comunes' },
  { id: 'parte-8-actividad-sin-computadora', label: 'Actividad práctica' },
  { id: 'parte-9-ejercicios', label: 'Ejercicios' },
  { id: 'parte-10-retos', label: 'Retos' },
  { id: 'parte-11-mini-proyecto', label: 'Mini proyecto' },
  { id: 'parte-13-evaluacion', label: 'Evaluación' },
  { id: 'parte-14-recursos', label: 'Videos y lecturas' },
  { id: 'parte-15-glosario', label: 'Glosario' },
  { id: 'parte-16-cierre', label: 'Resumen y cierre' },
]

function getVisibleModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'modulo-2.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## 1. Objetivo del módulo')
  const solutionsStart = source.indexOf('# PARTE 12 — SOLUCIONES EXPLICADAS')
  const evaluationStart = source.indexOf('# PARTE 13 — EVALUACIÓN')
  const answersStart = source.indexOf('## 59. Respuestas de la evaluación')
  const selfEvaluationStart = source.indexOf('## 60. Autoevaluación')

  const beforeSolutions = source.slice(contentStart, solutionsStart)
  const evaluationWithoutAnswers =
    source.slice(evaluationStart, answersStart) +
    source.slice(selfEvaluationStart)

  return beforeSolutions + evaluationWithoutAnswers
}

export default function LogicCourseModuleTwoPage() {
  const content = getVisibleModuleContent()
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
              href="/cursos/logica-de-programacion/curso"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 1
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Lógica de Programación
            </p>
            <h1 className="max-w-3xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 2: Datos, variables y operaciones
            </h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración obligatoria</p>
                <p className="text-primary-foreground/80">2 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Principiante absoluto</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Módulo 1 aprobado</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Lightbulb className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">
                  Práctica, independiente de cualquier lenguaje
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Materiales: Papel, lápiz y calculadora sencilla opcional</p>
              <p>Herramientas opcionales: PSeInt o un editor de texto</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['7 ejercicios', '2 retos', '1 mini proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="logica-programacion-modulo-2"
          moduleLabel="Módulo 2"
          items={moduleTwoToc}
          nextHref="/cursos/logica-de-programacion/curso/modulo-3"
          nextLabel="Ir al Módulo 3"
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isExercise = /^## \d+\. Ejercicio \d+/i.test(heading)
              const isChallenge = /^## \d+\. Reto \d+/i.test(heading)
              const isMiniProject = /^## 4[2-6]\./.test(heading)
              const isEvaluation = /^## 58\./.test(heading)
              const emphasized = isExercise || isChallenge || isMiniProject || isEvaluation

              return (
                <section
                  key={heading}
                  className={
                    emphasized
                      ? `rounded-2xl border p-6 shadow-sm md:p-7 ${
                          isChallenge
                            ? 'border-accent/50 bg-accent/5'
                            : isMiniProject
                              ? 'border-primary/30 bg-secondary/40'
                              : 'border-border bg-card'
                        }`
                      : ''
                  }
                >
                  <CourseMarkdown markdown={section} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Button asChild className="gap-2 bg-primary font-semibold hover:bg-primary/90">
                <Link href="/cursos/logica-de-programacion/curso">
                  <ArrowLeft className="h-4 w-4" />
                  Módulo 1
                </Link>
              </Button>
              <Button
                asChild
                className="gap-2 bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/cursos/logica-de-programacion">
                  Volver a la página del curso
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

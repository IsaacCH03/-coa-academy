import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, GraduationCap, Lightbulb } from 'lucide-react'
import { CourseMarkdown } from '@/components/course-markdown'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Módulo 6: Proyecto final | C.O.A.',
  description:
    'Proyecto final del curso de Lógica de Programación: sistema de pedidos para la Cafetería COA.',
}

const moduleSixToc: ModuleTocItem[] = [
  { id: '1-objetivo-del-modulo', label: 'Objetivo' },
  { id: '2-resultado-final', label: 'Resultado final' },
  { id: '3-distribucion-exacta-del-tiempo', label: 'Distribución del tiempo' },
  { id: 'parte-1-preparacion', label: 'Parte 1: Preparación' },
  { id: 'parte-2-situacion-del-proyecto', label: 'Parte 2: Situación' },
  { id: 'parte-3-cinco-ejercicios-preparatorios', label: 'Ejercicios preparatorios' },
  { id: 'parte-4-diseno-del-proyecto', label: 'Parte 4: Diseño' },
  { id: 'parte-5-pseudocodigo', label: 'Parte 5: Pseudocódigo' },
  { id: 'parte-6-diagrama-de-flujo', label: 'Parte 6: Diagrama' },
  { id: 'parte-7-plan-de-pruebas', label: 'Parte 7: Pruebas' },
  { id: 'parte-8-reto-opcional', label: 'Reto opcional' },
  { id: 'parte-9-entregable-final', label: 'Entrega final' },
  { id: 'parte-11-evaluacion-final', label: 'Evaluación final' },
  { id: 'parte-12-documentacion-y-recursos', label: 'Recursos' },
  { id: 'parte-13-cierre-del-curso', label: 'Cierre del curso' },
]

const moduleSixDelivery = {
  fileName: 'Modulo6_ProyectoFinal_Nombre_Apellido.pdf',
  items: [
    'Nombre completo',
    'Nombre del curso',
    'Módulo 6 — Proyecto final',
    'Todas las secciones obligatorias del proyecto',
    'Pseudocódigo, diagrama, pruebas y reflexión claramente legibles',
  ],
}

function getVisibleModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'modulo-6.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## 1. Objetivo del módulo')
  const solutionsStart = source.indexOf('# PARTE 10 — SOLUCIÓN DE REFERENCIA')
  const evaluationStart = source.indexOf('# PARTE 11 — EVALUACIÓN FINAL')
  const answersStart = source.indexOf('## 52. Respuestas')
  const selfEvaluationStart = source.indexOf('## 53. Autoevaluación final')

  const beforeSolutions = source.slice(contentStart, solutionsStart)
  const evaluationWithoutAnswers =
    source.slice(evaluationStart, answersStart) +
    source.slice(selfEvaluationStart)

  return beforeSolutions + evaluationWithoutAnswers
}

export default function LogicCourseModuleSixPage() {
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
              href="/cursos/logica-de-programacion/curso/modulo-5"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 5
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Lógica de Programación</p>
            <h1 className="max-w-3xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 6: Proyecto final — Sistema de pedidos para una cafetería
            </h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración obligatoria</p>
                <p className="text-primary-foreground/80">3 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Principiante absoluto</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Módulos 1, 2, 3, 4 y 5 aprobados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Lightbulb className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Proyecto práctico e independiente de cualquier lenguaje</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Entrega: Un único archivo con todo el proyecto</p>
              <p>Materiales: Papel, lápiz y calculadora sencilla</p>
              <p>Herramientas opcionales: Editor de texto, PSeInt y diagrams.net</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['5 ejercicios', '1 reto opcional', '1 proyecto final', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="logica-programacion-modulo-6"
          moduleLabel="Módulo 6"
          items={moduleSixToc}
          completionTitle="¡Felicidades, completaste el curso!"
          completionDescription="Has finalizado Lógica de Programación. Recibirás tu certificado de participación por medio del correo electrónico en un plazo de 4 días."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isExercise = /^## \d+\. Ejercicio \d+/i.test(heading)
              const isChallenge = /^## 34\./.test(heading)
              const isMiniProject = /^## (3[5-9]|40)\./.test(heading)
              const isEvaluation = /^## 51\./.test(heading)
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
                  <CourseMarkdown markdown={section} delivery={moduleSixDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/logica-de-programacion/curso/modulo-5"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 5
              </Link>
              <Link
                href="/cursos/logica-de-programacion"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Volver a la página del curso
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

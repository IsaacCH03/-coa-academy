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
  title: 'Módulo 1: Texto profesional y funciones integradas | C.O.A.',
  description:
    'Módulo 1 de Python Práctico: métodos de cadenas, funciones integradas, formato, validación y expresiones regulares esenciales.',
}

const moduleOneToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'antes-de-comenzar', label: 'Antes de comenzar' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-diagnosticar-antes-de-transformar', label: '1. Diagnóstico' },
  { id: '2-metodos-profesionales-de-cadenas', label: '2. Cadenas' },
  { id: '3-formato-y-caracteres-invisibles', label: '3. Formato' },
  { id: '4-funciones-integradas-de-alto-valor', label: '4. Funciones integradas' },
  { id: '5-expresiones-regulares-esenciales', label: '5. Expresiones regulares' },
  { id: '6-practicas-guiadas', label: '6. Prácticas guiadas' },
  { id: '7-actividades-obligatorias', label: '7. Actividades' },
  { id: '8-proyecto-del-modulo-normalizador-y-auditor-de-registros', label: '8. Proyecto' },
  { id: '9-rubrica-de-evaluacion-del-proyecto', label: '9. Rúbrica' },
  { id: '10-evaluacion-del-modulo', label: '10. Evaluación' },
  { id: '11-soluciones-de-las-practicas-guiadas', label: '11. Soluciones' },
  { id: '12-retos-adicionales', label: '12. Retos' },
  { id: '13-videos-recomendados', label: '13. Videos' },
  { id: '14-documentacion-y-recursos-de-lectura', label: '14. Lecturas' },
  { id: '15-material-descargable', label: '15. Material' },
  { id: '16-errores-comunes', label: '16. Errores comunes' },
  { id: '17-glosario', label: '17. Glosario' },
  { id: '18-resumen-del-modulo', label: '18. Resumen' },
]

const moduleOneDelivery = [
  {
    match: 'módulo 1',
    fileName: 'python-practico_modulo-01_juan-perez.zip',
    items: [
      'Las tres actividades obligatorias',
      'normalizador_registros.py y datos_registros.py',
      'README.md con instrucciones y respuestas de reflexión',
      'Evidencia del reporte generado',
      'Plan de pruebas completado',
      'Versión de Python utilizada',
    ],
    title: 'Entrega del Módulo 1',
    stepLabel: 'Último paso del módulo',
    description:
      'Cuando hayas completado las actividades, el proyecto, las pruebas y la reflexión, reúne todo en un único archivo comprimido.',
    itemsLabel: 'La entrega única debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar Módulo 1',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'python-practico-modulo-1.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function PracticalPythonModuleOnePage() {
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
              href="/cursos/python-practico/inscripcion"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la inscripción
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Python Práctico</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 1: Texto profesional y funciones integradas
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">2 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Intermedio</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Requisito recomendado</p>
                <p className="text-primary-foreground/80">Python Básico e Intermedio</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Python y biblioteca estándar</p>
              <p>Resultado: Un normalizador y auditor de registros de texto</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['5 prácticas guiadas', '3 actividades obligatorias', '1 proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="python-practico-modulo-1"
          moduleLabel="Módulo 1"
          items={moduleOneToc}
          nextHref="/cursos/python-practico/curso/modulo-2"
          nextLabel="Ir al Módulo 2"
          completionTitle="¡Has completado el Módulo 1 de Python Práctico!"
          completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# 6\./.test(heading)
              const isActivities = /^# 7\./.test(heading)
              const isProject = /^# 8\./.test(heading)
              const isEvaluation = /^# (9|10)\./.test(heading)
              const isSolutions = /^# 11\./.test(heading)
              const isChallenges = /^# 12\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de las prácticas guiadas — consultar después de intentarlas
                    </summary>
                    <div className="mt-6 border-t border-border pt-6">
                      <CourseMarkdown markdown={section} deliveryVariants={moduleOneDelivery} />
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
                  <CourseMarkdown markdown={section} deliveryVariants={moduleOneDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/python-practico"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Ver información del curso
              </Link>
              <Link
                href="/cursos/python-practico/curso/modulo-2"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Módulo 2
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

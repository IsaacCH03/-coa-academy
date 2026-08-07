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
  title: 'Módulo 1: Fundamentos relacionales y primeros pasos con SQL | C.O.A.',
  description:
    'Módulo 1 de SQL y Bases de Datos Relacionales: fundamentos, SQLite, tablas, inserciones y primeras consultas.',
}

const moduleOneToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-datos-informacion-y-bases-de-datos', label: '1. Datos y bases de datos' },
  { id: '2-modelo-relacional-gestores-y-sql', label: '2. Modelo relacional' },
  { id: '3-preparacion-de-sqlite-y-db-browser', label: '3. SQLite y DB Browser' },
  { id: '4-tablas-tipos-de-datos-y-valores-ausentes', label: '4. Tablas y tipos' },
  { id: '5-tu-primer-script-sql', label: '5. Primer script SQL' },
  { id: '6-buenas-practicas-y-errores-frecuentes', label: '6. Buenas prácticas' },
  { id: '7-ejercicios-individuales', label: '7. Ejercicios' },
  { id: '8-soluciones-explicadas-de-los-ejercicios', label: '8. Soluciones' },
  { id: '9-mini-proyecto-agenda-de-contactos-personales', label: '9. Mini proyecto' },
  { id: '10-proyecto-del-modulo-catalogo-digital-de-una-biblioteca', label: '10. Proyecto' },
  { id: '11-rubrica-de-evaluacion-del-proyecto', label: '11. Rúbrica' },
  { id: '12-evaluacion-practica-del-modulo', label: '12. Evaluación' },
  { id: '13-punto-de-entrega-obligatorio', label: '13. Entrega' },
  { id: '14-retos-adicionales', label: '14. Retos' },
  { id: '15-videos-recomendados-del-modulo', label: '15. Videos' },
  { id: '16-documentacion-y-recursos-de-lectura', label: '16. Lecturas' },
  { id: '17-glosario', label: '17. Glosario' },
  { id: '18-resumen-del-modulo', label: '18. Resumen' },
]

const moduleOneDelivery = [
  {
    match: 'módulo 1',
    fileName: 'COA_SQL_M01_Cerna_Victor.zip',
    items: [
      'El script SQL principal',
      'La base de datos biblioteca.db',
      'La explicación del diseño en PDF',
      'Las cinco evidencias solicitadas',
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
    path.join(process.cwd(), 'content', 'sql-bases-datos-modulo-1.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function SqlModuleOnePage() {
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
              href="/cursos/sql-bases-datos/inscripcion"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la inscripción
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — SQL y Bases de Datos Relacionales</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 1: Fundamentos relacionales y primeros pasos con SQL
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">3 horas</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Inicial</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Requisito recomendado</p>
                <p className="text-primary-foreground/80">No requiere experiencia previa</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Motor: SQLite · Herramienta: DB Browser for SQLite</p>
              <p>Resultado: Un catálogo digital de biblioteca funcional</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['10 ejercicios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="sql-bases-datos-modulo-1"
          moduleLabel="Módulo 1"
          items={moduleOneToc}
          nextHref="/cursos/sql-bases-datos/curso/modulo-2"
          nextLabel="Ir al Módulo 2"
          completionTitle="¡Has completado el Módulo 1 de SQL y Bases de Datos Relacionales!"
          completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# 7\./.test(heading)
              const isActivities = /^# 9\./.test(heading)
              const isProject = /^# 10\./.test(heading)
              const isEvaluation = /^# (11|12|13)\./.test(heading)
              const isSolutions = /^# 8\./.test(heading)
              const isChallenges = /^# 14\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de los ejercicios — consultar después de intentarlos
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
                href="/cursos/sql-bases-datos"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Ver información del curso
              </Link>
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-2"
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

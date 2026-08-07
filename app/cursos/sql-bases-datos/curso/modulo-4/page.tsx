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
  title: 'Módulo 4: Consultas, funciones y análisis de información | C.O.A.',
  description:
    'Módulo 4 de SQL y Bases de Datos Relacionales: filtros, funciones, agrupaciones y análisis de información.',
}

const moduleFourToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'conocimientos-previos', label: 'Conocimientos previos' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-de-una-pregunta-a-una-consulta', label: '1. Construir consultas' },
  { id: '2-seleccion-de-columnas-alias-y-valores-distintos', label: '2. Columnas y alias' },
  { id: '3-filtrado-con-where', label: '3. WHERE' },
  { id: '4-orden-y-cantidad-de-resultados', label: '4. Orden y límites' },
  { id: '5-expresiones-y-columnas-calculadas', label: '5. Expresiones' },
  { id: '6-funciones-utiles-para-presentar-y-transformar-datos', label: '6. Funciones' },
  { id: '7-funciones-de-agregacion', label: '7. Agregación' },
  { id: '8-agrupacion-con-group-by', label: '8. GROUP BY' },
  { id: '9-filtrado-de-grupos-con-having', label: '9. HAVING' },
  { id: '10-metodo-profesional-para-construir-una-consulta', label: '10. Método profesional' },
  { id: '11-practicas-guiadas', label: '11. Prácticas' },
  { id: '12-errores-comunes-y-como-corregirlos', label: '12. Errores comunes' },
  { id: '13-buenas-practicas-de-consultas', label: '13. Buenas prácticas' },
  { id: '14-ejercicios-individuales', label: '14. Ejercicios' },
  { id: '15-soluciones-sugeridas-de-los-ejercicios', label: '15. Soluciones' },
  { id: '16-mini-proyecto-estadisticas-de-un-torneo', label: '16. Mini proyecto' },
  { id: '17-proyecto-obligatorio-del-modulo-analisis-de-operaciones-de-una-tienda', label: '17. Proyecto' },
  { id: '18-rubrica-del-proyecto-obligatorio', label: '18. Rúbrica' },
  { id: '19-evaluacion-practica-del-modulo', label: '19. Evaluación' },
  { id: '20-punto-de-entrega-del-modulo', label: '20. Entrega' },
  { id: '21-retos-adicionales', label: '21. Retos' },
  { id: '22-videos-recomendados', label: '22. Videos' },
  { id: '23-documentacion-y-recursos-gratuitos', label: '23. Lecturas' },
  { id: '24-material-complementario', label: '24. Material' },
  { id: '25-glosario', label: '25. Glosario' },
  { id: '26-resumen-final', label: '26. Resumen' },
]

const moduleFourDelivery = [
  {
    match: 'módulo 4',
    fileName: 'COA_SQL_M04_Cerna_Victor.zip',
    items: [
      'El script SQL principal',
      'La base de datos del módulo',
      'El informe de análisis en PDF',
      'Las seis evidencias solicitadas',
    ],
    title: 'Entrega del Módulo 4',
    stepLabel: 'Último paso del módulo',
    description:
      'Cuando hayas completado las actividades, el proyecto, las pruebas y la reflexión, reúne todo en un único archivo comprimido.',
    itemsLabel: 'La entrega única debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar Módulo 4',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'sql-bases-datos-modulo-4.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function SqlModuleFourPage() {
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
              href="/cursos/sql-bases-datos/curso/modulo-3"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 3
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — SQL y Bases de Datos Relacionales</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 4: Consultas, funciones y análisis de información
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">4 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Intermedio</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Requisito recomendado</p>
                <p className="text-primary-foreground/80">Módulos 1 al 3 aprobados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Motor: SQLite · Herramienta: DB Browser for SQLite</p>
              <p>Resultado: Un informe reproducible de operaciones comerciales</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['22 ejercicios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="sql-bases-datos-modulo-4"
          moduleLabel="Módulo 4"
          items={moduleFourToc}
          nextHref="/cursos/sql-bases-datos/curso/modulo-5"
          nextLabel="Ir al Módulo 5"
          completionTitle="¡Has completado el Módulo 4 de SQL y Bases de Datos Relacionales!"
          completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (11|14)\./.test(heading)
              const isActivities = /^# 16\./.test(heading)
              const isProject = /^# 17\./.test(heading)
              const isEvaluation = /^# (18|19|20)\./.test(heading)
              const isSolutions = /^# 15\./.test(heading)
              const isChallenges = /^# 21\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de los ejercicios — consultar después de intentarlos
                    </summary>
                    <div className="mt-6 border-t border-border pt-6">
                      <CourseMarkdown markdown={section} deliveryVariants={moduleFourDelivery} />
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
                  <CourseMarkdown markdown={section} deliveryVariants={moduleFourDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-3"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 3
              </Link>
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-5"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Módulo 5
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

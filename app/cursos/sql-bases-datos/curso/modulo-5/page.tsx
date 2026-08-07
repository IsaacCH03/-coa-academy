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
  title: 'Módulo 5: Consultas multitabla y resolución avanzada con SQL | C.O.A.',
  description:
    'Módulo 5 de SQL y Bases de Datos Relacionales: JOIN, subconsultas, CTE y operaciones de conjuntos.',
}

const moduleFiveToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'conocimientos-previos', label: 'Conocimientos previos' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-pensar-en-caminos-no-en-tablas-aisladas', label: '1. Caminos entre tablas' },
  { id: '2-producto-cartesiano-todas-las-combinaciones', label: '2. Producto cartesiano' },
  { id: '3-inner-join-conservar-coincidencias', label: '3. INNER JOIN' },
  { id: '4-alias-de-tablas-y-columnas-ambiguas', label: '4. Alias de tablas' },
  { id: '5-left-join-conservar-el-lado-izquierdo', label: '5. LEFT JOIN' },
  { id: '6-on-y-where-no-siempre-son-intercambiables', label: '6. ON y WHERE' },
  { id: '7-unir-tres-o-mas-tablas', label: '7. Varias tablas' },
  { id: '8-relaciones-muchos-a-muchos', label: '8. Muchos a muchos' },
  { id: '9-autounion-una-tabla-se-relaciona-consigo-misma', label: '9. Autounión' },
  { id: '10-otros-tipos-de-union', label: '10. Otras uniones' },
  { id: '11-subconsultas', label: '11. Subconsultas' },
  { id: '12-exists-not-exists-y-la-trampa-de-not-in', label: '12. EXISTS' },
  { id: '13-cte-ordinarias-con-with', label: '13. CTE' },
  { id: '14-union-y-union-all', label: '14. UNION' },
  { id: '15-elegir-la-herramienta-adecuada', label: '15. Elegir herramienta' },
  { id: '16-metodo-de-verificacion-de-una-consulta-multitabla', label: '16. Verificación' },
  { id: '17-practicas-guiadas', label: '17. Prácticas' },
  { id: '18-errores-comunes', label: '18. Errores comunes' },
  { id: '19-buenas-practicas', label: '19. Buenas prácticas' },
  { id: '20-ejercicios-individuales', label: '20. Ejercicios' },
  { id: '21-soluciones-sugeridas', label: '21. Soluciones' },
  { id: '22-mini-proyecto-gestion-de-un-festival-y-sus-entradas', label: '22. Mini proyecto' },
  { id: '23-proyecto-obligatorio-sistema-de-reportes-academicos', label: '23. Proyecto' },
  { id: '24-rubrica-del-proyecto', label: '24. Rúbrica' },
  { id: '25-evaluacion-practica', label: '25. Evaluación' },
  { id: '26-punto-de-entrega', label: '26. Entrega' },
  { id: '27-retos-adicionales', label: '27. Retos' },
  { id: '28-videos-recomendados', label: '28. Videos' },
  { id: '29-documentacion-y-recursos-confiables', label: '29. Lecturas' },
  { id: '30-portabilidad-entre-motores', label: '30. Portabilidad' },
  { id: '31-material-complementario', label: '31. Material' },
  { id: '32-glosario', label: '32. Glosario' },
  { id: '33-resumen-final', label: '33. Resumen' },
]

const moduleFiveDelivery = [
  {
    match: 'módulo 5',
    fileName: 'COA_SQL_M05_Cerna_Victor.zip',
    items: [
      'El script SQL principal',
      'La base de datos universitaria',
      'El informe relacional en PDF y el mapa de relaciones',
      'Las siete evidencias solicitadas',
    ],
    title: 'Entrega del Módulo 5',
    stepLabel: 'Último paso del módulo',
    description:
      'Cuando hayas completado las actividades, el proyecto, las pruebas y la reflexión, reúne todo en un único archivo comprimido.',
    itemsLabel: 'La entrega única debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar Módulo 5',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'sql-bases-datos-modulo-5.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function SqlModuleFivePage() {
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
              href="/cursos/sql-bases-datos/curso/modulo-4"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 4
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — SQL y Bases de Datos Relacionales</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 5: Consultas multitabla y resolución avanzada con SQL
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
                <p className="text-primary-foreground/80">Módulos 1 al 4 aprobados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Motor: SQLite · Herramienta: DB Browser for SQLite</p>
              <p>Resultado: Un sistema reproducible de reportes académicos</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['16 ejercicios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="sql-bases-datos-modulo-5"
          moduleLabel="Módulo 5"
          items={moduleFiveToc}
          nextHref="/cursos/sql-bases-datos/curso/modulo-6"
          nextLabel="Ir al Módulo 6"
          completionTitle="¡Has completado el Módulo 5 de SQL y Bases de Datos Relacionales!"
          completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (17|20)\./.test(heading)
              const isActivities = /^# 22\./.test(heading)
              const isProject = /^# 23\./.test(heading)
              const isEvaluation = /^# (24|25|26)\./.test(heading)
              const isSolutions = /^# 21\./.test(heading)
              const isChallenges = /^# 27\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de los ejercicios — consultar después de intentarlos
                    </summary>
                    <div className="mt-6 border-t border-border pt-6">
                      <CourseMarkdown markdown={section} deliveryVariants={moduleFiveDelivery} />
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
                  <CourseMarkdown markdown={section} deliveryVariants={moduleFiveDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-4"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 4
              </Link>
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-6"
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

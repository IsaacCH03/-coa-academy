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
  title: 'Módulo 2: Diseño de bases de datos, relaciones e integridad | C.O.A.',
  description:
    'Módulo 2 de SQL y Bases de Datos Relacionales: modelado, claves, relaciones, restricciones y normalización.',
}

const moduleTwoToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-del-problema-real-al-modelo-de-datos', label: '1. Modelo de datos' },
  { id: '2-claves-identidad-y-referencia', label: '2. Claves' },
  { id: '3-relaciones-cardinalidad-y-opcionalidad', label: '3. Relaciones' },
  { id: '4-restricciones-reglas-protegidas-por-la-base', label: '4. Restricciones' },
  { id: '5-implementar-relaciones-correctamente-en-sqlite', label: '5. Relaciones en SQLite' },
  { id: '6-acciones-referenciales-y-cambios-del-esquema', label: '6. Acciones referenciales' },
  { id: '7-normalizacion-practica', label: '7. Normalización' },
  { id: '8-diccionario-de-datos-y-modelo-relacional', label: '8. Documentación' },
  { id: '9-diferencias-entre-sqlite-y-otros-motores', label: '9. Otros motores' },
  { id: '10-buenas-practicas-y-errores-frecuentes', label: '10. Buenas prácticas' },
  { id: '11-ejercicios-individuales', label: '11. Ejercicios' },
  { id: '12-soluciones-explicadas-de-los-ejercicios', label: '12. Soluciones' },
  { id: '13-mini-proyecto-estructura-organizacional-de-una-empresa', label: '13. Mini proyecto' },
  { id: '14-proyecto-del-modulo-sistema-de-gestion-para-una-clinica', label: '14. Proyecto' },
  { id: '15-rubrica-de-evaluacion-del-proyecto', label: '15. Rúbrica' },
  { id: '16-evaluacion-practica-del-modulo', label: '16. Evaluación' },
  { id: '17-punto-de-entrega-obligatorio', label: '17. Entrega' },
  { id: '18-retos-adicionales', label: '18. Retos' },
  { id: '19-videos-recomendados-del-modulo', label: '19. Videos' },
  { id: '20-documentacion-y-recursos-de-lectura', label: '20. Lecturas' },
  { id: '21-glosario', label: '21. Glosario' },
  { id: '22-resumen-del-modulo', label: '22. Resumen' },
]

const moduleTwoDelivery = [
  {
    match: 'módulo 2',
    fileName: 'COA_SQL_M02_Cerna_Victor.zip',
    items: [
      'El script SQL principal',
      'La base de datos clinica.db',
      'La documentación del diseño en PDF',
      'Las ocho evidencias solicitadas',
    ],
    title: 'Entrega del Módulo 2',
    stepLabel: 'Último paso del módulo',
    description:
      'Cuando hayas completado las actividades, el proyecto, las pruebas y la reflexión, reúne todo en un único archivo comprimido.',
    itemsLabel: 'La entrega única debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar Módulo 2',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'sql-bases-datos-modulo-2.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function SqlModuleTwoPage() {
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
              href="/cursos/sql-bases-datos/curso"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 1
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — SQL y Bases de Datos Relacionales</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 2: Diseño de bases de datos, relaciones e integridad
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">4 horas</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Inicial a intermedio</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Requisito recomendado</p>
                <p className="text-primary-foreground/80">Módulo 1 aprobado</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Motor: SQLite · Herramienta: DB Browser for SQLite</p>
              <p>Resultado: Una base de datos relacional para la gestión de una clínica</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['12 ejercicios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="sql-bases-datos-modulo-2"
          moduleLabel="Módulo 2"
          items={moduleTwoToc}
          nextHref="/cursos/sql-bases-datos/curso/modulo-3"
          nextLabel="Ir al Módulo 3"
          completionTitle="¡Has completado el Módulo 2 de SQL y Bases de Datos Relacionales!"
          completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# 11\./.test(heading)
              const isActivities = /^# 13\./.test(heading)
              const isProject = /^# 14\./.test(heading)
              const isEvaluation = /^# (15|16|17)\./.test(heading)
              const isSolutions = /^# 12\./.test(heading)
              const isChallenges = /^# 18\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de los ejercicios — consultar después de intentarlos
                    </summary>
                    <div className="mt-6 border-t border-border pt-6">
                      <CourseMarkdown markdown={section} deliveryVariants={moduleTwoDelivery} />
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
                  <CourseMarkdown markdown={section} deliveryVariants={moduleTwoDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/sql-bases-datos/curso"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 1
              </Link>
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-3"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Módulo 3
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

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
  title: 'Módulo 3: Gestión segura de datos y transacciones | C.O.A.',
  description:
    'Módulo 3 de SQL y Bases de Datos Relacionales: operaciones CRUD, cambios seguros y transacciones.',
}

const moduleThreeToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-el-ciclo-crud', label: '1. Ciclo CRUD' },
  { id: '2-insertar-datos-profesionalmente', label: '2. INSERT' },
  { id: '3-modificar-datos-con-update', label: '3. UPDATE' },
  { id: '4-eliminar-datos-con-delete', label: '4. DELETE' },
  { id: '5-transacciones-todo-o-nada', label: '5. Transacciones' },
  { id: '6-metodo-coa-para-cambios-seguros', label: '6. Método COA' },
  { id: '7-buenas-practicas-y-errores-frecuentes', label: '7. Buenas prácticas' },
  { id: '8-ejercicios-individuales', label: '8. Ejercicios' },
  { id: '9-soluciones-explicadas-de-los-ejercicios', label: '9. Soluciones' },
  { id: '10-mini-proyecto-caja-diaria-de-una-cafeteria', label: '10. Mini proyecto' },
  { id: '11-proyecto-del-modulo-sistema-de-inventario-y-movimientos', label: '11. Proyecto' },
  { id: '12-rubrica-de-evaluacion-del-proyecto', label: '12. Rúbrica' },
  { id: '13-evaluacion-practica-del-modulo', label: '13. Evaluación' },
  { id: '14-punto-de-entrega-obligatorio', label: '14. Entrega' },
  { id: '15-retos-adicionales', label: '15. Retos' },
  { id: '16-videos-recomendados-del-modulo', label: '16. Videos' },
  { id: '17-documentacion-y-recursos-de-lectura', label: '17. Lecturas' },
  { id: '18-glosario', label: '18. Glosario' },
  { id: '19-resumen-del-modulo', label: '19. Resumen' },
]

const moduleThreeDelivery = [
  {
    match: 'módulo 3',
    fileName: 'COA_SQL_M03_Cerna_Victor.zip',
    items: [
      'El script SQL principal',
      'La base de datos inventario.db',
      'La explicación de las operaciones en PDF',
      'Las doce evidencias solicitadas',
    ],
    title: 'Entrega del Módulo 3',
    stepLabel: 'Último paso del módulo',
    description:
      'Cuando hayas completado las actividades, el proyecto, las pruebas y la reflexión, reúne todo en un único archivo comprimido.',
    itemsLabel: 'La entrega única debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar Módulo 3',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'sql-bases-datos-modulo-3.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function SqlModuleThreePage() {
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
              href="/cursos/sql-bases-datos/curso/modulo-2"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 2
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — SQL y Bases de Datos Relacionales</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 3: Gestión segura de datos y transacciones
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">3 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Intermedio inicial</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Requisito recomendado</p>
                <p className="text-primary-foreground/80">Módulos 1 y 2 aprobados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Motor: SQLite · Herramienta: DB Browser for SQLite</p>
              <p>Resultado: Un inventario con operaciones controladas y transacciones</p>
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
          moduleId="sql-bases-datos-modulo-3"
          moduleLabel="Módulo 3"
          items={moduleThreeToc}
          nextHref="/cursos/sql-bases-datos/curso/modulo-4"
          nextLabel="Ir al Módulo 4"
          completionTitle="¡Has completado el Módulo 3 de SQL y Bases de Datos Relacionales!"
          completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# 8\./.test(heading)
              const isActivities = /^# 10\./.test(heading)
              const isProject = /^# 11\./.test(heading)
              const isEvaluation = /^# (12|13|14)\./.test(heading)
              const isSolutions = /^# 9\./.test(heading)
              const isChallenges = /^# 15\./.test(heading)
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de los ejercicios — consultar después de intentarlos
                    </summary>
                    <div className="mt-6 border-t border-border pt-6">
                      <CourseMarkdown markdown={section} deliveryVariants={moduleThreeDelivery} />
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
                  <CourseMarkdown markdown={section} deliveryVariants={moduleThreeDelivery} />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-2"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 2
              </Link>
              <Link
                href="/cursos/sql-bases-datos/curso/modulo-4"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Módulo 4
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

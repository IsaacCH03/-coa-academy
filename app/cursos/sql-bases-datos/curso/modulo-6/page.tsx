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
  title: 'Módulo 6: SQL profesional y proyecto final integrador | C.O.A.',
  description:
    'Módulo 6 de SQL y Bases de Datos Relacionales: vistas, índices, planes de consulta y proyecto final.',
}

const moduleSixToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'conocimientos-previos', label: 'Conocimientos previos' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-organizacion-profesional-de-un-proyecto-sql', label: '1. Organización' },
  { id: '2-vistas-con-create-view', label: '2. Vistas' },
  { id: '3-indices-una-ruta-adicional-hacia-los-datos', label: '3. Índices' },
  { id: '4-explain-query-plan', label: '4. Plan de consulta' },
  { id: '5-mejoras-basicas-antes-de-anadir-indices', label: '5. Mejoras básicas' },
  { id: '6-consultas-parametrizadas-e-inyeccion-sql', label: '6. Seguridad' },
  { id: '7-inspeccion-y-verificacion-de-sqlite', label: '7. Verificación' },
  { id: '8-respaldo-y-recuperacion-basica', label: '8. Respaldo' },
  { id: '9-portabilidad', label: '9. Portabilidad' },
  { id: '10-practicas-guiadas', label: '10. Prácticas' },
  { id: '11-ejercicios-y-diagnostico', label: '11. Ejercicios' },
  { id: '12-soluciones-sugeridas', label: '12. Soluciones' },
  { id: '13-mini-proyecto-auditoria-de-una-empresa-de-mensajeria', label: '13. Mini proyecto' },
  { id: '14-proyecto-final-integrador-sistema-de-gestion-de-un-hotel', label: '14. Proyecto final' },
  { id: '15-evaluacion-practica-y-defensa', label: '15. Evaluación' },
  { id: '16-rubrica-del-proyecto-final', label: '16. Rúbrica' },
  { id: '17-punto-de-entrega-final', label: '17. Entrega final' },
  { id: '18-videos-recomendados', label: '18. Videos' },
  { id: '19-documentacion-oficial', label: '19. Documentación' },
  { id: '20-referencias-de-portabilidad', label: '20. Referencias' },
  { id: '21-material-complementario', label: '21. Material' },
  { id: '22-glosario', label: '22. Glosario' },
  { id: '23-resumen-final-del-modulo', label: '23. Resumen' },
  { id: '24-cierre-del-curso', label: '24. Cierre del curso' },
]

const moduleSixDelivery = [
  {
    match: 'módulo 6',
    fileName: 'COA_SQL_M06_Cerna_Victor.zip',
    items: [
      'El script SQL principal',
      'La base de datos del hotel y su respaldo',
      'La documentación profesional y el diagrama',
      'La auditoría, la evaluación y las doce evidencias',
    ],
    title: 'Entrega final del Módulo 6',
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
    path.join(process.cwd(), 'content', 'sql-bases-datos-modulo-6.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function SqlModuleSixPage() {
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
              href="/cursos/sql-bases-datos/curso/modulo-5"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 5
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — SQL y Bases de Datos Relacionales</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 6: SQL profesional y proyecto final integrador
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
                <p className="text-primary-foreground/80">Módulos 1 al 5 aprobados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyecto</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Motor: SQLite · Herramienta: DB Browser for SQLite</p>
              <p>Resultado: Una base de datos profesional para la gestión de un hotel</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['10 ejercicios', '1 mini proyecto', '1 proyecto final', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="sql-bases-datos-modulo-6"
          moduleLabel="Módulo 6"
          items={moduleSixToc}
          completionTitle="¡Felicitaciones! Has completado SQL y Bases de Datos Relacionales"
          completionDescription="Revisa el proyecto integrador, confirma la entrega final y consulta los requisitos del certificado de participación."
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (10|11)\./.test(heading)
              const isActivities = /^# 13\./.test(heading)
              const isProject = /^# 14\./.test(heading)
              const isEvaluation = /^# (15|16|17)\./.test(heading)
              const isSolutions = /^# 12\./.test(heading)
              const isChallenges = false
              const emphasized =
                isPractice || isActivities || isProject || isEvaluation || isChallenges

              if (isSolutions) {
                return (
                  <details key={heading} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <summary className="cursor-pointer text-lg font-bold text-primary">
                      Soluciones de los ejercicios — consultar después de intentarlos
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
                href="/cursos/sql-bases-datos/curso/modulo-5"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 5
              </Link>
              <Link
                href="/cursos/sql-bases-datos"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Ver información del curso
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

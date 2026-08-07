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
  title: 'Módulo 2: JavaScript moderno en el navegador | C.O.A.',
  description:
    'Segundo módulo del curso Desarrollo Web Moderno: DOM, eventos, formularios, Fetch API, localStorage y depuración con Inteligencia Artificial.',
}

const moduleTwoToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-preparacion-modulos-y-depuracion-inicial', label: '1. Preparación' },
  { id: '2-dom-y-representacion-de-datos', label: '2. DOM y datos' },
  { id: '3-eventos-e-interaccion', label: '3. Eventos' },
  { id: '4-formularios-y-validacion', label: '4. Formularios' },
  { id: '5-datos-asincronos-con-fetch', label: '5. Fetch API' },
  { id: '6-estado-y-persistencia-con-localstorage', label: '6. Estado y persistencia' },
  { id: '7-diagnostico-asistido-por-inteligencia-artificial', label: '7. Diagnóstico con IA' },
  { id: '8-mini-proyecto-preguntas-frecuentes-accesibles', label: '8. Mini proyecto' },
  { id: '9-proyecto-del-modulo-explorador-interactivo-de-cursos-coa', label: '9. Proyecto' },
  { id: '10-rubrica-de-evaluacion-del-proyecto', label: '10. Rúbrica' },
  { id: '11-evaluacion-del-modulo', label: '11. Evaluación' },
  { id: '12-retos-adicionales', label: '12. Retos' },
  { id: '13-videos-recomendados-del-modulo', label: '13. Videos' },
  { id: '14-documentacion-y-recursos-de-lectura', label: '14. Lecturas' },
  { id: '15-errores-comunes', label: '15. Errores comunes' },
  { id: '16-glosario', label: '16. Glosario' },
  { id: '17-resumen-del-modulo', label: '17. Resumen' },
]

const moduleTwoDeliveryVariants = [
  {
    match: 'mini proyecto',
    fileName: 'Juan Pérez - Desarrollo Web - MiniProyecto Módulo 2.zip',
    items: [
      'Nombre completo',
      'Curso: Desarrollo Web Moderno',
      'Módulo 2',
      'Archivos HTML, CSS y JavaScript de las preguntas frecuentes',
      'Captura con todas las preguntas cerradas',
      'Captura con una respuesta abierta',
      'Breve explicación de la delegación de eventos utilizada',
    ],
    title: 'Entrega del mini proyecto',
    stepLabel: 'Último paso del mini proyecto',
    description:
      'Una vez completada la sección de preguntas frecuentes accesibles, reúne los archivos, capturas y explicación en un único ZIP.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar mini proyecto',
  },
  {
    match: 'proyecto del módulo',
    fileName: 'Juan Pérez - Desarrollo Web - Proyecto Módulo 2.pdf',
    items: [
      'Nombre completo',
      'Enlace público al repositorio de GitHub',
      'Captura del catálogo con resultados',
      'Captura del estado vacío o de error',
      'Captura de un favorito conservado después de actualizar',
      'Bitácora de uso de Inteligencia Artificial',
      'Plan de pruebas con resultados reales',
      'Reflexión final de 120 a 200 palabras',
    ],
    title: 'Entrega del proyecto del módulo',
    stepLabel: 'Último paso del proyecto',
    description:
      'Cuando el explorador interactivo esté terminado y publicado en GitHub, reúne las evidencias en un único documento PDF.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar proyecto',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'desarrollo-web-moderno-modulo-2.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function ModernWebCourseModuleTwoPage() {
  const content = getModuleContent()
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
              href="/cursos/desarrollo-web-moderno/curso"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 1
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Desarrollo Web Moderno
            </p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 2: JavaScript moderno en el navegador
            </h1>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración aproximada</p>
                <p className="text-primary-foreground/80">6 horas y 30 minutos</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Básico</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Módulo 1 completado</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyectos</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: JavaScript ES6+, HTML5, CSS3, Git, GitHub, ChatGPT o Claude</p>
              <p>Resultado: Un explorador interactivo de cursos COA</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['10 prácticas guiadas', '1 mini proyecto', '1 proyecto de módulo', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="desarrollo-web-moderno-modulo-2"
          moduleLabel="Módulo 2"
          items={moduleTwoToc}
          nextHref="/cursos/desarrollo-web-moderno/curso/modulo-3"
          nextLabel="Ir al Módulo 3"
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isMiniProject = /^# 8\./.test(heading)
              const isProject = /^# (9|10)\./.test(heading)
              const isEvaluation = /^# 11\./.test(heading)
              const isChallenge = /^# 12\./.test(heading)
              const emphasized =
                isMiniProject || isProject || isEvaluation || isChallenge

              return (
                <section
                  key={heading}
                  className={
                    emphasized
                      ? `rounded-2xl border p-6 shadow-sm md:p-7 ${
                          isChallenge
                            ? 'border-accent/50 bg-accent/5'
                            : isMiniProject || isProject
                              ? 'border-primary/30 bg-secondary/40'
                              : 'border-border bg-card'
                        }`
                      : ''
                  }
                >
                  <CourseMarkdown
                    markdown={section}
                    deliveryVariants={moduleTwoDeliveryVariants}
                  />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/desarrollo-web-moderno/curso"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 1
              </Link>
              <Link
                href="/cursos/desarrollo-web-moderno/curso/modulo-3"
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

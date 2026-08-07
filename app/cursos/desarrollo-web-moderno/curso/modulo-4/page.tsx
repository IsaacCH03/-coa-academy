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
  title: 'Módulo 4: Next.js, App Router, Tailwind CSS y despliegue | C.O.A.',
  description:
    'Cuarto módulo del curso Desarrollo Web Moderno: Next.js, App Router, Tailwind CSS, rutas dinámicas y despliegue en Vercel.',
}

const moduleFourToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'producto-que-construiras', label: 'Producto del módulo' },
  { id: 'ruta-de-trabajo-y-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-de-react-a-nextjs-y-preparacion-del-proyecto', label: '1. React a Next.js' },
  { id: '2-app-router-paginas-y-layouts', label: '2. App Router y layouts' },
  { id: '3-navegacion-y-rutas-dinamicas', label: '3. Rutas dinámicas' },
  { id: '4-componentes-de-servidor-y-cliente', label: '4. Servidor y cliente' },
  { id: '5-diseno-practico-con-tailwind-css', label: '5. Tailwind CSS' },
  { id: '6-metadatos-imagenes-y-estados-especiales', label: '6. Metadatos e imágenes' },
  { id: '7-git-construccion-y-despliegue-en-vercel', label: '7. Git y Vercel' },
  { id: '8-diagnostico-asistido-por-ia', label: '8. Diagnóstico con IA' },
  { id: '9-mini-proyecto-directorio-de-recursos', label: '9. Mini proyecto' },
  { id: '10-proyecto-del-modulo-portal-coa-en-nextjs', label: '10. Proyecto' },
  { id: '11-evaluacion-del-modulo', label: '11. Evaluación' },
  { id: 'videos-recomendados', label: 'Videos' },
  { id: 'documentacion-y-lecturas', label: 'Lecturas' },
  { id: 'glosario', label: 'Glosario' },
  { id: 'resumen-final', label: 'Resumen' },
  { id: 'cierre-y-requisito-de-avance', label: 'Cierre' },
]

const moduleFourDeliveryVariants = [
  {
    match: 'mini proyecto',
    fileName: 'Juan Pérez - Desarrollo Web - MiniProyecto Módulo 4.zip',
    items: [
      'Nombre completo',
      'Curso: Desarrollo Web Moderno',
      'Módulo 4',
      'Enlace al repositorio o carpeta indicada',
      'Mapa de rutas',
      'Captura del índice',
      'Captura de un detalle',
      'Captura de la página 404',
      'Explicación de por qué los componentes permanecen en el servidor',
    ],
    title: 'Entrega del mini proyecto',
    stepLabel: 'Último paso del mini proyecto',
    description:
      'Una vez completado el directorio de recursos en Next.js, reúne el proyecto, el mapa, las capturas y la explicación en un único ZIP.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar mini proyecto',
  },
  {
    match: 'proyecto del módulo',
    fileName: 'Juan Pérez - Desarrollo Web - Proyecto Módulo 4.pdf',
    items: [
      'Nombre completo',
      'Enlace al repositorio',
      'Enlace de producción en Vercel',
      'Enlace a una vista previa',
      'Mapa de rutas',
      'Árbol servidor-cliente',
      'Capturas del inicio, catálogo móvil, detalle y página 404',
      'Resultados de npm run lint y npm run build',
      'Tabla de pruebas y bitácora de Inteligencia Artificial',
      'Reflexión final de 150 a 250 palabras',
    ],
    title: 'Entrega del proyecto del módulo',
    stepLabel: 'Último paso del proyecto',
    description:
      'Cuando el portal COA en Next.js esté terminado y publicado en Vercel, reúne los enlaces y las evidencias en un único documento PDF.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar proyecto',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'desarrollo-web-moderno-modulo-4.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function ModernWebCourseModuleFourPage() {
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
              href="/cursos/desarrollo-web-moderno/curso/modulo-3"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 3
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Desarrollo Web Moderno
            </p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 4: Next.js, App Router, Tailwind CSS y despliegue
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
                <p className="text-primary-foreground/80">Módulos 1, 2 y 3 completados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Práctica guiada y proyectos</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Next.js, React, JavaScript ES6+, Tailwind CSS, Git, GitHub, Vercel, ChatGPT o Claude</p>
              <p>Resultado: Un portal multipágina de COA construido con Next.js y publicado en Vercel</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['Prácticas guiadas', '1 mini proyecto', '1 proyecto de módulo', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="desarrollo-web-moderno-modulo-4"
          moduleLabel="Módulo 4"
          items={moduleFourToc}
          nextHref="/cursos/desarrollo-web-moderno/curso/modulo-5"
          nextLabel="Ir al Módulo 5"
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isMiniProject = /^# 9\./.test(heading)
              const isProject = /^# 10\./.test(heading)
              const isEvaluation = /^# 11\./.test(heading)
              const isChallenge = false
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
                    deliveryVariants={moduleFourDeliveryVariants}
                  />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/desarrollo-web-moderno/curso/modulo-3"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 3
              </Link>
              <Link
                href="/cursos/desarrollo-web-moderno/curso/modulo-5"
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

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
  title: 'Módulo 6: Proyecto Final Integrador | C.O.A.',
  description:
    'Proyecto Final Integrador del curso Desarrollo Web Moderno con React, Next.js e Inteligencia Artificial.',
}

const moduleSixToc: ModuleTocItem[] = [
  { id: 'bienvenida', label: 'Bienvenida' },
  { id: 'objetivos-del-proyecto-final', label: 'Objetivos' },
  { id: 'el-desafio', label: 'El desafío' },
  { id: 'opciones-de-proyecto', label: 'Opciones de proyecto' },
  { id: 'requisitos-comunes-obligatorios', label: 'Requisitos obligatorios' },
  { id: 'restricciones-generales', label: 'Restricciones' },
  { id: 'distribucion-de-las-6-horas-y-30-minutos', label: 'Distribución del tiempo' },
  { id: 'fase-1-seleccion-del-problema-y-alcance', label: 'Fase 1. Alcance' },
  { id: 'fase-2-requisitos-contenido-y-experiencia', label: 'Fase 2. Requisitos' },
  { id: 'fase-3-arquitectura-y-preparacion', label: 'Fase 3. Arquitectura' },
  { id: 'fase-4-rutas-datos-e-interfaz-principal', label: 'Fase 4. Interfaz' },
  { id: 'fase-5-interaccion-persistencia-y-formulario', label: 'Fase 5. Interacción' },
  { id: 'fase-6-accesibilidad-pruebas-y-correcciones', label: 'Fase 6. Pruebas' },
  { id: 'fase-7-documentacion-vista-previa-y-produccion', label: 'Fase 7. Producción' },
  { id: 'fase-8-verificacion-final-y-defensa', label: 'Fase 8. Defensa' },
  { id: 'un-unico-punto-de-entrega', label: 'Entrega final' },
  { id: 'rubrica-del-proyecto-final', label: 'Rúbrica' },
  { id: 'videos-recomendados', label: 'Videos' },
  { id: 'documentacion-y-lecturas', label: 'Lecturas' },
  { id: 'glosario-del-proyecto-final', label: 'Glosario' },
  { id: 'cierre-del-curso', label: 'Cierre del curso' },
  { id: 'requisitos-para-obtener-el-certificado', label: 'Certificado' },
]

const moduleSixDeliveryVariants = [
  {
    match: 'proyecto final integrador',
    fileName: 'Juan Pérez - Desarrollo Web - Proyecto Final.pdf',
    items: [
      'Nombre completo',
      'Nombre del proyecto y opción elegida',
      'Descripción de 100 a 150 palabras',
      'Enlaces al repositorio, vista previa, producción y demostración',
      'Mapa de rutas, árbol de componentes y diagrama servidor-cliente',
      'Capturas solicitadas en escritorio y móvil',
      'PROJECT_BRIEF.md, TEST_PLAN.md, AI_LOG.md y README',
      'Resultados de ESLint y construcción',
      'Tabla de veinte pruebas y evidencia de tres correcciones',
      'Reflexión final de 400 a 600 palabras',
    ],
    title: 'Entrega del Proyecto Final Integrador',
    stepLabel: 'Último paso del curso',
    description:
      'Cuando hayas completado, probado, documentado y publicado el proyecto, reúne todos los enlaces y evidencias en una sola entrega final.',
    itemsLabel: 'La entrega debe incluir:',
    fileNameLabel: 'Ejemplo de nombre',
    buttonLabel: 'Entregar proyecto final',
  },
]

function getModuleContent() {
  const source = readFileSync(
    path.join(process.cwd(), 'content', 'desarrollo-web-moderno-modulo-6.md'),
    'utf8',
  )
  const contentStart = source.indexOf('## Bienvenida')
  return source.slice(contentStart)
}

export default function ModernWebCourseModuleSixPage() {
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
              href="/cursos/desarrollo-web-moderno/curso/modulo-5"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Módulo 5
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Desarrollo Web Moderno
            </p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 6: Proyecto Final Integrador
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
                <p className="text-primary-foreground/80">Proyecto integrador</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Módulos 1 al 5 completados</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Code2 className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">Proyecto profesional individual</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: HTML5, CSS3, JavaScript, React, Next.js, Tailwind CSS, Git, GitHub, Vercel e IA</p>
              <p>Resultado: Una aplicación web moderna, funcional, accesible, documentada y publicada</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['8 fases de trabajo', '1 proyecto final', '20 pruebas', '1 defensa técnica'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="desarrollo-web-moderno-modulo-6"
          moduleLabel="Módulo 6"
          items={moduleSixToc}
        >
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isMiniProject = false
              const isProject = /^# (Un único punto de entrega|Rúbrica del Proyecto Final)/.test(heading)
              const isEvaluation = /^# (Cierre del curso|Requisitos para obtener el certificado)/.test(heading)
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
                    deliveryVariants={moduleSixDeliveryVariants}
                  />
                </section>
              )
            })}

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link
                href="/cursos/desarrollo-web-moderno/curso/modulo-5"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Módulo 5
              </Link>
              <Link
                href="/#cursos"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Ver otros cursos
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

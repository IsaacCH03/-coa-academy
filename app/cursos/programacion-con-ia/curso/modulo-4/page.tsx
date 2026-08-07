import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Code2, GraduationCap } from 'lucide-react'
import { CourseMarkdown } from '@/components/course-markdown'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { courseSectionId } from '@/lib/course-navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Módulo 4: Depuración, diagnóstico y validación de respuestas | C.O.A.',
  description: 'Aprende a diagnosticar errores, validar propuestas de IA y corregir software mediante evidencia y pruebas de regresión.',
}

const shortLabels: Record<string, string> = {
  introduccion: 'Introducción',
  'objetivos-de-aprendizaje': 'Objetivos',
  'conocimientos-previos': 'Conocimientos previos',
  'preparacion-del-entorno': 'Preparación',
  'distribucion-recomendada-del-tiempo': 'Distribución del tiempo',
  '1-que-significa-programar-con-asistencia-de-ia': '1. Desarrollo con IA',
  '2-cuatro-formas-de-asistencia': '2. Formas de asistencia',
  '3-panorama-practico-de-herramientas': '3. Herramientas',
  '4-que-puede-aportar-la-ia': '4. Capacidades',
  '5-lo-que-la-ia-no-puede-garantizar': '5. Límites',
  '6-la-responsabilidad-permanece-contigo': '6. Responsabilidad',
  '7-flujo-minimo-de-trabajo-a-p-l-e-p-d': '7. Flujo A-P-L-E-P-D',
  '8-suposiciones-la-fuente-silenciosa-de-errores': '8. Suposiciones',
  '9-senales-de-una-respuesta-peligrosa-o-insuficiente': '9. Señales de riesgo',
  '10-privacidad-y-seguridad-antes-de-enviar-un-mensaje': '10. Privacidad',
  '11-propiedad-intelectual-y-dependencias': '11. Propiedad intelectual',
  '12-errores-comunes-al-comenzar': '12. Errores comunes',
  '13-practica-guiada-una-solicitud-vaga-y-una-solicitud-comprobable': '13. Práctica guiada',
  '14-como-comparar-dos-respuestas': '14. Comparar respuestas',
  '15-bitacora-minima-de-uso-de-ia': '15. Bitácora de IA',
  'ejercicios-individuales-obligatorios': 'Ejercicios',
  'reto-adicional-opcional': 'Reto opcional',
  'mini-proyecto-comparador-de-soluciones-asistidas': 'Mini proyecto',
  'proyecto-del-modulo-validador-de-pedidos-y-descuentos': 'Proyecto',
  'rubrica-del-proyecto-del-modulo': 'Rúbrica',
  'evaluacion-practica-del-modulo': 'Evaluación',
  'calificacion-del-modulo': 'Calificación',
  'errores-frecuentes-en-las-actividades': 'Errores frecuentes',
  'recomendaciones-para-completar-el-modulo': 'Recomendaciones',
  'videos-recomendados': 'Videos',
  'documentacion-oficial-y-recursos-confiables': 'Documentación',
  'material-complementario': 'Material descargable',
  glosario: 'Glosario',
  'resumen-del-modulo': 'Resumen',
  'checklist-antes-de-entregar': 'Lista final',
  'entrega-de-la-actividad': 'Entrega',
  'habilidades-obtenidas': 'Habilidades obtenidas',
}

const moduleOneDelivery = [{
  match: 'módulo 4',
  fileName: 'COA_IA_M4_Nombre_Apellido.zip',
  items: ['Ejercicios individuales obligatorios', 'Laboratorio de diagnóstico', 'Rescate de una aplicación defectuosa', 'Pruebas RD-01 a RD-10, evidencias e informe de causa raíz', 'Evaluación práctica resuelta'],
  title: 'Entrega del Módulo 4',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado y verificado todas las actividades, reúne el trabajo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 4',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'programacion-ia-modulo-4.md'), 'utf8')
  return source.slice(source.indexOf('# Introducción'))
}

function splitTopLevelSections(content: string) {
  const sections: string[] = []
  let current: string[] = []
  let insideCode = false
  for (const line of content.split('\n')) {
    if (line.trimStart().startsWith('```')) insideCode = !insideCode
    if (!insideCode && line.startsWith('# ') && current.length) {
      sections.push(current.join('\n').trim())
      current = []
    }
    current.push(line)
  }
  if (current.length) sections.push(current.join('\n').trim())
  return sections.filter(Boolean)
}

export default function AiAssistedProgrammingModuleFourPage() {
  const sections = splitTopLevelSections(getModuleContent())
  const toc: ModuleTocItem[] = sections.map((section) => {
    const heading = section.split('\n', 1)[0].replace(/^# /, '')
    const id = courseSectionId(heading)
    return { id, label: shortLabels[id] ?? heading }
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <Link href="/cursos/programacion-con-ia/curso/modulo-3" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Volver al Módulo 3</Link>
            <p className="mb-3 font-semibold text-accent">COA — Programación Asistida por Inteligencia Artificial</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 4: Depuración, diagnóstico y validación de respuestas</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[[Clock, 'Duración aproximada', '2 horas y 30 minutos'], [GraduationCap, 'Nivel', 'Intermedio'], [BookOpen, 'Requisito', 'Módulos 1 al 3 aprobados'], [Code2, 'Lenguaje', 'El que ya conoces']].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80"><p>Herramientas: Depurador, registros, pruebas, Git y asistente de IA</p><p>Resultado: Rescate de una aplicación defectuosa</p></div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">{['2 prácticas guiadas', 'Ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}</div>
          </div>
        </section>

        <ModuleExperience moduleId="programacion-ia-modulo-4" moduleLabel="Módulo 4" items={toc} nextHref="/cursos/programacion-con-ia/curso/modulo-5" nextLabel="Ir al Módulo 5" completionTitle="¡Has completado el Módulo 4 de Programación Asistida por IA!" completionDescription="Revisa tus actividades, descarga los materiales y confirma la entrega única antes de avanzar.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (Práctica guiada|Ejercicios individuales)/.test(heading)
              const isChallenges = false
              const isMiniProject = /^# Mini proyecto/.test(heading)
              const isProject = /^# Proyecto del módulo/.test(heading)
              const isEvaluation = /^# (Rúbrica|Evaluación|Calificación|Entrega de la actividad)/.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleOneDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/programacion-con-ia/curso/modulo-3" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 3</Link>
              <Link href="/cursos/programacion-con-ia/curso/modulo-5" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Módulo 5 <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

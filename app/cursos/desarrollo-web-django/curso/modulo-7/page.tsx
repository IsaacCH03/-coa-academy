import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, Code2, GraduationCap, Trophy } from 'lucide-react'
import { CourseMarkdown } from '@/components/course-markdown'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { courseSectionId } from '@/lib/course-navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Proyecto Final Integrador: COA Gestión Empresarial Web | C.O.A.',
  description: 'Proyecto final del curso de Django: diseña, prueba, documenta y despliega una aplicación empresarial profesional.',
}

const shortLabels: Record<string, string> = {
  introduccion: 'Introducción',
  'objetivos-de-aprendizaje': 'Objetivos',
  'conocimientos-previos': 'Conocimientos previos',
  'competencias-finales': 'Competencias finales',
  'resultado-obligatorio': 'Resultado obligatorio',
  'distribucion-recomendada-del-tiempo': 'Distribución del tiempo',
  'metodologia-de-trabajo': 'Metodología',
  '1-caso-empresarial': '1. Caso empresarial',
  '2-actores-del-sistema': '2. Actores',
  '3-documento-de-requisitos': '3. Requisitos',
  '4-requisitos-funcionales-obligatorios': '4. Requisitos funcionales',
  '5-reglas-empresariales-obligatorias': '5. Reglas empresariales',
  '6-requisitos-no-funcionales': '6. Requisitos no funcionales',
  '7-modelo-de-datos-minimo': '7. Modelo de datos',
  '8-integridad-y-decisiones-de-datos': '8. Integridad',
  '9-trazabilidad': '9. Trazabilidad',
  '10-definition-of-done': '10. Definition of Done',
  '11-preparacion-del-repositorio-final': '11. Repositorio',
  '12-fase-1-analisis-y-alcance': '12. Análisis y alcance',
  '13-fase-2-arquitectura-y-datos': '13. Arquitectura y datos',
  '14-mini-proyecto-obligatorio-prototipo-del-flujo-critico': '14. Mini proyecto',
  '15-fase-3-integracion-funcional': '15. Integración',
  '16-conexion-con-toda-la-ruta-python': '16. Ruta Python',
  '17-automatizaciones-utiles': '17. Automatizaciones',
  '18-plan-maestro-de-pruebas': '18. Plan de pruebas',
  '19-revision-de-seguridad': '19. Seguridad',
  '20-revision-de-experiencia-de-usuario': '20. Experiencia de usuario',
  '21-revision-de-rendimiento': '21. Rendimiento',
  '22-despliegue-final': '22. Despliegue',
  '23-datos-y-cuentas-de-demostracion': '23. Datos de demostración',
  '24-documentacion-profesional': '24. Documentación',
  '25-presentacion-de-portafolio': '25. Portafolio',
  '26-solicitud-de-cambio-del-instructor': '26. Solicitud de cambio',
  '27-defensa-de-autoria': '27. Defensa',
  '28-actividades-obligatorias': '28. Actividades',
  '29-ejercicios-de-diagnostico': '29. Diagnóstico',
  '30-retos-adicionales': '30. Retos',
  '31-proyecto-final-coa-gestion-empresarial-web': '31. Proyecto final',
  '32-matriz-de-aceptacion-final': '32. Aceptación',
  '33-entregables-finales': '33. Entregables',
  '34-estructura-de-la-entrega': '34. Estructura',
  '35-bitacora-de-inteligencia-artificial': '35. Bitácora de IA',
  '36-rubrica-final-de-evaluacion': '36. Rúbrica',
  '37-condiciones-criticas-de-rechazo': '37. Condiciones críticas',
  '38-requisitos-de-aprobacion': '38. Aprobación',
  '39-punto-de-entrega-unico': '39. Entrega',
  '40-proceso-de-revision': '40. Revisión',
  '41-errores-comunes': '41. Errores comunes',
  '42-videos-recomendados': '42. Videos',
  '43-documentacion-oficial-y-recursos-confiables': '43. Documentación',
  '44-material-complementario': '44. Material',
  '45-glosario': '45. Glosario',
  '46-resumen-final': '46. Resumen',
  '47-checklist-final-del-estudiante': '47. Lista final',
  'cierre-de-la-ruta-python': 'Cierre de la Ruta Python',
}

const finalDelivery = [{
  match: 'módulo 7',
  fileName: 'COA_DJANGO_PROYECTO_FINAL_Nombre_Apellido.zip',
  items: ['COA Gestión Empresarial Web', 'Repositorio y aplicación desplegada', 'Pruebas, documentos y diagramas', 'Presentación y bitácora de IA', 'Evidencias del cambio y de la defensa cuando sean solicitadas'],
  title: 'Entrega del Proyecto Final',
  stepLabel: 'Último paso del curso',
  description: 'Cuando hayas completado y comprobado el proyecto, reúne todos los entregables finales y verifica los enlaces desde una sesión privada.',
  itemsLabel: 'La entrega final debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Proyecto Final',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-7.md'), 'utf8')
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

export default function DjangoFinalProjectPage() {
  const sections = splitTopLevelSections(getModuleContent())
  const finalToc: ModuleTocItem[] = sections.map((section) => {
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
            <Link href="/cursos/desarrollo-web-django/curso/modulo-6" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Volver al Módulo 6</Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 7: Proyecto Final Integrador</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[[Clock, 'Duración aproximada', '10 horas'], [GraduationCap, 'Nivel', 'Avanzado'], [BookOpen, 'Requisito', 'Módulos 1 al 6 aprobados'], [Code2, 'Modalidad', 'Autodidacta y práctica']].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80"><p>Proyecto final: COA Gestión Empresarial Web</p><p>Resultado: Aplicación de portafolio y preparación para el Programa de Experiencia Profesional COA</p></div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">{['1 mini proyecto', '1 proyecto final', 'Plan maestro de pruebas', 'Despliegue', 'Defensa de autoría'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}</div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-7" moduleLabel="Proyecto Final" items={finalToc} completionTitle="¡Felicitaciones! Has completado el Proyecto Final Integrador" completionDescription="Después de enviar el proyecto, completa las correcciones y la defensa solicitadas para obtener la aprobación final de la Ruta Python de COA.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isActivities = /^# (14|28|29)\./.test(heading)
              const isChallenges = /^# 30\./.test(heading)
              const isProject = /^# 31\./.test(heading)
              const isEvaluation = /^# (32|33|34|35|36|37|38|39|40)\./.test(heading)
              const emphasized = isActivities || isChallenges || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={finalDelivery} /></section>
            })}

            <section className="rounded-2xl border border-accent/50 bg-accent/10 p-7 text-center shadow-sm md:p-10">
              <Trophy className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-4 text-2xl font-extrabold text-foreground">¡Felicitaciones por completar la Ruta Python de COA!</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Una vez aprobado el proyecto final y completadas las correcciones y la defensa, estarás preparado para continuar al Programa de Experiencia Profesional COA.</p>
            </section>

            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django/curso/modulo-6" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 6</Link>
              <Link href="/cursos/desarrollo-web-django" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Volver al curso <Trophy className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

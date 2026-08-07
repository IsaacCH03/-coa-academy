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
  title: 'Módulo 6: Arquitectura, pruebas, reportes y despliegue | C.O.A.',
  description: 'Prepara una aplicación Django para producción mediante arquitectura profesional, pruebas, reportes, PostgreSQL y despliegue.',
}

const shortLabels: Record<string, string> = {
  introduccion: 'Introducción',
  'objetivos-de-aprendizaje': 'Objetivos',
  'conocimientos-previos': 'Conocimientos previos',
  'competencias-que-desarrollaras': 'Competencias',
  'distribucion-recomendada-del-tiempo': 'Distribución del tiempo',
  '1-organizacion-profesional-del-proyecto': '1. Organización',
  '2-mvt-y-capas': '2. MVT y capas',
  '3-vistas-delgadas': '3. Vistas delgadas',
  '4-servicios-y-casos-de-uso': '4. Servicios',
  '5-consultas-reutilizables': '5. Consultas',
  '6-funciones-reutilizables': '6. Funciones',
  '7-lo-que-no-pertenece-al-template': '7. Templates',
  '8-configuracion-por-entorno': '8. Configuración',
  '9-variables-de-entorno': '9. Variables de entorno',
  '10-env-example': '10. .env.example',
  '11-gestion-de-dependencias': '11. Dependencias',
  '12-registro-de-eventos': '12. Registro de eventos',
  '13-errores-y-eventos': '13. Errores',
  '14-paginas-403-404-y-500': '14. Páginas de error',
  '15-ruta-de-salud': '15. Ruta de salud',
  '16-pruebas-automaticas-una-red-de-seguridad': '16. Pruebas automáticas',
  '17-organizacion-de-las-pruebas': '17. Organización de pruebas',
  '18-pruebas-de-modelos-y-restricciones': '18. Pruebas de modelos',
  '19-pruebas-de-formularios': '19. Pruebas de formularios',
  '20-pruebas-de-vistas-con-el-cliente-de-django': '20. Pruebas de vistas',
  '21-pruebas-de-permisos': '21. Pruebas de permisos',
  '22-pruebas-de-procesos-criticos-y-transacciones': '22. Pruebas de procesos',
  '23-datos-de-prueba-e-independencia': '23. Datos de prueba',
  '24-optimizacion-del-orm-y-problema-n-1': '24. Optimización ORM',
  '25-selectores-para-consultas-reutilizables': '25. Selectores',
  '26-comprobar-la-cantidad-de-consultas': '26. Medir consultas',
  '27-agregaciones-para-paneles': '27. Agregaciones',
  '28-indices-optimizar-con-evidencia': '28. Índices',
  '29-formulario-de-filtros-para-reportes': '29. Filtros de reportes',
  '30-exportacion-segura-a-csv': '30. Exportar CSV',
  '31-exportacion-a-excel-con-openpyxl': '31. Exportar Excel',
  '32-reglas-profesionales-para-reportes': '32. Reglas de reportes',
  '33-conexion-con-la-automatizacion-aprendida-en-la-ruta-python': '33. Automatización',
  '34-sqlite-en-desarrollo-y-postgresql-en-produccion': '34. PostgreSQL',
  '35-configuracion-de-produccion': '35. Producción',
  '36-archivos-estaticos-con-whitenoise': '36. WhiteNoise',
  '37-archivos-multimedia-no-son-archivos-estaticos': '37. Multimedia',
  '38-migraciones-en-el-proceso-de-publicacion': '38. Migraciones',
  '39-servidor-de-produccion': '39. Servidor',
  '40-comprobacion-de-despliegue-de-django': '40. Comprobar despliegue',
  '41-despliegue-guiado-en-render': '41. Despliegue en Render',
  '42-repositorio-profesional': '42. Repositorio',
  '43-uso-profesional-de-ia-en-esta-etapa': '43. Uso de IA',
  '44-laboratorio-guiado-de-vista-grande-a-flujo-probado': '44. Laboratorio',
  '45-ejercicios-guiados': '45. Ejercicios guiados',
  '46-ejercicios-individuales-obligatorios': '46. Ejercicios',
  '47-retos-adicionales': '47. Retos',
  '48-mini-proyecto-centro-de-reportes-empresariales': '48. Mini proyecto',
  '49-proyecto-del-modulo-version-candidata-del-sistema-empresarial': '49. Proyecto',
  '50-estructura-de-la-entrega': '50. Estructura de entrega',
  '51-rubrica-del-proyecto-del-modulo': '51. Rúbrica',
  '52-evaluacion-practica-del-modulo': '52. Evaluación',
  '53-distribucion-de-la-calificacion': '53. Calificación',
  '54-punto-de-entrega-unico': '54. Entrega',
  '55-proceso-de-revision-y-correccion': '55. Revisión',
  '56-errores-comunes-y-como-corregirlos': '56. Errores comunes',
  '57-buenas-practicas-del-modulo': '57. Buenas prácticas',
  '58-videos-recomendados': '58. Videos',
  '59-documentacion-oficial-y-recursos-confiables': '59. Documentación',
  '60-material-complementario': '60. Material',
  '61-glosario': '61. Glosario',
  '62-resumen-del-modulo': '62. Resumen',
  '63-checklist-final-del-estudiante': '63. Lista final',
  'cierre-del-modulo': 'Cierre del módulo',
}

const moduleSixDelivery = [{
  match: 'módulo 6',
  fileName: 'COA_DJANGO_M6_Nombre_Apellido.zip',
  items: ['Ejercicios obligatorios', 'Centro de Reportes Empresariales', 'Versión Candidata del Sistema Empresarial', 'Evaluación práctica', 'Pruebas, despliegue, evidencias y explicación de arquitectura'],
  title: 'Entrega del Módulo 6',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado todas las actividades, reúne el trabajo del módulo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 6',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-6.md'), 'utf8')
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

export default function DjangoModuleSixPage() {
  const sections = splitTopLevelSections(getModuleContent())
  const moduleSixToc: ModuleTocItem[] = sections.map((section) => {
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
            <Link href="/cursos/desarrollo-web-django/curso/modulo-5" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Volver al Módulo 5</Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 6: Arquitectura, pruebas, reportes y despliegue</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[[Clock, 'Duración aproximada', '7 horas'], [GraduationCap, 'Nivel', 'Avanzado'], [BookOpen, 'Requisito recomendado', 'Módulos 1 al 5 aprobados'], [Code2, 'Modalidad', 'Autodidacta y práctica']].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80"><p>Tecnologías: Django 5.2 LTS, PostgreSQL, Gunicorn, WhiteNoise, OpenPyXL y Render</p><p>Resultado: Versión Candidata del Sistema Empresarial</p></div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">{['Ejercicios guiados', 'Ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}</div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-6" moduleLabel="Módulo 6" items={moduleSixToc} nextHref="/cursos/desarrollo-web-django/curso/modulo-7" nextLabel="Ir al Proyecto Final" completionTitle="¡Has completado el Módulo 6 de Desarrollo Web con Django!" completionDescription="Revisa tus actividades, confirma la entrega única y espera la aprobación antes de avanzar al Proyecto Final Integrador.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (44|45|46)\./.test(heading)
              const isChallenges = /^# 47\./.test(heading)
              const isMiniProject = /^# 48\./.test(heading)
              const isProject = /^# 49\./.test(heading)
              const isEvaluation = /^# (50|51|52|53|54|55)\./.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleSixDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django/curso/modulo-5" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 5</Link>
              <Link href="/cursos/desarrollo-web-django/curso/modulo-7" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Proyecto Final Integrador <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

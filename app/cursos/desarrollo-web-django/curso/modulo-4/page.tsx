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
  title: 'Módulo 4: Formularios, validaciones y CRUD profesional | C.O.A.',
  description: 'Construye formularios seguros, validaciones profesionales y flujos CRUD completos con Django Forms, SQLite y Bootstrap.',
}

const shortLabels: Record<string, string> = {
  introduccion: 'Introducción',
  'objetivos-de-aprendizaje': 'Objetivos',
  'conocimientos-previos': 'Conocimientos previos',
  'distribucion-recomendada-del-tiempo': 'Distribución del tiempo',
  '1-el-ciclo-completo-de-un-formulario': '1. Ciclo del formulario',
  '2-get-y-post': '2. GET y POST',
  '3-formularios-de-django-con-form': '3. Django Form',
  '4-modelform': '4. ModelForm',
  '5-personalizar-widgets': '5. Widgets',
  '6-formulario-enlazado-y-no-enlazado': '6. Formularios enlazados',
  '7-validacion-automatica': '7. Validación automática',
  '8-validacion-de-un-campo': '8. Validación de campo',
  '9-validacion-entre-campos': '9. Validación entre campos',
  '10-donde-debe-vivir-una-regla': '10. Reglas',
  '11-mostrar-errores-correctamente': '11. Mostrar errores',
  '12-proteccion-csrf': '12. Protección CSRF',
  '13-post-redirect-get': '13. Post/Redirect/Get',
  '14-sistema-de-mensajes': '14. Mensajes',
  '15-crud-con-vistas-funcionales': '15. CRUD funcional',
  '16-vistas-genericas-basadas-en-clases': '16. Vistas genéricas',
  '17-elegir-entre-funcion-y-clase': '17. Función o clase',
  '18-urls-con-identificadores-y-slugs': '18. IDs y slugs',
  '19-urls-completas-del-crud': '19. URLs del CRUD',
  '20-confirmaciones-para-acciones-sensibles': '20. Confirmaciones',
  '21-busqueda-con-parametros-get': '21. Búsqueda',
  '22-filtros-combinados': '22. Filtros',
  '23-ordenamiento-seguro': '23. Ordenamiento',
  '24-paginacion': '24. Paginación',
  '25-listview-con-busqueda-filtros-y-orden': '25. ListView',
  '26-evitar-duplicados': '26. Duplicados',
  '27-archivos-multimedia': '27. Multimedia',
  '28-formulario-para-archivos': '28. Formulario de archivos',
  '29-validacion-de-archivos': '29. Validación de archivos',
  '30-reemplazo-y-eliminacion-responsable-de-archivos': '30. Gestionar archivos',
  '31-formsets-basicos': '31. Formsets',
  '32-reutilizacion-de-templates': '32. Reutilización',
  '33-accesibilidad-de-formularios': '33. Accesibilidad',
  '34-laboratorio-guiado-crud-de-productos': '34. Laboratorio',
  '35-inteligencia-artificial-para-revisar-un-crud': '35. Uso de IA',
  '36-ejercicios-obligatorios': '36. Ejercicios',
  '37-retos-adicionales': '37. Retos',
  '38-mini-proyecto-agenda-profesional-de-clientes': '38. Mini proyecto',
  '39-proyecto-del-modulo-gestor-web-de-clientes-y-productos': '39. Proyecto',
  '40-matriz-minima-de-pruebas': '40. Pruebas',
  '41-rubrica-del-proyecto-del-modulo': '41. Rúbrica',
  '42-evaluacion-practica': '42. Evaluación',
  '43-calificacion-y-punto-de-entrega': '43. Entrega',
  '44-errores-comunes-y-soluciones': '44. Errores comunes',
  '45-consejos-profesionales': '45. Consejos',
  '46-videos-recomendados': '46. Videos',
  '47-documentacion-oficial': '47. Documentación',
  '48-material-complementario': '48. Material',
  '49-glosario': '49. Glosario',
  '50-resumen-del-modulo': '50. Resumen',
  '51-lista-de-comprobacion-final': '51. Lista final',
  '52-finalizacion-del-modulo': '52. Finalización',
}

const moduleFourDelivery = [{
  match: 'módulo 4',
  fileName: 'COA_DJANGO_M4_APELLIDO_NOMBRE.zip',
  items: ['12 ejercicios obligatorios', 'Agenda Profesional de Clientes', 'Gestor Web de Clientes y Productos', 'Evaluación práctica', 'Evidencias, casos de prueba y explicación técnica'],
  title: 'Entrega del Módulo 4',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado las actividades, reúne todo el trabajo del módulo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 4',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-4.md'), 'utf8')
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

export default function DjangoModuleFourPage() {
  const sections = splitTopLevelSections(getModuleContent())
  const moduleFourToc: ModuleTocItem[] = sections.map((section) => {
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
            <Link href="/cursos/desarrollo-web-django/curso/modulo-3" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" /> Volver al Módulo 3
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 4: Formularios, validaciones y CRUD profesional</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Clock, 'Duración aproximada', '7 horas'],
                [GraduationCap, 'Nivel', 'Avanzado'],
                [BookOpen, 'Requisito recomendado', 'Módulos 1, 2 y 3 aprobados'],
                [Code2, 'Modalidad', 'Autodidacta y práctica'],
              ].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Django 5.2 LTS, SQLite, Django Forms y Bootstrap 5.3.8</p>
              <p>Resultado: Gestor Web de Clientes y Productos</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['1 laboratorio guiado', '12 ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}
            </div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-4" moduleLabel="Módulo 4" items={moduleFourToc} nextHref="/cursos/desarrollo-web-django/curso/modulo-5" nextLabel="Ir al Módulo 5" completionTitle="¡Has completado el Módulo 4 de Desarrollo Web con Django!" completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (34|36)\./.test(heading)
              const isChallenges = /^# 37\./.test(heading)
              const isMiniProject = /^# 38\./.test(heading)
              const isProject = /^# 39\./.test(heading)
              const isEvaluation = /^# (40|41|42|43)\./.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleFourDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django/curso/modulo-3" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 3</Link>
              <Link href="/cursos/desarrollo-web-django/curso/modulo-5" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Módulo 5 <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

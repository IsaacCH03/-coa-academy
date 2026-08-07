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
  title: 'Módulo 5: Autenticación, permisos y operaciones empresariales | C.O.A.',
  description: 'Implementa autenticación, roles, permisos, transacciones y operaciones empresariales seguras con Django.',
}

const shortLabels: Record<string, string> = {
  introduccion: 'Introducción',
  'objetivos-de-aprendizaje': 'Objetivos',
  'conocimientos-previos': 'Conocimientos previos',
  'distribucion-recomendada-del-tiempo': 'Distribución del tiempo',
  '1-autenticacion-y-autorizacion': '1. Autenticación y autorización',
  '2-sistema-de-autenticacion-de-django': '2. Django Auth',
  '3-contrasenas': '3. Contraseñas',
  '4-registro-controlado-de-usuarios': '4. Registro de usuarios',
  '5-registro-interno-con-rol-controlado': '5. Registro por roles',
  '6-inicio-de-sesion': '6. Inicio de sesión',
  '7-cierre-de-sesion': '7. Cierre de sesión',
  '8-cambio-de-contrasena': '8. Cambio de contraseña',
  '9-recuperacion-de-contrasena': '9. Recuperación',
  '10-perfil-de-usuario': '10. Perfil',
  '11-proteger-vistas-funcionales': '11. Proteger funciones',
  '12-proteger-vistas-basadas-en-clases': '12. Proteger clases',
  '13-grupos-y-permisos': '13. Grupos y permisos',
  '14-permisos-personalizados': '14. Permisos personalizados',
  '15-matriz-de-roles': '15. Matriz de roles',
  '16-crear-grupos-de-forma-reproducible': '16. Crear grupos',
  '17-ocultar-no-significa-proteger': '17. Ocultar no protege',
  '18-propiedad-de-registros': '18. Propiedad',
  '19-permisos-de-objeto': '19. Permisos de objeto',
  '20-respuesta-403': '20. Respuesta 403',
  '21-principio-de-minimo-privilegio': '21. Mínimo privilegio',
  '22-modelar-una-venta': '22. Modelar ventas',
  '23-detalle-de-venta': '23. Detalle de venta',
  '24-relacionar-movimientos-con-ventas': '24. Movimientos',
  '25-que-es-una-transaccion': '25. Transacciones',
  '26-transaction-atomic': '26. transaction.atomic()',
  '27-formset-de-lineas-de-venta': '27. Formset de venta',
  '28-servicio-para-registrar-una-venta': '28. Registrar venta',
  '29-concurrencia-y-sqlite': '29. Concurrencia',
  '30-vista-para-registrar-la-venta': '30. Vista de venta',
  '31-template-del-formset-de-venta': '31. Template de venta',
  '32-cancelacion-controlada': '32. Cancelación',
  '33-formulario-y-vista-de-cancelacion': '33. Formulario de cancelación',
  '34-auditoria-basica': '34. Auditoría',
  '35-panel-personalizado-por-rol': '35. Panel por rol',
  '36-csrf': '36. CSRF',
  '37-xss': '37. XSS',
  '38-inyeccion-sql': '38. Inyección SQL',
  '39-sesiones-cookies-y-https': '39. Sesiones y HTTPS',
  '40-datos-sensibles-y-registros': '40. Datos sensibles',
  '41-archivos-cargados': '41. Archivos',
  '42-inteligencia-artificial-para-revisar-seguridad': '42. IA y seguridad',
  '43-laboratorio-guiado-asegurar-el-sistema-y-registrar-ventas': '43. Laboratorio',
  '44-ejercicios-obligatorios': '44. Ejercicios',
  '45-retos-adicionales': '45. Retos',
  '46-mini-proyecto-portal-privado-por-roles': '46. Mini proyecto',
  '47-proyecto-del-modulo-sistema-seguro-de-ventas-e-inventario': '47. Proyecto',
  '48-matriz-minima-de-pruebas': '48. Pruebas',
  '49-rubrica-del-proyecto': '49. Rúbrica',
  '50-evaluacion-practica': '50. Evaluación',
  '51-calificacion-y-punto-de-entrega': '51. Entrega',
  '52-errores-comunes-y-soluciones': '52. Errores comunes',
  '53-consejos-profesionales': '53. Consejos',
  '54-videos-recomendados': '54. Videos',
  '55-documentacion-oficial': '55. Documentación',
  '56-material-complementario': '56. Material',
  '57-glosario': '57. Glosario',
  '58-resumen-del-modulo': '58. Resumen',
  '59-lista-de-comprobacion-final': '59. Lista final',
  '60-finalizacion-del-modulo': '60. Finalización',
}

const moduleFiveDelivery = [{
  match: 'módulo 5',
  fileName: 'COA_DJANGO_M5_APELLIDO_NOMBRE.zip',
  items: ['12 ejercicios obligatorios', 'Portal Privado por Roles', 'Sistema Seguro de Ventas e Inventario', 'Evaluación práctica', 'Pruebas, auditoría, revisión de seguridad y registro de IA'],
  title: 'Entrega del Módulo 5',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado las actividades, reúne todo el trabajo del módulo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 5',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-5.md'), 'utf8')
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

export default function DjangoModuleFivePage() {
  const sections = splitTopLevelSections(getModuleContent())
  const moduleFiveToc: ModuleTocItem[] = sections.map((section) => {
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
            <Link href="/cursos/desarrollo-web-django/curso/modulo-4" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Volver al Módulo 4</Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 5: Autenticación, permisos y operaciones empresariales</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[[Clock, 'Duración aproximada', '7 horas'], [GraduationCap, 'Nivel', 'Avanzado'], [BookOpen, 'Requisito recomendado', 'Módulos 1 al 4 aprobados'], [Code2, 'Modalidad', 'Autodidacta y práctica']].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80"><p>Tecnologías: Django 5.2 LTS, SQLite, Django Auth y Django ORM</p><p>Resultado: Sistema Seguro de Ventas e Inventario</p></div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">{['1 laboratorio guiado', '12 ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}</div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-5" moduleLabel="Módulo 5" items={moduleFiveToc} nextHref="/cursos/desarrollo-web-django/curso/modulo-6" nextLabel="Ir al Módulo 6" completionTitle="¡Has completado el Módulo 5 de Desarrollo Web con Django!" completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (43|44)\./.test(heading)
              const isChallenges = /^# 45\./.test(heading)
              const isMiniProject = /^# 46\./.test(heading)
              const isProject = /^# 47\./.test(heading)
              const isEvaluation = /^# (48|49|50|51)\./.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleFiveDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django/curso/modulo-4" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 4</Link>
              <Link href="/cursos/desarrollo-web-django/curso/modulo-6" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Módulo 6 <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

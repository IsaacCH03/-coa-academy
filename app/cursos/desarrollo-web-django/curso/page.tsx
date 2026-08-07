import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Code2, GraduationCap } from 'lucide-react'
import { CourseMarkdown } from '@/components/course-markdown'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = {
  title: 'Módulo 1: Django y la arquitectura de una aplicación web | C.O.A.',
  description: 'Aprende la arquitectura MVT de Django, crea aplicaciones, rutas, vistas y templates, y construye el Portal de Operaciones COA.',
}

const moduleOneToc: ModuleTocItem[] = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'distribucion-recomendada-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-que-sucede-cuando-visitas-una-pagina-web', label: '1. Una página web' },
  { id: '2-cliente-servidor-solicitud-y-respuesta', label: '2. Cliente y servidor' },
  { id: '3-que-es-django', label: '3. Django' },
  { id: '4-arquitectura-mvt', label: '4. Arquitectura MVT' },
  { id: '5-preparacion-del-entorno', label: '5. Entorno' },
  { id: '6-laboratorio-de-entorno', label: '6. Laboratorio' },
  { id: '7-crear-el-primer-proyecto', label: '7. Primer proyecto' },
  { id: '8-comprender-manage-py', label: '8. manage.py' },
  { id: '9-estructura-del-proyecto-config', label: '9. Estructura' },
  { id: '10-servidor-de-desarrollo', label: '10. Servidor' },
  { id: '11-proyecto-y-aplicacion-no-son-lo-mismo', label: '11. Proyecto y app' },
  { id: '12-crear-la-aplicacion-principal', label: '12. Crear aplicación' },
  { id: '13-registrar-la-aplicacion', label: '13. Registrar aplicación' },
  { id: '14-crear-la-primera-vista', label: '14. Primera vista' },
  { id: '15-crear-rutas-de-la-aplicacion', label: '15. Rutas de la app' },
  { id: '16-conectar-las-rutas-del-proyecto', label: '16. Conectar rutas' },
  { id: '17-flujo-completo-de-una-solicitud', label: '17. Flujo de solicitud' },
  { id: '18-crear-varias-rutas', label: '18. Varias rutas' },
  { id: '19-rutas-dinamicas', label: '19. Rutas dinámicas' },
  { id: '20-inspeccionar-la-solicitud', label: '20. Solicitud' },
  { id: '21-html-con-httpresponse', label: '21. HTML y HttpResponse' },
  { id: '22-crear-el-primer-template', label: '22. Primer template' },
  { id: '23-enviar-contexto-al-template', label: '23. Contexto' },
  { id: '24-flujo-completo-con-render', label: '24. Flujo con render' },
  { id: '25-nombres-de-ruta-y-namespaces', label: '25. Namespaces' },
  { id: '26-manejo-de-errores-404', label: '26. Errores 404' },
  { id: '27-pagina-404-personalizada', label: '27. Página 404' },
  { id: '28-control-de-versiones-con-git', label: '28. Git' },
  { id: '29-uso-profesional-de-inteligencia-artificial', label: '29. Uso de IA' },
  { id: '30-ejercicio-guiado-completo', label: '30. Ejercicio guiado' },
  { id: '31-ejercicios-individuales-obligatorios', label: '31. Ejercicios' },
  { id: '32-retos-adicionales', label: '32. Retos' },
  { id: '33-mini-proyecto', label: '33. Mini proyecto' },
  { id: '34-proyecto-del-modulo', label: '34. Proyecto' },
  { id: '35-pruebas-manuales-obligatorias', label: '35. Pruebas' },
  { id: '36-rubrica-de-evaluacion', label: '36. Rúbrica' },
  { id: '37-evaluacion-practica', label: '37. Evaluación' },
  { id: '38-punto-de-entrega', label: '38. Entrega' },
  { id: '39-errores-comunes-y-soluciones', label: '39. Errores comunes' },
  { id: '40-buenas-practicas', label: '40. Buenas prácticas' },
  { id: '41-videos-recomendados', label: '41. Videos' },
  { id: '42-documentacion-y-lecturas', label: '42. Lecturas' },
  { id: '43-material-complementario', label: '43. Material' },
  { id: '44-glosario', label: '44. Glosario' },
  { id: '45-resumen-del-modulo', label: '45. Resumen' },
  { id: '46-lista-de-comprobacion-final', label: '46. Lista final' },
  { id: 'finalizacion-del-modulo', label: 'Finalización' },
]

const moduleOneDelivery = [{
  match: 'módulo 1',
  fileName: 'COA_DJANGO_M1_APELLIDO_NOMBRE.zip',
  items: ['Ejercicios obligatorios', 'Mini proyecto', 'Portal de Operaciones COA', 'Evaluación y evidencias', 'Explicación y bitácora de IA'],
  title: 'Entrega del Módulo 1',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado todas las actividades, reúne el trabajo del módulo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 1',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-1.md'), 'utf8')
  return source.slice(source.indexOf('# Introducción'))
}

export default function DjangoModuleOnePage() {
  const sections = getModuleContent().split(/(?=^# )/gm).map((section) => section.trim()).filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <Link href="/cursos/desarrollo-web-django/inscripcion" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" /> Volver a la inscripción
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 1: Django y la arquitectura de una aplicación web</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Clock, 'Duración aproximada', '5 horas'],
                [GraduationCap, 'Nivel', 'Avanzado'],
                [BookOpen, 'Requisito recomendado', 'Ruta Python de C.O.A.'],
                [Code2, 'Modalidad', 'Autodidacta y práctica'],
              ].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Django 5.2 LTS, Python, HTML, Git e Inteligencia Artificial</p>
              <p>Resultado: Portal de Operaciones COA</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['1 ejercicio guiado', '12 ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}
            </div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-1" moduleLabel="Módulo 1" items={moduleOneToc} nextHref="/cursos/desarrollo-web-django/curso/modulo-2" nextLabel="Ir al Módulo 2" completionTitle="¡Has completado el Módulo 1 de Desarrollo Web con Django!" completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (30|31)\./.test(heading)
              const isChallenges = /^# 32\./.test(heading)
              const isMiniProject = /^# 33\./.test(heading)
              const isProject = /^# 34\./.test(heading)
              const isEvaluation = /^# (35|36|37|38)\./.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleOneDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Ver información del curso</Link>
              <Link href="/cursos/desarrollo-web-django/curso/modulo-2" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Módulo 2 <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

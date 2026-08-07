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
  title: 'Módulo 2: Interfaces profesionales con templates y Bootstrap | C.O.A.',
  description: 'Construye interfaces Django reutilizables, responsive y accesibles con Django Template Language y Bootstrap 5.',
}

const moduleTwoToc: ModuleTocItem[] = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'objetivos-de-aprendizaje', label: 'Objetivos' },
  { id: 'distribucion-recomendada-del-tiempo', label: 'Distribución del tiempo' },
  { id: '1-la-responsabilidad-de-un-template', label: '1. Templates' },
  { id: '2-django-template-language', label: '2. Django Template Language' },
  { id: '3-variables-y-acceso-mediante-punto', label: '3. Variables' },
  { id: '4-filtros-utiles', label: '4. Filtros' },
  { id: '5-condicionales', label: '5. Condicionales' },
  { id: '6-ciclos-y-estados-vacios', label: '6. Ciclos' },
  { id: '7-herencia-de-templates', label: '7. Herencia' },
  { id: '8-componentes-reutilizables-con-include', label: '8. Componentes' },
  { id: '9-enlaces-mediante-nombres-de-rutas', label: '9. Enlaces' },
  { id: '10-archivos-estaticos', label: '10. Archivos estáticos' },
  { id: '11-html-semantico-indispensable', label: '11. HTML semántico' },
  { id: '12-integracion-de-bootstrap-5-3-8', label: '12. Bootstrap' },
  { id: '13-diseno-mobile-first-y-cuadricula', label: '13. Mobile first' },
  { id: '14-barra-de-navegacion-adaptable', label: '14. Navegación' },
  { id: '15-tarjetas-reutilizables', label: '15. Tarjetas' },
  { id: '16-tablas-que-funcionan-en-pantallas-pequenas', label: '16. Tablas responsive' },
  { id: '17-estados-vacios-avisos-y-retroalimentacion', label: '17. Estados y avisos' },
  { id: '18-css-propio-sin-competir-con-bootstrap', label: '18. CSS propio' },
  { id: '19-accesibilidad-basica-desde-el-inicio', label: '19. Accesibilidad' },
  { id: '20-seguridad-basica-en-los-templates', label: '20. Seguridad' },
  { id: '21-laboratorio-guiado-transformar-el-portal-del-modulo-1', label: '21. Laboratorio' },
  { id: '22-inteligencia-artificial-como-asistente-de-interfaz', label: '22. Uso de IA' },
  { id: '23-ejercicios-obligatorios', label: '23. Ejercicios' },
  { id: '24-retos-adicionales', label: '24. Retos' },
  { id: '25-mini-proyecto-catalogo-visual-responsive', label: '25. Mini proyecto' },
  { id: '26-proyecto-del-modulo-sitio-empresarial-reutilizable', label: '26. Proyecto' },
  { id: '27-pruebas-manuales-del-proyecto', label: '27. Pruebas' },
  { id: '28-rubrica-del-proyecto-del-modulo', label: '28. Rúbrica' },
  { id: '29-evaluacion-practica-del-modulo', label: '29. Evaluación' },
  { id: '30-calificacion-y-punto-de-entrega', label: '30. Entrega' },
  { id: '31-errores-comunes-y-como-resolverlos', label: '31. Errores comunes' },
  { id: '32-buenas-practicas-del-modulo', label: '32. Buenas prácticas' },
  { id: '33-videos-recomendados', label: '33. Videos' },
  { id: '34-documentacion-y-recursos', label: '34. Lecturas' },
  { id: '35-material-complementario', label: '35. Material' },
  { id: '36-glosario', label: '36. Glosario' },
  { id: '37-resumen-del-modulo', label: '37. Resumen' },
  { id: '38-lista-de-comprobacion-final', label: '38. Lista final' },
  { id: '39-finalizacion-del-modulo', label: '39. Finalización' },
]

const moduleTwoDelivery = [{
  match: 'módulo 2',
  fileName: 'COA_DJANGO_M2_APELLIDO_NOMBRE.zip',
  items: ['12 ejercicios obligatorios', 'Catálogo Visual Responsive', 'Sitio Empresarial Reutilizable', 'Evaluación práctica', 'Evidencias y explicación técnica'],
  title: 'Entrega del Módulo 2',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado las actividades, reúne todo el trabajo del módulo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 2',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-2.md'), 'utf8')
  return source.slice(source.indexOf('# Introducción'))
}

export default function DjangoModuleTwoPage() {
  const sections = getModuleContent().split(/(?=^# )/gm).map((section) => section.trim()).filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <Link href="/cursos/desarrollo-web-django/curso" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" /> Volver al Módulo 1
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 2: Interfaces profesionales con templates y Bootstrap</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Clock, 'Duración aproximada', '5 horas'],
                [GraduationCap, 'Nivel', 'Avanzado'],
                [BookOpen, 'Requisito recomendado', 'Módulo 1 aprobado'],
                [Code2, 'Modalidad', 'Autodidacta y práctica'],
              ].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Django 5.2 LTS, Django Template Language y Bootstrap 5.3.8</p>
              <p>Resultado: Sitio Empresarial Reutilizable</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['1 laboratorio guiado', '12 ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}
            </div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-2" moduleLabel="Módulo 2" items={moduleTwoToc} nextHref="/cursos/desarrollo-web-django/curso/modulo-3" nextLabel="Ir al Módulo 3" completionTitle="¡Has completado el Módulo 2 de Desarrollo Web con Django!" completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (21|23)\./.test(heading)
              const isChallenges = /^# 24\./.test(heading)
              const isMiniProject = /^# 25\./.test(heading)
              const isProject = /^# 26\./.test(heading)
              const isEvaluation = /^# (27|28|29|30)\./.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleTwoDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django/curso" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 1</Link>
              <Link href="/cursos/desarrollo-web-django/curso/modulo-3" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Módulo 3 <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

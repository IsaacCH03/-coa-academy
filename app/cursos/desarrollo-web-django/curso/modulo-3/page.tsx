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
  title: 'Módulo 3: Modelos, relaciones, ORM y administración | C.O.A.',
  description: 'Diseña modelos relacionados, administra migraciones y utiliza el ORM y Django Admin para construir un núcleo de inventario empresarial.',
}

const shortLabels: Record<string, string> = {
  introduccion: 'Introducción',
  'objetivos-de-aprendizaje': 'Objetivos',
  'conocimientos-previos': 'Conocimientos previos',
  'distribucion-recomendada-del-tiempo': 'Distribución del tiempo',
  '1-de-una-necesidad-empresarial-a-un-modelo-de-datos': '1. Modelo de datos',
  '2-entidades-atributos-y-relaciones': '2. Entidades y relaciones',
  '3-diagrama-entidad-relacion': '3. Diagrama ER',
  '4-del-diseno-sql-al-modelo-django': '4. Modelo Django',
  '5-campos-utilizados-con-mayor-frecuencia': '5. Campos',
  '6-opciones-de-los-campos': '6. Opciones de campos',
  '7-representacion-y-metadatos': '7. Metadatos',
  '8-claves-primarias-identidad-interna-y-codigo-empresarial': '8. Claves primarias',
  '9-relaciones-uno-a-muchos': '9. Uno a muchos',
  '10-relaciones-muchos-a-muchos': '10. Muchos a muchos',
  '11-relaciones-uno-a-uno': '11. Uno a uno',
  '12-integridad-referencial-y-on-delete': '12. Integridad referencial',
  '13-modelo-de-usuario-personalizado-desde-el-inicio': '13. Usuario personalizado',
  '14-modelos-del-nucleo-empresarial': '14. Núcleo empresarial',
  '15-migraciones-historial-del-esquema': '15. Migraciones',
  '16-reglas-profesionales-para-migraciones': '16. Reglas de migración',
  '17-consola-de-django': '17. Consola Django',
  '18-crear-registros-con-el-orm': '18. Crear con ORM',
  '19-consultar-registros': '19. Consultas',
  '20-consultas-mediante-lookups': '20. Lookups',
  '21-consultas-a-traves-de-relaciones': '21. Consultas relacionadas',
  '22-busquedas-complejas-con-q': '22. Consultas con Q',
  '23-operaciones-con-f': '23. Operaciones con F',
  '24-modificar-y-eliminar': '24. Modificar y eliminar',
  '25-agregaciones-iniciales': '25. Agregaciones',
  '26-comprender-el-sql-generado': '26. SQL generado',
  '27-consultas-repetidas-y-problema-n-1': '27. Problema N+1',
  '28-django-admin-herramienta-interna': '28. Django Admin',
  '29-organizacion-del-formulario-administrativo': '29. Formulario Admin',
  '30-acciones-administrativas-basicas': '30. Acciones Admin',
  '31-datos-de-prueba-reproducibles': '31. Datos de prueba',
  '32-laboratorio-guiado-construir-el-nucleo-de-inventario': '32. Laboratorio',
  '33-inteligencia-artificial-para-revisar-datos': '33. Uso de IA',
  '34-ejercicios-obligatorios': '34. Ejercicios',
  '35-retos-adicionales': '35. Retos',
  '36-mini-proyecto-biblioteca-administrable': '36. Mini proyecto',
  '37-proyecto-del-modulo-nucleo-de-inventario-empresarial': '37. Proyecto',
  '38-pruebas-del-proyecto': '38. Pruebas',
  '39-rubrica-del-proyecto-del-modulo': '39. Rúbrica',
  '40-evaluacion-practica': '40. Evaluación',
  '41-calificacion-y-punto-de-entrega': '41. Entrega',
  '42-errores-comunes-y-soluciones': '42. Errores comunes',
  '43-recomendaciones-profesionales': '43. Recomendaciones',
  '44-videos-recomendados': '44. Videos',
  '45-documentacion-oficial': '45. Documentación',
  '46-como-consultar-la-documentacion': '46. Consultar documentación',
  '47-material-complementario': '47. Material',
  '48-glosario': '48. Glosario',
  '49-resumen-del-modulo': '49. Resumen',
  '50-lista-de-comprobacion-final': '50. Lista final',
  '51-finalizacion-del-modulo': '51. Finalización',
}

const moduleThreeDelivery = [{
  match: 'módulo 3',
  fileName: 'COA_DJANGO_M3_APELLIDO_NOMBRE.zip',
  items: ['12 ejercicios obligatorios', 'Biblioteca Administrable', 'Núcleo de Inventario Empresarial', 'Evaluación práctica', 'Migraciones, diagramas, evidencias y explicación técnica'],
  title: 'Entrega del Módulo 3',
  stepLabel: 'Último paso del módulo',
  description: 'Cuando hayas completado las actividades, reúne todo el trabajo del módulo en un único archivo comprimido.',
  itemsLabel: 'La entrega única debe incluir:',
  fileNameLabel: 'Nombre solicitado',
  buttonLabel: 'Entregar Módulo 3',
}]

function getModuleContent() {
  const source = readFileSync(path.join(process.cwd(), 'content', 'django-modulo-3.md'), 'utf8')
  return source.slice(source.indexOf('# Introducción'))
}

export default function DjangoModuleThreePage() {
  const sections = getModuleContent().split(/(?=^# )/gm).map((section) => section.trim()).filter(Boolean)
  const moduleThreeToc: ModuleTocItem[] = sections.map((section) => {
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
            <Link href="/cursos/desarrollo-web-django/curso/modulo-2" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" /> Volver al Módulo 2
            </Link>
            <p className="mb-3 font-semibold text-accent">COA — Desarrollo Web con Django</p>
            <h1 className="max-w-4xl text-balance text-3xl font-extrabold md:text-5xl">Módulo 3: Modelos, relaciones, ORM y administración</h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Clock, 'Duración aproximada', '7 horas'],
                [GraduationCap, 'Nivel', 'Avanzado'],
                [BookOpen, 'Requisito recomendado', 'Módulos 1 y 2 aprobados'],
                [Code2, 'Modalidad', 'Autodidacta y práctica'],
              ].map(([Icon, title, value]) => {
                const CardIcon = Icon as typeof Clock
                return <div key={String(title)} className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20"><CardIcon className="mb-2 h-5 w-5 text-accent" /><p className="font-semibold">{String(title)}</p><p className="text-primary-foreground/80">{String(value)}</p></div>
              })}
            </div>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>Tecnologías: Django 5.2 LTS, SQLite y Django ORM</p>
              <p>Resultado: Núcleo de Inventario Empresarial</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['1 laboratorio guiado', '12 ejercicios obligatorios', '1 mini proyecto', '1 proyecto', '1 evaluación'].map((item) => <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">{item}</span>)}
            </div>
          </div>
        </section>

        <ModuleExperience moduleId="django-modulo-3" moduleLabel="Módulo 3" items={moduleThreeToc} nextHref="/cursos/desarrollo-web-django/curso/modulo-4" nextLabel="Ir al Módulo 4" completionTitle="¡Has completado el Módulo 3 de Desarrollo Web con Django!" completionDescription="Revisa tus actividades, confirma la entrega única y consulta nuevamente los recursos antes de avanzar.">
          <article className="space-y-10">
            {sections.map((section) => {
              const heading = section.split('\n', 1)[0]
              const isPractice = /^# (32|34)\./.test(heading)
              const isChallenges = /^# 35\./.test(heading)
              const isMiniProject = /^# 36\./.test(heading)
              const isProject = /^# 37\./.test(heading)
              const isEvaluation = /^# (38|39|40|41)\./.test(heading)
              const emphasized = isPractice || isChallenges || isMiniProject || isProject || isEvaluation
              return <section key={heading} className={emphasized ? `rounded-2xl border p-6 shadow-sm md:p-7 ${isChallenges ? 'border-accent/50 bg-accent/5' : isMiniProject || isProject ? 'border-primary/30 bg-secondary/40' : 'border-border bg-card'}` : ''}><CourseMarkdown markdown={section} deliveryVariants={moduleThreeDelivery} /></section>
            })}
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-8 sm:flex-row">
              <Link href="/cursos/desarrollo-web-django/curso/modulo-2" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><ArrowLeft className="h-4 w-4" /> Módulo 2</Link>
              <Link href="/cursos/desarrollo-web-django/curso/modulo-4" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Módulo 4 <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

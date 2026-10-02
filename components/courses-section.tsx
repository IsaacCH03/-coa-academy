import Link from 'next/link'
import { CourseRail, type CourseRailItem } from '@/components/course-rail'
import { catalogCategories, courses, getCourse } from '@/lib/courses'
import type { PublicLiveGroup } from '@/lib/public-live-groups'

export function CoursesSection({publicGroups=[]}:{publicGroups?:PublicLiveGroup[]}) {
  const catalogGroups=publicGroups.filter(group=>group.showCatalog)
  const items:CourseRailItem[]=[
    ...courses.map(course=>({slug:course.slug,title:course.title,category:course.catalogCategory,image:course.image,subtitle:course.short,href:`/cursos/${course.slug}`,disabled:course.comingSoon,duration:course.duration,modality:course.modality,lessons:course.lessons,price:course.price,billing:course.billing,actionLabel:'Ver curso'})),
    ...catalogGroups.map(group=>{const course=group.course?getCourse(group.course.slug):undefined;return {slug:`group-${group.slug}`,title:group.name,category:'Otros',image:group.image,subtitle:group.summary??(group.course?`Grupo en vivo de ${group.course.title}`:'Grupo público en vivo'),href:`/inscripcion/grupo/${group.slug}`,duration:course?.duration??'En vivo',modality:'En vivo',lessons:course?.lessons??0,price:course?.price??'Gratis',billing:course?.billing,actionLabel:'Inscribirme'}}),
  ]
  const categories=catalogCategories.filter(category=>items.some(item=>item.category===category))
  return (
    <section id="cursos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="mb-3 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-primary">
          Nuestros cursos
        </span>
        <h2 className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">
          Encuentra el curso ideal para seguir aprendiendo
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
          Explora nuestros cursos prácticos, conoce sus contenidos y elige la opción que
          mejor se adapte a tus objetivos de aprendizaje.
        </p>
      </div>

      <div className="mb-8 flex justify-center"><Link href="#todos-los-cursos" className="rounded-xl border border-primary px-5 py-2.5 text-sm font-bold text-primary">Ver todos los cursos</Link></div>
      <div className="space-y-12">{categories.map(category=>{const categoryItems=items.filter(item=>item.category===category);return <section key={category} aria-labelledby={`category-${category.replace(/\W+/g,'-').toLowerCase()}`}><h3 id={`category-${category.replace(/\W+/g,'-').toLowerCase()}`} className="mb-5 text-2xl font-extrabold">{category}</h3><CourseRail courses={categoryItems} ariaLabel={`Cursos de ${category}`} actionLabel="Ver curso" variant="catalog"/></section>})}</div>
      <div id="todos-los-cursos" className="scroll-mt-24 pt-16"><h3 className="mb-6 text-2xl font-extrabold">Todos los cursos</h3><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=>item.disabled?<article key={item.slug} className="rounded-2xl border border-border bg-card p-5 opacity-75"><p className="text-xs font-bold uppercase tracking-wider text-primary">{item.category}</p><h4 className="mt-2 font-bold text-card-foreground">{item.title}</h4><p className="mt-2 text-sm font-semibold text-muted-foreground">Próximamente</p></article>:<Link key={item.slug} href={item.href!} className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40"><p className="text-xs font-bold uppercase tracking-wider text-primary">{item.category}</p><h4 className="mt-2 font-bold text-card-foreground">{item.title}</h4>{item.subtitle&&<p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</p>}</Link>)}</div></div>
    </section>
  )
}

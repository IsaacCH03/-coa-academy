'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { CourseCard } from '@/components/course-card'
import { SafeImage } from '@/components/safe-image'

export type CourseRailItem = {
  slug: string
  title: string
  category: string
  image: string
  href?: string
  subtitle?: string
  disabled?: boolean
  duration?: string
  modality?: string
  lessons?: number
  price?: string
  billing?: string|null
  actionLabel?: string
}

const cardClass="group w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-[300px] lg:w-[340px]"
const catalogCardClass="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[300px] lg:w-[340px] [&>article]:h-full"
function RailCard({course,actionLabel}:{course:CourseRailItem;actionLabel:string}){
  const content=<article><div className="relative aspect-[16/9] overflow-hidden bg-secondary"><SafeImage src={course.image||'/placeholder.svg'} alt={`Portada del curso ${course.title}`} sizes="(max-width: 640px) 78vw, 340px" className="object-cover transition-transform duration-300 group-hover:scale-105"/></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">{course.category}</p><h3 className="mt-2 line-clamp-2 text-lg font-bold text-card-foreground">{course.title}</h3>{course.subtitle&&<p className="mt-1 text-sm text-muted-foreground">{course.subtitle}</p>}<span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">{course.disabled?'Próximamente':actionLabel}{!course.disabled&&<ArrowRight className="h-4 w-4"/>}</span></div></article>
  return course.disabled?<div aria-disabled="true" className={cardClass}>{content}</div>:<Link href={course.href??`/mi-coa/cursos/${course.slug}`} className={cardClass}>{content}</Link>
}

export function CourseRail({ courses, ariaLabel='Cursos matriculados', actionLabel='Continuar', variant='compact' }: { courses: CourseRailItem[];ariaLabel?:string;actionLabel?:string;variant?:'compact'|'catalog' }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateControls = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    setCanScrollBack(rail.scrollLeft > 1)
    setCanScrollForward(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    updateControls()
    rail.addEventListener('scroll', updateControls, { passive: true })
    const observer = new ResizeObserver(updateControls)
    observer.observe(rail)
    return () => {
      rail.removeEventListener('scroll', updateControls)
      observer.disconnect()
    }
  }, [updateControls])

  const scroll = (direction: -1 | 1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.8, 280), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:pr-4"
      >
        {courses.map(course=>variant==='catalog'?<div key={course.slug} className={catalogCardClass}><CourseCard course={{slug:course.slug,title:course.title,category:course.category,image:course.image,short:course.subtitle??'',duration:course.duration??'',modality:course.modality,lessons:course.lessons??0,price:course.price??'',billing:course.billing,comingSoon:course.disabled}} href={course.href} actionLabel={course.actionLabel??actionLabel}/></div>:<RailCard key={course.slug} course={course} actionLabel={actionLabel}/>)}
      </div>

      {canScrollBack && (
        <button
          type="button"
          aria-label="Cursos anteriores"
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition hover:bg-secondary md:inline-flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollForward && (
        <button
          type="button"
          aria-label="Cursos siguientes"
          onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-lg transition hover:bg-secondary md:inline-flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

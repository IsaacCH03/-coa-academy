import Image from 'next/image'
import Link from 'next/link'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '@/lib/courses'

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image
          src={course.image || '/placeholder.svg'}
          alt={`Portada del curso ${course.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-card-foreground">{course.title}</h3>
        <p className="flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          {course.short}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.modality ?? `${course.lessons} lecciones`}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
          {course.billing ? (
            <div className="flex items-end gap-1.5">
              <span className="text-lg font-extrabold text-primary">{course.price}</span>
              <span className="pb-0.5 text-xs text-muted-foreground">
                {course.billing}
              </span>
            </div>
          ) : (
            <span className="text-lg font-extrabold text-primary">{course.price}</span>
          )}
          {course.comingSoon ? (
            <span className="inline-flex h-8 items-center rounded-md bg-primary/80 px-3 text-xs font-semibold text-primary-foreground">
              Próximamente
            </span>
          ) : (
            <Button
              asChild
              size="sm"
              className="gap-1 bg-primary font-semibold hover:bg-primary/90"
            >
              <Link href={`/cursos/${course.slug}`}>
                Ver curso
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

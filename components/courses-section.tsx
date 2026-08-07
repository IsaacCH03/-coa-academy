import { CourseCard } from '@/components/course-card'
import { courses } from '@/lib/courses'

export function CoursesSection() {
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CourseRail, type CourseRailItem } from '@/components/course-rail'
import { getCourse } from '@/lib/courses'
import { accessibleEnrollments, getCurrentStudentEnrollments } from '@/lib/student-enrollments'

export async function ContinueLearningSection() {
  const result = await getCurrentStudentEnrollments()
  if (result.status !== 'success') return null

  const courses = accessibleEnrollments(result.enrollments)
    .map((enrollment) => {
      const slug = enrollment.courses?.slug
      const course = slug ? getCourse(slug) : undefined
      if (!course || course.comingSoon) return null
      return { slug: course.slug, title: course.title, category: course.category, image: course.image } satisfies CourseRailItem
    })
    .filter((course): course is CourseRailItem => course !== null)

  if (courses.length === 0) return null

  return (
    <section aria-labelledby="continue-learning-title" className="border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">Tus cursos</p>
            <h2 id="continue-learning-title" className="text-2xl font-extrabold text-foreground md:text-3xl">
              Continúa aprendiendo
            </h2>
          </div>
          <Link href="/mi-coa" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CourseRail courses={courses} />
      </div>
    </section>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CourseRail, type CourseRailItem } from '@/components/course-rail'
import { getCourse } from '@/lib/courses'
import { accessibleEnrollments, getCurrentStudentEnrollments } from '@/lib/student-enrollments'
import { createClient } from '@/lib/supabase/server'
import { resolveLiveGroupCover } from '@/lib/live-groups'

export async function ContinueLearningSection() {
  const result = await getCurrentStudentEnrollments()
  if (result.status !== 'success') return null

  const supabase = result.userId ? await createClient() : null
  const { data: memberships } = supabase ? await supabase.from('live_group_members').select('joined_at,live_groups!inner(id,slug,name,status,image_path,courses(title))').eq('student_id', result.userId!).eq('live_groups.status', 'active').order('joined_at', { ascending: false }) : { data: [] }
  const courses: CourseRailItem[] = accessibleEnrollments(result.enrollments)
    .map((enrollment) => {
      const slug = enrollment.courses?.slug
      const course = slug ? getCourse(slug) : undefined
      if (!course || course.comingSoon) return null
      return { slug: course.slug, title: course.title, category: course.category, image: course.image } satisfies CourseRailItem
    })
    .filter((course): course is CourseRailItem => course !== null)
  for (const membership of memberships ?? []) {
    const group = membership.live_groups as unknown as { id:string;slug:string;name:string;image_path:string|null;courses:{title:string}|null }
    const resolvedCover = supabase ? await resolveLiveGroupCover(supabase, group.image_path) : null
    const image = resolvedCover ?? '/placeholder.svg'
    courses.push({ slug: `group-${group.slug}`, title: group.courses?.title ?? group.name, subtitle: group.name, category: 'Grupo en vivo', image, href: `/mi-coa/grupos/${group.slug}` })
  }

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

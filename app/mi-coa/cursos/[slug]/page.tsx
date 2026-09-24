import { notFound, redirect } from 'next/navigation'
import { requireAccount } from '@/lib/auth/session'
import { courseContentPath } from '@/lib/course-access'
import { getCourse } from '@/lib/courses'
import { createClient } from '@/lib/supabase/server'

export default async function AcademicCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const courseDefinition = getCourse(slug)
  const contentPath = courseContentPath(slug)
  if (!courseDefinition || !contentPath) notFound()

  const { user, profile } = await requireAccount()
  if (profile.role === 'admin') redirect(contentPath)
  if (courseDefinition.comingSoon) notFound()

  const supabase = await createClient()
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, courses!inner(slug, status)')
    .eq('student_id', user.id)
    .eq('status', 'active')
    .eq('courses.slug', slug)
    .eq('courses.status', 'published')
    .maybeSingle()

  if (!enrollment) redirect('/mi-coa?sin-acceso=curso')
  redirect(contentPath)
}

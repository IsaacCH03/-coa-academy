import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { EnrollmentStatus } from '@/lib/academic'

export type StudentEnrollment = {
  id: string
  status: EnrollmentStatus
  enrolled_at: string
  courses: { slug: string; title: string; status: string } | null
}

export type StudentEnrollmentResult =
  | { status: 'guest' | 'not-student' | 'error'; enrollments: [] }
  | { status: 'success'; enrollments: StudentEnrollment[] }

export async function getCurrentStudentEnrollments(): Promise<StudentEnrollmentResult> {
  const account = await getCurrentAccount()
  if (!account) return { status: 'guest', enrollments: [] }
  if (account.profile.role !== 'student') return { status: 'not-student', enrollments: [] }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, status, enrolled_at, courses!inner(slug, title, status)')
    .eq('student_id', account.user.id)
    .order('enrolled_at', { ascending: false })

  if (error) return { status: 'error', enrollments: [] }
  return { status: 'success', enrollments: (data ?? []) as unknown as StudentEnrollment[] }
}

export function accessibleEnrollments(enrollments: StudentEnrollment[]) {
  return enrollments.filter((enrollment) =>
    enrollment.status === 'active' && enrollment.courses?.status === 'published',
  )
}

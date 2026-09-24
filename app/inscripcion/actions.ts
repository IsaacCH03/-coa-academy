'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAccount } from '@/lib/auth/session'
import { getCourse } from '@/lib/courses'
import { createClient } from '@/lib/supabase/server'
import { isAcademicProfileComplete, type AcademicProfile, type EnrollmentActionState } from '@/lib/academic'
import { isSupportedCountry } from '@/lib/countries'

const readField = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim()

export async function enrollInCourseAction(_: EnrollmentActionState, formData: FormData): Promise<EnrollmentActionState> {
  const slug = readField(formData, 'slug')
  const publicCourse = getCourse(slug)
  if (!publicCourse || publicCourse.comingSoon) return { status: 'error', message: 'Este curso no está disponible para matrícula.' }

  const { user, profile: accountProfile } = await requireAccount()
  if (accountProfile.role !== 'student') redirect('/admin')

  const supabase = await createClient()
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, slug, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle<{ id: string; slug: string; status: string }>()

  if (courseError || !course) return { status: 'error', message: 'No pudimos encontrar un curso disponible con esos datos.' }

  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, identification, country, phone')
    .eq('id', user.id)
    .single<AcademicProfile>()

  if (profileError || !currentProfile) return { status: 'error', message: 'No pudimos consultar tu perfil académico.' }

  if (!isAcademicProfileComplete(currentProfile)) {
    const identification = readField(formData, 'identification')
    const country = readField(formData, 'country')
    const phone = readField(formData, 'phone')
    if (identification.length < 4 || identification.length > 40) return { status: 'error', message: 'Escribe una identificación válida.' }
    if (!isSupportedCountry(country)) return { status: 'error', message: 'Selecciona un país válido.' }
    if (phone.length < 7 || phone.length > 30) return { status: 'error', message: 'Escribe un teléfono válido.' }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ identification, country, phone })
      .eq('id', user.id)
    if (updateError) return { status: 'error', message: 'No pudimos guardar los datos de tu perfil.' }
  }

  const { error: enrollmentError } = await supabase
    .from('enrollments')
    .insert({ student_id: user.id, course_id: course.id })

  if (enrollmentError?.code === '23505') redirect(`/inscripcion/${slug}?estado=ya-inscrito`)
  if (enrollmentError) return { status: 'error', message: 'No pudimos completar la matrícula. Inténtalo de nuevo.' }

  revalidatePath('/mi-coa')
  redirect(`/inscripcion/${encodeURIComponent(slug)}?estado=inscrito`)
}

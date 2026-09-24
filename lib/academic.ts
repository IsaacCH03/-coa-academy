export type AcademicProfile = {
  id: string
  full_name: string
  identification: string | null
  country: string | null
  phone: string | null
}

export type EnrollmentStatus = 'active' | 'completed' | 'cancelled'

export type EnrollmentActionState = {
  status: 'idle' | 'error'
  message?: string
}

export const initialEnrollmentState: EnrollmentActionState = { status: 'idle' }

export function isAcademicProfileComplete(profile: AcademicProfile) {
  return Boolean(profile.identification?.trim() && profile.country?.trim() && profile.phone?.trim())
}

export function enrollmentStatusLabel(status: EnrollmentStatus) {
  if (status === 'completed') return 'Completado'
  if (status === 'cancelled') return 'Cancelado'
  return 'En curso'
}

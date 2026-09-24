export const academicCoursePaths = {
  'logica-de-programacion': '/cursos/logica-de-programacion/curso',
  'desarrollo-web-moderno': '/cursos/desarrollo-web-moderno/curso',
  'python-practico': '/cursos/python-practico/curso',
  'sql-bases-datos': '/cursos/sql-bases-datos/curso',
  'desarrollo-web-django': '/cursos/desarrollo-web-django/curso',
  'programacion-con-ia': '/cursos/programacion-con-ia/curso',
} as const

export type AcademicCourseSlug = keyof typeof academicCoursePaths

export function isAcademicCourseSlug(slug: string): slug is AcademicCourseSlug {
  return Object.hasOwn(academicCoursePaths, slug)
}

export function courseContentPath(slug: string) {
  return isAcademicCourseSlug(slug) ? academicCoursePaths[slug] : null
}

export function contentCourseSlug(pathname: string) {
  const match = pathname.match(/^\/cursos\/([a-z0-9]+(?:-[a-z0-9]+)*)\/curso(?:\/|$)/)
  return match && isAcademicCourseSlug(match[1]) ? match[1] : null
}

export function academicAccessAllowed(slug: AcademicCourseSlug, role: 'student' | 'admin', hasActiveEnrollment: boolean) {
  if (role === 'admin') return true
  if (slug === 'programacion-con-ia') return false
  return hasActiveEnrollment
}

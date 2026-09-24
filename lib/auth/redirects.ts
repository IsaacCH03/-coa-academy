const AUTH_DESTINATIONS = new Set(['/mi-coa', '/admin', '/cuenta/restablecer'])
const ENROLLMENT_DESTINATION = /^\/inscripcion\/[a-z0-9]+(?:-[a-z0-9]+)*$/
const COURSE_CONTENT_DESTINATION = /^\/cursos\/[a-z0-9]+(?:-[a-z0-9]+)*\/curso(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/

export function safeAuthDestination(value: string | null, expectedOrigin: string) {
  if (!value || value.includes('\\') || /%5c|%2e/i.test(value) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(value)) return '/mi-coa'

  try {
    const destination = new URL(value, expectedOrigin)
    if (destination.origin !== expectedOrigin) return '/mi-coa'
    if (destination.search || destination.hash) return '/mi-coa'
    return AUTH_DESTINATIONS.has(destination.pathname) || ENROLLMENT_DESTINATION.test(destination.pathname) || COURSE_CONTENT_DESTINATION.test(destination.pathname)
      ? destination.pathname
      : '/mi-coa'
  } catch {
    return '/mi-coa'
  }
}

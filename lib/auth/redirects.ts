const AUTH_DESTINATIONS = new Set(['/mi-coa', '/admin', '/cuenta/restablecer'])

export function safeAuthDestination(value: string | null, expectedOrigin: string) {
  if (!value || value.includes('\\') || /%5c/i.test(value)) return '/mi-coa'

  try {
    const destination = new URL(value, expectedOrigin)
    if (destination.origin !== expectedOrigin) return '/mi-coa'
    if (destination.search || destination.hash) return '/mi-coa'
    return AUTH_DESTINATIONS.has(destination.pathname) ? destination.pathname : '/mi-coa'
  } catch {
    return '/mi-coa'
  }
}

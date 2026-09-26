export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error('Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
  }

  return { url, publishableKey }
}

export function getSiteUrl() {
  const configured = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  if (configured.hostname === 'cursoscoa.com') configured.hostname = 'www.cursoscoa.com'
  return configured.toString().replace(/\/$/, '')
}

export function getSupabaseCookieOptions() {
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }
}

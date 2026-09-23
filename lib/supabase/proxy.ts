import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig, getSupabaseCookieOptions } from './config'

const protectedPaths = ['/mi-coa', '/admin']
const guestPaths = ['/cuenta/iniciar-sesion', '/cuenta/registro']

export function applyTransportSecurity(response: NextResponse, request: NextRequest) {
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  if (process.env.NODE_ENV === 'production' && (forwardedProtocol === 'https' || request.nextUrl.protocol === 'https:')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  return response
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, publishableKey } = getSupabaseConfig()
  const supabase = createServerClient(url, publishableKey, {
    cookieOptions: getSupabaseCookieOptions(),
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  if (!user && protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/cuenta/iniciar-sesion'
    loginUrl.searchParams.set('next', pathname)
    return applyTransportSecurity(NextResponse.redirect(loginUrl), request)
  }

  if (user && guestPaths.includes(pathname)) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/mi-coa'
    dashboardUrl.search = ''
    return applyTransportSecurity(NextResponse.redirect(dashboardUrl), request)
  }

  return applyTransportSecurity(response, request)
}

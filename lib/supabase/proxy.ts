import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig, getSupabaseCookieOptions } from './config'
import { academicAccessAllowed, contentCourseSlug } from '@/lib/course-access'

const protectedPaths = ['/mi-coa', '/admin', '/inscripcion']
const guestPaths = ['/cuenta/iniciar-sesion', '/cuenta/registro', '/cuenta/reenviar-confirmacion']

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
  const academicSlug = contentCourseSlug(pathname)

  if (!user && (academicSlug || protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/cuenta/iniciar-sesion'
    loginUrl.searchParams.set('next', pathname)
    return applyTransportSecurity(NextResponse.redirect(loginUrl), request)
  }

  if (user && academicSlug) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: 'student' | 'admin' }>()
    if (profile?.role === 'admin' && academicAccessAllowed(academicSlug, 'admin', false)) return applyTransportSecurity(response, request)

    const { data: enrollment } = academicSlug === 'programacion-con-ia' ? { data: null } : await supabase
      .from('enrollments')
      .select('id, courses!inner(slug, status)')
      .eq('student_id', user.id)
      .eq('status', 'active')
      .eq('courses.slug', academicSlug)
      .eq('courses.status', 'published')
      .maybeSingle()

    if (!academicAccessAllowed(academicSlug, 'student', Boolean(enrollment))) {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/mi-coa'
      dashboardUrl.search = 'sin-acceso=curso'
      return applyTransportSecurity(NextResponse.redirect(dashboardUrl), request)
    }
  }

  if (user && guestPaths.includes(pathname)) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/mi-coa'
    dashboardUrl.search = ''
    return applyTransportSecurity(NextResponse.redirect(dashboardUrl), request)
  }

  return applyTransportSecurity(response, request)
}

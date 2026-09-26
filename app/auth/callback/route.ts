import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/supabase/config'
import { safeAuthDestination } from '@/lib/auth/redirects'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const expectedOrigin = new URL(getSiteUrl()).origin
  const next = safeAuthDestination(url.searchParams.get('next'), expectedOrigin, '/')
  const supabase = await createClient()

  const providerError = url.searchParams.get('error_code') || url.searchParams.get('error')
  if (providerError) {
    const reason = /expired/i.test(providerError) ? 'enlace-vencido' : 'enlace-utilizado-o-invalido'
    return NextResponse.redirect(new URL(`/cuenta/error?motivo=${reason}`, expectedOrigin))
  }

  let error = null
  let recoveryFlow = false
  let hasSession = false
  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code)
    error = result.error
    hasSession = Boolean(result.data.session)
    recoveryFlow = (result.data as typeof result.data & { redirectType?: string | null }).redirectType === 'recovery'
  } else if (tokenHash && type) {
    const result = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    error = result.error
    hasSession = Boolean(result.data.session)
    recoveryFlow = type === 'recovery'
  } else return NextResponse.redirect(new URL('/cuenta/error?motivo=enlace-invalido', expectedOrigin))

  const destination = error
    ? `/cuenta/error?motivo=${/expired/i.test(`${error.code} ${error.message}`) ? 'enlace-vencido' : 'enlace-utilizado-o-invalido'}`
    : !recoveryFlow && !hasSession
      ? '/cuenta/iniciar-sesion?confirmacion=correcta'
    : next
  const response = NextResponse.redirect(new URL(destination, expectedOrigin))
  response.headers.set('Cache-Control', 'no-store')
  if (!error && recoveryFlow && next === '/cuenta/restablecer') {
    response.cookies.set('coa-password-recovery', 'verified', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/cuenta/restablecer',
      maxAge: 10 * 60,
    })
  }
  return response
}

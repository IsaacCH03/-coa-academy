'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/supabase/config'
import { isValidEmail, normalizeEmail, readText, validatePassword } from '@/lib/auth/validation'
import { safeAuthDestination } from '@/lib/auth/redirects'
import type { AuthActionState } from '@/lib/auth/types'

const errorState = (message: string, fields?: Record<string, string>): AuthActionState => ({
  status: 'error', message, fields,
})

function friendlyAuthError(message: string, code?: string) {
  if (code === 'user_already_exists' || /already registered|already exists/i.test(message)) return 'Si este correo puede registrarse, recibirás las instrucciones necesarias para continuar.'
  if (/invalid login credentials/i.test(message)) return 'El correo o la contraseña son incorrectos.'
  if (/email not confirmed/i.test(message)) return 'Confirma tu correo antes de iniciar sesión.'
  if (/rate limit|security purposes/i.test(message)) return 'Espera unos minutos antes de volver a intentarlo.'
  return 'No pudimos completar la solicitud. Inténtalo de nuevo.'
}

function captchaToken(formData: FormData) {
  const value = formData.get('cf-turnstile-response') || formData.get('captchaToken')
  return typeof value === 'string' && value ? value : undefined
}

function authDestination(formData: FormData, fallback = '/mi-coa') {
  return safeAuthDestination(readText(formData.get('next')), new URL(getSiteUrl()).origin, fallback)
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const fullName = readText(formData.get('fullName'))
  const email = normalizeEmail(formData.get('email'))
  const password = String(formData.get('password') || '')
  const confirmation = String(formData.get('passwordConfirmation') || '')
  const fields = { fullName, email }
  const next = authDestination(formData, '/')
  if (fullName.length < 2) return errorState('Escribe tu nombre completo.', fields)
  if (!isValidEmail(email)) return errorState('Escribe un correo válido.', fields)
  const passwordError = validatePassword(password)
  if (passwordError) return errorState(passwordError, fields)
  if (password !== confirmation) return errorState('Las contraseñas no coinciden.', fields)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      captchaToken: captchaToken(formData),
    },
  })
  if (error) return errorState(friendlyAuthError(error.message, error.code), fields)
  if (data.session) redirect(next)
  return { status: 'success', message: 'Cuenta creada. Revisa tu correo y pulsa el enlace de confirmación. Después volverás a COA con tu cuenta activada.' }
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get('email'))
  const password = String(formData.get('password') || '')
  const next = authDestination(formData)
  if (!isValidEmail(email) || !password) return errorState('Completa el correo y la contraseña.', { email })
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken: captchaToken(formData) },
  })
  if (error) return errorState(friendlyAuthError(error.message, error.code), { email })

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single<{ role: string }>()
    : { data: null }
  redirect(next !== '/mi-coa' ? next : profile?.role === 'admin' ? '/admin' : '/mi-coa')
}

export async function requestPasswordResetAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get('email'))
  if (!isValidEmail(email)) return errorState('Escribe un correo válido.', { email })
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/cuenta/restablecer`,
    captchaToken: captchaToken(formData),
  })
  if (error) return errorState(friendlyAuthError(error.message, error.code), { email })
  return { status: 'success', message: 'Si el correo pertenece a una cuenta, recibirás un enlace para restablecer la contraseña.' }
}

export async function resendConfirmationAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = normalizeEmail(formData.get('email'))
  const next = authDestination(formData, '/')
  if (!isValidEmail(email)) return errorState('Escribe un correo válido.', { email })
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      captchaToken: captchaToken(formData),
    },
  })
  if (error && /rate limit|security purposes/i.test(error.message)) {
    return errorState('Espera unos minutos antes de volver a intentarlo.', { email })
  }
  return { status: 'success', message: 'Si existe una cuenta pendiente de confirmación con ese correo, recibirás un nuevo enlace.' }
}

export async function updatePasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const cookieStore = await cookies()
  if (cookieStore.get('coa-password-recovery')?.value !== 'verified') {
    return errorState('Solicita un nuevo enlace de recuperación antes de cambiar la contraseña.')
  }
  const password = String(formData.get('password') || '')
  const confirmation = String(formData.get('passwordConfirmation') || '')
  const passwordError = validatePassword(password)
  if (passwordError) return errorState(passwordError)
  if (password !== confirmation) return errorState('Las contraseñas no coinciden.')
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return errorState(friendlyAuthError(error.message, error.code))
  cookieStore.set('coa-password-recovery', '', { path: '/cuenta/restablecer', maxAge: 0 })
  return { status: 'success', message: 'Contraseña actualizada. Ya puedes continuar con tu cuenta.' }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

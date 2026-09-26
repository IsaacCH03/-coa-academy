import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialAuthState } from '@/lib/auth/types'

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  resend: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  signInWithPassword: vi.fn(),
  getUser: vi.fn(),
  single: vi.fn(),
  updateUser: vi.fn(),
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
}))

vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))
vi.mock('next/headers', () => ({ cookies: async () => ({ get: mocks.cookieGet, set: mocks.cookieSet }) }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { signOut: mocks.signOut, signUp: mocks.signUp, resend: mocks.resend, resetPasswordForEmail: mocks.resetPasswordForEmail, signInWithPassword: mocks.signInWithPassword, getUser: mocks.getUser, updateUser: mocks.updateUser },
    from: () => ({ select: () => ({ eq: () => ({ single: mocks.single }) }) }),
  }),
}))

import { requestPasswordResetAction, resendConfirmationAction, signInAction, signOutAction, signUpAction, updatePasswordAction } from './actions'

describe('acciones de sesión', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.signInWithPassword.mockResolvedValue({ error: null })
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
  })

  it('registra con callback al inicio canónico cuando no existe next', async () => {
    mocks.signUp.mockResolvedValue({ data: { session: null }, error: null })
    const form = new FormData()
    form.set('fullName', 'Ana Estudiante')
    form.set('email', 'ana@ejemplo.com')
    form.set('password', 'segura123')
    form.set('passwordConfirmation', 'segura123')
    const state = await signUpAction(initialAuthState, form)
    expect(state.status).toBe('success')
    expect(mocks.signUp).toHaveBeenCalledWith(expect.objectContaining({
      options: expect.objectContaining({ emailRedirectTo: 'http://localhost:3000/auth/callback?next=%2F' }),
    }))
  })

  it('reenvía una confirmación de signup con callback canónico y Turnstile', async () => {
    mocks.resend.mockResolvedValue({ data: {}, error: null })
    const form = new FormData()
    form.set('email', 'ana@ejemplo.com')
    form.set('cf-turnstile-response', 'captcha-token')
    form.set('next', '/inscripcion/python-practico')
    const state = await resendConfirmationAction(initialAuthState, form)
    expect(mocks.resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'ana@ejemplo.com',
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback?next=%2Finscripcion%2Fpython-practico',
        captchaToken: 'captcha-token',
      },
    })
    expect(state.message).toBe('Si existe una cuenta pendiente de confirmación con ese correo, recibirás un nuevo enlace.')
    expect(mocks.resetPasswordForEmail).not.toHaveBeenCalled()
  })

  it('bloquea next externo al reenviar confirmación', async () => {
    mocks.resend.mockResolvedValue({ data: {}, error: null })
    const form = new FormData()
    form.set('email', 'ana@ejemplo.com')
    form.set('next', 'https://evil.example')
    await resendConfirmationAction(initialAuthState, form)
    expect(mocks.resend).toHaveBeenCalledWith(expect.objectContaining({
      options: expect.objectContaining({ emailRedirectTo: 'http://localhost:3000/auth/callback?next=%2F' }),
    }))
  })

  it('mantiene recuperación en resetPasswordForEmail y separada de resend', async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null })
    const form = new FormData()
    form.set('email', 'ana@ejemplo.com')
    await requestPasswordResetAction(initialAuthState, form)
    expect(mocks.resetPasswordForEmail).toHaveBeenCalledOnce()
    expect(mocks.resend).not.toHaveBeenCalled()
  })

  it.each([['student', '/mi-coa'], ['admin', '/admin']])('redirige el rol %s a %s', async (role, destination) => {
    mocks.single.mockResolvedValue({ data: { role } })
    const form = new FormData()
    form.set('email', 'persona@ejemplo.com')
    form.set('password', 'segura123')
    await signInAction(initialAuthState, form)
    expect(mocks.redirect).toHaveBeenCalledWith(destination)
  })

  it('cierra la sesión Supabase antes de volver al inicio', async () => {
    mocks.signOut.mockResolvedValue({ error: null })
    await signOutAction()
    expect(mocks.signOut).toHaveBeenCalledOnce()
    expect(mocks.redirect).toHaveBeenCalledWith('/')
  })

  it('rechaza cambios de contraseña desde una sesión normal', async () => {
    mocks.cookieGet.mockReturnValue(undefined)
    const state = await updatePasswordAction(initialAuthState, new FormData())
    expect(state.status).toBe('error')
    expect(mocks.updateUser).not.toHaveBeenCalled()
  })

  it('permite una contraseña nueva después del callback de recuperación', async () => {
    mocks.cookieGet.mockReturnValue({ value: 'verified' })
    mocks.updateUser.mockResolvedValue({ error: null })
    const form = new FormData()
    form.set('password', 'nueva1234')
    form.set('passwordConfirmation', 'nueva1234')
    const state = await updatePasswordAction(initialAuthState, form)
    expect(state.status).toBe('success')
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: 'nueva1234' })
    expect(mocks.cookieSet).toHaveBeenCalled()
  })
})

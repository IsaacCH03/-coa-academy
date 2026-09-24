import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { signInAction } from '../actions'
import { safeAuthDestination } from '@/lib/auth/redirects'
import { getSiteUrl } from '@/lib/supabase/config'

export const metadata = { title: 'Iniciar sesión | C.O.A' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const next = safeAuthDestination(params.next ?? null, new URL(getSiteUrl()).origin)
  const nextQuery = next === '/mi-coa' ? '' : `?next=${encodeURIComponent(next)}`
  return (
    <AuthShell title="Inicia sesión" description="Accede a tu espacio personal de Cursos Online Avanzados.">
      <AuthForm
        action={signInAction}
        fields={[
          { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email' },
          { name: 'password', label: 'Contraseña', type: 'password', autoComplete: 'current-password' },
        ]}
        submitLabel="Entrar a Mi COA"
        pendingLabel="Iniciando sesión…"
        hiddenFields={{ next }}
        captcha
        footer={<div className="space-y-3 text-center text-sm text-muted-foreground"><p><AuthLink href="/cuenta/recuperar">¿Olvidaste tu contraseña?</AuthLink></p><p>¿Aún no tienes cuenta? <AuthLink href={`/cuenta/registro${nextQuery}`}>Crear cuenta</AuthLink></p></div>}
      />
    </AuthShell>
  )
}

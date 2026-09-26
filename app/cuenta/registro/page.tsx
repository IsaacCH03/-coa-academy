import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { signUpAction } from '../actions'
import { safeAuthDestination } from '@/lib/auth/redirects'
import { getSiteUrl } from '@/lib/supabase/config'

export const metadata = { title: 'Crear cuenta | C.O.A' }

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const next = safeAuthDestination(params.next ?? null, new URL(getSiteUrl()).origin, '/')
  const nextQuery = next === '/' ? '' : `?next=${encodeURIComponent(next)}`
  return (
    <AuthShell title="Crea tu cuenta" description="Regístrate como estudiante. Te enviaremos un enlace para confirmar tu correo.">
      <AuthForm
        action={signUpAction}
        fields={[
          { name: 'fullName', label: 'Nombre completo', type: 'text', autoComplete: 'name' },
          { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email' },
          { name: 'password', label: 'Contraseña', type: 'password', autoComplete: 'new-password', placeholder: '8+ caracteres, letra y número' },
          { name: 'passwordConfirmation', label: 'Confirmar contraseña', type: 'password', autoComplete: 'new-password' },
        ]}
        submitLabel="Crear cuenta"
        pendingLabel="Creando cuenta…"
        hiddenFields={{ next }}
        captcha
        footer={<p className="text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <AuthLink href={`/cuenta/iniciar-sesion${nextQuery}`}>Iniciar sesión</AuthLink></p>}
      />
    </AuthShell>
  )
}

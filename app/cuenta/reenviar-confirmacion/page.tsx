import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { safeAuthDestination } from '@/lib/auth/redirects'
import { getSiteUrl } from '@/lib/supabase/config'
import { resendConfirmationAction } from '../actions'

export const metadata = { title: 'Reenviar confirmación | C.O.A' }

export default async function ResendConfirmationPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const next = safeAuthDestination(params.next ?? null, new URL(getSiteUrl()).origin, '/')
  return (
    <AuthShell title="Reenviar correo de confirmación" description="Escribe el correo con el que creaste tu cuenta y te enviaremos un nuevo enlace para confirmar tu correo.">
      <AuthForm
        action={resendConfirmationAction}
        fields={[{ name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email' }]}
        submitLabel="Enviar nuevo enlace"
        pendingLabel="Enviando…"
        hiddenFields={{ next }}
        captcha
        footer={<p className="text-center text-sm"><AuthLink href="/cuenta/iniciar-sesion">Volver a iniciar sesión</AuthLink></p>}
      />
    </AuthShell>
  )
}

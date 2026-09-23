import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { requestPasswordResetAction } from '../actions'

export const metadata = { title: 'Recuperar contraseña | C.O.A' }

export default async function RecoverPage({ searchParams }: { searchParams: Promise<{ enlace?: string }> }) {
  const params = await searchParams
  return (
    <AuthShell title="Recupera tu contraseña" description="Escribe el correo de tu cuenta y recibirás un enlace seguro para crear una nueva contraseña.">
      {params.enlace && <p role="alert" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">Solicita y abre un nuevo enlace de recuperación para cambiar tu contraseña.</p>}
      <AuthForm
        action={requestPasswordResetAction}
        fields={[{ name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email' }]}
        submitLabel="Enviar enlace"
        pendingLabel="Enviando…"
        captcha
        footer={<p className="text-center text-sm"><AuthLink href="/cuenta/iniciar-sesion">Volver a iniciar sesión</AuthLink></p>}
      />
    </AuthShell>
  )
}

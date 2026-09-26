import { AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'

export const metadata = { title: 'Enlace no válido | C.O.A' }

const messages = {
  'enlace-vencido': 'El enlace venció. Solicita uno nuevo para continuar.',
  'enlace-utilizado-o-invalido': 'El enlace ya fue utilizado o no es válido. Si ya confirmaste tu correo, puedes iniciar sesión.',
  'enlace-invalido': 'El enlace no contiene una confirmación válida. Solicita uno nuevo o inicia sesión si ya confirmaste tu correo.',
} as const

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ motivo?: string; flujo?: string; next?: string }> }) {
  const { motivo, flujo, next } = await searchParams
  const description = messages[motivo as keyof typeof messages] ?? messages['enlace-invalido']
  const recovery = flujo === 'recuperacion'
  const resendHref = `/cuenta/reenviar-confirmacion${next ? `?next=${encodeURIComponent(next)}` : ''}`
  return (
    <AuthShell title="No pudimos validar el enlace" description={description}>
      <div className="space-y-4 text-sm"><AuthLink href={recovery ? '/cuenta/recuperar' : resendHref}>{recovery ? 'Solicitar un nuevo enlace de recuperación' : 'Solicitar un nuevo enlace de confirmación'}</AuthLink><p><AuthLink href="/cuenta/iniciar-sesion">Volver a iniciar sesión</AuthLink></p></div>
    </AuthShell>
  )
}

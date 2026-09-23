import { AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'

export const metadata = { title: 'Enlace no válido | C.O.A' }

export default function AuthErrorPage() {
  return (
    <AuthShell title="No pudimos validar el enlace" description="El enlace es inválido, ya fue utilizado o venció. Puedes solicitar uno nuevo.">
      <div className="space-y-4 text-sm"><AuthLink href="/cuenta/recuperar">Solicitar un nuevo enlace</AuthLink><p><AuthLink href="/cuenta/iniciar-sesion">Volver a iniciar sesión</AuthLink></p></div>
    </AuthShell>
  )
}

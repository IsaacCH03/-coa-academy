import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { signInAction } from '../actions'

export const metadata = { title: 'Iniciar sesión | C.O.A' }

export default function LoginPage() {
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
        captcha
        footer={<div className="space-y-3 text-center text-sm text-muted-foreground"><p><AuthLink href="/cuenta/recuperar">¿Olvidaste tu contraseña?</AuthLink></p><p>¿Aún no tienes cuenta? <AuthLink href="/cuenta/registro">Crear cuenta</AuthLink></p></div>}
      />
    </AuthShell>
  )
}

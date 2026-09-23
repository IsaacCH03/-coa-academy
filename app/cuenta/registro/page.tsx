import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { signUpAction } from '../actions'

export const metadata = { title: 'Crear cuenta | C.O.A' }

export default function SignUpPage() {
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
        captcha
        footer={<p className="text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <AuthLink href="/cuenta/iniciar-sesion">Iniciar sesión</AuthLink></p>}
      />
    </AuthShell>
  )
}

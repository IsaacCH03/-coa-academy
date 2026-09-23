import { AuthForm, AuthLink } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'
import { updatePasswordAction } from '../actions'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Nueva contraseña | C.O.A' }

export default async function ResetPasswordPage() {
  const cookieStore = await cookies()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || cookieStore.get('coa-password-recovery')?.value !== 'verified') {
    redirect('/cuenta/recuperar?enlace=requerido')
  }
  return (
    <AuthShell title="Crea una nueva contraseña" description="Usa una contraseña de al menos 8 caracteres con una letra y un número.">
      <AuthForm
        action={updatePasswordAction}
        fields={[
          { name: 'password', label: 'Nueva contraseña', type: 'password', autoComplete: 'new-password' },
          { name: 'passwordConfirmation', label: 'Confirmar contraseña', type: 'password', autoComplete: 'new-password' },
        ]}
        submitLabel="Guardar contraseña"
        pendingLabel="Guardando…"
        footer={<p className="text-center text-sm"><AuthLink href="/mi-coa">Ir a Mi COA</AuthLink></p>}
      />
    </AuthShell>
  )
}

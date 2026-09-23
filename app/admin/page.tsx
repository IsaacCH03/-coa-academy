import { ShieldCheck, UsersRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Administración | C.O.A' }

export default async function AdminDashboard() {
  const { profile } = await requireAdmin()
  const supabase = await createClient()
  const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  return (
    <AccountShell title={`Bienvenido, ${profile.full_name}`} eyebrow="Panel de administración">
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-background p-6"><UsersRound className="h-7 w-7 text-primary" /><p className="mt-4 text-3xl font-extrabold">{count ?? 0}</p><h2 className="mt-1 font-bold">Perfiles registrados</h2><p className="mt-2 text-sm text-muted-foreground">Vista inicial de cuentas de estudiantes y administradores.</p></article>
        <article className="rounded-2xl border border-border bg-background p-6"><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Acceso administrativo</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Esta ruta valida el rol en el servidor antes de mostrar cualquier información.</p></article>
      </div>
    </AccountShell>
  )
}

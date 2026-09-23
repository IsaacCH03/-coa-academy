import { BookOpen, ShieldCheck, UserRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAccount } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Mi COA | C.O.A' }

export default async function StudentDashboard({ searchParams }: { searchParams: Promise<{ 'sin-permiso'?: string }> }) {
  const { profile, user } = await requireAccount()
  if (profile.role === 'admin') redirect('/admin')
  const params = await searchParams
  return (
    <AccountShell title={`Hola, ${profile.full_name}`} eyebrow="Panel del estudiante">
      {params['sin-permiso'] && <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">No tienes permisos para acceder al panel de administración.</div>}
      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-background p-6"><UserRound className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Tu perfil</h2><p className="mt-2 text-sm text-muted-foreground">{user.email}</p><p className="mt-1 text-sm text-muted-foreground">Rol: Estudiante</p></article>
        <article className="rounded-2xl border border-border bg-background p-6"><BookOpen className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Cursos</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tu espacio académico estará disponible en una próxima fase.</p></article>
        <article className="rounded-2xl border border-border bg-background p-6"><ShieldCheck className="h-7 w-7 text-primary" /><h2 className="mt-4 font-bold">Cuenta protegida</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tu sesión se mantiene de forma segura mediante cookies del servidor.</p></article>
      </div>
    </AccountShell>
  )
}

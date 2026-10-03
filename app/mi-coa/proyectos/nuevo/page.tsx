import { AccountShell } from '@/components/account/account-shell'
import { ProjectCreateForm } from '@/components/projects/project-create-form'
import { requireAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAccount()
  const supabase = await createClient()
  const [{ data: courses }, { error }] = await Promise.all([
    supabase.from('courses').select('id,title').eq('status', 'published').order('title'),
    searchParams,
  ])
  return <AccountShell eyebrow="Proyectos COA" title="Publicar un proyecto">
    <p className="mb-6 text-muted-foreground">La publicación quedará pendiente hasta que administración la revise.</p>
    {error && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 p-4 text-destructive">{error}</p>}
    <div className="max-w-3xl rounded-2xl border bg-background p-6"><ProjectCreateForm courses={courses ?? []}/></div>
  </AccountShell>
}

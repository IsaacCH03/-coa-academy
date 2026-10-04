import { AccountShell } from '@/components/account/account-shell'
import { AdminProjectModeration, type AdminProject } from '@/components/projects/admin-project-moderation'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('student_projects')
    .select('id,slug,title,description,technologies,youtube_id,github_url,status,rejection_reason,created_at,author:profiles!student_projects_author_id_fkey(full_name),course:courses!student_projects_course_id_fkey(title),student_project_images(storage_path,alt_text,display_order)')
    .order('created_at', { ascending: false })

  if (error) console.error('[Proyectos COA] admin project query failed', { stage: 'admin_project_query', code: error.code, message: error.message, details: error.details, hint: error.hint })

  const projects = error ? [] : await Promise.all(((data ?? []) as unknown as AdminProject[]).map(async project => ({
    ...project,
    student_project_images: await Promise.all(project.student_project_images
      .sort((a, b) => a.display_order - b.display_order)
      .map(async image => ({ ...image, url: (await supabase.storage.from('phase3-media').createSignedUrl(image.storage_path, 3600)).data?.signedUrl ?? null }))),
  })))

  return <AccountShell eyebrow="Moderación" title="Proyectos COA">
    <p className="mt-2 text-muted-foreground">Revisa y administra los proyectos enviados por estudiantes.</p>
    {error
      ? <p role="alert" className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-5 font-semibold text-destructive">No pudimos consultar los proyectos. Revisa el diagnóstico del servidor.</p>
      : <AdminProjectModeration projects={projects}/>
    }
  </AccountShell>
}

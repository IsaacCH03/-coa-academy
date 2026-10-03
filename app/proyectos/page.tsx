import Image from 'next/image'
import Link from 'next/link'
import { Phase3Shell } from '@/components/phase3-shell'
import { ProjectComposer } from '@/components/projects/project-composer'
import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Proyectos COA' }

export default async function Page({ searchParams }: { searchParams: Promise<{ crear?: string; enviado?: string; error?: string }> }) {
  const supabase = await createClient()
  const account = await getCurrentAccount()
  const query = await searchParams
  const [{ data: projects }, { data: profiles }, { data: courses }] = await Promise.all([
    supabase.from('student_projects').select('id,slug,title,technologies,youtube_id,created_at,author_id,course_id,student_project_images(storage_path,display_order)').eq('status', 'published').order('created_at', { ascending: false }),
    supabase.from('public_profiles').select('id,slug,full_name'),
    supabase.from('courses').select('id,title').eq('status', 'published').order('title'),
  ])
  const names = new Map((profiles ?? []).map(profile => [profile.id, profile]))
  const cards = await Promise.all((projects ?? []).map(async project => {
    const path = project.student_project_images?.sort((a, b) => a.display_order - b.display_order)[0]?.storage_path
    const image = path ? (await supabase.storage.from('phase3-media').createSignedUrl(path, 3600)).data?.signedUrl : null
    return { ...project, image }
  }))
  const avatarUrl = account?.profile.avatar_path
    ? (await supabase.storage.from('phase3-media').createSignedUrl(account.profile.avatar_path, 3600)).data?.signedUrl ?? null
    : null

  return <Phase3Shell>
    <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Galería estudiantil</p>
    <h1 className="mt-2 text-4xl font-extrabold">Proyectos COA</h1>
    <p className="mt-3 text-muted-foreground">Proyectos creados por estudiantes de COA y revisados antes de su publicación.</p>
    {query.enviado && <div role="status" className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-4"><p className="font-bold text-primary">Proyecto enviado para revisión</p><p className="mt-1 text-sm text-muted-foreground">Podrás consultar su estado desde tus proyectos.</p></div>}
    {query.error && <p role="alert" className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">{query.error}</p>}
    <ProjectComposer
      account={account ? { fullName: account.profile.full_name, avatarUrl } : null}
      courses={courses ?? []}
      initialOpen={query.crear === '1'}
    />
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="text-2xl font-extrabold">Proyectos</h2>
      {!cards.length
        ? <p className="mt-5 rounded-2xl border bg-background p-8">Aún no hay proyectos publicados. Puedes ser la primera persona en compartir uno.</p>
        : <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{cards.map(project => <article key={project.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {project.image ? <div className="relative aspect-video"><Image fill src={project.image} alt={`Captura de ${project.title}`} className="object-cover" unoptimized/></div> : <div className="grid aspect-video place-items-center bg-secondary text-muted-foreground">Proyecto COA</div>}
          <div className="p-5"><h3 className="text-lg font-bold">{project.title}</h3><Link href={`/autores/${names.get(project.author_id)?.slug}`} className="mt-1 block text-sm text-primary">{names.get(project.author_id)?.full_name ?? 'Estudiante COA'}</Link><div className="mt-3 flex flex-wrap gap-1">{project.technologies.map((technology: string) => <span key={technology} className="rounded-full bg-secondary px-2 py-1 text-xs">{technology}</span>)}</div><Link href={`/proyectos/${project.slug}`} className="mt-5 inline-block font-semibold text-primary">Ver proyecto →</Link></div>
        </article>)}</div>}
    </div>
  </Phase3Shell>
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Phase3Shell } from '@/components/phase3-shell'
import { ProjectImageGallery } from '@/components/projects/project-community-feed'
import { createClient } from '@/lib/supabase/server'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('student_projects')
    .select('*,student_project_images(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (!project) notFound()

  const [{ data: author }, signedImages] = await Promise.all([
    supabase.from('public_profiles').select('*').eq('id', project.author_id).single(),
    Promise.all((project.student_project_images ?? [])
      .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
      .map(async (image: { storage_path: string; alt_text: string | null }) => ({
        ...image,
        url: (await supabase.storage.from('phase3-media').createSignedUrl(image.storage_path, 3600)).data?.signedUrl,
      }))),
  ])
  const images = signedImages.flatMap(image => image.url ? [{ url: image.url, alt: image.alt_text ?? project.title }] : [])

  return <Phase3Shell wide>
    <article className="mx-auto max-w-6xl">
      <Link href="/proyectos" className="font-semibold text-primary">← Proyectos COA</Link>
      <div className="mt-6">
        <h1 className="text-4xl font-extrabold">{project.title}</h1>
        <Link href={`/autores/${author?.slug}`} className="mt-2 inline-block text-primary">Por {author?.full_name ?? 'Estudiante COA'}</Link>
        <p className="mt-6 whitespace-pre-wrap text-lg leading-relaxed">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">{project.technologies.map((technology: string) => <span key={technology} className="rounded-full bg-secondary px-3 py-1 text-sm">{technology}</span>)}</div>
        {project.youtube_id && <div className="mt-8 aspect-video overflow-hidden rounded-2xl"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${project.youtube_id}`} title={`Video de ${project.title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}
        <ProjectImageGallery images={images} title={project.title} />
        {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-xl border px-5 py-3 font-bold text-primary">Ver código en GitHub</a>}
      </div>
    </article>
  </Phase3Shell>
}

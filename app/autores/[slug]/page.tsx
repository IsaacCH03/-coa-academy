import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phase3Shell } from '@/components/phase3-shell'
import { createClient } from '@/lib/supabase/server'

export default async function Page({params}:{params:Promise<{slug:string}>}){
 const{slug}=await params,supabase=await createClient()
 const{data:profile}=await supabase.from('public_profiles').select('*').eq('slug',slug).maybeSingle()
 if(!profile)notFound()
 const[{data:projects},avatar]=await Promise.all([
  supabase.from('student_projects').select('id,slug,title,technologies').eq('author_id',profile.id).eq('status','published').order('created_at',{ascending:false}),
  profile.avatar_path?supabase.storage.from('phase3-media').createSignedUrl(profile.avatar_path,3600):Promise.resolve({data:null}),
 ])
 const avatarUrl=avatar.data?.signedUrl??null,initials=String(profile.full_name??'CO').trim().split(/\s+/).slice(0,2).map((part:string)=>part[0]).join('').toUpperCase()
 return <Phase3Shell>
  <section className="rounded-3xl border bg-card p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center">{avatarUrl?<Image src={avatarUrl} alt={`Foto de ${profile.full_name}`} width={96} height={96} unoptimized className="h-24 w-24 rounded-full object-cover"/>:<span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">{initials}</span>}<div><h1 className="text-3xl font-extrabold">{profile.full_name}</h1>{profile.occupation&&<p className="mt-2 font-semibold text-primary">{profile.occupation}</p>}{profile.public_location&&<p className="text-muted-foreground">{profile.public_location}</p>}</div></div>{profile.public_bio&&<p className="mt-5 max-w-2xl whitespace-pre-wrap">{profile.public_bio}</p>}{profile.public_github_url&&<a className="mt-4 inline-block text-primary" href={profile.public_github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}</section>
  <h2 className="mt-10 text-2xl font-extrabold">Proyectos publicados</h2>{!projects?.length?<p className="mt-4 text-muted-foreground">Este autor aún no tiene proyectos publicados.</p>:<div className="mt-5 grid gap-4 md:grid-cols-3">{projects.map(p=><Link key={p.id} href={`/proyectos/${p.slug}`} className="rounded-2xl border bg-card p-5"><b>{p.title}</b><p className="mt-2 text-sm text-muted-foreground">{p.technologies.join(' · ')}</p></Link>)}</div>}
 </Phase3Shell>
}

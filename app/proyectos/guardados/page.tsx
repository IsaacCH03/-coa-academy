import Link from 'next/link'
import { Phase3Shell } from '@/components/phase3-shell'
import { ProjectCommunityFeed, type CommunityFeedProject } from '@/components/projects/project-community-feed'
import { requireAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export const metadata={title:'Proyectos guardados | COA'}

export default async function SavedProjectsPage(){
 const{user}=await requireAccount(),supabase=await createClient()
 const{data:saves,error:savesError}=await supabase.from('student_project_saves').select('project_id,created_at').eq('user_id',user.id).order('created_at',{ascending:false})
 if(savesError)console.error('[Proyectos COA] saved projects query failed',{stage:'saved_projects_query',code:savesError.code,message:savesError.message})
 const ids=(saves??[]).map((save:{project_id:string})=>save.project_id)
 const{data:rawProjects}=ids.length?await supabase.from('student_projects').select('id,slug,title,description,technologies,github_url,youtube_id,created_at,author_id,course_id').in('id',ids).eq('status','published'):{data:[]}
 const projects=(rawProjects??[]) as Array<{id:string;slug:string;title:string;description:string;technologies:string[];github_url:string|null;youtube_id:string|null;created_at:string;author_id:string;course_id:string|null}>
 const authorIds=[...new Set(projects.map(project=>project.author_id))],{data:profiles}=authorIds.length?await supabase.from('public_profiles').select('id,slug,full_name,avatar_path').in('id',authorIds):{data:[]}
 const profileMap=new Map(((profiles??[]) as Array<{id:string;slug:string;full_name:string;avatar_path:string|null}>).map(profile=>[profile.id,profile]))
 const projectIds=projects.map(project=>project.id),{data:images}=projectIds.length?await supabase.from('student_project_images').select('project_id,storage_path,alt_text,display_order').in('project_id',projectIds).order('display_order'):{data:[]}
 const imageRows=(images??[]) as Array<{project_id:string;storage_path:string;alt_text:string|null;display_order:number}>,paths=imageRows.map(image=>image.storage_path),{data:signedImages}=paths.length?await supabase.storage.from('phase3-media').createSignedUrls(paths,3600):{data:[]}
 const imageUrls=new Map(((signedImages??[]) as Array<{path:string;signedUrl:string|null}>).map(item=>[item.path,item.signedUrl])),avatarPaths=[...new Set([...profileMap.values()].map(profile=>profile.avatar_path).filter((path):path is string=>!!path))],{data:signedAvatars}=avatarPaths.length?await supabase.storage.from('phase3-media').createSignedUrls(avatarPaths,3600):{data:[]}
 const avatarUrls=new Map(((signedAvatars??[]) as Array<{path:string;signedUrl:string|null}>).map(item=>[item.path,item.signedUrl])),imagesByProject=new Map<string,Array<{url:string;alt:string}>>();for(const image of imageRows){const url=imageUrls.get(image.storage_path);if(url)imagesByProject.set(image.project_id,[...(imagesByProject.get(image.project_id)??[]),{url,alt:image.alt_text??'Captura del proyecto'}])}
 const order=new Map(ids.map((id,index)=>[id,index])),feed:CommunityFeedProject[]=projects.sort((a,b)=>(order.get(a.id)??0)-(order.get(b.id)??0)).map(project=>{const profile=profileMap.get(project.author_id);return{id:project.id,slug:project.slug,title:project.title,description:project.description,technologies:project.technologies??[],githubUrl:project.github_url,youtubeId:project.youtube_id,createdAt:project.created_at,author:{name:profile?.full_name??'Estudiante COA',slug:profile?.slug??project.author_id,avatarUrl:profile?.avatar_path?avatarUrls.get(profile.avatar_path)??null:null},courseTitle:null,images:imagesByProject.get(project.id)??[]}})
 return <Phase3Shell><Link href="/proyectos" className="text-sm font-bold text-primary">← Explorar proyectos</Link><p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-primary">Comunidad estudiantil</p><h1 className="mt-2 text-4xl font-extrabold">Proyectos guardados</h1><p className="mt-3 text-muted-foreground">Tus proyectos guardados son privados y están disponibles en cualquier dispositivo.</p><div className="mt-8 max-w-3xl"><ProjectCommunityFeed projects={feed} canSave savedIds={ids} empty="Guarda proyectos que quieras consultar más adelante."/></div></Phase3Shell>
}

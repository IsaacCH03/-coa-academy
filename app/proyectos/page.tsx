import Link from 'next/link'
import { Phase3Shell } from '@/components/phase3-shell'
import { ProjectComposer } from '@/components/projects/project-composer'
import { ProjectCommunityFeed, type CommunityFeedProject } from '@/components/projects/project-community-feed'
import { CommunitySearch, ProjectCommunityLeft, ProjectCommunityRight } from '@/components/projects/project-community-sidebars'
import { categoryCounts, filterCommunityProjects, technologyCounts } from '@/lib/project-community'
import { getCurrentAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

export const metadata={title:'Proyectos COA'}
const pageSize=10
type Query={crear?:string;enviado?:string;error?:string;q?:string;category?:string;technology?:string;course?:string;page?:string;allTech?:string}
const linkFor=(values:Record<string,string|undefined>)=>{const search=new URLSearchParams();Object.entries(values).forEach(([key,value])=>{if(value)search.set(key,value)});const text=search.toString();return text?`/proyectos?${text}`:'/proyectos'}

export default async function Page({searchParams}:{searchParams:Promise<Query>}){
 const supabase=await createClient(),account=await getCurrentAccount(),query=await searchParams
 const[{data:rawProjects,error:projectsError},{data:courseRows}]=await Promise.all([
  supabase.from('student_projects').select('id,slug,title,description,technologies,youtube_id,github_url,created_at,author_id,course_id').eq('status','published').order('created_at',{ascending:false}),
  supabase.from('courses').select('id,title').eq('status','published').order('title'),
 ])
 if(projectsError)console.error('[Proyectos COA] public feed query failed',{stage:'public_project_feed',code:projectsError.code,message:projectsError.message})
 const projects=(rawProjects??[]) as Array<{id:string;slug:string;title:string;description:string;technologies:string[];youtube_id:string|null;github_url:string|null;created_at:string;author_id:string;course_id:string|null}>
 const authorIds=[...new Set(projects.map(project=>project.author_id))]
 const{data:profileRows}=authorIds.length?await supabase.from('public_profiles').select('id,slug,full_name,avatar_path').in('id',authorIds):{data:[]}
 const profiles=new Map(((profileRows??[]) as Array<{id:string;slug:string;full_name:string;avatar_path:string|null}>).map(profile=>[profile.id,profile]))
 const courses=new Map(((courseRows??[]) as Array<{id:string;title:string}>).map(course=>[course.id,course]))
 const enriched=projects.map(project=>({...
  project,
 authorName:profiles.get(project.author_id)?.full_name??'Estudiante COA',
  authorSlug:profiles.get(project.author_id)?.slug??project.author_id,
  avatarPath:profiles.get(project.author_id)?.avatar_path??null,
  courseTitle:project.course_id?courses.get(project.course_id)?.title??null:null,
  authorId:project.author_id,
  courseId:project.course_id,
 }))
 const filtered=filterCommunityProjects(enriched,{q:query.q,category:query.category,technology:query.technology,course:query.course})
 const page=Math.max(1,Number(query.page)||1),visible=filtered.slice((page-1)*pageSize,page*pageSize),visibleIds=visible.map(project=>project.id)
 const{data:imageRows}=visibleIds.length?await supabase.from('student_project_images').select('project_id,storage_path,alt_text,display_order').in('project_id',visibleIds).order('display_order'):{data:[]}
 const imageItems=(imageRows??[]) as Array<{project_id:string;storage_path:string;alt_text:string|null;display_order:number}>,paths=imageItems.map(image=>image.storage_path)
 const{data:signedImages}=paths.length?await supabase.storage.from('phase3-media').createSignedUrls(paths,3600):{data:[]}
 const imageUrls=new Map(((signedImages??[]) as Array<{path:string;signedUrl:string|null}>).map(item=>[item.path,item.signedUrl]))
 const avatarPaths=[...new Set([...visible.map(project=>project.avatarPath),account?.profile.avatar_path].filter((path):path is string=>!!path))]
 const{data:signedAvatars}=avatarPaths.length?await supabase.storage.from('phase3-media').createSignedUrls(avatarPaths,3600):{data:[]}
 const avatarUrls=new Map(((signedAvatars??[]) as Array<{path:string;signedUrl:string|null}>).map(item=>[item.path,item.signedUrl]))
 const imagesByProject=new Map<string,Array<{url:string;alt:string}>>();for(const image of imageItems){const url=imageUrls.get(image.storage_path);if(url)imagesByProject.set(image.project_id,[...(imagesByProject.get(image.project_id)??[]),{url,alt:image.alt_text??'Captura del proyecto'}])}
 const feed:CommunityFeedProject[]=visible.map(project=>({id:project.id,slug:project.slug,title:project.title,description:project.description,technologies:project.technologies??[],githubUrl:project.github_url,youtubeId:project.youtube_id,createdAt:project.created_at,author:{name:project.authorName,slug:project.authorSlug,avatarUrl:project.avatarPath?avatarUrls.get(project.avatarPath)??null:null},courseTitle:project.courseTitle,images:imagesByProject.get(project.id)??[]}))
 const{data:saves}=account?await supabase.from('student_project_saves').select('project_id').eq('user_id',account.user.id):{data:[]}
 const savedIds=(saves??[]).map((save:{project_id:string})=>save.project_id)
 const categories=[['Todos',projects.length] as const,...categoryCounts(projects.map(project=>({id:project.id,title:project.title,technologies:project.technologies??[],authorId:project.author_id,courseId:project.course_id})))]
 const courseCounts=new Map<string,number>();for(const project of projects)if(project.course_id)courseCounts.set(project.course_id,(courseCounts.get(project.course_id)??0)+1)
 const courseItems=[...courseCounts.entries()].map(([id,count])=>({id,title:courses.get(id)?.title??'Curso COA',count})).sort((a,b)=>b.count-a.count||a.title.localeCompare(b.title,'es'))
 const technologies=technologyCounts(projects.map(project=>({id:project.id,title:project.title,technologies:project.technologies??[],authorId:project.author_id,courseId:project.course_id})))
 const filterBase={q:query.q,technology:query.technology,course:query.course}
 const leftCategories=categories.map(([label,count])=>({label,count,active:(label==='Todos'&&!query.category)||query.category===label,href:linkFor({...filterBase,category:label==='Todos'?undefined:label})}))
 const leftCourses=courseItems.slice(0,6).map(item=>({label:item.title,count:item.count,active:query.course===item.id,href:linkFor({q:query.q,category:query.category,technology:query.technology,course:item.id})}))
 const stats=[{label:'Proyectos publicados',value:projects.length},{label:'Estudiantes que han publicado',value:new Set(projects.map(project=>project.author_id)).size},{label:'Cursos representados',value:courseCounts.size},{label:'Tecnologías utilizadas',value:technologies.length}]
 const recent=enriched.slice(0,3).map(project=>({title:project.title,author:project.authorName,href:`/proyectos/${project.slug}`}))
 const hasMore=page*pageSize<filtered.length,nextHref=linkFor({q:query.q,category:query.category,technology:query.technology,course:query.course,page:String(page+1)})
 const avatarUrl=account?.profile.avatar_path?avatarUrls.get(account.profile.avatar_path)??null:null
 const savedHref=account?'/proyectos/guardados':`/cuenta/iniciar-sesion?next=${encodeURIComponent('/proyectos/guardados')}`
 return <Phase3Shell wide>
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start xl:grid-cols-[220px_minmax(0,1fr)_260px]">
   <div className="hidden xl:block xl:sticky xl:top-24"><ProjectCommunityLeft categories={leftCategories} courses={leftCourses} savedHref={savedHref} showAllCourses={courseItems.length>6}/></div>
   <section className="min-w-0"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Comunidad estudiantil</p><h1 className="mt-2 text-4xl font-extrabold">Proyectos COA</h1><p className="mt-3 max-w-2xl text-muted-foreground">Proyectos creados por estudiantes de COA y revisados antes de su publicación.<br/>Aprende, comparte e inspírate con proyectos reales de nuestra comunidad.</p></div><form className="w-full sm:max-w-xs"><CommunitySearch/><input type="hidden" name="category" value={query.category??''}/><input type="hidden" name="technology" value={query.technology??''}/><input type="hidden" name="course" value={query.course??''}/></form></div>
   {query.enviado&&<div role="status" className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-4"><p className="font-bold text-primary">Proyecto enviado para revisión</p><p className="mt-1 text-sm text-muted-foreground">Podrás consultar su estado desde tus proyectos.</p></div>}{query.error&&<p role="alert" className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">{query.error}</p>}
   <div className="mt-6 xl:hidden"><details className="rounded-2xl border bg-card p-4"><summary className="cursor-pointer font-bold">Filtros y navegación</summary><div className="mt-4"><ProjectCommunityLeft categories={leftCategories} courses={leftCourses} savedHref={savedHref} showAllCourses={courseItems.length>6}/></div></details></div>
   <ProjectComposer account={account?{fullName:account.profile.full_name,avatarUrl}:null} courses={courseRows??[]} initialOpen={query.crear==='1'}/>
   <div className="mt-7 flex flex-wrap items-center gap-2"><p className="mr-2 text-sm font-bold">Más recientes</p>{(query.q||query.category||query.technology||query.course)&&<Link href="/proyectos" className="rounded-full border px-3 py-1 text-sm font-semibold text-primary">Limpiar filtros</Link>}<span className="text-sm text-muted-foreground">{filtered.length} proyecto{filtered.length===1?'':'s'}</span></div>
   <div className="mt-4"><ProjectCommunityFeed projects={feed} canSave={!!account} savedIds={savedIds} empty="Aún no hay proyectos publicados con estos filtros."/>{hasMore&&<Link href={nextHref} className="mt-6 inline-flex rounded-xl border px-5 py-3 font-bold text-primary">Cargar más proyectos</Link>}</div>
   </section>
   <div className="hidden lg:block lg:sticky lg:top-24"><ProjectCommunityRight stats={stats} technologies={(query.allTech==='1'?technologies:technologies.slice(0,8)).map(([label,count])=>({label,count,href:linkFor({q:query.q,category:query.category,course:query.course,technology:label})}))} allTechnologiesHref={technologies.length>8&&query.allTech!=='1'?linkFor({q:query.q,category:query.category,course:query.course,allTech:'1'}):undefined} recent={recent}/></div>
  </div><div className="mt-8 lg:hidden"><ProjectCommunityRight stats={stats} technologies={(query.allTech==='1'?technologies:technologies.slice(0,8)).map(([label,count])=>({label,count,href:linkFor({technology:label})}))} allTechnologiesHref={technologies.length>8&&query.allTech!=='1'?linkFor({allTech:'1'}):undefined} recent={recent}/></div>
 </Phase3Shell>
}

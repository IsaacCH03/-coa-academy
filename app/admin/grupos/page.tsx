import Image from 'next/image'
import Link from 'next/link'
import { Archive, UsersRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { LiveGroupArchiveAction } from '@/components/admin/live-group-archive-action'
import { LiveGroupCreateForm } from '@/components/admin/live-group-create-form'
import { requireAdmin } from '@/lib/auth/session'
import { liveGroupStatusLabel, resolveLiveGroupCover, type LiveGroupStatus } from '@/lib/live-groups'
import { createClient } from '@/lib/supabase/server'

type Group={id:string;name:string;status:LiveGroupStatus;starts_on:string|null;image_path:string|null;access_type:string;archived_at:string|null;courses:{title:string}|null;live_group_members:{count:number}[]}

export default async function GroupsPage({searchParams}:{searchParams:Promise<{vista?:string}>}){
 await requireAdmin()
 const{vista}=await searchParams,showArchived=vista==='archivados',supabase=await createClient(),returnTo=showArchived?'/admin/grupos?vista=archivados':'/admin/grupos'
 let groupsQuery=supabase.from('live_groups').select('id,name,status,starts_on,image_path,access_type,archived_at,courses(title),live_group_members(count)').order('created_at',{ascending:false})
 groupsQuery=showArchived?groupsQuery.not('archived_at','is',null):groupsQuery.is('archived_at',null)
 const[{data:groups,error},{data:courses}]=await Promise.all([groupsQuery,supabase.from('courses').select('id,title').eq('status','published').eq('delivery_mode','live_group').order('title')])
 const groupCards=await Promise.all(((groups??[])as unknown as Group[]).map(async group=>({...group,coverUrl:await resolveLiveGroupCover(supabase,group.image_path)})))
 const list=<section><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3">{showArchived?<Archive className="text-primary"/>:<UsersRound className="text-primary"/>}<h2 className="text-xl font-bold">{showArchived?'Grupos archivados':'Grupos existentes'}</h2></div><Link href={showArchived?'/admin/grupos':'/admin/grupos?vista=archivados'} className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-primary">{showArchived?'Volver a grupos':'Ver grupos archivados'}</Link></div>{error?<p role="alert" className="mt-5 text-destructive">No pudimos consultar los grupos.</p>:!groupCards.length?<p className="mt-5 rounded-2xl border border-border p-8 text-center text-muted-foreground">{showArchived?'No hay grupos archivados.':'Aún no hay grupos en vivo.'}</p>:<div className="mt-5 grid gap-4 sm:grid-cols-2">{groupCards.map(group=><article key={group.id} className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm"><Link href={`/admin/grupos/${group.id}?returnTo=${encodeURIComponent(returnTo)}`} className="block hover:bg-secondary/30"><div className="relative aspect-[16/7] bg-secondary"><Image src={group.coverUrl??'/placeholder.svg'} alt={`Portada de ${group.name}`} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover"/></div><div className="p-5">{group.courses?.title&&<p className="text-sm text-muted-foreground">{group.courses.title}</p>}<h3 className="mt-1 text-lg font-bold">{group.name}</h3><div className="mt-4 flex justify-between text-sm"><span>{group.live_group_members[0]?.count??0} participantes</span><span className="font-bold text-primary">{group.access_type==='public'?'Público · ':''}{liveGroupStatusLabel[group.status]}</span></div></div></Link>{showArchived&&<div className="border-t border-border p-4"><LiveGroupArchiveAction groupId={group.id} archived/></div>}</article>)}</div>}</section>
 return <AccountShell title="Grupos en vivo" eyebrow="Administración">{showArchived?<div>{list}</div>:<div className="grid gap-8 lg:grid-cols-[1fr_360px]">{list}<LiveGroupCreateForm courses={courses??[]}/></div>}</AccountShell>
}

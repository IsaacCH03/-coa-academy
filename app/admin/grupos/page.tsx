import Image from 'next/image'
import Link from 'next/link'
import { UsersRound } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { requireAdmin } from '@/lib/auth/session'
import { liveGroupStatusLabel, resolveLiveGroupCover, type LiveGroupStatus } from '@/lib/live-groups'
import { createClient } from '@/lib/supabase/server'
import { createGroup } from './actions'

type Group={id:string;name:string;status:LiveGroupStatus;starts_on:string|null;image_path:string|null;courses:{title:string}|null;live_group_members:{count:number}[]}

export default async function GroupsPage(){
  await requireAdmin()
  const supabase=await createClient()
  const[{data:groups,error},{data:courses}]=await Promise.all([
    supabase.from('live_groups').select('id,name,status,starts_on,image_path,courses(title),live_group_members(count)').order('created_at',{ascending:false}),
    supabase.from('courses').select('id,title').eq('status','published').eq('delivery_mode','live_group').order('title'),
  ])
  const groupCards=await Promise.all(((groups??[]) as unknown as Group[]).map(async group=>({...group,coverUrl:await resolveLiveGroupCover(supabase,group.image_path)})))
  return <AccountShell title="Grupos en vivo" eyebrow="Administración"><div className="grid gap-8 lg:grid-cols-[1fr_360px]"><section><div className="flex items-center gap-3"><UsersRound className="text-primary"/><h2 className="text-xl font-bold">Grupos existentes</h2></div>{error?<p role="alert" className="mt-5 text-destructive">No pudimos consultar los grupos.</p>:!groupCards.length?<p className="mt-5 rounded-2xl border border-border p-8 text-center text-muted-foreground">Aún no hay grupos en vivo.</p>:<div className="mt-5 grid gap-4 sm:grid-cols-2">{groupCards.map(group=><Link key={group.id} href={`/admin/grupos/${group.id}`} className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm hover:border-primary/40"><div className="relative aspect-[16/7] bg-secondary"><Image src={group.coverUrl??'/placeholder.svg'} alt={`Portada de ${group.name}`} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover"/></div><div className="p-5"><p className="text-sm text-muted-foreground">{group.courses?.title}</p><h3 className="mt-1 text-lg font-bold">{group.name}</h3><div className="mt-4 flex justify-between text-sm"><span>{group.live_group_members[0]?.count??0} participantes</span><span className="font-bold text-primary">{liveGroupStatusLabel[group.status]}</span></div></div></Link>)}</div>}</section><form action={createGroup} className="h-fit space-y-4 rounded-2xl border border-border bg-background p-6"><h2 className="text-xl font-bold">Crear grupo</h2><label className="block text-sm font-bold">Curso base<select name="course_id" required className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3">{courses?.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="block text-sm font-bold">Nombre<input name="name" required maxLength={120} placeholder="Python H-26" className="mt-2 h-11 w-full rounded-xl border border-border px-3"/></label><label className="block text-sm font-bold">Fecha de inicio<input name="starts_on" type="date" className="mt-2 h-11 w-full rounded-xl border border-border px-3"/></label><label className="block text-sm font-bold">Estado<select name="status" className="mt-2 h-11 w-full rounded-xl border border-border px-3"><option value="preparation">Preparación</option><option value="active">Activo</option><option value="finished">Finalizado</option></select></label><button className="h-11 w-full rounded-xl bg-primary font-bold text-primary-foreground">Crear grupo</button></form></div></AccountShell>
}

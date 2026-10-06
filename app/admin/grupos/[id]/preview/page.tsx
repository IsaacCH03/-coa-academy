import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { LiveGroupView, type LiveGroupAnnouncement, type LiveGroupPublicMember, type LiveGroupViewSection } from '@/components/academic/live-group-view'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { resolveLiveGroupCover } from '@/lib/live-groups'
import { safeAdminReturnTo } from '@/lib/admin-navigation'

export default async function LiveGroupPreviewPage({ params, searchParams }:{params:Promise<{id:string}>;searchParams:Promise<{tab?:string;returnTo?:string}>}) {
  await requireAdmin()
  const { id } = await params
  const { tab='curso',returnTo:rawReturnTo } = await searchParams
  const returnTo=safeAdminReturnTo(rawReturnTo,'/admin/grupos')
  const supabase = await createClient()
  const { data:group } = await supabase.from('live_groups').select('id,slug,name,image_path,courses(title)').eq('id',id).maybeSingle()
  if (!group) notFound()
  const [{data:sections},{data:members},{data:announcements}] = await Promise.all([
    supabase.from('live_group_sections').select('id,title,status,display_order,live_group_items(id,item_type,title,content,url,original_filename,activity_id,due_at,max_files,max_file_size_bytes,status,display_order)').eq('group_id',id).order('display_order').order('display_order',{referencedTable:'live_group_items'}),
    supabase.rpc('get_live_group_participants',{p_group:id}),
    supabase.from('live_group_announcements').select('id,title,message,published_at').eq('group_id',id).order('published_at',{ascending:false}),
  ])
  const course = Array.isArray(group.courses) ? group.courses[0] : group.courses
  const coverUrl=await resolveLiveGroupCover(supabase,group.image_path)
  return <AccountShell title={group.name} eyebrow={course?.title??'Grupo en vivo'}>
    <Link href={`/admin/grupos/${id}?returnTo=${encodeURIComponent(returnTo)}`} className="mb-5 inline-flex text-sm font-bold text-primary hover:underline">← Volver a administrar</Link>
    <LiveGroupView preview coverUrl={coverUrl} slug={group.slug} tab={tab} tabBaseHref={`/admin/grupos/${id}/preview`} sections={(sections??[]) as unknown as LiveGroupViewSection[]} members={(members??[]) as LiveGroupPublicMember[]} announcements={(announcements??[]) as LiveGroupAnnouncement[]} records={[]} />
  </AccountShell>
}

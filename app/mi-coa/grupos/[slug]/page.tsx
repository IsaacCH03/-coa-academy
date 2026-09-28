import { notFound } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { LiveGroupView, type LiveGroupAnnouncement, type LiveGroupGrade, type LiveGroupPublicMember, type LiveGroupViewSection } from '@/components/academic/live-group-view'
import { requireAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { resolveLiveGroupCover } from '@/lib/live-groups'

export default async function LiveGroupPage({ params, searchParams }: { params:Promise<{slug:string}>;searchParams:Promise<{tab?:string}> }) {
  const { profile } = await requireAccount()
  const { slug } = await params
  const { tab='curso' } = await searchParams
  if (profile.role !== 'student') notFound()
  const supabase = await createClient()
  const { data:group } = await supabase.from('live_groups').select('id,name,status,starts_on,image_path,courses(title)').eq('slug',slug).maybeSingle()
  if (!group) notFound()
  const [{data:sections},{data:members},{data:announcements},{data:records}] = await Promise.all([
    supabase.from('live_group_sections').select('id,title,status,display_order,live_group_items(id,item_type,title,content,url,original_filename,activity_id,due_at,max_files,max_file_size_bytes,status,display_order)').eq('group_id',group.id).eq('status','published').order('display_order').order('display_order',{referencedTable:'live_group_items'}),
    supabase.rpc('get_live_group_participants',{p_group:group.id}),
    supabase.from('live_group_announcements').select('id,title,message,published_at').eq('group_id',group.id).order('published_at',{ascending:false}).limit(5),
    supabase.from('student_activity_records').select('activity_id,status,feedback,reviewed_at,submissions(grade),activities!inner(title,live_group_id)').eq('student_id',profile.id).eq('activities.live_group_id',group.id),
  ])
  const course = Array.isArray(group.courses) ? group.courses[0] : group.courses
  const coverUrl=await resolveLiveGroupCover(supabase,group.image_path)
  return <AccountShell title={group.name} eyebrow={course?.title??'Grupo en vivo'}>
    <LiveGroupView coverUrl={coverUrl} slug={slug} tab={tab} tabBaseHref={`/mi-coa/grupos/${slug}`} sections={(sections??[]) as unknown as LiveGroupViewSection[]} members={(members??[]) as LiveGroupPublicMember[]} announcements={(announcements??[]) as LiveGroupAnnouncement[]} records={(records??[]) as unknown as LiveGroupGrade[]} />
  </AccountShell>
}

import { createClient } from '@/lib/supabase/server'
import { getCourse } from '@/lib/courses'
import { resolveLiveGroupCover } from '@/lib/live-groups'

export type PublicLiveGroup = {
  id:string
  slug:string
  name:string
  startsOn:string|null
  summary:string|null
  showBanner:boolean
  showCatalog:boolean
  image:string
  course:{slug:string;title:string;category:string}|null
}

export async function getPublicLiveGroups(){
  const supabase=await createClient()
  const{data,error}=await supabase.from('live_groups')
    .select('id,slug,name,starts_on,image_path,public_summary,show_banner,show_catalog,courses(slug,title)')
    .eq('access_type','public').eq('status','active').or('show_banner.eq.true,show_catalog.eq.true')
    .order('starts_on',{ascending:true,nullsFirst:false})
  if(error){
    if(process.env.NODE_ENV!=='production')console.error('[public-live-groups]',{message:error.message,code:error.code})
    return []
  }
  return Promise.all((data??[]).map(async row=>{
    const related=Array.isArray(row.courses)?row.courses[0]:row.courses
    const definition=related?getCourse(related.slug):undefined
    return {
      id:row.id,slug:row.slug,name:row.name,startsOn:row.starts_on,summary:row.public_summary,
      showBanner:row.show_banner,showCatalog:row.show_catalog,
      image:await resolveLiveGroupCover(supabase,row.image_path)??'/placeholder.svg',
      course:related?{slug:related.slug,title:related.title,category:definition?.category??'Grupos en vivo'}:null,
    } satisfies PublicLiveGroup
  }))
}

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAccount } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { isAcademicProfileComplete, type AcademicProfile, type EnrollmentActionState } from '@/lib/academic'
import { isSupportedCountry } from '@/lib/countries'

const field=(data:FormData,key:string)=>String(data.get(key)??'').trim()

export async function joinPublicGroupAction(_:EnrollmentActionState,data:FormData):Promise<EnrollmentActionState>{
  const{user,profile:account}=await requireAccount()
  if(account.role!=='student')redirect('/admin')
  const groupId=field(data,'group_id'),slug=field(data,'slug')
  if(!/^[0-9a-f-]{36}$/i.test(groupId)||!slug)return{status:'error',message:'El grupo seleccionado no es válido.'}
  const supabase=await createClient()
  const{data:profile}=await supabase.from('profiles').select('id,full_name,identification,country,phone').eq('id',user.id).single<AcademicProfile>()
  if(!profile)return{status:'error',message:'No pudimos consultar tu perfil académico.'}
  if(!isAcademicProfileComplete(profile)){
    const identification=field(data,'identification'),country=field(data,'country'),phone=field(data,'phone')
    if(identification.length<4||identification.length>40)return{status:'error',message:'Escribe una identificación válida.'}
    if(!isSupportedCountry(country))return{status:'error',message:'Selecciona un país válido.'}
    if(phone.length<7||phone.length>30)return{status:'error',message:'Escribe un teléfono válido.'}
    const{error}=await supabase.from('profiles').update({identification,country,phone}).eq('id',user.id)
    if(error)return{status:'error',message:'No pudimos guardar los datos de tu perfil.'}
  }
  const{data:joinedSlug,error}=await supabase.rpc('join_public_live_group',{p_group:groupId})
  if(error){
    if(process.env.NODE_ENV!=='production')console.error('[join-public-group]',{message:error.message,code:error.code,groupId,userId:user.id})
    return{status:'error',message:'No pudimos completar la inscripción. Confirma que el grupo siga público y activo.'}
  }
  if(joinedSlug!==slug)return{status:'error',message:'No pudimos confirmar el grupo seleccionado.'}
  revalidatePath('/');revalidatePath('/mi-coa');revalidatePath(`/mi-coa/grupos/${slug}`)
  redirect(`/inscripcion/grupo/${encodeURIComponent(slug)}?estado=inscrito`)
}

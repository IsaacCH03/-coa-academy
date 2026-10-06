'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

const idFrom=(data:FormData)=>String(data.get('submission_id')??'').trim()

export async function archiveSubmission(data:FormData){
 await requireAdmin()
 const id=idFrom(data)
 if(!id)throw new Error('Entrega inválida.')
 const supabase=await createClient()
 const{error}=await supabase.from('submissions').update({admin_archived_at:new Date().toISOString()}).eq('id',id).is('admin_archived_at',null)
 if(error)throw new Error('No pudimos archivar la entrega.')
 revalidatePath('/admin/entregas')
}

export async function restoreSubmission(data:FormData){
 await requireAdmin()
 const id=idFrom(data)
 if(!id)throw new Error('Entrega inválida.')
 const supabase=await createClient()
 const{error}=await supabase.from('submissions').update({admin_archived_at:null}).eq('id',id).not('admin_archived_at','is',null)
 if(error)throw new Error('No pudimos restaurar la entrega.')
 revalidatePath('/admin/entregas')
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccountShell } from '@/components/account/account-shell'
import { Field, inputClass } from '@/components/phase3-shell'
import { addProposalOption, saveProposal } from '@/app/phase3-actions'
import { requireAdmin } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

const relationName=(value:unknown)=>{const row=Array.isArray(value)?value[0]:value;return row&&typeof row==='object'&&'full_name'in row?String(row.full_name):'Estudiante COA'}

export default async function Page({params}:{params:Promise<{id:string}>}){
 await requireAdmin()
 const{id}=await params,supabase=await createClient(),[{data:proposal},{data:options},{data:requests}]=await Promise.all([
  supabase.from('course_proposals').select('*').eq('id',id).maybeSingle(),
  supabase.from('course_proposal_options').select('*').eq('proposal_id',id).order('display_order'),
  supabase.from('course_requests').select('user_id,option_id,profiles(full_name)').eq('proposal_id',id),
 ])
 if(!proposal)notFound()
 const distribution=new Map<string,number>();for(const request of requests??[])distribution.set(request.option_id,(distribution.get(request.option_id)??0)+1)
 const editableFields=['price_text','modality','duration','schedule_text'] as const
 return <AccountShell eyebrow="Demanda" title={proposal.name}>
  <Link href="/admin/solicitudes" className="mb-5 inline-flex text-sm font-bold text-primary">← Volver a solicitudes</Link>
  <div className="grid gap-8 lg:grid-cols-2"><form action={saveProposal} className="grid gap-4 rounded-2xl border bg-background p-6"><input type="hidden" name="id" value={proposal.id}/><Field label="Nombre"><input className={inputClass} name="name" defaultValue={proposal.name}/></Field><Field label="Slug"><input className={inputClass} name="slug" defaultValue={proposal.slug}/></Field><Field label="Descripción corta"><textarea className={inputClass} name="short_description" defaultValue={proposal.short_description}/></Field><Field label="Información"><textarea className={`${inputClass} min-h-32`} name="content" defaultValue={proposal.content}/></Field><Field label="Imagen nueva"><input name="image" type="file" accept="image/png,image/jpeg,image/webp"/></Field>{editableFields.map(key=><Field key={key} label={key.replaceAll('_',' ')}><input className={inputClass} name={key} defaultValue={proposal[key]}/></Field>)}<Field label="Mínimo"><input className={inputClass} type="number" name="minimum_requests" defaultValue={proposal.minimum_requests}/></Field><Field label="Estado"><select className={inputClass} name="status" defaultValue={proposal.status}>{['draft','open','closed','archived'].map(status=><option key={status}>{status}</option>)}</select></Field><button className="rounded-xl bg-primary py-3 font-bold text-primary-foreground">Guardar cambios</button></form><section><div className="rounded-2xl border bg-background p-6"><h2 className="text-xl font-bold">{requests?.length??0} solicitudes</h2><p className="text-sm text-muted-foreground">Mínimo: {proposal.minimum_requests}</p><div className="mt-5 grid gap-2">{options?.map(option=><div key={option.id} className="flex justify-between"><span>{option.label||option.proposed_start_date}</span><b>{distribution.get(option.id)??0}</b></div>)}</div><form action={addProposalOption} className="mt-5 flex gap-2"><input type="hidden" name="proposal_id" value={proposal.id}/><input className={`${inputClass} flex-1`} name="label" placeholder="Nueva disponibilidad"/><button className="rounded-xl border px-3">Agregar</button></form></div><div className="mt-5 rounded-2xl border bg-background p-6"><h2 className="font-bold">Personas interesadas</h2>{requests?.map(request=><p key={request.user_id} className="mt-2 text-sm">{relationName(request.profiles)}</p>)}</div>{(requests?.length??0)>=proposal.minimum_requests&&<Link href={`/admin/grupos?proposal=${proposal.id}`} className="mt-5 block rounded-xl bg-primary p-3 text-center font-bold text-primary-foreground">Crear grupo en vivo</Link>}</section></div>
 </AccountShell>
}

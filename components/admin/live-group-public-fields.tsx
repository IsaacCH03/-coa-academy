'use client'
import { useState } from 'react'
import { LIVE_GROUP_COVER_MAX_BYTES, validateLiveGroupCover } from '@/lib/live-groups'

export function LiveGroupPublicFields({accessType='private',showBanner=false,showCatalog=false,summary='',allowPrivate=true}:{accessType?:string;showBanner?:boolean;showCatalog?:boolean;summary?:string;allowPrivate?:boolean}){
  const[access,setAccess]=useState(accessType)
  return <><label className="text-sm font-bold">Tipo de acceso<select name="access_type" value={access} onChange={event=>setAccess(event.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-background px-3">{allowPrivate&&<option value="private">Privado</option>}<option value="public">Público</option></select></label>{access==='public'&&<fieldset className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4 sm:col-span-2"><legend className="px-2 text-sm font-bold">Visibilidad pública</legend><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="show_banner" defaultChecked={showBanner}/>Mostrar como banner destacado</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="show_catalog" defaultChecked={showCatalog}/>Mostrar en catálogo de cursos</label><label className="block text-sm font-bold">Descripción pública<textarea name="public_summary" defaultValue={summary} maxLength={500} placeholder="Describe brevemente el grupo, sus fechas o modalidad." className="mt-2 min-h-24 w-full rounded-xl border bg-background p-3 font-normal"/></label></fieldset>}</>
}

export function LiveGroupCoverInput({label}:{label:string}){
  const[error,setError]=useState('')
  return <label className="text-sm font-bold">{label}<input type="file" name="image" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={event=>{const file=event.target.files?.[0];const message=file?validateLiveGroupCover(file):'';event.target.setCustomValidity(message??'');setError(message??'')}} className="mt-2 block w-full text-sm"/><span className="mt-1 block text-xs font-normal text-muted-foreground">PNG, JPG o WebP · máximo {LIVE_GROUP_COVER_MAX_BYTES/1024/1024} MB · recomendado 1600 × 700 px.</span>{error&&<span className="mt-1 block text-xs font-semibold text-destructive">{error}</span>}</label>
}

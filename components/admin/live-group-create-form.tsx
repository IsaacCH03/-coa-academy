'use client'

import { useState } from 'react'
import { createGroup } from '@/app/admin/grupos/actions'

export function LiveGroupCreateForm({courses}:{courses:{id:string;title:string}[]}){
  const[access,setAccess]=useState<'private'|'public'>('private')
  return <form action={createGroup} className="h-fit space-y-4 rounded-2xl border border-border bg-background p-6">
    <h2 className="text-xl font-bold">Crear grupo</h2>
    {access==='private'&&<label className="block text-sm font-bold">Curso base<select name="course_id" required className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3">{courses.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}</select></label>}
    <label className="block text-sm font-bold">Nombre<input name="name" required maxLength={120} placeholder="Python H-26" className="mt-2 h-11 w-full rounded-xl border border-border px-3"/></label>
    <label className="block text-sm font-bold">Fecha de inicio<input name="starts_on" type="date" className="mt-2 h-11 w-full rounded-xl border border-border px-3"/></label>
    <label className="block text-sm font-bold">Estado<select name="status" className="mt-2 h-11 w-full rounded-xl border border-border px-3"><option value="preparation">Preparación</option><option value="active">Activo</option><option value="finished">Finalizado</option></select></label>
    <label className="block text-sm font-bold">Tipo de acceso<select name="access_type" value={access} onChange={event=>setAccess(event.target.value as 'private'|'public')} className="mt-2 h-11 w-full rounded-xl border bg-background px-3"><option value="private">Privado</option><option value="public">Público</option></select></label>
    {access==='public'&&<fieldset className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4"><legend className="px-2 text-sm font-bold">Visibilidad pública</legend><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="show_banner"/>Mostrar como banner destacado</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="show_catalog"/>Mostrar en catálogo de cursos</label><label className="block text-sm font-bold">Descripción pública<textarea name="public_summary" maxLength={500} placeholder="Describe brevemente el grupo, sus fechas o modalidad." className="mt-2 min-h-24 w-full rounded-xl border bg-background p-3 font-normal"/></label></fieldset>}
    <button className="h-11 w-full rounded-xl bg-primary font-bold text-primary-foreground">Crear grupo</button>
  </form>
}

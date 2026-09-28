'use client'

import { useState } from 'react'
import { createItem } from '@/app/admin/grupos/actions'
import type { LiveGroupItemType } from '@/lib/live-groups'

const inputClass = 'mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 font-normal'

export function LiveGroupItemForm({ groupId, sectionId }: { groupId: string; sectionId: string }) {
  const [type, setType] = useState<LiveGroupItemType>('text')
  return <form action={createItem} className="mt-5 grid gap-4 rounded-xl bg-secondary/60 p-4 sm:grid-cols-2">
    <input type="hidden" name="group_id" value={groupId} />
    <input type="hidden" name="section_id" value={sectionId} />
    <label className="text-sm font-bold">Tipo
      <select name="item_type" value={type} onChange={(event) => setType(event.target.value as LiveGroupItemType)} className={inputClass}>
        <option value="text">Texto</option><option value="file">Archivo</option><option value="link">Enlace</option><option value="assignment">Entrega</option>
      </select>
    </label>
    <label className="text-sm font-bold">Título
      <input name="title" required={type === 'assignment'} className={inputClass} />
    </label>
    {type === 'text' && <label className="text-sm font-bold sm:col-span-2">Contenido
      <textarea name="content" required className="mt-1 min-h-24 w-full rounded-lg border border-border bg-background p-3 font-normal" />
    </label>}
    {type === 'file' && <><label className="text-sm font-bold sm:col-span-2">Descripción opcional
      <textarea name="content" className="mt-1 min-h-20 w-full rounded-lg border border-border bg-background p-3 font-normal" />
    </label><label className="text-sm font-bold sm:col-span-2">Archivo
      <input name="file" type="file" required className="mt-2 block w-full font-normal" />
    </label></>}
    {type === 'link' && <><label className="text-sm font-bold sm:col-span-2">Descripción opcional
      <textarea name="description" className="mt-1 min-h-20 w-full rounded-lg border border-border bg-background p-3 font-normal" />
    </label><label className="text-sm font-bold sm:col-span-2">URL
      <input name="url" type="url" required placeholder="https://…" className={inputClass} />
    </label></>}
    {type === 'assignment' && <>
      <label className="text-sm font-bold sm:col-span-2">Instrucciones / descripción<textarea name="content" className="mt-1 min-h-24 w-full rounded-lg border border-border bg-background p-3 font-normal" /></label>
      <label className="text-sm font-bold">Fecha límite<input name="due_date" type="date" required className={inputClass} /></label>
      <label className="text-sm font-bold">Hora límite<input name="due_time" type="time" required defaultValue="23:59" className={inputClass} /></label>
      <label className="text-sm font-bold">Máximo de archivos<input name="max_files" type="number" min="1" max="20" required defaultValue="3" className={inputClass} /></label>
      <label className="text-sm font-bold">MB por archivo<input name="max_file_mb" type="number" min="1" max="50" required defaultValue="20" className={inputClass} /></label>
    </>}
    <button className="h-11 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground sm:col-span-2">Añadir contenido</button>
  </form>
}

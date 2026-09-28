import { updateItem } from '@/app/admin/grupos/actions'

export type EditableLiveGroupItem = {
  id: string
  item_type: string
  title: string | null
  content: string | null
  url: string | null
  due_at: string | null
  max_files: number | null
  max_file_size_bytes: number | null
}

function costaRicaParts(value: string | null) {
  if (!value) return { date: '', time: '23:59' }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(value))
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` }
}

export function LiveGroupItemEditor({ groupId, item }: { groupId: string; item: EditableLiveGroupItem }) {
  const deadline = costaRicaParts(item.due_at)
  return <details className="mt-2 rounded-lg border border-border p-3">
    <summary className="cursor-pointer text-xs font-bold text-primary">Editar contenido</summary>
    <form action={updateItem} className="mt-3 grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="group_id" value={groupId} />
      <input type="hidden" name="item_id" value={item.id} />
      <label className="text-xs font-bold">Título<input name="title" defaultValue={item.title ?? ''} className="mt-1 h-10 w-full rounded-lg border px-2 font-normal" /></label>
      {item.item_type === 'link' && <label className="text-xs font-bold">URL<input name="url" type="url" required defaultValue={item.url ?? ''} className="mt-1 h-10 w-full rounded-lg border px-2 font-normal" /></label>}
      {(item.item_type === 'text' || item.item_type === 'link' || item.item_type === 'assignment' || item.item_type === 'file') && <label className="text-xs font-bold sm:col-span-2">{item.item_type === 'link' || item.item_type === 'file' ? 'Descripción opcional' : item.item_type === 'assignment' ? 'Instrucciones / descripción' : 'Contenido'}<textarea name="content" required={item.item_type === 'text'} defaultValue={item.content ?? ''} className="mt-1 min-h-20 w-full rounded-lg border p-2 font-normal" /></label>}
      {item.item_type === 'file' && <label className="text-xs font-bold sm:col-span-2">Reemplazar archivo (opcional)<input name="file" type="file" className="mt-1 block w-full font-normal" /></label>}
      {item.item_type === 'assignment' && <><label className="text-xs font-bold">Fecha límite<input name="due_date" type="date" required defaultValue={deadline.date} className="mt-1 h-10 w-full rounded-lg border px-2 font-normal" /></label><label className="text-xs font-bold">Hora<input name="due_time" type="time" required defaultValue={deadline.time} className="mt-1 h-10 w-full rounded-lg border px-2 font-normal" /></label><label className="text-xs font-bold">Máximo de archivos<input name="max_files" type="number" min="1" max="20" required defaultValue={item.max_files ?? 1} className="mt-1 h-10 w-full rounded-lg border px-2 font-normal" /></label><label className="text-xs font-bold">MB por archivo<input name="max_file_mb" type="number" min="1" max="50" required defaultValue={Math.round((item.max_file_size_bytes ?? 10485760) / 1048576)} className="mt-1 h-10 w-full rounded-lg border px-2 font-normal" /></label></>}
      <button className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground sm:col-span-2">Guardar contenido</button>
    </form>
  </details>
}

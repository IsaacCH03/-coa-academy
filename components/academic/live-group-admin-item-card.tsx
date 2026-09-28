import { ArrowDown, ArrowUp, FileText, Link2, NotebookPen, Type } from 'lucide-react'
import { archiveItem, moveItem } from '@/app/admin/grupos/actions'
import { ConfirmSubmitButton } from './confirm-submit-button'
import { LiveGroupItemEditor, type EditableLiveGroupItem } from './live-group-item-editor'

export type AdminLiveGroupItem = EditableLiveGroupItem & {
  original_filename: string | null
  status: string
  activity_id: string | null
  display_order: number
}

const metadata = {
  text: { label: 'Texto', Icon: Type },
  file: { label: 'Archivo', Icon: FileText },
  link: { label: 'Enlace', Icon: Link2 },
  assignment: { label: 'Entrega', Icon: NotebookPen },
} as const

export function LiveGroupAdminItemCard({ groupId, item }: { groupId: string; item: AdminLiveGroupItem }) {
  const type = metadata[item.item_type as keyof typeof metadata] ?? metadata.text
  const detail = item.item_type === 'file' ? item.original_filename
    : item.item_type === 'assignment' ? `${item.due_at ? `Cierra: ${new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Costa_Rica' }).format(new Date(item.due_at))}` : 'Sin fecha'} · Máximo: ${item.max_files ?? 1} archivo${item.max_files === 1 ? '' : 's'} · ${Math.round((item.max_file_size_bytes ?? 10485760) / 1048576)} MB por archivo`
      : item.item_type === 'link' ? (() => { try { return item.url ? new URL(item.url).hostname : null } catch { return item.url } })()
        : item.content
  return <article className="rounded-xl border border-border bg-background p-4 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary"><type.Icon className="h-4 w-4" />{type.label}</p>
        <h3 className="mt-2 break-words text-base font-bold">{item.title ?? item.original_filename ?? `Contenido ${type.label.toLowerCase()}`}</h3>
        {detail && <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{detail}</p>}
        <LiveGroupItemEditor groupId={groupId} item={item} />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <form action={moveItem}><input type="hidden" name="group_id" value={groupId}/><input type="hidden" name="item_id" value={item.id}/><button name="direction" value="-1" aria-label="Subir contenido" title="Subir" className="rounded-lg border p-2 text-primary"><ArrowUp className="h-4 w-4"/></button><button name="direction" value="1" aria-label="Bajar contenido" title="Bajar" className="ml-1 rounded-lg border p-2 text-primary"><ArrowDown className="h-4 w-4"/></button></form>
        <form action={archiveItem}><input type="hidden" name="group_id" value={groupId}/><input type="hidden" name="item_id" value={item.id}/><ConfirmSubmitButton label="Archivar" title="Archivar contenido" message="Dejará de estar disponible para estudiantes. El historial académico asociado se conservará." className="rounded-lg px-3 py-2 text-sm font-bold text-destructive"/></form>
      </div>
    </div>
  </article>
}

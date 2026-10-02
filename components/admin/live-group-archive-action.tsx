import { ConfirmSubmitButton } from '@/components/academic/confirm-submit-button'
import { archiveGroup, restoreGroup } from '@/app/admin/grupos/actions'

export function LiveGroupArchiveAction({groupId,archived}:{groupId:string;archived:boolean}){
  return <form action={archived?restoreGroup:archiveGroup}>
    <input type="hidden" name="group_id" value={groupId}/>
    <ConfirmSubmitButton label={archived?'Restaurar grupo':'Archivar grupo'} title={archived?'Restaurar grupo':'Archivar grupo'} message={archived?'El grupo volverá a aparecer en la lista principal. Su estado, visibilidad, contenido y participantes no cambiarán.':'El grupo dejará de aparecer en la lista principal de administración. Su estado, visibilidad, contenido, participantes y datos académicos se conservarán.'} className={archived?'rounded-xl border border-primary px-4 py-2 text-sm font-bold text-primary':'rounded-xl border border-destructive px-4 py-2 text-sm font-bold text-destructive'}/>
  </form>
}


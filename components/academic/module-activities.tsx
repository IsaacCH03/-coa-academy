import { academicActivities } from '@/lib/academic-activities'
import { SubmissionUploader } from '@/components/academic/submission-uploader'

const typeLabels = {
  exercise: 'Ejercicios', assignment: 'Actividades obligatorias', challenge: 'Ejercicios y retos',
  mini_project: 'Mini proyecto', project: 'Proyecto', final_project: 'Proyecto final',
} as const

export function ActivityDeliveryPoint({ activityId }: { activityId: string }) {
  const activity = academicActivities.find((item) => item.id === activityId)
  if (!activity) return null
  return <section data-activity-anchor={activity.id} className="my-10 border-y border-primary/20 py-8">
    <p className="mb-4 text-sm font-bold uppercase tracking-wide text-primary">Punto de entrega</p>
    <article id={activity.id} className="rounded-2xl border border-primary/25 bg-card p-6 shadow-sm md:p-7">
      <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{typeLabels[activity.activityType]}</span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">Obligatoria</span></div>
      <h3 className="mt-4 text-2xl font-extrabold text-foreground">{activity.visibleName}</h3><p className="mt-3 text-muted-foreground">{activity.instructions}</p>
      <div className="mt-6 rounded-xl bg-secondary/60 p-5"><h4 className="font-bold text-foreground">Qué debes entregar</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">{activity.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div>
      {activity.rubric.origin === 'new' ? <div className="mt-6 overflow-hidden rounded-xl border border-border"><div className="flex items-center justify-between bg-secondary px-4 py-3"><h4 className="font-bold text-foreground">Rúbrica de evaluación</h4><span className="text-sm font-bold text-primary">100 puntos</span></div><div className="divide-y divide-border">{activity.rubric.criteria.map((criterion) => <div key={criterion.label} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-sm"><div><p className="font-medium text-foreground">{criterion.label}</p>{criterion.description && <p className="mt-1 text-muted-foreground">{criterion.description}</p>}</div><span className="font-bold text-primary">{criterion.maxPoints}</span></div>)}<div className="grid grid-cols-[1fr_auto] gap-4 bg-muted/40 px-4 py-3 font-bold text-foreground"><span>Total</span><span>100</span></div></div></div> : <div className="mt-6 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground"><p className="font-bold text-foreground">Rúbrica existente del contenido</p><p className="mt-1">Se conserva la rúbrica original mostrada antes de este punto de entrega.{activity.rubric.originalMaxPoints !== 100 && <> Su escala original es de {activity.rubric.originalMaxPoints} puntos y la futura nota se normalizará a 100.</>}</p></div>}
      <SubmissionUploader activityId={activity.id} />
    </article>
  </section>
}

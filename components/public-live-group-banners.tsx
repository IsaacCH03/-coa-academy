import Link from 'next/link'
import { ArrowRight, CalendarDays, Radio } from 'lucide-react'
import type { PublicLiveGroup } from '@/lib/public-live-groups'
import { SafeImage } from '@/components/safe-image'

export function PublicLiveGroupBanners({groups}:{groups:PublicLiveGroup[]}){
  const featured=groups.filter(group=>group.showBanner)
  if(!featured.length)return null
  return <section aria-labelledby="public-groups-title" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
    <div className="mb-5"><p className="text-sm font-semibold text-primary">Próximas experiencias</p><h2 id="public-groups-title" className="mt-1 text-2xl font-extrabold md:text-3xl">Grupos públicos en vivo</h2></div>
    <div className="space-y-5">{featured.map(group=><article key={group.id} className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
      <div className="flex flex-col justify-center p-6 md:p-10"><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary"><Radio className="h-4 w-4"/>Grupo público en vivo</p><h3 className="mt-3 text-2xl font-extrabold text-card-foreground md:text-4xl">{group.name}</h3>{group.course&&<p className="mt-2 font-semibold text-muted-foreground">{group.course.title}</p>}{group.summary&&<p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{group.summary}</p>}{group.startsOn&&<p className="mt-4 flex items-center gap-2 text-sm font-semibold"><CalendarDays className="h-4 w-4 text-primary"/>Inicia {new Intl.DateTimeFormat('es-CR',{dateStyle:'long'}).format(new Date(`${group.startsOn}T12:00:00`))}</p>}<Link href={`/inscripcion/grupo/${group.slug}`} className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Inscribirme <ArrowRight className="h-4 w-4"/></Link></div>
      <div className="relative min-h-56 bg-secondary md:min-h-80"><SafeImage src={group.image} alt={`Portada de ${group.name}`} sizes="(max-width: 768px) 100vw, 480px" className="object-cover"/></div>
    </article>)}</div>
  </section>
}

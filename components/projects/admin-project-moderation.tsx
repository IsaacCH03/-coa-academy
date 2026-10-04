'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Eye, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { moderateProject } from '@/app/phase3-actions'

type Status = 'pending' | 'published' | 'rejected'
type ImageData = { storage_path: string; alt_text: string | null; display_order: number; url?: string | null }
export type AdminProject = { id:string;slug:string;title:string;description:string;technologies:string[];youtube_id:string|null;github_url:string|null;status:Status;rejection_reason:string|null;created_at:string;author:{full_name:string}|null;course:{title:string}|null;student_project_images:ImageData[] }
const tabs:Array<{value:Status;label:string;empty:string}>=[{value:'pending',label:'Pendientes',empty:'No hay proyectos pendientes de revisión.'},{value:'published',label:'Publicados',empty:'No hay proyectos publicados.'},{value:'rejected',label:'Rechazados',empty:'No hay proyectos rechazados.'}]
const statusLabel:Record<Status,string>={pending:'Pendiente',published:'Publicado',rejected:'Rechazado'}
const formatDate=(value:string)=>new Intl.DateTimeFormat('es-CR',{dateStyle:'medium'}).format(new Date(value))

function Actions({project,compact=false}:{project:AdminProject;compact?:boolean}){
 if(project.status==='rejected')return null
 return <div className={`flex flex-wrap gap-2 ${compact?'':'mt-5'}`}>
  {project.status==='pending'&&<form action={moderateProject}><input type="hidden" name="project_id" value={project.id}/><button name="status" value="published" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Aprobar</button></form>}
  <form action={moderateProject} className="flex min-w-56 flex-1 gap-2"><input type="hidden" name="project_id" value={project.id}/>{project.status==='pending'&&<input name="reason" required className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm" placeholder="Motivo del rechazo"/>}<button name="status" value={project.status==='published'?'pending':'rejected'} className="rounded-xl border px-4 py-2 text-sm font-bold text-destructive">{project.status==='published'?'Retirar':'Rechazar'}</button></form>
 </div>
}

function ProjectDialog({project}:{project:AdminProject}){
 const ref=useRef<HTMLDialogElement>(null)
 return <><button type="button" onClick={()=>ref.current?.showModal()} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-primary"><Eye className="h-4 w-4"/>Ver proyecto</button>
  <dialog ref={ref} aria-labelledby={`project-${project.id}`} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-3xl border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60">
   <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-background p-5 sm:p-6"><div><p className="text-xs font-bold uppercase text-primary">{statusLabel[project.status]}</p><h2 id={`project-${project.id}`} className="mt-1 text-2xl font-extrabold">{project.title}</h2></div><button type="button" onClick={()=>ref.current?.close()} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><X className="h-5 w-5"/></button></div>
   <div className="p-5 sm:p-6">
    <dl className="grid gap-4 text-sm sm:grid-cols-3"><div><dt className="font-bold text-muted-foreground">Autor</dt><dd className="mt-1">{project.author?.full_name??'Estudiante COA'}</dd></div><div><dt className="font-bold text-muted-foreground">Curso</dt><dd className="mt-1">{project.course?.title??'Sin curso relacionado'}</dd></div><div><dt className="font-bold text-muted-foreground">Enviado</dt><dd className="mt-1">{formatDate(project.created_at)}</dd></div></dl>
    <p className="mt-6 whitespace-pre-wrap leading-relaxed">{project.description}</p>
    {!!project.technologies.length&&<div className="mt-5 flex flex-wrap gap-2">{project.technologies.map(item=><span key={item} className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold">{item}</span>)}</div>}
    {!!project.student_project_images.length&&<div className="mt-6 grid gap-4 sm:grid-cols-2">{project.student_project_images.map(image=>image.url&&<div key={image.storage_path} className="relative aspect-video overflow-hidden rounded-2xl border"><Image fill unoptimized src={image.url} alt={image.alt_text??project.title} className="object-cover"/></div>)}</div>}
    <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-primary">{project.youtube_id&&<a href={`https://youtube.com/watch?v=${project.youtube_id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">YouTube <ExternalLink className="h-4 w-4"/></a>}{project.github_url&&<a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">GitHub <ExternalLink className="h-4 w-4"/></a>}{project.status==='published'&&<Link href={`/proyectos/${project.slug}`} target="_blank" className="inline-flex items-center gap-1">Ver publicación <ExternalLink className="h-4 w-4"/></Link>}</div>
    {project.rejection_reason&&<p className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"><b>Motivo:</b> {project.rejection_reason}</p>}
    <Actions project={project}/>
   </div>
  </dialog></>
}

export function AdminProjectModeration({projects}:{projects:AdminProject[]}){
 const[active,setActive]=useState<Status>('pending'),selected=projects.filter(project=>project.status===active),current=tabs.find(tab=>tab.value===active)!
 return <section className="mt-7"><div role="tablist" aria-label="Estado de los proyectos" className="flex flex-wrap gap-2 border-b pb-4">{tabs.map(tab=><button key={tab.value} type="button" role="tab" aria-selected={active===tab.value} onClick={()=>setActive(tab.value)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${active===tab.value?'bg-primary text-primary-foreground':'bg-secondary text-foreground hover:bg-secondary/70'}`}>{tab.label} <span className="ml-1 opacity-80">{projects.filter(project=>project.status===tab.value).length}</span></button>)}</div>
  {!selected.length?<p className="mt-6 rounded-2xl border bg-background p-8 text-center text-muted-foreground">{current.empty}</p>:<div role="tabpanel" className="mt-6 grid gap-5">{selected.map(project=>{const cover=project.student_project_images[0]?.url;return <article key={project.id} className="grid overflow-hidden rounded-2xl border bg-background shadow-sm sm:grid-cols-[220px_1fr]"><div className="relative min-h-44 bg-secondary">{cover?<Image fill unoptimized src={cover} alt={project.student_project_images[0].alt_text??project.title} className="object-cover"/>:<div className="grid h-full min-h-44 place-items-center px-5 text-center text-sm text-muted-foreground">Sin imágenes</div>}</div><div className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-primary">{statusLabel[project.status]}</p><h2 className="mt-1 text-xl font-extrabold">{project.title}</h2></div><span className="text-sm text-muted-foreground">{formatDate(project.created_at)}</span></div><p className="mt-2 text-sm"><b>{project.author?.full_name??'Estudiante COA'}</b>{project.course?.title?` · ${project.course.title}`:''}</p>{!!project.technologies.length&&<p className="mt-2 text-sm text-muted-foreground">{project.technologies.join(' · ')}</p>}{project.rejection_reason&&<p className="mt-3 text-sm text-destructive">Motivo: {project.rejection_reason}</p>}<div className="mt-5 flex flex-wrap items-start gap-2"><ProjectDialog project={project}/><Actions project={project} compact/></div></div></article>})}</div>}
 </section>
}

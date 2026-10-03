'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ProjectCreateForm } from './project-create-form'

type Course = { id: string; title: string }
type Account = { fullName: string; avatarUrl: string | null }

export function ProjectComposer({ account, courses, initialOpen = false }: { account: Account | null; courses: Course[]; initialOpen?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const firstName = account?.fullName.trim().split(/\s+/)[0] ?? ''
  const initials = account?.fullName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() ?? 'CO'
  const loginHref = '/cuenta/iniciar-sesion?next=%2Fproyectos%3Fcrear%3D1'
  const open = () => dialogRef.current?.showModal()

  useEffect(() => {
    if (account && initialOpen) dialogRef.current?.showModal()
  }, [account, initialOpen])

  return <>
    <section aria-label="Publicar un proyecto" className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
      {account?.avatarUrl
        ? <Image src={account.avatarUrl} alt="" width={48} height={48} unoptimized className="h-12 w-12 shrink-0 rounded-full object-cover"/>
        : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-extrabold text-primary-foreground">{initials}</span>}
      {account
        ? <button type="button" onClick={open} className="min-w-0 flex-1 rounded-full bg-secondary px-4 py-3 text-left text-sm text-muted-foreground transition hover:bg-secondary/80 sm:text-base">¿Qué proyecto quieres compartir, {firstName}?</button>
        : <Link href={loginHref} className="min-w-0 flex-1 rounded-full bg-secondary px-4 py-3 text-sm text-muted-foreground transition hover:bg-secondary/80 sm:text-base">Inicia sesión para compartir tu proyecto</Link>}
      {account
        ? <button type="button" onClick={open} aria-label="Crear proyecto" title="Crear proyecto" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90"><Plus className="h-6 w-6"/></button>
        : <Link href={loginHref} aria-label="Crear proyecto" title="Crear proyecto" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90"><Plus className="h-6 w-6"/></Link>}
    </section>
    {account && <dialog ref={dialogRef} aria-labelledby="project-dialog-title" className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-3xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background p-5 sm:p-6">
        <div><h2 id="project-dialog-title" className="text-2xl font-extrabold">Publicar proyecto</h2><p className="mt-1 text-sm text-muted-foreground">Tu publicación será revisada antes de aparecer públicamente.</p></div>
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary hover:bg-secondary/80"><X className="h-5 w-5"/></button>
      </div>
      <div className="p-5 sm:p-6"><ProjectCreateForm courses={courses} returnTo="/proyectos"/></div>
    </dialog>}
  </>
}

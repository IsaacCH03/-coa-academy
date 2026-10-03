'use client'

import Image from 'next/image'
import { ImagePlus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createProject } from '@/app/phase3-actions'
import type { ReactNode } from 'react'

type Course = { id: string; title: string }
type SelectedImage = { file: File; url: string }
const allowed = new Set(['image/png', 'image/jpeg', 'image/webp'])
const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}{children}</label>
}

export function ProjectCreateForm({ courses, returnTo = '/mi-coa/proyectos' }: { courses: Course[]; returnTo?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<SelectedImage[]>([])
  const [fileError, setFileError] = useState('')
  useEffect(() => () => images.forEach(image => URL.revokeObjectURL(image.url)), [images])

  function applyFiles(files: File[]) {
    const error = files.length > 5 ? 'Puedes subir un máximo de 5 imágenes.'
      : files.some(file => !allowed.has(file.type)) ? 'Solo se permiten imágenes PNG, JPG o WEBP.'
      : files.some(file => file.size > 5 * 1024 * 1024) ? 'Cada imagen debe pesar 5 MB o menos.' : ''
    setFileError(error)
    if (error) return false
    images.forEach(image => URL.revokeObjectURL(image.url))
    setImages(files.map(file => ({ file, url: URL.createObjectURL(file) })))
    return true
  }

  function removeImage(index: number) {
    const next = images.filter((_, position) => position !== index)
    const transfer = new DataTransfer()
    next.forEach(image => transfer.items.add(image.file))
    if (inputRef.current) inputRef.current.files = transfer.files
    applyFiles(next.map(image => image.file))
  }

  return <form action={createProject} onSubmit={event => {
    if (!applyFiles(Array.from(inputRef.current?.files ?? []))) event.preventDefault()
  }} className="grid gap-5">
    <input type="hidden" name="return_to" value={returnTo}/>
    <Field label="Título"><input className={inputClass} name="title" required minLength={2} maxLength={160}/></Field>
    <Field label="Cuéntanos sobre tu proyecto"><textarea className={`${inputClass} min-h-36 resize-y`} name="description" required minLength={10} maxLength={5000}/></Field>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Curso relacionado (opcional)"><select className={inputClass} name="course_id"><option value="">Sin curso</option>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></Field>
      <Field label="Tecnologías"><input className={inputClass} name="technologies" placeholder="Python, Tkinter, SQLite"/></Field>
    </div>
    <div className="border-t border-border pt-5">
      <h3 className="font-bold">Enlaces opcionales</h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <Field label="YouTube"><input className={inputClass} name="youtube_url" type="url" placeholder="https://youtube.com/..."/></Field>
        <Field label="GitHub"><input className={inputClass} name="github_url" type="url" placeholder="https://github.com/..."/></Field>
      </div>
    </div>
    <div className="border-t border-border pt-5">
      <h3 className="font-bold">Capturas del proyecto</h3>
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition hover:bg-secondary focus-within:ring-2 focus-within:ring-primary">
        <ImagePlus className="h-4 w-4 text-primary"/>Agregar imágenes
        <input ref={inputRef} className="sr-only" name="images" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={event => applyFiles(Array.from(event.currentTarget.files ?? []))}/>
      </label>
      <p className="mt-2 text-xs text-muted-foreground">PNG/JPG/WEBP · máximo 5 imágenes · 5 MB cada una</p>
      {fileError && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{fileError}</p>}
      {images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={image.url} className="relative aspect-video overflow-hidden rounded-xl border"><Image fill src={image.url} alt={`Vista previa ${index + 1}`} unoptimized className="object-cover"/><button type="button" onClick={() => removeImage(index)} aria-label={`Quitar imagen ${index + 1}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"><X className="h-4 w-4"/></button></div>)}</div>}
    </div>
    <button className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:bg-primary/90">Enviar para revisión</button>
  </form>
}

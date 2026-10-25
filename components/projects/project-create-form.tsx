'use client'

import Image from 'next/image'
import { ImagePlus, LoaderCircle, X } from 'lucide-react'
import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { submitProject, type ProjectFormState } from '@/app/phase3-actions'
import type { ReactNode } from 'react'

type Course = { id: string; title: string }
type SelectedImage = { file: File; url: string }
const allowed = new Set(['image/png', 'image/jpeg', 'image/webp'])
const initialState: ProjectFormState = { error: null }
const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
const identity = (file: File) => `${file.name}:${file.size}:${file.lastModified}:${file.type}`
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 text-sm font-semibold">{label}{children}</label> }

export function ProjectCreateForm({ courses, returnTo = '/mi-coa/proyectos' }: { courses: Course[]; returnTo?: string }) {
  const inputRef = useRef<HTMLInputElement>(null), submittingRef = useRef(false), submissionKey = useRef<string | null>(null), previewUrls = useRef(new Set<string>())
  const [images, setImages] = useState<SelectedImage[]>([]), [fileError, setFileError] = useState(''), [locallySubmitting, setLocallySubmitting] = useState(false)
  const [state, action, pending] = useActionState(async(previous:ProjectFormState,data:FormData)=>{try{return await submitProject(previous,data)}finally{submittingRef.current=false;setLocallySubmitting(false)}}, initialState)
  useEffect(() => { const urls=previewUrls.current; return () => urls.forEach(url => URL.revokeObjectURL(url)) }, [])

  function applyFiles(files: File[]) {
    const invalidType = files.find(file => !allowed.has(file.type)), tooLarge = files.find(file => file.size > 5 * 1024 * 1024)
    const known = new Set(images.map(({ file }) => identity(file)))
    const additions = files.filter(file => { const key=identity(file); if(known.has(key))return false; known.add(key); return true })
    const error = invalidType ? `El formato de ${invalidType.name} no está permitido. Usa PNG, JPG o WEBP.` : tooLarge ? `La imagen ${tooLarge.name} supera el límite de 5 MB.` : images.length + additions.length > 5 ? 'Puedes subir un máximo de 5 imágenes.' : ''
    setFileError(error)
    if (error) return false
    setImages(current => [...current, ...additions.map(file => {const url=URL.createObjectURL(file);previewUrls.current.add(url);return{file,url}})])
    if (inputRef.current) inputRef.current.value = ''
    return true
  }

  function removeImage(index: number) {
    setImages(current => { URL.revokeObjectURL(current[index].url);previewUrls.current.delete(current[index].url);return current.filter((_, position) => position !== index) })
    setFileError('')
  }

  const busy = pending || locallySubmitting
  return <form onSubmit={event => {
    event.preventDefault()
    if (submittingRef.current || fileError) return
    submittingRef.current = true; setLocallySubmitting(true)
    const data = new FormData(event.currentTarget)
    images.forEach(({ file }) => data.append('images', file))
    submissionKey.current ??= globalThis.crypto.randomUUID()
    data.set('submission_key', submissionKey.current)
    startTransition(() => action(data))
  }} className="grid gap-5">
    <input type="hidden" name="return_to" value={returnTo}/>
    <Field label="Título"><input disabled={busy} className={inputClass} name="title" required minLength={2} maxLength={160}/></Field>
    <Field label="Cuéntanos sobre tu proyecto"><textarea disabled={busy} className={`${inputClass} min-h-36 resize-y`} name="description" required minLength={10} maxLength={5000}/></Field>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Curso relacionado (opcional)"><select disabled={busy} className={inputClass} name="course_id"><option value="">Sin curso</option>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></Field><Field label="Tecnologías"><input disabled={busy} className={inputClass} name="technologies" placeholder="Python, Tkinter, SQLite"/></Field></div>
    <div className="border-t border-border pt-5"><h3 className="font-bold">Enlaces opcionales</h3><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field label="YouTube"><input disabled={busy} className={inputClass} name="youtube_url" type="url" placeholder="https://youtube.com/..."/></Field><Field label="GitHub"><input disabled={busy} className={inputClass} name="github_url" type="url" placeholder="https://github.com/..."/></Field></div></div>
    <div className="border-t border-border pt-5">
      <h3 className="font-bold">Capturas del proyecto</h3>
      <label className={`mt-3 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition focus-within:ring-2 focus-within:ring-primary ${busy?'cursor-not-allowed opacity-60':'cursor-pointer hover:bg-secondary'}`}><ImagePlus className="h-4 w-4 text-primary"/>Agregar imágenes<input ref={inputRef} disabled={busy} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={event => applyFiles(Array.from(event.currentTarget.files ?? []))}/></label>
      <p className="mt-2 text-xs text-muted-foreground">PNG/JPG/WEBP · máximo 5 imágenes · 5 MB cada una</p><p className="mt-1 text-sm font-semibold text-muted-foreground">{images.length} de 5 imágenes</p>
      <div onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();if(!busy)applyFiles(Array.from(event.dataTransfer.files))}} className="mt-3 rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Arrastra y suelta imágenes aquí</div>
      {fileError && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{fileError}</p>}
      {images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={image.url} className="relative aspect-video overflow-hidden rounded-xl border"><Image fill src={image.url} alt={`Vista previa ${index + 1}`} unoptimized className="object-cover"/><button disabled={busy} type="button" onClick={() => removeImage(index)} aria-label={`Quitar imagen ${index + 1}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground shadow hover:bg-background disabled:opacity-50"><X className="h-4 w-4"/></button></div>)}</div>}
    </div>
    {state.error&&<p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">{state.error}</p>}
    <button disabled={busy||!!fileError} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{busy&&<LoaderCircle aria-hidden className="h-4 w-4 animate-spin"/>}{busy?'Enviando proyecto…':'Enviar para revisión'}</button>
  </form>
}

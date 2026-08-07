import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'

export const metadata: Metadata = { title: 'Módulo 5 | Programación Asistida por Inteligencia Artificial | C.O.A.', description: 'Espacio preparado para el quinto módulo del curso.' }

export default function AiAssistedProgrammingModuleFivePage() {
  return <div className="flex min-h-screen flex-col"><SiteHeader /><main className="flex-1"><section className="bg-primary text-primary-foreground"><div className="mx-auto max-w-4xl px-4 py-10 md:py-14"><Link href="/cursos/programacion-con-ia/curso/modulo-4" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"><ArrowLeft className="h-4 w-4" /> Volver al Módulo 4</Link><p className="mb-3 font-semibold text-accent">COA — Programación Asistida por Inteligencia Artificial</p><h1 className="text-balance text-3xl font-extrabold md:text-5xl">Módulo 5: Automatización, pruebas y modernización de proyectos</h1></div></section><section className="bg-background px-4 py-16 md:py-20"><div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-12"><span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary"><BookOpen className="h-6 w-6" /></span><h2 className="text-2xl font-extrabold text-foreground">Contenido del Módulo 5</h2><p className="mt-3 text-muted-foreground">Este espacio está preparado para incorporar el contenido del próximo módulo.</p></div></section></main><SiteFooter /><WhatsAppFloat /></div>
}

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteFooter } from '@/components/site-footer'

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-secondary/50 to-background">
      <header className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Ir al inicio de C.O.A">
            <Image src="/logoCOA.png" alt="C.O.A" width={44} height={44} className="h-11 w-11 object-contain" />
            <span className="font-extrabold text-primary">C.O.A</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">Volver al inicio</Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-xl shadow-primary/5 sm:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Mi COA</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-7">{children}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

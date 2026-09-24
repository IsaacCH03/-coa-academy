import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, LogOut } from 'lucide-react'
import { signOutAction } from '@/app/cuenta/actions'
import { NotificationBell } from './notification-bell'

export function AccountShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2"><Image src="/logoCOA.png" alt="C.O.A" width={42} height={42} className="h-10 w-10 object-contain" /><strong className="hidden text-primary sm:inline">C.O.A</strong></Link>
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-4 w-4" />Volver al sitio</Link>
          </div>
          <div className="flex items-center gap-2"><NotificationBell /><form action={signOutAction}><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Cerrar sesión</span></button></form></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}

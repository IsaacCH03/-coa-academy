'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award, ChevronDown, Gift, LayoutDashboard, LogOut, Menu, MessageCircle, Scale, UserRound, X } from 'lucide-react'
import { signOutAction } from '@/app/cuenta/actions'
import type { UserRole } from '@/lib/auth/types'
import { Button } from '@/components/ui/button'
import { createWhatsAppLink } from '@/lib/site'

const navLinks = [
  { href: '/#cursos', label: 'Cursos' }, { href: '/#nosotros', label: 'Nosotros' },
  { href: '/experiencia-profesional', label: 'Experiencia' }, { href: '/#contacto', label: 'Contacto' },
]
const secondaryLinks = [
  { href: '/certificados', label: 'Certificados', description: 'Verificar certificados emitidos por COA', icon: Award },
  { href: '/#beneficios', label: 'Beneficios', description: 'Conoce los beneficios de COA', icon: Gift },
  { href: '/terminos-y-condiciones', label: 'Términos y condiciones', description: 'Información legal', icon: Scale },
]
const headerWhatsappLink = createWhatsAppLink('Hola, me interesa recibir más información sobre los cursos de C.O.A.')

export type HeaderAccount = { fullName: string; role: UserRole }
const compactName = (name: string) => name.trim().split(/\s+/).slice(0, 2).join(' ')
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CO'

export function SiteHeaderClient({ account = null }: { account?: HeaderAccount | null }) {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreButton = useRef<HTMLButtonElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const accountButton = useRef<HTMLButtonElement>(null)
  const dashboardHref = account?.role === 'admin' ? '/admin' : account ? '/mi-coa' : '/cuenta/iniciar-sesion'
  const moreLinks = [{ href: dashboardHref, label: 'Mi COA', description: account ? 'Volver a tu panel personal' : 'Ingresa a tu cuenta y panel personal', icon: UserRound }, ...secondaryLinks]

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false)
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (accountOpen) accountButton.current?.focus()
      else if (moreOpen) moreButton.current?.focus()
      setMoreOpen(false); setAccountOpen(false)
    }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [accountOpen, moreOpen])

  return <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logoCOA.png" alt="Logotipo C.O.A Cursos Online Avanzados" width={44} height={44} className="h-11 w-11 object-contain" />
        <span className="flex flex-col leading-none"><span className="text-lg font-extrabold tracking-tight text-primary">C.O.A</span><span className="text-[10px] font-medium text-muted-foreground">Cursos Online Avanzados</span></span>
      </Link>
      <nav className="hidden items-center gap-4 xl:flex xl:gap-6">
        {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground transition-colors hover:text-primary">{link.label}</Link>)}
        <div className="relative" ref={moreRef}>
          <button ref={moreButton} type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen} aria-haspopup="menu" aria-controls="more-navigation" className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary">Más<ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} /></button>
          {moreOpen && <div id="more-navigation" role="menu" className="absolute right-0 top-full z-[60] mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl shadow-primary/10">
            {moreLinks.map(({ href, label, description, icon: Icon }) => <Link role="menuitem" key={href} href={href} onClick={() => setMoreOpen(false)} className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-secondary focus-visible:bg-secondary"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span><span><strong className="block text-sm">{label}</strong><span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{description}</span></span></Link>)}
          </div>}
        </div>
        <a href={headerWhatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"><MessageCircle className="h-4 w-4" />Escríbenos</a>
      </nav>
      <div className="hidden xl:block">{account ? <div className="relative" ref={accountRef}>
        <button ref={accountButton} type="button" onClick={() => setAccountOpen((value) => !value)} aria-expanded={accountOpen} aria-haspopup="menu" aria-controls="account-navigation" className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-2.5 text-sm font-semibold shadow-sm transition hover:bg-secondary"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-primary-foreground">{initials(account.fullName)}</span><span className="max-w-32 truncate">{compactName(account.fullName)}</span><ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${accountOpen ? 'rotate-180' : ''}`} /></button>
        {accountOpen && <div id="account-navigation" role="menu" className="absolute right-0 top-full z-[60] mt-3 w-72 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl shadow-primary/10">
          <div className="border-b border-border px-3 py-3"><strong className="block truncate text-sm">{account.fullName}</strong><span className="mt-1 block text-xs text-muted-foreground">{account.role === 'admin' ? 'Administrador' : 'Estudiante'}</span></div>
          <Link role="menuitem" href={dashboardHref} onClick={() => setAccountOpen(false)} className="mt-2 flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-secondary"><LayoutDashboard className="h-4 w-4 text-primary" />{account.role === 'admin' ? 'Panel de administración' : 'Mi COA'}</Link>
          <form action={signOutAction}><button role="menuitem" className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />Cerrar sesión</button></form>
        </div>}
      </div> : <div className="flex items-center gap-3" aria-label="Acceso a la cuenta">
        <Button asChild className="h-10 gap-2 bg-primary px-3 font-semibold hover:bg-primary/90"><Link href="/cuenta/iniciar-sesion"><UserRound className="h-4 w-4" />Iniciar sesión</Link></Button>
        <Link href="/cuenta/registro" className="text-sm font-semibold text-primary hover:underline">Registrarse</Link>
      </div>}</div>
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center justify-center rounded-md p-2 text-foreground xl:hidden" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
    </div>
    {open && <div className="border-t border-border bg-background xl:hidden"><nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
      {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-primary">{link.label}</Link>)}
      <div className="my-2 border-t border-border pt-2"><p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Más</p>{moreLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"><Icon className="h-4 w-4 text-primary" />{label}</Link>)}</div>
      {account ? <div className="rounded-xl border border-border bg-secondary/50 p-3">
        <div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">{initials(account.fullName)}</span><span className="min-w-0"><strong className="block truncate text-sm">{account.fullName}</strong><span className="block text-xs text-muted-foreground">{account.role === 'admin' ? 'Administrador' : 'Estudiante'}</span></span></div>
        <Link href={dashboardHref} onClick={() => setOpen(false)} className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary hover:bg-background"><LayoutDashboard className="h-4 w-4" />{account.role === 'admin' ? 'Panel de administración' : 'Mi COA'}</Link>
        <form action={signOutAction}><button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />Cerrar sesión</button></form>
      </div> : <div className="rounded-xl border border-border bg-secondary/50 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tu cuenta</p>
        <Button asChild className="mt-3 w-full gap-2 bg-primary font-semibold"><Link href="/cuenta/iniciar-sesion" onClick={() => setOpen(false)}><UserRound className="h-4 w-4" />Iniciar sesión</Link></Button>
        <Link href="/cuenta/registro" onClick={() => setOpen(false)} className="mt-2 flex justify-center rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-background">Registrarse</Link>
      </div>}
      <Button asChild variant="outline" className="mt-2 gap-2 font-semibold"><a href={headerWhatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" />Escríbenos por WhatsApp</a></Button>
    </nav></div>}
  </header>
}

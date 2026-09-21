'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award, ChevronDown, Gift, Menu, MessageCircle, Scale, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createWhatsAppLink } from '@/lib/site'

const navLinks = [
  { href: '/#cursos', label: 'Cursos' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/experiencia-profesional', label: 'Experiencia' },
  { href: '/#contacto', label: 'Contacto' },
]
const moreLinks = [
  { href: '/certificados', label: 'Certificados', description: 'Verificar certificados emitidos por COA', icon: Award },
  { href: '/#beneficios', label: 'Beneficios', description: 'Conoce los beneficios de COA', icon: Gift },
  { href: '/terminos-y-condiciones', label: 'Términos y condiciones', description: 'Información legal', icon: Scale },
]

const headerWhatsappLink = createWhatsAppLink(
  'Hola, me interesa recibir más información sobre los cursos de C.O.A.',
)

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreButton = useRef<HTMLButtonElement>(null)
  useEffect(()=>{
    const closeOutside=(event:PointerEvent)=>{if(!moreRef.current?.contains(event.target as Node))setMoreOpen(false)}
    const closeEscape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setMoreOpen(false);moreButton.current?.focus()}}
    document.addEventListener('pointerdown',closeOutside);document.addEventListener('keydown',closeEscape)
    return()=>{document.removeEventListener('pointerdown',closeOutside);document.removeEventListener('keydown',closeEscape)}
  },[])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logoCOA.png"
            alt="Logotipo C.O.A Cursos Online Avanzados"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-primary">C.O.A</span>
            <span className="text-[10px] font-medium text-muted-foreground">
              Cursos Online Avanzados
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="relative" ref={moreRef}>
            <button ref={moreButton} type="button" onClick={()=>setMoreOpen(value=>!value)} aria-expanded={moreOpen} aria-haspopup="menu" aria-controls="more-navigation" className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary">Más<ChevronDown className={`h-4 w-4 transition-transform ${moreOpen?'rotate-180':''}`} /></button>
            {moreOpen&&<div id="more-navigation" role="menu" className="absolute right-0 top-full z-[60] mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl shadow-primary/10">
              {moreLinks.map(({href,label,description,icon:Icon})=><Link role="menuitem" key={href} href={href} onClick={()=>setMoreOpen(false)} className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-secondary focus-visible:bg-secondary"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span><span><strong className="block text-sm">{label}</strong><span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{description}</span></span></Link>)}
            </div>}
          </div>
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="gap-2 bg-primary font-semibold hover:bg-primary/90">
            <a href={headerWhatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Escríbenos
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border pt-2"><p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Más</p>{moreLinks.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"><Icon className="h-4 w-4 text-primary" />{label}</Link>)}</div>
            <Button asChild className="mt-2 gap-2 bg-primary font-semibold">
              <a href={headerWhatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Escríbenos por WhatsApp
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

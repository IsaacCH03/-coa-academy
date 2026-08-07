'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createWhatsAppLink } from '@/lib/site'

const navLinks = [
  { href: '/#cursos', label: 'Cursos' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#beneficios', label: 'Beneficios' },
  { href: '/experiencia-profesional', label: 'Experiencia Profesional' },
  { href: '/terminos-y-condiciones', label: 'Términos y Condiciones' },
  { href: '/#contacto', label: 'Contacto' },
]

const headerWhatsappLink = createWhatsAppLink(
  'Hola, me interesa recibir más información sobre los cursos de C.O.A.',
)

export function SiteHeader() {
  const [open, setOpen] = useState(false)

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
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
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
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {link.label}
              </a>
            ))}
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

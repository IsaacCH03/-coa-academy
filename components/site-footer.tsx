import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Mail } from 'lucide-react'
import { FacebookIcon } from '@/components/icons'
import { site, whatsappLink } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/coa-icon.png"
              alt="Logotipo C.O.A"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="text-lg font-extrabold text-primary">C.O.A</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cursos Online Avanzados. Aprende habilidades reales para transformar tu
            futuro profesional.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Navegación</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href="/#cursos" className="hover:text-primary">
                Cursos
              </a>
            </li>
            <li>
              <a href="/#nosotros" className="hover:text-primary">
                Nosotros
              </a>
            </li>
            <li>
              <a href="/#beneficios" className="hover:text-primary">
                Beneficios
              </a>
            </li>
            <li>
              <a href="/#contacto" className="hover:text-primary">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Contacto</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {site.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Síguenos</h3>
          <div className="flex gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="text-center text-xs text-muted-foreground">
          {'© '}
          {new Date().getFullYear()} C.O.A · Cursos Online Avanzados. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}

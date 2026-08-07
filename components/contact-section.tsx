import { MessageCircle, Mail } from 'lucide-react'
import { FacebookIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { site, whatsappLink } from '@/lib/site'

export function ContactSection() {
  return (
    <section id="contacto" className="scroll-mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-balance text-3xl font-extrabold md:text-4xl">
            ¿Listo para empezar?
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-primary-foreground/85">
            Escríbenos por WhatsApp o síguenos en Facebook. Resolvemos todas tus dudas y
            te ayudamos a elegir el curso ideal para ti.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl bg-primary-foreground/10 p-8 text-center ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/15"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <MessageCircle className="h-7 w-7" />
            </span>
            <span className="text-lg font-bold">WhatsApp</span>
            <span className="text-sm text-primary-foreground/80">
              Chatea con nosotros en tiempo real
            </span>
          </a>

          <a
            href={site.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl bg-primary-foreground/10 p-8 text-center ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/15"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-turquoise text-primary-foreground">
              <FacebookIcon className="h-7 w-7" />
            </span>
            <span className="text-lg font-bold">Facebook</span>
            <span className="text-sm text-primary-foreground/80">
              Síguenos y no te pierdas novedades
            </span>
          </a>

          <a
            href={`mailto:${site.email}`}
            className="flex flex-col items-center gap-3 rounded-2xl bg-primary-foreground/10 p-8 text-center ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/15"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground">
              <Mail className="h-7 w-7" />
            </span>
            <span className="text-lg font-bold">Correo</span>
            <span className="text-sm text-primary-foreground/80">{site.email}</span>
          </a>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Escríbenos ahora
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

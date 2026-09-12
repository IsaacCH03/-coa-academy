import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, GraduationCap, Star, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createWhatsAppLink } from '@/lib/site'

const heroWhatsappLink = createWhatsAppLink(
  'Hola, quisiera recibir más información sobre los cursos de C.O.A.',
)

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium">
            <GraduationCap className="h-4 w-4 text-accent" />
            Academia de Cursos Online Avanzados
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight md:text-5xl">
            Aprende nuevas habilidades con{' '}
            <span className="text-accent">cursos en línea</span>
          </h1>
          <p className="max-w-md text-pretty text-lg leading-relaxed text-primary-foreground/85">
            Encuentra cursos prácticos con explicaciones claras, ejercicios y proyectos
            para aprender a tu propio ritmo, desde cualquier lugar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
            >
              <a href="#cursos">Ver cursos</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-primary-foreground/40 bg-transparent font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={heroWhatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Hablar por WhatsApp
              </a>
            </Button>
            <Link href="/ide" prefetch={false} className="relative inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary shadow-md transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <Code2 className="h-5 w-5" /> Abrir IDE Online
              <span className="absolute -right-1 -top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">Nuevo</span>
            </Link>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-primary-foreground/80">
            <div>
              <p className="text-xl font-bold text-primary-foreground">+800</p>
              <p>Estudiantes</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary-foreground">9</p>
              <p>Cursos</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-accent text-accent" />
              <span className="text-xl font-bold text-primary-foreground">4.9</span>
              <span>/ 5</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/logoCOA.png"
            alt="Logotipo de C.O.A Cursos Online Avanzados"
            width={1254}
            height={1254}
            className="h-auto w-full max-w-sm object-contain md:max-w-md"
            priority
          />
        </div>
      </div>
    </section>
  )
}

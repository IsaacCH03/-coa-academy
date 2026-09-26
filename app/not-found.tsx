import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Página no encontrada | C.O.A.',
  description: 'La página solicitada no existe o ya no está disponible.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center px-4 py-16">
        <section className="mx-auto max-w-xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Error 404</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold text-foreground sm:text-5xl">
            No encontramos esta página
          </h1>
          <p className="mt-5 text-pretty leading-7 text-muted-foreground">
            Es posible que el enlace esté incompleto o que el contenido se haya movido.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/"><Home className="h-4 w-4" />Volver al inicio</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#cursos"><Search className="h-4 w-4" />Ver cursos</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

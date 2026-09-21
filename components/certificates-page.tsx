import { Award } from 'lucide-react'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { WhatsAppFloat } from './whatsapp-float'
import { CertificateVerifier } from './certificate-verifier'

export function CertificatesPage({ initialCode }: { initialCode?: string }) {
  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-secondary/45">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-bold uppercase tracking-widest"><Award className="h-4 w-4 text-accent" />Certificados C.O.A.</span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold md:text-5xl">Verifica tu certificado</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/85">Consulta la información de un certificado emitido por COA – Cursos Online Avanzados.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-16"><CertificateVerifier key={initialCode||'certificate-search'} initialCode={initialCode} /></section>
    </main>
    <SiteFooter />
    <WhatsAppFloat />
  </div>
}

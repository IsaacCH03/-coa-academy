import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Code2,
  Handshake,
  Laptop,
  Lightbulb,
  PackageSearch,
  Rocket,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Programa de Experiencia Profesional | C.O.A.',
  description: 'Conoce el Programa de Experiencia Profesional de C.O.A. y la oportunidad de aplicar tus conocimientos en proyectos reales.',
  path: '/experiencia-profesional',
})

const steps = [
  ['1', 'Completa la Ruta Python', 'Finaliza la formación técnica requerida.'],
  ['2', 'Solicita participar', 'Presenta tu solicitud al Programa de Experiencia Profesional.'],
  ['3', 'Evaluación y aceptación', 'La participación depende del desempeño y de los proyectos disponibles.'],
  ['4', 'Participa en proyectos reales', 'Aplica tus conocimientos con empresas y emprendimientos aliados.'],
  ['5', 'Fortalece tu perfil', 'Obtén experiencia práctica con acompañamiento de C.O.A.'],
]

const benefits = [
  [BriefcaseBusiness, 'Experiencia profesional real'],
  [Code2, 'Desarrollo de proyectos reales'],
  [Building2, 'Trabajo con empresas y emprendimientos'],
  [Users, 'Supervisión durante el proceso'],
  [BadgeCheck, 'Certificado de participación'],
  [Rocket, 'Fortalecimiento del perfil profesional'],
  [Sparkles, 'Posibles oportunidades laborales futuras'],
]

const route = [
  ['1', 'Lógica de Programación', 'Gratis', 'Autodidacta', '/cursos/logica-de-programacion'],
  ['2', 'Python Básico', '₡10.000 por mes', 'Curso en vivo', '/cursos/python-nivel-1'],
  ['3', 'Python Intermedio', '₡10.000 por mes', 'Curso en vivo', '/cursos/python-intermedio'],
  ['4', 'Python Práctico', 'Gratis', 'Autodidacta', '/cursos/python-practico'],
  ['5', 'Desarrollo de Software con Python', '₡4.900', 'Autodidacta', '/cursos/desarrollo-software-python'],
  ['6', 'SQL y Bases de Datos', 'Gratis', 'Autodidacta', '/cursos/sql-bases-datos'],
  ['7', 'Desarrollo Web con Django', 'Gratis', 'Autodidacta', '/cursos/desarrollo-web-django'],
]

const projects = [
  [Settings, 'Automatización de procesos'],
  [Building2, 'Sistemas para pequeños negocios'],
  [PackageSearch, 'Inventarios'],
  [ShoppingCart, 'Control de ventas'],
  [ClipboardCheck, 'Aplicaciones administrativas'],
  [Wrench, 'Herramientas internas'],
  [Code2, 'Automatización con Python'],
  [Laptop, 'Desarrollo web'],
]

export default function ProfessionalExperiencePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-semibold"><BriefcaseBusiness className="h-4 w-4 text-accent" />Tu siguiente paso profesional</span>
              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight md:text-5xl">Programa de Experiencia Profesional C.O.A.</h1>
              <p className="mt-4 text-xl font-bold text-accent">Aprende. Practica. Crece profesionalmente.</p>
              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-primary-foreground/85">En C.O.A. creemos que aprender programación es solo el primer paso. Nuestro Programa de Experiencia Profesional busca conectar a nuestros estudiantes con proyectos reales desarrollados para empresas y emprendimientos aliados, permitiéndoles adquirir experiencia antes de ingresar al mercado laboral.</p>
            </div>
            <div className="relative rounded-3xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
              <Image src="/experiencia-profesional.svg" alt="Ilustración de desarrollo de software y experiencia profesional" width={760} height={560} priority className="h-auto w-full rounded-2xl" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-widest text-primary">Cómo funciona</span><h2 className="mt-3 text-balance text-3xl font-extrabold md:text-4xl">¿En qué consiste?</h2><p className="mt-4 text-muted-foreground">El programa ofrece oportunidades para pasar del aprendizaje a la práctica profesional mediante un proceso claro y acompañado.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {steps.map(([number, title, text], index) => <div key={number} className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-extrabold text-primary-foreground">{number}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>{index < steps.length - 1 && <ArrowRight className="absolute -right-5 top-7 z-10 hidden h-5 w-5 text-accent md:block" />}</div>)}
          </div>
          <div className="mt-8 rounded-2xl border border-accent/40 bg-accent/10 p-5 text-center text-sm text-foreground"><strong>Importante:</strong> el programa no promete empleo. Brinda una oportunidad de adquirir experiencia profesional que puede abrir puertas laborales en el futuro.</div>
        </section>

        <section className="bg-secondary"><div className="mx-auto max-w-6xl px-4 py-16 md:py-24"><div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-widest text-primary">Lo que puedes obtener</span><h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Beneficios del programa</h2></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(([Icon, title]) => { const BenefitIcon = Icon as typeof BriefcaseBusiness; return <div key={String(title)} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><BenefitIcon className="h-6 w-6" /></span><h3 className="mt-4 font-bold">{String(title)}</h3></div> })}</div></div></section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-widest text-primary">Requisito principal</span><h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Completa la Ruta Python</h2><p className="mt-4 text-muted-foreground">La ruta desarrolla progresivamente las habilidades necesarias para participar en proyectos profesionales.</p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">{route.map(([number, title, price, mode, href], index) => <Link href={href} key={number} className="group relative rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{number}</span><h3 className="mt-4 text-sm font-bold leading-snug">{title}</h3><p className="mt-3 text-sm font-extrabold text-primary">{price}</p><p className="mt-1 text-xs text-muted-foreground">{mode}</p>{index < route.length - 1 && <ArrowRight className="absolute -right-4 top-6 z-10 hidden h-4 w-4 text-accent lg:block" />}</Link>)}</div>
          <div className="mt-10 rounded-2xl border border-primary/20 bg-secondary p-6"><p className="font-semibold">Al completar esta ruta el estudiante podrá solicitar ingresar al Programa de Experiencia Profesional de C.O.A.</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">La participación estará sujeta a la disponibilidad de proyectos y a la evaluación del desempeño académico del estudiante.</p></div>
        </section>

        <section className="bg-primary text-primary-foreground"><div className="mx-auto max-w-6xl px-4 py-16 md:py-24"><div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-widest text-accent">Práctica profesional</span><h2 className="mt-3 text-3xl font-extrabold md:text-4xl">¿Qué tipo de proyectos podrían realizarse?</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{projects.map(([Icon, title]) => { const ProjectIcon = Icon as typeof Settings; return <div key={String(title)} className="rounded-2xl bg-primary-foreground/10 p-5 ring-1 ring-primary-foreground/20 transition-transform hover:-translate-y-1"><ProjectIcon className="h-7 w-7 text-accent" /><h3 className="mt-4 font-bold">{String(title)}</h3></div> })}</div></div></section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24"><div><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Lightbulb className="h-7 w-7" /></span><h2 className="mt-6 text-3xl font-extrabold md:text-4xl">Nuestro objetivo</h2><p className="mt-5 text-lg leading-relaxed text-muted-foreground">La misión del programa es ayudar a que nuestros estudiantes den sus primeros pasos en el mundo profesional.</p><p className="mt-4 leading-relaxed text-muted-foreground">No buscamos únicamente enseñar programación. Buscamos formar desarrolladores capaces de resolver problemas reales utilizando tecnología.</p></div><div className="rounded-3xl border border-border bg-secondary p-8"><ShieldCheck className="h-10 w-10 text-primary" /><h3 className="mt-5 text-2xl font-extrabold">Una oportunidad acompañada</h3><p className="mt-3 leading-relaxed text-muted-foreground">Cada participación se desarrolla con seguimiento de un encargado de C.O.A., objetivos definidos y responsabilidades acordes con la preparación del estudiante.</p></div></section>

        <section className="bg-secondary"><div className="mx-auto max-w-5xl px-4 py-16 text-center md:py-24"><Handshake className="mx-auto h-12 w-12 text-primary" /><h2 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-extrabold md:text-5xl">Hoy aprendes.<br /><span className="text-primary">Mañana desarrollas proyectos reales.</span></h2><p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">Cada proyecto terminado representa una nueva experiencia.<br />Cada experiencia fortalece tu perfil profesional.<br />Cada paso te acerca más a nuevas oportunidades.</p><Link href="/#cursos" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-7 font-bold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-lg">Comienza la Ruta Python<ArrowRight className="h-5 w-5" /></Link></div></section>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

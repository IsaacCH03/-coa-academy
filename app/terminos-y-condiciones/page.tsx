import type { Metadata } from 'next'
import {
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileLock2,
  GraduationCap,
  Landmark,
  Laptop,
  Mail,
  MessageCircle,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { createWhatsAppLink, site } from '@/lib/site'
import { createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({
  title: 'Términos y Condiciones | C.O.A.',
  description:
    'Conoce las condiciones de los cursos, certificados, pagos y servicios de Cursos Online Avanzados.',
  path: '/terminos-y-condiciones',
})

const sections = [
  { id: 'naturaleza', number: '01', title: 'Naturaleza de la academia', icon: Building2 },
  { id: 'independencia', number: '02', title: 'Independencia institucional', icon: Landmark },
  { id: 'certificados', number: '03', title: 'Certificados', icon: Award },
  { id: 'pagos', number: '04', title: 'Pagos y reembolsos', icon: CircleDollarSign },
  { id: 'clases', number: '05', title: 'Clases', icon: Laptop },
  { id: 'contenido', number: '06', title: 'Uso del contenido', icon: FileLock2 },
  { id: 'experiencia', number: '07', title: 'Experiencia Profesional', icon: BriefcaseBusiness },
  { id: 'responsabilidad', number: '08', title: 'Responsabilidad del estudiante', icon: UserRoundCheck },
  { id: 'cambios', number: '09', title: 'Cambios en los cursos', icon: RefreshCw },
  { id: 'disponibilidad', number: '10', title: 'Disponibilidad', icon: ServerCog },
  { id: 'datos', number: '11', title: 'Protección de datos', icon: ShieldCheck },
  { id: 'contacto-terminos', number: '12', title: 'Contacto', icon: MessageCircle },
]

const whatsappTermsLink = createWhatsAppLink(
  'Hola, tengo una consulta sobre los Términos y Condiciones de C.O.A.',
)

function SectionHeading({ id, inverted = false }: { id: string; inverted?: boolean }) {
  const section = sections.find((item) => item.id === id)!
  const Icon = section.icon

  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <span className={`text-xs font-bold tracking-[0.18em] ${inverted ? 'text-accent' : 'text-primary'}`}>SECCIÓN {section.number}</span>
        <h2 className={`mt-1 text-xl font-extrabold sm:text-2xl ${inverted ? 'text-primary-foreground' : 'text-foreground'}`}>{section.title}</h2>
      </div>
    </div>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground sm:text-base">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-accent/20" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.45fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Información clara y transparente
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
                Términos y Condiciones
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg">
                Aquí explicamos de forma sencilla cómo funciona C.O.A., cuáles son nuestros compromisos y qué responsabilidades compartimos con cada estudiante.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <GraduationCap className="h-10 w-10 text-accent" />
              <h2 className="mt-4 text-xl font-bold">Una relación basada en la confianza</h2>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                Estas condiciones buscan prevenir malentendidos y ofrecer una experiencia educativa transparente, respetuosa y profesional.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/40 py-10">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-5 flex items-center gap-3">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Contenido de esta página</h2>
            </div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Índice de términos y condiciones">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-sm"
                >
                  <span className="text-xs font-bold text-primary">{section.number}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
            <article id="naturaleza" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="naturaleza" />
              <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                <p><strong className="text-foreground">Cursos Online Avanzados (C.O.A.)</strong> es una academia privada dedicada a la enseñanza de programación y tecnología mediante modalidades virtuales.</p>
                <p>Actualmente, todas las actividades académicas se desarrollan en línea. Aunque el proyecto fue creado en Costa Rica y su fundador reside en Guápiles, C.O.A. no cuenta con una sede física abierta al público.</p>
                <p>La inscripción, las clases, los materiales y el soporte se gestionan por medios digitales.</p>
              </div>
            </article>

            <article id="independencia" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="independencia" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">C.O.A. es un proyecto educativo independiente. Los cursos son desarrollados y administrados directamente por la academia.</p>
              <div className="mt-5 rounded-2xl border border-primary/15 bg-secondary/60 p-5">
                <p className="text-sm font-bold text-foreground">C.O.A. no pertenece ni representa a:</p>
                <CheckList items={['El Ministerio de Educación Pública (MEP).', 'El Instituto Nacional de Aprendizaje (INA).', 'Ninguna universidad ni el Gobierno de Costa Rica.']} />
                <p className="mt-4 text-sm leading-6 text-muted-foreground">Tampoco está afiliado ni respaldado oficialmente por estas instituciones.</p>
              </div>
            </article>

            <article id="certificados" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="certificados" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">Al completar un curso, el estudiante puede recibir un certificado de participación emitido por C.O.A. Este documento acredita que participó y completó las actividades definidas por la academia.</p>
              <CheckList items={['No constituye un título profesional ni equivale a un diploma universitario.', 'No sustituye certificaciones oficiales emitidas por instituciones reconocidas.', 'No garantiza oportunidades laborales.', 'Tiene fines académicos y de reconocimiento interno.']} />
            </article>

            <article id="pagos" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="pagos" />
              <CheckList items={['Los cursos gratuitos no requieren ningún pago.', 'Los cursos de pago deben cancelarse antes de iniciar.', 'Si el estudiante cancela su inscripción antes del inicio del curso, puede solicitar el reembolso completo.']} />
              <div className="mt-5 rounded-2xl border border-accent/40 bg-accent/10 p-5">
                <p className="font-bold text-foreground">Importante sobre los reembolsos</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Una vez iniciado el curso no se realizarán reembolsos, ya que desde ese momento el estudiante obtiene acceso al contenido, las clases, los materiales y los recursos correspondientes.</p>
              </div>
            </article>

            <article id="clases" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="clases" />
              <CheckList items={['Las clases se realizan mediante plataformas virtuales.', 'En algunos cursos, las sesiones pueden quedar grabadas para los estudiantes inscritos.', 'Cada estudiante debe contar con acceso a Internet y un dispositivo adecuado para participar.']} />
            </article>

            <article id="contenido" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="contenido" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">Todo el contenido de pago desarrollado por C.O.A., incluidos videos, ejercicios, documentos, imágenes, proyectos, material escrito y demás recursos, pertenece a la academia.</p>
              <div className="mt-5 flex gap-3 rounded-2xl bg-secondary/60 p-5">
                <FileLock2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">No está permitido distribuirlo, venderlo, copiarlo ni publicarlo sin autorización de C.O.A.</p>
              </div>
            </article>

            <article id="experiencia" className="scroll-mt-24 rounded-3xl border border-primary/20 bg-primary/[0.04] p-6 shadow-sm sm:p-8 lg:col-span-2">
              <SectionHeading id="experiencia" />
              <div className="grid gap-7 lg:grid-cols-2">
                <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  <p>El Programa de Experiencia Profesional de C.O.A. es una iniciativa mediante la cual algunos estudiantes podrán participar en proyectos reales desarrollados para empresas y emprendimientos aliados.</p>
                  <p>Completar la Ruta Python permite solicitar el ingreso, pero <strong className="text-foreground">no garantiza la aceptación</strong>. C.O.A. seleccionará únicamente a quienes considere preparados para representar adecuadamente a la institución.</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <p className="font-bold text-foreground">La evaluación puede considerar:</p>
                  <CheckList items={['Desempeño académico y calidad de los proyectos.', 'Compromiso, responsabilidad y disponibilidad de proyectos.', 'La evaluación realizada directamente por C.O.A.']} />
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-5">
                <p className="text-sm leading-7 text-muted-foreground"><strong className="text-foreground">La participación no constituye una relación laboral</strong> y no garantiza empleo, contratación ni remuneración. Una posible contratación dependerá exclusivamente de la empresa correspondiente.</p>
              </div>
            </article>

            <article id="responsabilidad" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="responsabilidad" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">Para cuidar una experiencia positiva, cada estudiante se compromete a:</p>
              <CheckList items={['Participar y comunicarse con respeto.', 'No compartir materiales privados.', 'No afectar el desarrollo de las clases.', 'Cumplir las normas básicas de convivencia.', 'Mantener un trato respetuoso con profesores y estudiantes.']} />
            </article>

            <article id="cambios" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="cambios" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">C.O.A. puede actualizar materiales, ejercicios, videos, proyectos y plataformas utilizadas para mantener el contenido vigente y mejorar la experiencia educativa.</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">Cuando estas modificaciones tengan ese propósito, podrán realizarse sin previo aviso.</p>
            </article>

            <article id="disponibilidad" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="disponibilidad" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">La academia hará todos los esfuerzos razonables para mantener disponibles la plataforma, los materiales, las clases y los recursos.</p>
              <div className="mt-5 flex gap-3 rounded-2xl bg-secondary/60 p-5">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">Pueden presentarse interrupciones temporales por mantenimiento, servicios externos o problemas técnicos.</p>
              </div>
            </article>

            <article id="datos" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <SectionHeading id="datos" />
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">Los datos personales recopilados durante la inscripción se utilizarán únicamente para fines relacionados con la administración de los cursos.</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">C.O.A. no venderá ni compartirá la información personal con terceros, salvo cuando sea necesario para prestar los servicios educativos o por obligación legal.</p>
            </article>

            <article id="contacto-terminos" className="scroll-mt-24 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8 lg:col-span-2">
              <SectionHeading id="contacto-terminos" inverted />
              <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="max-w-2xl text-sm leading-7 text-primary-foreground/85 sm:text-base">Si tienes alguna duda relacionada con estos términos y condiciones, puedes consultarla directamente con C.O.A. mediante nuestros canales oficiales. Con gusto te ayudaremos a aclararla.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a href={`mailto:${site.email}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
                    <Mail className="h-4 w-4" />Escribir por correo
                  </a>
                  <a href={whatsappTermsLink} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
                    <MessageCircle className="h-4 w-4" />Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

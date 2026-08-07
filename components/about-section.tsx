import { Award, Users, Clock, Laptop, ShieldCheck, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Award,
    title: 'Certificado de finalización',
    text: 'Recibe un certificado al completar cada curso para respaldar tus nuevas habilidades.',
  },
  {
    icon: Clock,
    title: 'Aprende a tu ritmo',
    text: 'Accede a las clases cuando quieras, las veces que necesites, sin horarios fijos.',
  },
  {
    icon: Users,
    title: 'Instructores expertos',
    text: 'Aprende de profesionales con experiencia real en cada área.',
  },
  {
    icon: Laptop,
    title: '100% online',
    text: 'Estudia desde tu computadora o celular, en cualquier lugar del mundo.',
  },
  {
    icon: ShieldCheck,
    title: 'Contenido actualizado',
    text: 'Material práctico y al día con las tendencias de cada industria.',
  },
  {
    icon: Headphones,
    title: 'Soporte cercano',
    text: 'Resuelve tus dudas por WhatsApp con nuestro equipo de acompañamiento.',
  },
]

export function AboutSection() {
  return (
    <>
      <section id="nosotros" className="scroll-mt-20 bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col gap-5">
            <span className="w-fit rounded-full bg-background px-4 py-1.5 text-sm font-semibold text-primary">
              Sobre nosotros
            </span>
            <h2 className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">
              Una academia creada para acercar la programación a todos
            </h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              En <strong className="text-foreground">Cursos Online Avanzados (C.O.A.)</strong>{' '}
              creemos que aprender programación debe ser accesible, práctico y enfocado
              en el mundo real.
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Nuestra academia fue fundada en <strong className="text-foreground">2023</strong>{' '}
              por <strong className="text-foreground">Evelio Josué Chevez Powell</strong>, con
              el objetivo de ofrecer una formación de calidad para quienes desean iniciar
              o fortalecer su carrera en el área de la tecnología.
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              El primer curso de la plataforma fue lanzado en{' '}
              <strong className="text-foreground">mayo de 2023</strong> y, desde entonces,
              C.O.A. ha trabajado continuamente en el desarrollo de nuevos programas de
              formación, adaptándose a las necesidades del mercado y a las tecnologías
              más actuales.
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Actualmente contamos con un equipo de profesores e instructores que
              colaboran en la creación e impartición de cursos virtuales, compartiendo
              conocimientos prácticos y acompañando a cientos de estudiantes en su
              proceso de aprendizaje.
            </p>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Nuestro compromiso es brindar una educación moderna, enfocada en habilidades
              reales, para que cada estudiante pueda desarrollar proyectos, mejorar su
              perfil profesional y abrir nuevas oportunidades laborales.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className="text-3xl font-extrabold">+800</p>
              <p className="text-sm text-primary-foreground/80">Estudiantes activos</p>
            </div>
            <div className="rounded-2xl bg-accent p-6 text-accent-foreground">
              <p className="text-3xl font-extrabold">9</p>
              <p className="text-sm">Cursos disponibles</p>
            </div>
            <div className="rounded-2xl bg-turquoise p-6 text-primary-foreground">
              <p className="text-3xl font-extrabold">98%</p>
              <p className="text-sm text-primary-foreground/90">Satisfacción</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
              <p className="text-3xl font-extrabold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Acceso al contenido</p>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:py-24">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-primary">
            Beneficios
          </span>
          <h2 className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">
            ¿Por qué estudiar con C.O.A?
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

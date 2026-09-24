import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  ListChecks,
  PlayCircle,
  Rocket,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InteractiveCodeBlock as CodeBlock } from '@/components/interactive-code-block'
import { ModuleExperience, type ModuleTocItem } from '@/components/module-experience'
import { ActivityDeliveryPoint } from '@/components/academic/module-activities'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { courseSectionId } from '@/lib/course-navigation'

export const metadata: Metadata = {
  title: 'Módulo 1: Pensar como un programador | C.O.A.',
  description:
    'Módulo 1 del curso de Lógica de Programación: Pensar como un programador.',
}

const moduleOneToc: ModuleTocItem[] = [
  { id: '1-objetivo-del-modulo', label: 'Objetivo' },
  { id: '2-distribucion-del-tiempo', label: 'Distribución del tiempo' },
  { id: '3-pregunta-inicial', label: 'Parte 1: Activación' },
  { id: '5-que-significa-pensar-como-un-programador', label: 'Parte 2: Comprender' },
  { id: '9-que-es-un-algoritmo', label: 'Parte 3: Algoritmos' },
  { id: '14-el-modelo-eps', label: 'Parte 4: Entrada y salida' },
  { id: '18-lenguaje-cotidiano-estructurado', label: 'Parte 5: Representación' },
  { id: 'ejercicio-1-problema-o-sintoma', label: 'Ejercicios' },
  { id: 'retos-del-modulo', label: 'Retos' },
  { id: 'mini-proyecto', label: 'Mini proyecto' },
  { id: 'evaluacion-de-dominio', label: 'Evaluación' },
  { id: 'videos-complementarios', label: 'Videos' },
  { id: 'lecturas-y-documentacion', label: 'Lecturas' },
  { id: 'glosario', label: 'Glosario' },
  { id: 'resumen-del-modulo', label: 'Resumen' },
]

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={courseSectionId(title)} className="scroll-mt-32">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-2xl font-extrabold text-foreground md:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

function DeliveryBlock() {
  return null
}

function Activity({
  title,
  children,
  delivery = true,
  time,
}: {
  title: string
  children: ReactNode
  delivery?: boolean
  time?: string
}) {
  const isChallenge = title.startsWith('Reto')
  return (
    <article
      id={courseSectionId(title)}
      className={`scroll-mt-32 rounded-2xl border p-6 shadow-sm ${
        isChallenge
          ? 'border-accent/50 bg-accent/5'
          : 'border-primary/20 bg-secondary/40'
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
          isChallenge
            ? 'bg-accent text-accent-foreground'
            : 'bg-primary text-primary-foreground'
        }`}>
          {isChallenge ? '🚀 Reto' : '📝 Ejercicio'}
        </span>
        <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
          Nivel: Práctica
        </span>
        {time && (
          <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
            Tiempo: {time}
          </span>
        )}
      </div>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-secondary text-primary">
          {isChallenge ? <Rocket className="h-5 w-5" /> : <ListChecks className="h-5 w-5" />}
        </span>
        <h3 className="pt-1 text-xl font-bold text-card-foreground">{title}</h3>
      </div>
      <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
      {delivery && <DeliveryBlock />}
    </article>
  )
}

function Video({
  title,
  videoId,
  label,
  children,
}: {
  title: string
  videoId: string
  label: 'Video obligatorio' | 'Video opcional'
  children: ReactNode
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="aspect-video bg-foreground">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="p-5">
        <span className="mb-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
          🎥 {label}
        </span>
        <div className="flex items-center gap-2 text-primary">
          <PlayCircle className="h-5 w-5" />
          <h3 className="font-bold text-card-foreground">{title}</h3>
        </div>
        <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </article>
  )
}

export default function LogicCourseClassroomPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <Link
              href="/cursos/logica-de-programacion/inscripcion"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la inscripción
            </Link>
            <p className="mb-3 font-semibold text-accent">
              COA — Lógica de Programación
            </p>
            <h1 className="max-w-3xl text-balance text-3xl font-extrabold md:text-5xl">
              Módulo 1: Pensar como un programador
            </h1>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Duración obligatoria</p>
                <p className="text-primary-foreground/80">2 horas</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <GraduationCap className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Nivel</p>
                <p className="text-primary-foreground/80">Principiante absoluto</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <BookOpen className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Conocimientos previos</p>
                <p className="text-primary-foreground/80">Ninguno</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 ring-1 ring-primary-foreground/20">
                <Lightbulb className="mb-2 h-5 w-5 text-accent" />
                <p className="font-semibold">Modalidad</p>
                <p className="text-primary-foreground/80">
                  Práctica, sin instalar programas
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Materiales: Papel, lápiz y, opcionalmente, tarjetas o notas adhesivas
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              {['7 ejercicios', '2 retos', '1 mini proyecto', '1 evaluación'].map((item) => (
                <span key={item} className="rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-primary-foreground/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ModuleExperience
          moduleId="logica-programacion-modulo-1"
          moduleLabel="Módulo 1"
          items={moduleOneToc}
          nextHref="/cursos/logica-de-programacion/curso/modulo-2"
          nextLabel="Ir al Módulo 2"
        >
        <div className="space-y-14 md:space-y-20">
          <Section title="1. Objetivo del módulo">
            <p>
              Aprender a comprender un problema y transformarlo en una secuencia de
              instrucciones claras, ordenadas y ejecutables.
            </p>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold text-card-foreground">
                Al terminar el módulo, podrá:
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  'distinguir un problema de uno de sus síntomas;',
                  'describir el resultado que se desea alcanzar;',
                  'identificar entradas, proceso y salida;',
                  'dividir una tarea en partes pequeñas;',
                  'explicar qué es un algoritmo;',
                  'detectar instrucciones ambiguas, desordenadas o incompletas;',
                  'simular manualmente una secuencia;',
                  'representar un algoritmo secuencial mediante pseudocódigo y un diagrama de flujo sencillo.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section title="2. Distribución del tiempo">
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-[1fr_auto] bg-secondary px-5 py-3 font-bold text-secondary-foreground">
                <span>Sección</span>
                <span>Tiempo</span>
              </div>
              {[
                ['Activación y diagnóstico', '5 min'],
                ['Comprender antes de resolver', '18 min'],
                ['Algoritmos e instrucciones precisas', '22 min'],
                ['Entradas, proceso, salida y descomposición', '20 min'],
                ['Pseudocódigo y diagramas de flujo', '15 min'],
                ['Retos', '8 min'],
                ['Mini proyecto', '24 min'],
                ['Evaluación y cierre', '8 min'],
                ['Total', '120 min'],
              ].map(([name, time]) => (
                <div
                  key={name}
                  className="grid grid-cols-[1fr_auto] border-t border-border bg-card px-5 py-3"
                >
                  <span>{name}</span>
                  <span className="font-semibold text-foreground">{time}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section eyebrow="Parte 1 — Activación" title="3. Pregunta inicial">
            <p>
              Imagina que debes explicarle por teléfono a una persona cómo llegar desde
              la entrada de un edificio hasta una oficina.
            </p>
            <p>La persona:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>nunca ha visitado el edificio;</li>
              <li>no puede enviarte fotografías;</li>
              <li>debe seguir exactamente tus instrucciones;</li>
              <li>no puede preguntarte nada después de iniciar el recorrido.</li>
            </ul>
            <p className="font-semibold text-foreground">Responde:</p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>¿Qué información necesitarías antes de darle instrucciones?</li>
              <li>¿Qué podría salir mal?</li>
              <li>¿Qué palabras podrían resultar ambiguas?</li>
              <li>¿Cómo comprobarías que tus instrucciones están completas?</li>
            </ol>
            <p>
              No se espera una respuesta perfecta. El propósito es comenzar a observar
              que resolver una tarea exige comprender su contexto.
            </p>
          </Section>

          <Section title="4. Video introductorio obligatorio">
            <Video
              title="Definición sencilla de algoritmo y ejemplos cotidianos"
              videoId="oUWT8XvgH6E"
              label="Video obligatorio"
            >
              <p>Duración aproximada: 2 minutos</p>
              <p>
                Tema exacto: Definición sencilla de algoritmo y ejemplos cotidianos
              </p>
            </Video>
          </Section>

          <Section
            eyebrow="Parte 2 — Comprender antes de resolver"
            title="5. ¿Qué significa pensar como un programador?"
          >
            <p>
              Pensar como un programador no significa pensar como una computadora.
            </p>
            <p>Significa aprender a:</p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>comprender qué está ocurriendo;</li>
              <li>definir qué resultado se necesita;</li>
              <li>identificar la información disponible;</li>
              <li>descubrir qué información falta;</li>
              <li>dividir el problema;</li>
              <li>diseñar una serie de pasos;</li>
              <li>probar esos pasos;</li>
              <li>corregirlos si no producen el resultado esperado.</li>
            </ol>
            <div className="grid gap-4 sm:grid-cols-2">
              <blockquote className="rounded-2xl border border-border bg-card p-5 text-foreground">
                Un principiante suele intentar responder inmediatamente:
                <strong className="mt-2 block">“¿Qué tengo que hacer?”</strong>
              </blockquote>
              <blockquote className="rounded-2xl bg-secondary p-5 text-secondary-foreground">
                Un programador primero pregunta:
                <strong className="mt-2 block">“¿Cuál es exactamente el problema?”</strong>
              </blockquote>
            </div>
          </Section>

          <Section title="6. Problema, síntoma y causa">
            <p>Considera esta situación:</p>
            <blockquote className="rounded-2xl border-l-4 border-accent bg-card p-5 text-lg font-semibold text-foreground">
              “Los clientes se están quejando.”
            </blockquote>
            <p>Eso todavía no describe claramente el problema. Es un síntoma.</p>
            <p>Al investigar podríamos encontrar:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>los clientes esperan demasiado;</li>
              <li>algunos pedidos se pierden;</li>
              <li>los precios mostrados son incorrectos;</li>
              <li>los empleados reciben información incompleta.</li>
            </ul>
            <p>Cada causa necesitaría una solución distinta.</p>
            <CodeBlock>{`SÍNTOMA
"Los clientes se quejan"
│
├── Posible causa: espera excesiva
├── Posible causa: pedidos incorrectos
├── Posible causa: información confusa
└── Posible causa: cobros incorrectos`}</CodeBlock>
            <p>
              Antes de diseñar una solución debemos descubrir qué problema estamos
              intentando resolver.
            </p>
          </Section>

          <Section title="7. Estado actual y resultado esperado">
            <p>
              Todo problema puede analizarse como una distancia entre dos estados.
            </p>
            <CodeBlock>{`ESTADO ACTUAL                 ESTADO DESEADO
¿Dónde estamos? ───────────→ ¿Dónde queremos llegar?`}</CodeBlock>
            <h3 className="text-lg font-bold text-foreground">Ejemplo</h3>
            <p>Situación: Una persona llega tarde con frecuencia.</p>
            <p>Estado actual: Llega después de la hora de inicio.</p>
            <p>Estado deseado: Llega al menos cinco minutos antes.</p>
            <p>Todavía falta investigar:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>a qué hora se levanta;</li>
              <li>cuánto tarda en prepararse;</li>
              <li>cuánto dura el recorrido;</li>
              <li>qué medios de transporte puede utilizar;</li>
              <li>qué retrasos suelen presentarse.</li>
            </ul>
            <p>
              “Salir más temprano” podría ser parte de la solución, pero no deberíamos
              asumirlo antes de entender la situación.
            </p>
          </Section>

          <Section title="8. Hechos y suposiciones">
            <p>Un hecho es información conocida o comprobada.</p>
            <p>
              Una suposición es algo que creemos cierto, pero todavía no hemos
              confirmado.
            </p>
            <h3 className="text-lg font-bold text-foreground">Ejemplo</h3>
            <p>Un cliente no pudo completar una compra en línea.</p>
            <div className="overflow-hidden rounded-2xl border border-border">
              {[
                ['El cliente presionó el botón de pago.', 'Hecho, si existe un registro que lo confirma.'],
                ['El cliente no tenía dinero.', 'Suposición.'],
                ['La compra no aparece como completada.', 'Hecho comprobable.'],
                ['La página estaba dañada.', 'Suposición hasta investigarla.'],
              ].map(([statement, type]) => (
                <div
                  key={statement}
                  className="grid gap-1 border-b border-border bg-card p-4 last:border-b-0 sm:grid-cols-2"
                >
                  <span className="text-foreground">{statement}</span>
                  <span>{type}</span>
                </div>
              ))}
            </div>
            <p>
              Las suposiciones no siempre son incorrectas. El peligro está en tratarlas
              como hechos.
            </p>
          </Section>

          <div className="space-y-6">
            <Activity title="Ejercicio 1 — Problema o síntoma" time="4 minutos">
              <p>
                Lee cada situación. Decide si la frase describe un problema
                suficientemente claro o solamente un síntoma. Si es un síntoma, escribe
                dos preguntas que ayudarían a encontrar el problema real.
              </p>
              <p className="font-semibold text-foreground">Situaciones</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>“La aplicación es muy mala.”</li>
                <li>
                  “Durante tres compras de prueba, el total mostrado fue diferente de la
                  suma de los productos.”
                </li>
                <li>“Los estudiantes no entienden el curso.”</li>
                <li>
                  “Cinco estudiantes indicaron que no encontraron el botón para
                  continuar a la siguiente lección.”
                </li>
              </ol>
              <p>Tiempo sugerido: 4 minutos</p>
            </Activity>

            <Activity title="Ejercicio 2 — Hechos, suposiciones e información faltante" time="4 minutos">
              <p>
                Una cafetería preparó 40 almuerzos. A la 1:00 p. m. todavía quedaban 25.
                El propietario afirma: “La comida no se vendió porque estaba demasiado
                cara.”
              </p>
              <p className="font-semibold text-foreground">Realiza lo siguiente:</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>Escribe dos hechos que sí conocemos.</li>
                <li>Identifica la suposición del propietario.</li>
                <li>Escribe tres datos que investigarías antes de aceptar su conclusión.</li>
                <li>Propón otra causa posible.</li>
              </ol>
              <p>Tiempo sugerido: 4 minutos</p>
            </Activity>
          </div>

          <Section
            eyebrow="Parte 3 — Algoritmos e instrucciones"
            title="9. ¿Qué es un algoritmo?"
          >
            <p>
              Un algoritmo es una secuencia de pasos ordenados para completar una tarea
              o resolver un problema.
            </p>
            <p>Ejemplos cotidianos:</p>
            <ul className="grid list-disc gap-2 pl-6 sm:grid-cols-2">
              <li>seguir una receta;</li>
              <li>llegar a una dirección;</li>
              <li>armar un mueble;</li>
              <li>calcular el total de una compra;</li>
              <li>registrar un nuevo cliente;</li>
              <li>clasificar documentos;</li>
              <li>retirar dinero de un cajero.</li>
            </ul>
            <p>
              Una receta se parece a un algoritmo, pero no toda receta está escrita con
              suficiente precisión.
            </p>
            <blockquote className="rounded-2xl border-l-4 border-accent bg-card p-5 text-foreground">
              “Agregue un poco de agua y cocine hasta que esté listo.”
            </blockquote>
            <p>¿Cuánto es “un poco”?</p>
            <p>¿Cómo se determina que “está listo”?</p>
            <p>¿Quién ejecutará la instrucción?</p>
            <p>¿Qué conocimientos posee esa persona?</p>
            <p>
              Un cocinero con experiencia puede interpretar esas palabras. Un robot no
              puede improvisar su significado.
            </p>
          </Section>

          <Section title="10. Características prácticas de un buen algoritmo">
            <p>
              No es necesario memorizar una definición extensa. Utilizaremos esta lista
              de comprobación.
            </p>
            <p>Un buen algoritmo debe tener:</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['1. Un objetivo', 'Debe saberse qué tarea completa o qué problema resuelve.'],
                ['2. Un inicio definido', 'Debe quedar claro en qué situación comienza.'],
                ['3. Pasos ordenados', 'Cambiar el orden no debería provocar resultados inesperados.'],
                ['4. Instrucciones precisas', 'Cada instrucción debe poder interpretarse de una sola manera razonable.'],
                ['5. Pasos posibles', 'El ejecutor debe ser capaz de realizar cada acción.'],
                ['6. Un final', 'La tarea debe terminar.'],
                ['7. Un resultado comprobable', 'Debe ser posible verificar si alcanzó el objetivo.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-bold text-card-foreground">{title}</h3>
                  <p className="mt-2 text-sm">{text}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-secondary p-5 text-center font-bold text-secondary-foreground">
              OBJETIVO + ORDEN + PRECISIÓN + FINAL + COMPROBACIÓN
            </div>
          </Section>

          <Section title="11. Precisión y nivel de detalle">
            <p>Observa estas instrucciones:</p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>Toma el libro.</li>
              <li>Colócalo en su lugar.</li>
            </ol>
            <p>Pueden ser suficientes si la persona ya sabe:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>cuál libro;</li>
              <li>dónde está;</li>
              <li>cuál es “su lugar”;</li>
              <li>cómo debe colocarlo.</li>
            </ul>
            <p>Para un robot nuevo, serían insuficientes.</p>
            <p>Una versión más precisa podría ser:</p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>Localiza el libro de portada azul sobre la mesa.</li>
              <li>Sujeta el libro.</li>
              <li>Camina hasta el estante marcado con la letra B.</li>
              <li>Coloca el libro verticalmente en el espacio vacío.</li>
              <li>Deja el título orientado hacia afuera.</li>
            </ol>
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
              <p className="font-bold text-foreground">Lección importante</p>
              <p className="mt-2">
                Una instrucción no es clara por sí sola. También depende de quién debe
                ejecutarla.
              </p>
            </div>
          </Section>

          <Section title="12. Orden y dependencias">
            <p>Algunas instrucciones dependen de pasos anteriores.</p>
            <p>No podemos:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>servir una bebida antes de prepararla;</li>
              <li>enviar un paquete antes de escribir la dirección;</li>
              <li>calcular un promedio antes de conocer los valores;</li>
              <li>entregar un recibo antes de registrar la compra.</li>
            </ul>
            <p className="font-semibold text-foreground">Ejemplo desordenado</p>
            <ol className="list-[upper-alpha] space-y-2 pl-6">
              <li>Cerrar el sobre.</li>
              <li>Escribir la dirección del destinatario.</li>
              <li>Colocar el documento dentro del sobre.</li>
              <li>Entregar el sobre en el punto de envío.</li>
              <li>Comprobar que el documento es el correcto.</li>
            </ol>
            <CodeBlock>E → C → A → B → D</CodeBlock>
            <p>
              En algunas situaciones puede existir más de un orden válido. Lo
              importante es respetar las dependencias.
            </p>
          </Section>

          <div className="space-y-6">
            <Activity title="Ejercicio 3 — Ordenar una secuencia" time="4 minutos">
              <p>
                Las siguientes instrucciones describen el uso de una lavadora, pero
                están desordenadas:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>iniciar el ciclo;</li>
                <li>colocar la ropa dentro;</li>
                <li>retirar la ropa cuando termine el ciclo;</li>
                <li>agregar el detergente;</li>
                <li>separar las prendas que no deben lavarse juntas;</li>
                <li>seleccionar el ciclo apropiado;</li>
                <li>cerrar la puerta.</li>
              </ul>
              <p className="font-semibold text-foreground">Realiza lo siguiente:</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>Ordénalas.</li>
                <li>Indica qué paso depende directamente de otro.</li>
                <li>Señala una instrucción que todavía podría ser ambigua.</li>
                <li>Reescribe esa instrucción con mayor precisión.</li>
              </ol>
              <p>Tiempo sugerido: 4 minutos</p>
            </Activity>

            <Activity title="Ejercicio 4 — El robot literal" time="5 minutos">
              <p>Un robot recibe estas instrucciones:</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>Toma una hoja.</li>
                <li>Dóblala.</li>
                <li>Ponla en la caja.</li>
              </ol>
              <p>La mesa contiene:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>tres hojas de diferentes colores;</li>
                <li>dos cajas;</li>
                <li>varios objetos;</li>
                <li>ninguna marca que indique cómo doblar la hoja.</li>
              </ul>
              <p>
                Identifica al menos cuatro dudas que el robot no puede resolver. Después
                redacta una nueva versión de las instrucciones.
              </p>
              <p>Tiempo sugerido: 5 minutos</p>
            </Activity>
          </div>

          <ActivityDeliveryPoint activityId="logica-m1-ejercicios-1-4" />

          <Section title="13. Algoritmo y programa no son lo mismo">
            <p>Un algoritmo es el plan lógico de la solución.</p>
            <p>
              Un programa es ese plan expresado mediante un lenguaje que una computadora
              puede ejecutar.
            </p>
            <CodeBlock>{`PROBLEMA
↓
ALGORITMO
↓
PROGRAMA EN PYTHON, JAVA, C#, JAVASCRIPT...`}</CodeBlock>
            <p>
              En este curso nos concentraremos en la parte central: construir el
              algoritmo.
            </p>
            <p>
              Si el algoritmo está mal diseñado, cambiar de lenguaje no arreglará el
              razonamiento.
            </p>
          </Section>

          <Section eyebrow="Parte 4 — Entrada, proceso y salida" title="14. El modelo EPS">
            <p>Muchos problemas pueden comenzar a entenderse con tres preguntas:</p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>¿Qué información entra?</li>
              <li>¿Qué se hace con ella?</li>
              <li>¿Qué resultado sale?</li>
            </ol>
            <CodeBlock>ENTRADA ──→ PROCESO ──→ SALIDA</CodeBlock>
            <p>
              Utilizaremos la abreviatura EPS: entrada, proceso y salida.
            </p>
          </Section>

          <Section title="15. Ejemplo cotidiano">
            <p className="font-semibold text-foreground">Problema</p>
            <p>
              Calcular cuánto debe pagar una persona por tres entradas de cine con el
              mismo precio.
            </p>
            <p className="font-semibold text-foreground">Entrada</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>precio de una entrada;</li>
              <li>cantidad de entradas.</li>
            </ul>
            <p className="font-semibold text-foreground">Proceso</p>
            <p>Multiplicar el precio por la cantidad.</p>
            <p className="font-semibold text-foreground">Salida</p>
            <p>Total que debe pagar.</p>
            <CodeBlock>{`Precio y cantidad
↓
precio × cantidad
↓
Total de la compra`}</CodeBlock>
            <p>
              Todavía no necesitamos escribir código. Primero debemos comprender la
              transformación.
            </p>
          </Section>

          <Section title="16. Cuidado con las entradas faltantes">
            <p>Considera esta solicitud:</p>
            <blockquote className="rounded-2xl border-l-4 border-accent bg-card p-5 text-foreground">
              “Calcule cuánto tarda una persona en llegar al trabajo.”
            </blockquote>
            <p>No podemos resolverla sin información adicional.</p>
            <p>Podríamos necesitar:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>distancia;</li>
              <li>medio de transporte;</li>
              <li>velocidad aproximada;</li>
              <li>ruta;</li>
              <li>tráfico;</li>
              <li>hora de salida.</li>
            </ul>
            <p>
              Una tarea no se vuelve resoluble solo porque alguien la escriba como una
              orden.
            </p>
          </Section>

          <Activity title="Ejercicio 5 — Entrada, proceso y salida" time="5 minutos">
            <p>
              Para cada situación, identifica las entradas, el proceso y la salida.
            </p>
            <div>
              <p className="font-semibold text-foreground">A. Pintura para una pared</p>
              <p>
                Se desea calcular cuántos litros de pintura se necesitan para cubrir una
                pared.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">B. Costo de un viaje</p>
              <p>Se desea calcular el costo total de un viaje en automóvil.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                C. Duración de una película
              </p>
              <p>
                Se conoce la hora de inicio y la duración. Se desea obtener la hora
                aproximada de finalización.
              </p>
            </div>
            <p>
              No es necesario realizar cálculos. El objetivo es determinar qué
              información se necesita y qué transformación debe hacerse.
            </p>
            <p>Tiempo sugerido: 5 minutos</p>
          </Activity>

          <Section title="17. Descomponer un problema">
            <p>
              Descomponer significa dividir un problema grande en partes más pequeñas.
            </p>
            <p className="font-semibold text-foreground">
              Ejemplo: organizar una reunión
            </p>
            <CodeBlock>{`ORGANIZAR REUNIÓN
│
├── Definir propósito
├── Elegir participantes
├── Buscar fecha
├── Reservar lugar
├── Preparar materiales
├── Enviar invitaciones
└── Confirmar asistencia`}</CodeBlock>
            <p>
              “Organizar una reunión” es demasiado amplio para ejecutarlo como una sola
              instrucción.
            </p>
            <p>Cada parte puede dividirse nuevamente.</p>
            <CodeBlock>{`Enviar invitaciones
│
├── Preparar lista de destinatarios
├── Redactar mensaje
├── Revisar fecha y lugar
├── Enviar mensaje
└── Registrar confirmaciones`}</CodeBlock>
            <h3 className="text-lg font-bold text-foreground">
              Cuándo dejar de dividir
            </h3>
            <p>Dejamos de dividir cuando cada parte:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>se entiende;</li>
              <li>puede realizarse;</li>
              <li>tiene un resultado reconocible;</li>
              <li>no necesita una explicación excesivamente grande.</li>
            </ul>
            <p>
              No existe un único nivel correcto de descomposición. Depende del ejecutor
              y del propósito.
            </p>
          </Section>

          <Activity title="Ejercicio 6 — Descomposición" time="4 minutos">
            <p>
              Descompón la tarea “entregar un pedido a domicilio” en entre cinco y ocho
              partes principales.
            </p>
            <p>
              Después selecciona una de esas partes y divídela en al menos cuatro pasos
              más pequeños.
            </p>
            <p>
              No escribas todavía todos los detalles del algoritmo. Primero construye el
              mapa del problema.
            </p>
            <p>Tiempo sugerido: 4 minutos</p>
          </Activity>

          <Section
            eyebrow="Parte 5 — Representar un algoritmo"
            title="18. Lenguaje cotidiano estructurado"
          >
            <p>La primera representación puede ser una lista clara.</p>
            <p className="font-semibold text-foreground">
              Ejemplo: entregar una ficha numerada
            </p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>Recibir la solicitud de turno.</li>
              <li>Tomar la siguiente ficha disponible.</li>
              <li>Registrar el número.</li>
              <li>Entregar la ficha.</li>
              <li>Informar dónde debe esperar la persona.</li>
            </ol>
            <p>
              Esta representación es fácil de leer, pero puede volverse difícil de
              manejar en problemas grandes.
            </p>
          </Section>

          <Section title="19. Pseudocódigo">
            <p>
              El pseudocódigo representa un algoritmo utilizando palabras estructuradas,
              sin pertenecer a un lenguaje de programación específico.
            </p>
            <p className="font-semibold text-foreground">
              Convenciones iniciales de COA
            </p>
            <CodeBlock>{`INICIO
instrucciones
FIN`}</CodeBlock>
            <p>
              Utilizaremos verbos en mayúsculas para destacar acciones importantes:
            </p>
            <div className="flex flex-wrap gap-2">
              {['RECIBIR', 'LEER', 'CALCULAR', 'GUARDAR', 'MOSTRAR', 'REPETIR', 'DECIDIR'].map(
                (word) => (
                  <span
                    key={word}
                    className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground"
                  >
                    {word}
                  </span>
                ),
              )}
            </div>
            <p>En este módulo solo utilizaremos secuencias.</p>
            <p className="font-semibold text-foreground">Ejemplo</p>
            <CodeBlock>{`INICIO
RECIBIR la solicitud de turno
TOMAR la siguiente ficha disponible
REGISTRAR el número de la ficha
ENTREGAR la ficha
MOSTRAR el lugar de espera
FIN`}</CodeBlock>
            <p>
              No existe una única sintaxis universal de pseudocódigo. Lo importante es
              que la solución sea clara, consistente e independiente de un lenguaje.
            </p>
          </Section>

          <Section title="20. Diagrama de flujo básico">
            <p>Por ahora necesitaremos tres tipos de símbolos:</p>
            <div className="overflow-hidden rounded-2xl border border-border">
              {[
                ['Óvalo', 'Inicio o final'],
                ['Rectángulo', 'Acción o proceso'],
                ['Paralelogramo', 'Entrada o salida'],
                ['Flecha', 'Dirección del flujo'],
              ].map(([symbol, use]) => (
                <div
                  key={symbol}
                  className="grid grid-cols-2 border-b border-border bg-card p-4 last:border-b-0"
                >
                  <span className="font-semibold text-foreground">{symbol}</span>
                  <span>{use}</span>
                </div>
              ))}
            </div>
            <p className="font-semibold text-foreground">Representación textual</p>
            <CodeBlock>{`INICIO
↓
RECIBIR solicitud
↓
TOMAR la ficha
↓
ENTREGAR la ficha
↓
FIN`}</CodeBlock>
            <p>
              Las decisiones y repeticiones se agregarán en módulos posteriores.
            </p>
          </Section>

          <Activity title="Ejercicio 7 — Tres representaciones" time="5 minutos">
            <p>
              La tarea consiste en entregar una botella de agua que está sobre una mesa.
            </p>
            <p>
              El punto de inicio es: una persona se encuentra frente a la mesa.
            </p>
            <p>
              El punto final es: la botella está en manos del destinatario.
            </p>
            <p>Representa la solución de tres maneras:</p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>lista numerada;</li>
              <li>pseudocódigo;</li>
              <li>diagrama de flujo sencillo.</li>
            </ol>
            <p>Tiempo sugerido: 5 minutos</p>
          </Activity>

          <Section title="Video opcional sobre diagramas">
            <Video
              title="Concepto, construcción, prueba manual y símbolos principales"
              videoId="qDttSc3RQBc"
              label="Video opcional"
            >
              <p>Duración: 3 minutos y 22 segundos</p>
              <p>
                Tema exacto: Concepto, construcción, prueba manual y símbolos
                principales
              </p>
              <p>
                En este momento basta con observar inicio, final, proceso, entrada,
                salida y flechas. El símbolo de decisión se estudiará en el Módulo 3.
              </p>
            </Video>
          </Section>

          <Section eyebrow="Parte 6 — Retos" title="Retos del módulo">
            <div className="space-y-6">
              <Activity title="Reto 1 — La instrucción peligrosa">
                <p>
                  Una persona escribe este algoritmo para enviar un documento importante:
                </p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Imprimir el documento.</li>
                  <li>Colocarlo en un sobre.</li>
                  <li>Enviarlo a la dirección correcta.</li>
                </ol>
                <p>
                  Explica al menos cinco formas en que el resultado podría salir mal
                  aunque se sigan literalmente las instrucciones.
                </p>
                <p>
                  Después agrega únicamente los pasos necesarios para reducir esos
                  riesgos. Evita convertir la solución en una lista innecesariamente
                  larga.
                </p>
              </Activity>
              <Activity title="Reto 2 — Dos algoritmos, un objetivo">
                <p>
                  Dos personas deben guardar cinco objetos de una mesa dentro de una
                  caja.
                </p>
                <p className="font-semibold text-foreground">Algoritmo A</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Toma todos los objetos.</li>
                  <li>Guárdalos.</li>
                </ol>
                <p className="font-semibold text-foreground">Algoritmo B</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>Observa los objetos de izquierda a derecha.</li>
                  <li>Toma el primer objeto.</li>
                  <li>Colócalo dentro de la caja.</li>
                  <li>Toma el segundo objeto.</li>
                  <li>Colócalo dentro de la caja.</li>
                  <li>
                    Continúa de la misma manera hasta guardar los cinco.
                  </li>
                  <li>Comprueba que la mesa quedó vacía.</li>
                </ol>
                <p className="font-semibold text-foreground">Responde:</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>¿Cuál es más preciso?</li>
                  <li>¿Cuál es más breve?</li>
                  <li>¿El más breve es necesariamente mejor?</li>
                  <li>¿Para qué tipo de ejecutor podría funcionar el algoritmo A?</li>
                  <li>¿Qué parte del algoritmo B podría expresarse de forma más general?</li>
                  <li>¿Cómo escribirías una versión equilibrada?</li>
                </ol>
              </Activity>
            </div>
          </Section>

          <ActivityDeliveryPoint activityId="logica-m1-ejercicios-5-7-retos" />

          <section id="mini-proyecto" className="scroll-mt-32 rounded-3xl border-2 border-accent bg-card p-6 shadow-lg md:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Target className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Parte 7 — Mini proyecto
                </p>
                <h2 className="text-2xl font-extrabold text-card-foreground md:text-3xl">
                  Instrucciones para un robot doméstico
                </h2>
              </div>
            </div>
            <div className="mt-7 space-y-5 leading-relaxed text-muted-foreground">
              <h3 className="text-lg font-bold text-foreground">Situación</h3>
              <p>Un robot debe organizar un escritorio.</p>
              <h3 className="text-lg font-bold text-foreground">Estado inicial</h3>
              <p>Sobre el escritorio hay:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>dos libros;</li><li>tres hojas;</li><li>un lápiz;</li>
                <li>una taza vacía;</li><li>una caja para papeles;</li>
                <li>un estante;</li><li>un portalápices.</li>
              </ul>
              <h3 className="text-lg font-bold text-foreground">Estado deseado</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>los libros deben quedar en el estante;</li>
                <li>las hojas deben quedar dentro de la caja;</li>
                <li>el lápiz debe quedar en el portalápices;</li>
                <li>la taza debe quedar en la esquina derecha;</li>
                <li>el centro del escritorio debe quedar libre.</li>
              </ul>
              <h3 className="text-lg font-bold text-foreground">
                Comportamiento del robot
              </h3>
              <p>El robot:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>sigue las instrucciones literalmente;</li>
                <li>no puede adivinar;</li>
                <li>puede tomar un solo objeto a la vez;</li>
                <li>
                  entiende izquierda, derecha, centro, tomar, mover, colocar y soltar;
                </li>
                <li>
                  no sabe qué significa “ordenar bien”, “poner donde corresponde” o
                  “hacer lo necesario”.
                </li>
              </ul>
              <h3 className="text-xl font-extrabold text-foreground">Entregables</h3>
              <div className="space-y-5">
                <div><h4 className="font-bold text-foreground">1. Definición del problema</h4><p>Completa:</p><CodeBlock>{`Estado actual:
Estado deseado:
Ejecutor:
Restricciones:
Resultado comprobable:`}</CodeBlock></div>
                <div><h4 className="font-bold text-foreground">2. Modelo EPS</h4><p>Completa:</p><CodeBlock>{`ENTRADAS:
PROCESO:
SALIDAS:`}</CodeBlock><p>En este caso, “entrada” no significa necesariamente información escrita. También puede incluir los objetos y su ubicación inicial.</p></div>
                <div><h4 className="font-bold text-foreground">3. Descomposición</h4><p>Divide la tarea en tres o cuatro partes principales.</p><p>Ejemplo de estructura:</p><CodeBlock>{`ORGANIZAR ESCRITORIO
│
├── ...
├── ...
└── ...`}</CodeBlock></div>
                <div><h4 className="font-bold text-foreground">4. Algoritmo numerado</h4><p>Escribe entre 8 y 15 pasos.</p></div>
                <div><h4 className="font-bold text-foreground">5. Pseudocódigo</h4><p>Traduce el algoritmo al formato:</p><CodeBlock>{`INICIO
...
FIN`}</CodeBlock></div>
                <div><h4 className="font-bold text-foreground">6. Diagrama de flujo</h4><p>Representa el inicio, las acciones principales y el final.</p></div>
                <div><h4 className="font-bold text-foreground">7. Prueba manual</h4><p>Simula el algoritmo al menos una vez.</p><p>Registra:</p><div className="overflow-hidden rounded-xl border border-border"><div className="grid grid-cols-4 bg-secondary p-3 text-sm font-bold text-secondary-foreground"><span>Paso</span><span>Acción</span><span>Estado resultante</span><span>¿Existe algún problema?</span></div><div className="h-16 bg-background" /></div></div>
                <div><h4 className="font-bold text-foreground">8. Mejora</h4><p>Después de simularlo, responde:</p><ol className="list-decimal space-y-2 pl-6"><li>¿Qué instrucción resultó ambigua?</li><li>¿Qué paso faltaba?</li><li>¿Había pasos innecesarios?</li><li>¿Cómo mejoraste la solución?</li></ol></div>
              </div>
              <h3 className="text-xl font-extrabold text-foreground">
                Rúbrica del mini proyecto
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border">
                {[
                  ['Define claramente el estado inicial y el resultado', '15'],
                  ['Identifica entradas, proceso y salida', '15'],
                  ['Descompone la tarea', '15'],
                  ['Presenta pasos ordenados', '15'],
                  ['Utiliza instrucciones precisas', '15'],
                  ['Representa el algoritmo en pseudocódigo', '10'],
                  ['Incluye un diagrama comprensible', '5'],
                  ['Simula, detecta y corrige errores', '10'],
                  ['Total', '100'],
                ].map(([criterion, points]) => (
                  <div key={criterion} className="grid grid-cols-[1fr_auto] border-b border-border bg-background p-4 last:border-b-0"><span>{criterion}</span><span className="font-bold text-foreground">{points}</span></div>
                ))}
              </div>
              <h3 className="text-lg font-bold text-foreground">Interpretación</h3>
              <ul className="list-disc space-y-2 pl-6"><li>90–100: dominio sólido.</li><li>75–89: logro esperado.</li><li>60–74: necesita corregir algunos aspectos.</li><li>Menos de 60: conviene revisar el módulo y repetir el proyecto.</li></ul>
              <h3 className="text-lg font-bold text-foreground">
                Ejemplo parcial orientativo
              </h3>
              <p>Este ejemplo no resuelve todo el proyecto:</p>
              <CodeBlock>{`INICIO
TOMAR el primer libro
MOVER el libro hasta el estante
COLOCAR el libro verticalmente en el estante
SOLTAR el libro
TOMAR el segundo libro
MOVER el libro hasta el estante
COLOCAR el libro junto al primer libro
SOLTAR el libro
...
FIN`}</CodeBlock>
              <p>
                El ejemplo muestra el grado de precisión esperado. Deberá completar
                la solución y decidir cómo organizarla sin utilizar
                estructuras de repetición, que se estudiarán posteriormente.
              </p>
              <DeliveryBlock />
            </div>
          </section>

          <ActivityDeliveryPoint activityId="logica-m1-mini-proyecto-robot-domestico" />

          <Section eyebrow="Parte 8 — Evaluación" title="Evaluación de dominio">
            <div className="space-y-5">
              {[
                ['Pregunta 1', '¿Cuál opción describe mejor un algoritmo?', ['A. Cualquier idea para solucionar un problema.', 'B. Una secuencia ordenada de pasos para completar una tarea.', 'C. Un programa escrito en Python.', 'D. Un dibujo que contiene flechas.']],
                ['Pregunta 2', '¿Cuál instrucción es más ambigua?', ['A. Coloca la hoja azul dentro de la caja marcada A.', 'B. Toma el primer libro de la izquierda.', 'C. Organiza todo correctamente.', 'D. Escribe la fecha en la esquina superior derecha.']],
                ['Pregunta 3', '¿Cuál es una entrada necesaria para calcular el costo de cinco entradas de cine?', ['A. El nombre del cine.', 'B. El color de las entradas.', 'C. El precio de una entrada.', 'D. La duración de la película.']],
                ['Pregunta 4', '¿Cuál es la salida al calcular el costo de una compra?', ['A. El precio de cada producto.', 'B. La cantidad comprada.', 'C. La operación utilizada.', 'D. El total que debe pagarse.']],
                ['Pregunta 5', '¿Por qué se descompone un problema?', ['A. Para que parezca más difícil.', 'B. Para evitar escribir instrucciones.', 'C. Para convertirlo en partes manejables.', 'D. Para transformarlo inmediatamente en Python.']],
                ['Pregunta 6', '¿Qué representa normalmente un rectángulo en un diagrama de flujo?', ['A. Inicio o final.', 'B. Una acción o proceso.', 'C. Una entrada o salida.', 'D. La dirección del flujo.']],
                ['Pregunta 7', '¿Cuál afirmación es correcta?', ['A. Todo algoritmo debe escribirse en un lenguaje de programación.', 'B. Un algoritmo y un programa son exactamente lo mismo.', 'C. Un algoritmo puede diseñarse antes de elegir un lenguaje.', 'D. Un diagrama de flujo es un lenguaje de programación.']],
                ['Pregunta 8', 'Un algoritmo produce un resultado incorrecto durante la simulación. ¿Qué conviene hacer?', ['A. Cambiar inmediatamente de lenguaje.', 'B. Revisar los pasos y localizar dónde aparece el primer error.', 'C. Agregar más pasos al azar.', 'D. Aceptar el resultado porque el algoritmo terminó.']],
              ].map(([label, question, options]) => (
                <article key={label as string} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm font-semibold text-primary">{label as string}</p>
                  <h3 className="mt-2 font-bold text-card-foreground">{question as string}</h3>
                  <ul className="mt-4 space-y-2">{(options as string[]).map((option) => <li key={option} className="rounded-xl bg-secondary px-4 py-3 text-secondary-foreground">{option}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold text-card-foreground">Criterio de aprobación</h3>
              <p className="mt-3">Se recomienda obtener:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>al menos 6 de 8 respuestas correctas;</li>
                <li>al menos 75 puntos en el mini proyecto.</li>
              </ul>
              <p className="mt-4">
                Si no alcanza el resultado, revise especialmente:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>precisión de instrucciones;</li>
                <li>modelo entrada–proceso–salida;</li>
                <li>orden de los pasos;</li>
                <li>diferencia entre algoritmo y programa.</li>
              </ul>
            </div>
          </Section>

          <Section title="Videos complementarios">
            <Video
              title="Pensamiento computacional"
              videoId="SfN2QuPXPUg"
              label="Video opcional"
            >
              <p>Duración aproximada: 5 minutos</p>
              <p>
                Contenido: Descomposición, patrones, abstracción, algoritmos y depuración
              </p>
            </Video>
          </Section>

          <Section title="Lecturas y documentación">
            <div className="grid gap-5 sm:grid-cols-2">
              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-bold text-card-foreground">Lectura esencial</h3>
                <p className="mt-3 text-sm">
                  Explica qué es un algoritmo, cómo puede representarse y por qué
                  conviene pensar antes de programar.
                </p>
                <Button asChild variant="outline" className="mt-5 gap-2">
                  <a href="https://formacion.intef.es/aulaenabierto/mod/book/tool/print/index.php?id=4100" target="_blank" rel="noopener noreferrer">Abrir lectura<ExternalLink className="h-4 w-4" /></a>
                </Button>
              </article>
              <article className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-bold text-card-foreground">Lectura sencilla</h3>
                <p className="mt-3 text-sm">
                  Presenta la descomposición, el pensamiento algorítmico, la abstracción,
                  los patrones y la evaluación de soluciones.
                </p>
                <Button asChild variant="outline" className="mt-5 gap-2">
                  <a href="https://www.csunplugged.org/es/computational-thinking/" target="_blank" rel="noopener noreferrer">Abrir lectura<ExternalLink className="h-4 w-4" /></a>
                </Button>
              </article>
              <article className="rounded-2xl border border-border bg-card p-6 sm:col-span-2">
                <h3 className="font-bold text-card-foreground">Ampliación opcional</h3>
                <p className="mt-3 text-sm">
                  Relaciona el pensamiento computacional con la resolución de problemas
                  cotidianos y educativos.
                </p>
              </article>
            </div>
          </Section>

          <Section title="Glosario">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ['Algoritmo', 'secuencia ordenada de pasos para completar una tarea o resolver un problema.'],
                ['Ambigüedad', 'expresión que puede interpretarse de más de una manera.'],
                ['Descomposición', 'división de un problema en partes más pequeñas.'],
                ['Entrada', 'información o elementos necesarios para iniciar un proceso.'],
                ['Ejecutor', 'persona o máquina que sigue las instrucciones.'],
                ['Estado actual', 'situación existente antes de aplicar la solución.'],
                ['Estado deseado', 'situación que se pretende alcanzar.'],
                ['Hecho', 'información conocida o comprobada.'],
                ['Proceso', 'conjunto de acciones que transforma las entradas.'],
                ['Programa', 'algoritmo expresado mediante un lenguaje ejecutable por una computadora.'],
                ['Pseudocódigo', 'representación estructurada y legible de un algoritmo, independiente de un lenguaje específico.'],
                ['Salida', 'resultado producido.'],
                ['Simulación manual', 'ejecución de un algoritmo paso a paso utilizando ejemplos.'],
                ['Suposición', 'idea que se considera posible, pero todavía no se ha comprobado.'],
              ].map(([term, definition]) => (
                <div key={term} className="rounded-2xl border border-border bg-card p-5">
                  <dt className="font-bold text-card-foreground">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed">{definition}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Resumen del módulo">
            <CodeBlock>{`Un programador no comienza escribiendo código.

Primero:

COMPRENDE EL PROBLEMA
↓
DEFINE EL RESULTADO
↓
IDENTIFICA ENTRADAS Y SALIDAS
↓
DIVIDE EL PROBLEMA
↓
ORDENA LOS PASOS
↓
ESCRIBE EL ALGORITMO
↓
LO SIMULA
↓
CORRIGE LOS ERRORES`}</CodeBlock>
            <div className="rounded-3xl bg-primary p-7 text-primary-foreground">
              <h3 className="font-bold text-accent">Idea final</h3>
              <p className="mt-3 text-lg leading-relaxed">
                Programar comienza mucho antes de escribir código: comienza cuando
                aprendemos a describir un problema con suficiente claridad para construir
                una solución que otra persona pueda seguir, comprobar y mejorar.
              </p>
            </div>
          </Section>

          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <Button asChild className="gap-2 bg-primary font-semibold hover:bg-primary/90">
              <Link href="/cursos/logica-de-programacion">
                Volver a la página del curso
              </Link>
            </Button>
            <Button asChild className="gap-2 bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
              <Link href="/cursos/logica-de-programacion/curso/modulo-2">
                Módulo 2
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        </ModuleExperience>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  )
}

import { createWhatsAppLink } from '@/lib/site'
import { publicCourses, type PublicCourse } from './knowledge'
import type { ChatResponder, ChatResponse } from './types'

export function normalizeQuestion(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function hasAny(question: string, terms: string[]) {
  return terms.some((term) => question.includes(term))
}

function courseAliases(course: PublicCourse) {
  const aliases = [normalizeQuestion(course.title), normalizeQuestion(course.slug.replaceAll('-', ' '))]
  if (course.slug === 'python-nivel-1') aliases.push('python basico', 'python básico', 'python nivel uno')
  if (course.slug === 'sql-bases-datos') aliases.push('sql', 'bases de datos')
  if (course.slug === 'programacion-con-ia') aliases.push('programacion con ia', 'inteligencia artificial')
  if (course.slug === 'desarrollo-web-moderno') aliases.push('react', 'next js', 'desarrollo web moderno')
  if (course.slug === 'desarrollo-web-django') aliases.push('django')
  return aliases.map(normalizeQuestion)
}

function matchingCourses(question: string) {
  return publicCourses.filter((course) => courseAliases(course).some((alias) => question.includes(alias)))
}

function price(course: PublicCourse) {
  return `${course.price}${course.billing ? ` ${course.billing}` : ''}`
}

function whatsappResponse(question?: string): ChatResponse {
  const message = question
    ? `Hola, tengo esta consulta sobre C.O.A.: ${question}`
    : 'Hola, quisiera hablar con un asesor de C.O.A.'
  return {
    text: question
      ? 'No tengo información suficiente para responder esa consulta con seguridad. Puede enviársela a un asesor de COA por WhatsApp.'
      : 'Puede conversar directamente con un asesor de COA por WhatsApp. El asistente no enviará ningún mensaje automáticamente.',
    links: [{ label: 'Abrir WhatsApp', href: createWhatsAppLink(message), external: true }],
  }
}

export class LocalChatResponder implements ChatResponder {
  respond(rawQuestion: string): ChatResponse {
    const question = normalizeQuestion(rawQuestion)
    if (!question) return { text: 'Escriba una pregunta o seleccione una de las opciones disponibles.' }

    if (hasAny(question, ['asesor', 'persona', 'alguien', 'whatsapp', 'contactar', 'contacto humano'])) {
      return whatsappResponse()
    }

    if (hasAny(question, ['principiante', 'desde cero', 'por donde empiezo', 'como empiezo', 'comenzar a programar'])) {
      const logic = publicCourses.find((course) => course.slug === 'logica-de-programacion')
      const python = publicCourses.find((course) => course.slug === 'python-nivel-1')
      return {
        text: 'Si está comenzando desde cero, puede iniciar con Lógica de Programación para desarrollar las bases y luego continuar con Python Nivel 1.',
        links: [logic, python].filter((course): course is PublicCourse => Boolean(course)).map((course) => ({ label: `Ver ${course.title}`, href: course.href })),
      }
    }

    if (hasAny(question, ['certificado', 'certificacion', 'diploma'])) {
      return {
        text: 'Al completar un curso, el estudiante puede recibir un certificado de participación emitido por COA. También puede verificar públicamente un certificado mediante su código.',
        links: [{ label: 'Verificar certificado', href: '/certificados' }],
      }
    }

    if (hasAny(question, ['grabada', 'grabadas', 'grabacion', 'grabaciones'])) {
      return {
        text: 'Las clases se realizan de forma virtual. En algunos cursos las sesiones pueden quedar grabadas; para confirmar un curso específico debe consultarlo con un asesor.',
        links: [{ label: 'Consultar por WhatsApp', href: createWhatsAppLink(`Hola, quisiera confirmar si las clases quedan grabadas para este curso: ${rawQuestion}`), external: true }],
      }
    }

    const matches = matchingCourses(question)
    const asksPrice = hasAny(question, ['precio', 'precios', 'cuanto cuesta', 'costo', 'valor', 'gratis', 'gratuito'])
    const asksDuration = hasAny(question, ['duracion', 'cuanto dura', 'cuanto duran', 'horas', 'semanas'])
    const asksModality = hasAny(question, ['modalidad', 'modalidades', 'virtual', 'autodidacta', 'en vivo', 'presencial'])

    if (matches.length === 1 && asksPrice) {
      const course = matches[0]
      return { text: `${course.title} tiene un precio publicado de ${price(course)}.`, links: [{ label: 'Ver curso', href: course.href }] }
    }
    if (matches.length === 1 && asksDuration) {
      const course = matches[0]
      return { text: `${course.title} tiene una duración publicada de ${course.duration}.`, links: [{ label: 'Ver curso', href: course.href }] }
    }
    if (matches.length === 1 && asksModality) {
      const course = matches[0]
      return { text: `La modalidad publicada de ${course.title} es ${course.modality}.`, links: [{ label: 'Ver curso', href: course.href }] }
    }
    if (matches.length === 1) {
      const course = matches[0]
      return {
        text: `${course.title}: duración ${course.duration}, modalidad ${course.modality} y precio ${price(course)}.`,
        links: [{ label: 'Ver curso', href: course.href }, { label: 'Inscribirme', href: course.enrollmentHref }],
      }
    }
    if (matches.length > 1) {
      return {
        text: 'Encontré más de un curso relacionado. ¿Sobre cuál desea consultar?',
        links: matches.map((course) => ({ label: course.title, href: course.href })),
        suggestions: ['Ver cursos', 'Precios', 'Modalidades'],
      }
    }

    if (asksPrice) {
      const free = publicCourses.filter((course) => normalizeQuestion(course.price) === 'gratis')
      if (hasAny(question, ['gratis', 'gratuito'])) {
        return {
          text: `Actualmente el catálogo muestra como gratuitos: ${free.map((course) => course.title).join(', ')}.`,
          links: free.map((course) => ({ label: course.title, href: course.href })),
        }
      }
      return {
        text: `Estos son los precios publicados: ${publicCourses.map((course) => `${course.title}: ${price(course)}`).join('; ')}.`,
        links: [{ label: 'Ver catálogo', href: '/#cursos' }],
      }
    }

    if (asksModality) {
      return {
        text: 'COA ofrece cursos autodidactas y cursos en vivo, según el curso. La modalidad exacta aparece en cada ficha pública.',
        links: [{ label: 'Ver cursos', href: '/#cursos' }],
      }
    }

    if (asksDuration) {
      return {
        text: 'La duración depende del curso. Puede indicarme el nombre del curso o consultar su ficha pública.',
        suggestions: publicCourses.slice(0, 4).map((course) => course.title),
      }
    }

    if (hasAny(question, ['inscribir', 'inscribo', 'inscripcion', 'matricula', 'matricular'])) {
      return {
        text: 'Abra la ficha del curso que le interesa y seleccione “Inscribirme”. El flujo disponible depende de la modalidad de ese curso.',
        links: [{ label: 'Ver cursos', href: '/#cursos' }],
      }
    }

    if (hasAny(question, ['curso', 'cursos', 'que ofrecen', 'que tienen', 'catalogo'])) {
      return {
        text: `El catálogo actual incluye: ${publicCourses.map((course) => course.title).join(', ')}.`,
        links: [{ label: 'Ver catálogo', href: '/#cursos' }],
      }
    }

    return whatsappResponse(rawQuestion.trim())
  }
}

export const localChatResponder = new LocalChatResponder()

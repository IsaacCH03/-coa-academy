import { courseEnrollmentHref, courses } from '@/lib/courses'

export const publicCourses = courses
  .filter((course) => !course.comingSoon)
  .map((course) => ({
    slug: course.slug,
    title: course.title,
    price: course.price,
    billing: course.billing,
    duration: course.duration,
    modality: course.modality ?? (course.deliveryMode === 'live_group' ? 'En vivo' : 'Virtual'),
    href: `/cursos/${course.slug}`,
    enrollmentHref: courseEnrollmentHref(course),
  }))

export type PublicCourse = (typeof publicCourses)[number]

export const quickQuestions = [
  'Ver cursos',
  'Precios',
  'Modalidades',
  'Certificados',
  'Inscripciones',
  'Hablar con un asesor',
]

export const initialAssistantMessage =
  '¡Hola! Bienvenido a COA – Cursos Online Avanzados. Soy el asistente virtual y puedo ayudarle con información sobre nuestros cursos, precios, modalidades, certificados e inscripciones. ¿Qué le gustaría saber?'

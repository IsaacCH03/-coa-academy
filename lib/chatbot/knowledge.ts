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
    description: course.description,
    learn: course.learn,
    modules: course.modules,
    deliveryMode: course.deliveryMode,
  }))

export type PublicCourse = (typeof publicCourses)[number]

export type KnowledgeStatus = 'stable' | 'dynamic' | 'human-review'

export type KnowledgeEntry = {
  id: string
  topic: string
  status: KnowledgeStatus
  answer: string
}

export const coaKnowledge: KnowledgeEntry[] = [
  { id: 'institution', topic: 'COA', status: 'stable', answer: 'COA – Cursos Online Avanzados es un proyecto educativo costarricense enfocado en cursos de programación y tecnología. Ofrece formación virtual, talleres y contenidos educativos para distintos niveles.' },
  { id: 'certificates', topic: 'Certificados', status: 'stable', answer: 'Los certificados son emitidos por COA como constancia de participación o finalización. No son títulos universitarios ni implican acreditación externa.' },
  { id: 'scholarships', topic: 'Becas parciales', status: 'human-review', answer: 'COA ha comunicado un programa de becas parciales para personas a quienes se les dificulta cubrir el costo completo. Cada solicitud se revisa individualmente y no existe aprobación automática.' },
  { id: 'payment-methods', topic: 'Métodos de pago', status: 'human-review', answer: 'COA ha recibido pagos mediante SINPE Móvil o transferencia bancaria. Los datos vigentes y cualquier comprobante deben confirmarse directamente con un asesor.' },
]

export function knowledge(id: string) {
  return coaKnowledge.find((entry) => entry.id === id)!
}

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

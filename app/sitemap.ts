import type { MetadataRoute } from 'next'
import { certificados } from '@/data/certificados'
import { courses } from '@/lib/courses'
import { PUBLIC_ORIGIN } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  // Match the public course page's availability check. No private database reads.
  const paths = [
    '/',
    '/experiencia-profesional',
    '/certificados',
    '/ide',
    '/terminos-y-condiciones',
    ...courses.filter((course) => !course.comingSoon)
      .map((course) => `/cursos/${encodeURIComponent(course.slug)}`),
    ...certificados.map(({ codigo }) => `/certificados/${encodeURIComponent(codigo)}`),
  ]

  return paths.map((path) => ({ url: `${PUBLIC_ORIGIN}${path}` }))
}

import type { MetadataRoute } from 'next'
import { PUBLIC_ORIGIN } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Prefixes also cover the route itself without a trailing slash.
      disallow: [
        '/admin',
        '/mi-coa',
        '/cuenta',
        '/api',
        '/auth',
        '/inscripcion',
        '/cursos/*/curso',
        '/cursos/*/inscripcion',
      ],
    },
    host: PUBLIC_ORIGIN,
    sitemap: `${PUBLIC_ORIGIN}/sitemap.xml`,
  }
}

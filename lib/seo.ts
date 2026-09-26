import type { Metadata } from 'next'

export const PUBLIC_ORIGIN = 'https://www.cursoscoa.com'

const DEFAULT_SOCIAL_IMAGE = '/coa-logo.png'

export function createPublicMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'es_CR',
      siteName: 'C.O.A | Cursos Online Avanzados',
      url: path,
      title,
      description,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: 'C.O.A Cursos Online Avanzados' }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  }
}

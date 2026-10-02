import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { CoursesSection } from '@/components/courses-section'
import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { createPublicMetadata, PUBLIC_ORIGIN } from '@/lib/seo'
import { site } from '@/lib/site'
import { ContinueLearningSection } from '@/components/continue-learning-section'
import { PublicLiveGroupBanners } from '@/components/public-live-group-banners'
import { getPublicLiveGroups } from '@/lib/public-live-groups'

const title = 'C.O.A | Cursos Online Avanzados'
const description =
  'Academia de programación online (C.O.A). Aprende Python, desarrollo web, bases de datos e inteligencia artificial con cursos prácticos y proyectos reales.'

export const metadata: Metadata = createPublicMetadata({ title, description, path: '/' })

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: `${site.name} ${site.fullName}`,
  alternateName: site.name,
  url: PUBLIC_ORIGIN,
  logo: `${PUBLIC_ORIGIN}/coa-logo.png`,
  email: site.email,
  sameAs: [site.facebookUrl],
}

export default async function HomePage() {
  const publicGroups=await getPublicLiveGroups()
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <PublicLiveGroupBanners groups={publicGroups} />
        <ContinueLearningSection />
        <CoursesSection publicGroups={publicGroups} />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </div>
  )
}

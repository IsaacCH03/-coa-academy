import type { Metadata } from 'next'
import { CertificatesPage } from '@/components/certificates-page'
import { createPublicMetadata } from '@/lib/seo'

export const metadata: Metadata = createPublicMetadata({ title: 'Verificar certificado | COA – Cursos Online Avanzados', description: 'Verifica la validez y la información pública de un certificado emitido por C.O.A.', path: '/certificados' })

export default function CertificateSearchPage() { return <CertificatesPage /> }

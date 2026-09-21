import type { Metadata } from 'next'
import { CertificatesPage } from '@/components/certificates-page'

export const metadata: Metadata = { title: 'Verificar certificado | COA – Cursos Online Avanzados', description: 'Verifica la validez y la información pública de un certificado emitido por C.O.A.' }

export default function CertificateSearchPage() { return <CertificatesPage /> }

import type { Metadata } from 'next'
import { CertificatesPage } from '@/components/certificates-page'
import { certificados } from '@/data/certificados'
import { findCertificate } from '@/lib/certificates'
import { redirect } from 'next/navigation'
import { createPublicMetadata } from '@/lib/seo'

export function generateStaticParams() { return certificados.map(({codigo})=>({codigo})) }

export async function generateMetadata({params}:{params:Promise<{codigo:string}>}): Promise<Metadata> {
  const {codigo}=await params
  const certificate=findCertificate(codigo)
  if (!certificate) return { ...createPublicMetadata({ title: 'Certificado no encontrado | C.O.A.', description: 'Consulta la validez de un certificado emitido por C.O.A.', path: '/certificados' }), robots: { index: false, follow: true } }
  return createPublicMetadata({ title: `Certificado ${certificate.codigo} | C.O.A.`, description: 'Consulta directamente un certificado emitido por C.O.A. mediante su código.', path: `/certificados/${encodeURIComponent(certificate.codigo)}` })
}

export default async function CertificateCodePage({params}:{params:Promise<{codigo:string}>}) {
  const {codigo}=await params
  const certificate=findCertificate(codigo)
  if(certificate&&codigo!==certificate.codigo)redirect(`/certificados/${encodeURIComponent(certificate.codigo)}`)
  return <CertificatesPage initialCode={codigo} />
}

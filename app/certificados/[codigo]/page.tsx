import type { Metadata } from 'next'
import { CertificatesPage } from '@/components/certificates-page'
import { certificados } from '@/data/certificados'
import { findCertificate } from '@/lib/certificates'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Verificar certificado | COA – Cursos Online Avanzados', description: 'Consulta directamente un certificado emitido por C.O.A. mediante su código.' }
export function generateStaticParams() { return certificados.map(({codigo})=>({codigo})) }

export default async function CertificateCodePage({params}:{params:Promise<{codigo:string}>}) {
  const {codigo}=await params
  const certificate=findCertificate(codigo)
  if(certificate&&codigo!==certificate.codigo)redirect(`/certificados/${encodeURIComponent(certificate.codigo)}`)
  return <CertificatesPage initialCode={codigo} />
}

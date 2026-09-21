import { certificados } from '@/data/certificados'

export type EstadoCertificado = 'valido' | 'revocado'
export type Certificado = {
  codigo: string
  nombre: string
  curso: string
  modalidad: string
  fechaEmision: string
  estado: EstadoCertificado
}

export function normalizeCertificateCode(code: string) {
  return code.trim().toUpperCase()
}

export function validateUniqueCertificateCodes(items: readonly Certificado[]) {
  const seen = new Set<string>()
  for (const certificate of items) {
    const code = normalizeCertificateCode(certificate.codigo)
    if (seen.has(code)) throw new Error(`Código de certificado duplicado: ${code}`)
    seen.add(code)
  }
  return items
}

validateUniqueCertificateCodes(certificados)

export function findCertificate(code: string) {
  const normalized = normalizeCertificateCode(code)
  if (!normalized) return undefined
  return certificados.find((certificate) => normalizeCertificateCode(certificate.codigo) === normalized)
}

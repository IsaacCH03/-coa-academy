import { expect, it } from 'vitest'
import { findCertificate, normalizeCertificateCode, validateUniqueCertificateCodes, type Certificado } from './certificates'

const sample:Certificado={codigo:'COA-X-1',nombre:'Persona',curso:'Curso',modalidad:'Virtual',fechaEmision:'21/09/2026',estado:'valido'}

it('normalizes only surrounding whitespace and letter case',()=>{
  expect(normalizeCertificateCode('  coa-pyb-2026-0001  ')).toBe('COA-PYB-2026-0001')
  expect(normalizeCertificateCode('coa pyb-1')).toBe('COA PYB-1')
})
it('finds the public certificate case-insensitively',()=>{
  expect(findCertificate(' coa-pyb-2026-0001 ')?.nombre).toBe('Evelio Josué H. Bezpowy')
  expect(findCertificate('NO-EXISTE')).toBeUndefined()
})
it('detects duplicate codes after normalization',()=>{
  expect(()=>validateUniqueCertificateCodes([sample,{...sample,codigo:' coa-x-1 '}])).toThrow('Código de certificado duplicado: COA-X-1')
})
it('accepts unique valid and revoked certificates',()=>{
  expect(validateUniqueCertificateCodes([sample,{...sample,codigo:'COA-X-2',estado:'revocado'}])).toHaveLength(2)
})

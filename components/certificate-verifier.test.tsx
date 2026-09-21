// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { CertificateResult, CertificateVerifier } from './certificate-verifier'

afterEach(cleanup)

it('validates empty input and preserves an unknown code',()=>{
  render(<CertificateVerifier />)
  fireEvent.click(screen.getByRole('button',{name:'Verificar certificado'}))
  expect(screen.getByRole('alert').textContent).toContain('Ingresa el código')
  const input=screen.getByLabelText('Código del certificado')
  fireEvent.change(input,{target:{value:'  desconocido-1  '}})
  fireEvent.click(screen.getByRole('button',{name:'Verificar certificado'}))
  expect(screen.getByRole('status').textContent).toContain('No encontramos')
  expect((input as HTMLInputElement).value).toBe('  desconocido-1  ')
})
it('uses Enter and finds a lowercase code with surrounding spaces',()=>{
  render(<CertificateVerifier />)
  const input=screen.getByLabelText('Código del certificado')
  fireEvent.change(input,{target:{value:' coa-pyb-2026-0001 '}})
  fireEvent.submit(input.closest('form')!)
  expect(screen.getByTestId('certificate-result').textContent).toContain('Evelio Josué H. Bezpowy')
  expect(screen.getByTestId('certificate-result').textContent).toContain('Estado: Válido')
})
it('automatically verifies valid and invalid direct URL codes',()=>{
  const {unmount}=render(<CertificateVerifier initialCode="COA-PYB-2026-0001" />)
  expect(screen.getByTestId('certificate-result')).toBeTruthy()
  unmount()
  render(<CertificateVerifier initialCode="COA-NO-EXISTE" />)
  expect(screen.getByRole('status').textContent).toContain('No encontramos')
})
it('never presents a revoked certificate as valid',()=>{
  render(<CertificateResult certificate={{codigo:'COA-R-1',nombre:'Persona',curso:'Curso',modalidad:'Virtual',fechaEmision:'21/09/2026',estado:'revocado'}} />)
  const result=screen.getByTestId('certificate-result')
  expect(result.textContent).toContain('Certificado encontrado')
  expect(result.textContent).toContain('Estado: Revocado')
  expect(result.textContent).not.toContain('Certificado verificado')
})

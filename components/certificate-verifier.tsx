'use client'

import { FormEvent, useState } from 'react'
import { Award, BadgeCheck, Search, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { findCertificate, normalizeCertificateCode, type Certificado } from '@/lib/certificates'

type Result = { kind: 'idle' } | { kind: 'empty' } | { kind: 'missing'; code: string } | { kind: 'found'; certificate: Certificado }

function initialResult(code: string): Result {
  const normalized = normalizeCertificateCode(code)
  if (!normalized) return { kind: 'idle' }
  const certificate = findCertificate(normalized)
  return certificate ? { kind: 'found', certificate } : { kind: 'missing', code: normalized }
}

export function CertificateVerifier({ initialCode = '' }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode)
  const [result, setResult] = useState<Result>(() => initialResult(initialCode))

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = normalizeCertificateCode(code)
    if (!normalized) { setResult({ kind: 'empty' }); return }
    const certificate = findCertificate(normalized)
    setResult(certificate ? { kind: 'found', certificate } : { kind: 'missing', code: normalized })
  }

  return <div className="mx-auto w-full max-w-4xl">
    <form onSubmit={verify} className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-primary/5 sm:p-9">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Search className="h-6 w-6" /></span>
        <h2 className="mt-4 text-2xl font-extrabold text-card-foreground">Verifica tu certificado</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">Ingresa el código de tu certificado para consultar su información y comprobar su validez.</p>
      </div>
      <div className="mx-auto mt-7 max-w-xl">
        <label htmlFor="certificate-code" className="text-sm font-semibold text-foreground">Código del certificado</label>
        <input id="certificate-code" value={code} onChange={(event)=>setCode(event.target.value)} placeholder="Ej. COA-PYB-2026-0001" autoComplete="off" spellCheck={false} aria-describedby={result.kind==='empty'?'certificate-error':undefined} aria-invalid={result.kind==='empty'} className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-4 font-medium uppercase tracking-wide text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
        {result.kind==='empty'&&<p id="certificate-error" role="alert" className="mt-2 text-sm font-medium text-destructive">Ingresa el código del certificado.</p>}
        <Button type="submit" size="lg" className="mt-5 w-full gap-2 bg-primary font-bold hover:bg-primary/90"><Search className="h-4 w-4" />Verificar certificado</Button>
      </div>
    </form>

    <div className="mt-8" aria-live="polite">
      {result.kind==='missing'&&<div role="status" className="rounded-3xl border border-accent/50 bg-accent/10 p-7 text-center sm:p-9"><ShieldX className="mx-auto h-10 w-10 text-accent-foreground" /><h2 className="mt-4 text-xl font-extrabold">No encontramos un certificado con ese código.</h2><p className="mt-2 text-muted-foreground">Revisa que el código esté escrito correctamente e inténtalo nuevamente.</p><p className="mt-4 break-all font-semibold text-foreground">{result.code}</p></div>}
      {result.kind==='found'&&<CertificateResult certificate={result.certificate} />}
    </div>
  </div>
}

export function CertificateResult({ certificate }: { certificate: Certificado }) {
  const valid=certificate.estado==='valido'
  const fields=[['Nombre',certificate.nombre],['Curso',certificate.curso],['Modalidad',certificate.modalidad],['Fecha de emisión',certificate.fechaEmision],['Código del certificado',certificate.codigo],['Emitido por','COA – Cursos Online Avanzados']]
  return <article data-testid="certificate-result" className={`overflow-hidden rounded-3xl border bg-card shadow-lg ${valid?'border-primary/30':'border-destructive/40'}`}>
    <header className={`flex flex-col items-center gap-3 px-6 py-7 text-center sm:flex-row sm:text-left ${valid?'bg-primary text-primary-foreground':'bg-destructive text-white'}`}>
      {valid?<BadgeCheck className="h-11 w-11 shrink-0" />:<ShieldX className="h-11 w-11 shrink-0" />}
      <div><p className="text-xs font-bold uppercase tracking-[0.2em]">{valid?'Certificado verificado':'Certificado encontrado'}</p><h2 className="mt-1 text-2xl font-extrabold">{certificate.nombre}</h2></div>
      <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold sm:ml-auto">Estado: {valid?'Válido':'Revocado'}</span>
    </header>
    <div className="grid gap-px bg-border sm:grid-cols-2">{fields.map(([label,value])=><div key={label} className="min-w-0 bg-card p-5"><dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-semibold text-card-foreground">{value}</dd></div>)}</div>
    <footer className="flex items-center justify-center gap-2 border-t border-border bg-secondary/60 px-5 py-4 text-sm font-semibold text-secondary-foreground"><Award className="h-5 w-5 text-primary" />Información pública de certificación C.O.A.</footer>
  </article>
}

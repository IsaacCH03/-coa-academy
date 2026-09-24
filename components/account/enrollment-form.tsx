'use client'

import { useActionState } from 'react'
import { enrollInCourseAction } from '@/app/inscripcion/actions'
import { initialEnrollmentState, type AcademicProfile } from '@/lib/academic'
import { isSupportedCountry, supportedCountries } from '@/lib/countries'

export function EnrollmentForm({ slug, profileComplete, profile }: { slug: string; profileComplete: boolean; profile: AcademicProfile }) {
  const [state, action, pending] = useActionState(enrollInCourseAction, initialEnrollmentState)
  const selectedCountry = profile.country && isSupportedCountry(profile.country) ? profile.country : 'Costa Rica'
  return <form action={action} className="mt-6 space-y-5">
    <input type="hidden" name="slug" value={slug} />
    {!profileComplete && <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-foreground">Identificación o cédula<input name="identification" defaultValue={profile.identification ?? ''} required maxLength={40} autoComplete="off" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 font-normal outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" /></label>
      <label className="text-sm font-semibold text-foreground">País<select name="country" defaultValue={selectedCountry} required autoComplete="country-name" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 font-normal outline-none focus:border-primary focus:ring-3 focus:ring-primary/15">{supportedCountries.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
      <label className="text-sm font-semibold text-foreground sm:col-span-2">Teléfono<input name="phone" defaultValue={profile.phone ?? ''} required maxLength={30} autoComplete="tel" inputMode="tel" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 font-normal outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" /></label>
    </div>}
    {state.message && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{state.message}</p>}
    <button disabled={pending} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">{pending ? 'Confirmando matrícula…' : 'Confirmar inscripción'}</button>
  </form>
}

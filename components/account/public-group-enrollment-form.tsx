'use client'
import { useActionState } from 'react'
import { joinPublicGroupAction } from '@/app/inscripcion/grupo/actions'
import { initialEnrollmentState, type AcademicProfile } from '@/lib/academic'
import { isSupportedCountry, supportedCountries } from '@/lib/countries'

export function PublicGroupEnrollmentForm({groupId,slug,profile,profileComplete}:{groupId:string;slug:string;profile:AcademicProfile;profileComplete:boolean}){
  const[state,action,pending]=useActionState(joinPublicGroupAction,initialEnrollmentState)
  const selected=profile.country&&isSupportedCountry(profile.country)?profile.country:'Costa Rica'
  return <form action={action} className="mt-6 space-y-5"><input type="hidden" name="group_id" value={groupId}/><input type="hidden" name="slug" value={slug}/>{!profileComplete&&<div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Identificación o cédula<input name="identification" defaultValue={profile.identification??''} required maxLength={40} className="mt-2 h-11 w-full rounded-xl border bg-background px-3 font-normal"/></label><label className="text-sm font-semibold">País<select name="country" defaultValue={selected} className="mt-2 h-11 w-full rounded-xl border bg-background px-3 font-normal">{supportedCountries.map(country=><option key={country}>{country}</option>)}</select></label><label className="text-sm font-semibold sm:col-span-2">Teléfono<input name="phone" defaultValue={profile.phone??''} required maxLength={30} className="mt-2 h-11 w-full rounded-xl border bg-background px-3 font-normal"/></label></div>}{state.message&&<p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{state.message}</p>}<button disabled={pending} className="h-11 w-full rounded-xl bg-primary px-5 font-bold text-primary-foreground disabled:opacity-60">{pending?'Confirmando inscripción…':'Confirmar inscripción'}</button></form>
}

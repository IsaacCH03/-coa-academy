import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from './types'

export const getCurrentAccount = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, updated_at')
    .eq('id', user.id)
    .single<Profile>()

  if (error || !profile) return null
  return { user, profile }
})

export async function requireAccount() {
  const account = await getCurrentAccount()
  if (!account) redirect('/cuenta/iniciar-sesion')
  return account
}

export async function requireAdmin() {
  const account = await requireAccount()
  if (account.profile.role !== 'admin') redirect('/mi-coa?sin-permiso=admin')
  return account
}

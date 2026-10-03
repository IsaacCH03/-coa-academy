import { getCurrentAccount } from '@/lib/auth/session'
import { SiteHeaderClient } from './site-header-client'

export async function SiteHeader() {
  const account = await getCurrentAccount()
  let avatarUrl: string | null = null
  if (account?.profile.avatar_path) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    avatarUrl = (await supabase.storage.from('phase3-media').createSignedUrl(account.profile.avatar_path, 3600)).data?.signedUrl ?? null
  }
  return <SiteHeaderClient account={account ? { fullName: account.profile.full_name, role: account.profile.role, avatarUrl } : null} />
}

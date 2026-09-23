import { getCurrentAccount } from '@/lib/auth/session'
import { SiteHeaderClient } from './site-header-client'

export async function SiteHeader() {
  const account = await getCurrentAccount()
  return <SiteHeaderClient account={account ? { fullName: account.profile.full_name, role: account.profile.role } : null} />
}

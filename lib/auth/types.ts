export type UserRole = 'student' | 'admin'

export type Profile = {
  id: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type AuthActionState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  fields?: Record<string, string>
}

export const initialAuthState: AuthActionState = { status: 'idle' }

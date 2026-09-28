import { describe, expect, it, vi } from 'vitest'
import { logSupabaseError, supabaseErrorDetails } from './supabase-error-log'

describe('Supabase error logging', () => {
  it('preserves StorageApiError fields', () => {
    expect(supabaseErrorDetails({
      message: 'new row violates row-level security policy',
      statusCode: '403',
      status: 403,
      error: 'Unauthorized',
      name: 'StorageApiError',
    })).toMatchObject({
      message: 'new row violates row-level security policy',
      statusCode: '403',
      status: 403,
      error: 'Unauthorized',
      name: 'StorageApiError',
    })
  })

  it('does not write diagnostic details in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    logSupabaseError('upload-cover', { message: 'private detail' })
    expect(spy).not.toHaveBeenCalled()
    vi.unstubAllEnvs()
    spy.mockRestore()
  })
})

type SupabaseErrorLike = {
  code?: unknown
  message?: unknown
  details?: unknown
  hint?: unknown
  status?: unknown
  statusCode?: unknown
  error?: unknown
  name?: unknown
}

export function supabaseErrorDetails(error: SupabaseErrorLike | null | undefined) {
  return {
    message: error?.message,
    statusCode: error?.statusCode,
    status: error?.status,
    error: error?.error,
    name: error?.name,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
  }
}

export function logSupabaseError(
  operation: string,
  error: SupabaseErrorLike | null | undefined,
  context?: Record<string, unknown>,
) {
  if (process.env.NODE_ENV === 'production') return
  console.error(`[${operation}]`, { ...supabaseErrorDetails(error), ...context })
}

import { cookies } from 'next/headers'
import {
  assertOrigin,
  cookieOptions,
  githubConfigured,
  githubJson,
  githubRequest,
  githubToken,
} from '@/lib/ide/github-server'
export async function GET() {
  if (!githubConfigured())
    return githubJson({ configured: false, connected: false })
  try {
    const user = await githubRequest<{ login: string }>(
      await githubToken(),
      '/user',
    )
    return githubJson({ configured: true, connected: true, login: user.login })
  } catch {
    return githubJson({ configured: true, connected: false })
  }
}
export async function DELETE(request: Request) {
  try {
    assertOrigin(request)
    ;(await cookies()).set('coa-gh', '', { ...cookieOptions(), maxAge: 0 })
    return githubJson({ disconnected: true })
  } catch {
    return githubJson({ error: 'No se pudo cerrar la sesión.' }, 403)
  }
}

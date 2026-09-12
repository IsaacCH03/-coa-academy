import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto'
import { cookies } from 'next/headers'

export function githubConfigured() {
  return !!(
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    process.env.COA_SESSION_SECRET &&
    process.env.COA_SESSION_SECRET.length >= 32 &&
    process.env.COA_APP_URL
  )
}
export function appOrigin() {
  const url = new URL(process.env.COA_APP_URL ?? 'http://localhost:3000')
  if (
    url.protocol !== 'https:' &&
    !['localhost', '127.0.0.1'].includes(url.hostname)
  )
    throw new Error('COA_APP_URL debe usar HTTPS.')
  return url.origin
}
export const cookieOptions = () => ({
  httpOnly: true,
  secure: appOrigin().startsWith('https:'),
  sameSite: 'lax' as const,
  path: '/api/ide/github',
  maxAge: 8 * 60 * 60,
})
export function seal(value: Record<string, unknown>) {
  const key = createHash('sha256')
    .update(process.env.COA_SESSION_SECRET!)
    .digest()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ])
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    'base64url',
  )
}
export function unseal(value: string): Record<string, unknown> | null {
  try {
    const bytes = Buffer.from(value, 'base64url')
    const key = createHash('sha256')
      .update(process.env.COA_SESSION_SECRET!)
      .digest()
    const decipher = createDecipheriv('aes-256-gcm', key, bytes.subarray(0, 12))
    decipher.setAuthTag(bytes.subarray(12, 28))
    const result = JSON.parse(
      Buffer.concat([
        decipher.update(bytes.subarray(28)),
        decipher.final(),
      ]).toString(),
    )
    return typeof result.exp === 'number' && result.exp > Date.now()
      ? result
      : null
  } catch {
    return null
  }
}
export async function githubToken() {
  if (!githubConfigured())
    throw new Error('Configura GitHub para conectar tu cuenta.')
  const session = unseal((await cookies()).get('coa-gh')?.value ?? '')
  if (typeof session?.token !== 'string')
    throw new Error('Conecta de nuevo tu cuenta de GitHub.')
  return session.token
}
export function assertOrigin(request: Request) {
  if (request.headers.get('origin') !== appOrigin())
    throw new Error('Origen de solicitud no permitido.')
}

export async function limitedRequestText(
  request: Request,
  limit = 10 * 1024 * 1024,
) {
  if (Number(request.headers.get('content-length')) > limit)
    throw new Error('El proyecto es demasiado grande.')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Falta el proyecto.')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new Error('El proyecto es demasiado grande.')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks).toString('utf8')
}
export async function githubRequest<T>(
  token: string,
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const response = await fetch('https://api.github.com' + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok)
    throw new Error(
      response.status === 409 || response.status === 422
        ? 'GitHub detectó un conflicto. Revisa el nombre y actualiza el repositorio antes de volver a subir.'
        : response.status === 401
          ? 'La sesión de GitHub venció. Conecta tu cuenta de nuevo.'
          : `GitHub no pudo completar la operación (${response.status}). Revisa permisos y conexión.`,
    )
  return response.status === 204 ? (undefined as T) : response.json()
}
export const githubJson = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
export function repositoryPath(fullName: string) {
  if (
    !/^[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(fullName) ||
    fullName.endsWith('/..')
  )
    throw new Error('Escribe el repositorio como usuario/nombre.')
  return '/repos/' + fullName
}

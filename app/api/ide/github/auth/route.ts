import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  appOrigin,
  cookieOptions,
  githubConfigured,
  githubJson,
  seal,
} from '@/lib/ide/github-server'
export async function GET() {
  if (!githubConfigured())
    return githubJson(
      { error: 'Configura GitHub para conectar tu cuenta.' },
      503,
    )
  const state = randomBytes(32).toString('hex')
  const verifier = randomBytes(32).toString('base64url')
  ;(await cookies()).set(
    'coa-gh-flow',
    seal({ state, verifier, exp: Date.now() + 600000 }),
    { ...cookieOptions(), maxAge: 600 },
  )
  const url = new URL('https://github.com/login/oauth/authorize')
  url.search = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: appOrigin() + '/api/ide/github/callback',
    scope: 'repo',
    state,
    code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    code_challenge_method: 'S256',
  }).toString()
  return NextResponse.redirect(url)
}

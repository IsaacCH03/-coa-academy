import { timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  appOrigin,
  cookieOptions,
  githubConfigured,
  seal,
  unseal,
} from '@/lib/ide/github-server'
export async function GET(request: Request) {
  const jar = await cookies()
  const flow = unseal(jar.get('coa-gh-flow')?.value ?? '')
  jar.set('coa-gh-flow', '', { ...cookieOptions(), maxAge: 0 })
  const params = new URL(request.url).searchParams
  const state = params.get('state') ?? ''
  try {
    if (
      !githubConfigured() ||
      typeof flow?.state !== 'string' ||
      typeof flow.verifier !== 'string' ||
      state.length !== flow.state.length ||
      !timingSafeEqual(Buffer.from(state), Buffer.from(flow.state)) ||
      !params.get('code')
    )
      throw new Error('Invalid OAuth state')
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: params.get('code'),
          redirect_uri: appOrigin() + '/api/ide/github/callback',
          code_verifier: flow.verifier,
        }),
        signal: AbortSignal.timeout(20000),
      },
    )
    const result = await response.json()
    if (!response.ok || typeof result.access_token !== 'string')
      throw new Error('OAuth failed')
    jar.set(
      'coa-gh',
      seal({
        token: result.access_token,
        exp: Date.now() + 8 * 60 * 60 * 1000,
      }),
      cookieOptions(),
    )
    return NextResponse.redirect(appOrigin() + '/ide?github=connected')
  } catch {
    return NextResponse.redirect(appOrigin() + '/ide?github=error')
  }
}

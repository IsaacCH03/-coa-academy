'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { AuthActionState } from '@/lib/auth/types'
import { initialAuthState } from '@/lib/auth/types'
import { CaptchaField } from './captcha-field'

type Field = {
  name: string
  label: string
  type: 'text' | 'email' | 'password'
  autoComplete: string
  placeholder?: string
}

export function AuthForm({
  action,
  fields,
  submitLabel,
  pendingLabel,
  captcha = false,
  footer,
}: {
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>
  fields: Field[]
  submitLabel: string
  pendingLabel: string
  captcha?: boolean
  footer?: React.ReactNode
}) {
  const [state, formAction, pending] = useActionState(action, initialAuthState)
  return (
    <form action={formAction} className="space-y-5">
      {fields.map((field) => (
        <label key={field.name} className="block text-sm font-semibold text-foreground">
          {field.label}
          <input
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            defaultValue={state.fields?.[field.name] || ''}
            required
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
          />
        </label>
      ))}
      {state.message && (
        <div role={state.status === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${state.status === 'error' ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}>
          {state.message}
        </div>
      )}
      {captcha && <CaptchaField resetKey={state} />}
      <button disabled={pending} className="h-11 w-full rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">
        {pending ? pendingLabel : submitLabel}
      </button>
      {footer}
    </form>
  )
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="font-semibold text-primary hover:underline">{children}</Link>
}

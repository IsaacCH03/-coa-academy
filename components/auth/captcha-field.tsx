'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'

const turnstileScript = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileOptions = {
  sitekey: string
  theme: 'light'
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
  'timeout-callback': () => void
  'response-field': true
  'response-field-name': 'cf-turnstile-response'
}

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export function CaptchaField({ resetKey }: { resetKey?: unknown }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const mountedRef = useRef(false)
  const previousResetKey = useRef(resetKey)
  const [loadError, setLoadError] = useState(false)

  const invalidateAndReset = useCallback(() => {
    const widgetId = widgetIdRef.current
    if (widgetId && window.turnstile) window.turnstile.reset(widgetId)
  }, [])

  const renderWidget = useCallback(() => {
    const container = containerRef.current
    const turnstile = window.turnstile
    if (!siteKey || !container?.isConnected || !turnstile || widgetIdRef.current) return

    setLoadError(false)
    widgetIdRef.current = turnstile.render(container, {
      sitekey: siteKey,
      theme: 'light',
      callback: () => setLoadError(false),
      'expired-callback': invalidateAndReset,
      'error-callback': () => {
        setLoadError(true)
        invalidateAndReset()
      },
      'timeout-callback': invalidateAndReset,
      'response-field': true,
      'response-field-name': 'cf-turnstile-response',
    })
  }, [invalidateAndReset, siteKey])

  useEffect(() => {
    mountedRef.current = true
    renderWidget()
    return () => {
      mountedRef.current = false
      const widgetId = widgetIdRef.current
      widgetIdRef.current = null
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [renderWidget])

  useEffect(() => {
    if (previousResetKey.current === resetKey) return
    previousResetKey.current = resetKey
    if (!mountedRef.current) return
    setLoadError(false)
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current)
    else renderWidget()
  }, [renderWidget, resetKey])

  if (!siteKey) {
    return <p role="alert" className="text-sm text-destructive">La verificación de seguridad no está disponible. Recarga la página para intentarlo de nuevo.</p>
  }

  return <div className="min-h-[70px]">
    <Script
      id="cloudflare-turnstile"
      src={turnstileScript}
      strategy="afterInteractive"
      onReady={renderWidget}
      onError={() => setLoadError(true)}
    />
    <div ref={containerRef} data-testid="turnstile-container" />
    {loadError && <p role="alert" className="mt-2 text-sm text-destructive">No se pudo cargar la verificación de seguridad. Recarga la página para intentarlo de nuevo.</p>}
  </div>
}

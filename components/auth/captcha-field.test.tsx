// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CaptchaField } from './captcha-field'

vi.mock('next/script', () => ({
  default: ({ onReady, onError }: { onReady?: () => void; onError?: () => void }) => <>
    <button data-testid="load-script" onClick={onReady}>load</button>
    <button data-testid="fail-script" onClick={onError}>fail</button>
  </>,
}))

const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

beforeEach(() => {
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key'
  delete window.turnstile
})

afterEach(() => {
  cleanup()
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey
  delete window.turnstile
})

it('renders when the script becomes ready after the component mounts', () => {
  const renderWidget = vi.fn((container: HTMLElement, options: { sitekey: string; [key: string]: unknown }) => {
    void container
    void options
    return 'widget-1'
  })
  render(<CaptchaField />)
  window.turnstile = { render: renderWidget, reset: vi.fn(), remove: vi.fn() }

  fireEvent.click(screen.getByTestId('load-script'))

  expect(renderWidget).toHaveBeenCalledOnce()
  expect(renderWidget.mock.calls[0][0]).toBe(screen.getByTestId('turnstile-container'))
  expect(renderWidget.mock.calls[0][1]).toMatchObject({
    sitekey: 'test-site-key',
    'response-field': true,
    'response-field-name': 'cf-turnstile-response',
  })
})

it('uses an already loaded API, resets after an action and removes the widget on unmount', () => {
  const reset = vi.fn()
  const remove = vi.fn()
  window.turnstile = { render: vi.fn(() => 'widget-2'), reset, remove }

  const view = render(<CaptchaField resetKey="initial" />)
  expect(window.turnstile.render).toHaveBeenCalledOnce()

  view.rerender(<CaptchaField resetKey="server-response" />)
  expect(reset).toHaveBeenCalledWith('widget-2')

  view.unmount()
  expect(remove).toHaveBeenCalledWith('widget-2')
})

it('renders a fresh widget after navigation remounts the field', () => {
  const renderWidget = vi.fn()
    .mockReturnValueOnce('widget-login')
    .mockReturnValueOnce('widget-register')
  const remove = vi.fn()
  window.turnstile = { render: renderWidget, reset: vi.fn(), remove }

  const firstPage = render(<CaptchaField />)
  firstPage.unmount()
  render(<CaptchaField />)

  expect(renderWidget).toHaveBeenCalledTimes(2)
  expect(remove).toHaveBeenCalledWith('widget-login')
})

it('shows a blocking error state when the script cannot load', () => {
  render(<CaptchaField />)
  fireEvent.click(screen.getByTestId('fail-script'))
  expect(screen.getByRole('alert').textContent).toContain('No se pudo cargar')
})

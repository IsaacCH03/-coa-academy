// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotificationBell } from './notification-bell'

describe('NotificationBell', () => {
  beforeEach(() => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ notifications: [{ id: 'n1', title: 'Actividad aprobada', message: 'Tu entrega fue aprobada.', href: null, read_at: null, created_at: '2026-09-25T12:00:00Z' }] }), { status: 200 }))) })
  afterEach(() => { cleanup(); vi.unstubAllGlobals() })

  it('shows the unread badge and marks the student notification as read', async () => {
    render(<NotificationBell />)
    const bell = await screen.findByRole('button', { name: /1 sin leer/ })
    fireEvent.click(bell)
    fireEvent.click(await screen.findByRole('button', { name: /Actividad aprobada/ }))
    await waitFor(() => expect(vi.mocked(fetch)).toHaveBeenLastCalledWith('/api/academic/notifications', expect.objectContaining({ method: 'PATCH' })))
    expect(screen.getByRole('button', { name: 'Notificaciones' })).toBeTruthy()
  })

  it('shows an empty state', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ notifications: [] }), { status: 200 }))
    render(<NotificationBell />)
    fireEvent.click(await screen.findByRole('button', { name: 'Notificaciones' }))
    expect(screen.getByText('No tienes notificaciones.')).toBeTruthy()
  })

  it('distinguishes read items and exposes their destination', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ notifications: [{ id: 'n2', title: 'Retroalimentación', message: 'Revisa tu entrega.', href: '/mi-coa/cursos/python-practico', read_at: '2026-09-26T12:00:00Z', created_at: '2026-09-25T12:00:00Z' }] }), { status: 200 }))
    render(<NotificationBell />)
    fireEvent.click(await screen.findByRole('button', { name: 'Notificaciones' }))
    const link=screen.getByRole('link',{name:/Retroalimentación/})
    expect(link.getAttribute('href')).toBe('/mi-coa/cursos/python-practico')
    expect(link.className).toContain('text-muted-foreground')
  })
})

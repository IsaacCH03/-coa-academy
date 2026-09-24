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
})

// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityDeliveryPoint } from './module-activities'

describe('ActivityDeliveryPoint', () => {
  beforeEach(() => { vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(JSON.stringify({ mode: 'admin', submission: null }), { status: 200 }))) })
  afterEach(() => { cleanup(); vi.unstubAllGlobals() })
  it('renders exactly one activity, its rubric and its Phase 3B delivery state', async () => {
    const { container } = render(<ActivityDeliveryPoint activityId="logica-m1-ejercicios-1-4" />)
    expect(container.querySelectorAll('[data-activity-anchor]')).toHaveLength(1)
    expect(screen.getByText(/Ejercicios 1–4/)).toBeTruthy()
    expect(screen.getByText('Rúbrica de evaluación')).toBeTruthy()
    expect(await screen.findByText(/Vista de inspección administrativa/)).toBeTruthy()
  })
})

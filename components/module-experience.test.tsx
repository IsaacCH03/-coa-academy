// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ModuleExperience } from './module-experience'

const items = [{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }]
const positionKey = 'coa-course-position:test'
const visitedKey = 'coa-course-visited:test'

function mount() {
  vi.useFakeTimers()
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => window.setTimeout(() => callback(0), 0))
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => window.clearTimeout(id))
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true })
  const result = render(<ModuleExperience moduleId="test" moduleLabel="Test" items={items}>
    <section id="one" /><section id="two" />
  </ModuleExperience>)
  vi.spyOn(document.getElementById('one')!, 'getBoundingClientRect').mockImplementation(() => ({ top: 0 }) as DOMRect)
  vi.spyOn(document.getElementById('two')!, 'getBoundingClientRect').mockImplementation(() => ({ top: window.scrollY > 500 ? 0 : 1000 }) as DOMRect)
  act(() => vi.runOnlyPendingTimers())
  return result
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); vi.useRealTimers() })

it('retains visited sections when scrolling back and saves on unmount', () => {
  const result = mount()
  window.scrollY = 800
  fireEvent.scroll(window)
  expect(screen.getByText('100%')).toBeTruthy()
  window.scrollY = 0
  fireEvent.scroll(window)
  expect(screen.getByText('100%')).toBeTruthy()
  result.unmount()
  expect(JSON.parse(localStorage.getItem(visitedKey)!)).toEqual(['one', 'two'])
})

it.each(['null', '{}', '42', 'broken', '["obsolete",1]'])('tolerates invalid stored progress: %s', value => {
  localStorage.setItem(visitedKey, value)
  localStorage.setItem(positionKey, 'Infinity')
  mount()
  expect(screen.getByText('50%')).toBeTruthy()
  expect(screen.queryByText('Continuar donde quedaste')).toBeNull()
})

it('preserves the saved position until the student scrolls', () => {
  localStorage.setItem(positionKey, '900')
  const result = mount()
  act(() => vi.advanceTimersByTime(500))
  expect(screen.getByText('Continuar donde quedaste')).toBeTruthy()
  result.unmount()
  expect(localStorage.getItem(positionKey)).toBe('900')
})

it('remains usable when browser storage throws', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  mount()
  window.scrollY = 800
  fireEvent.scroll(window)
  act(() => vi.advanceTimersByTime(200))
  expect(screen.getByText('100%')).toBeTruthy()
})

it('adds every rendered delivery point to desktop and mobile navigation', () => {
  vi.useFakeTimers()
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => window.setTimeout(() => callback(0), 0))
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => window.clearTimeout(id))
  render(<ModuleExperience moduleId="deliveries" moduleLabel="Test" items={items}>
    <section id="one"/><section id="two"/>
    <section data-activity-anchor="delivery-one" data-activity-label="Ejercicios" id="delivery-one"/>
    <section data-activity-anchor="delivery-two" data-activity-label="Proyecto" id="delivery-two"/>
  </ModuleExperience>)
  act(() => vi.runOnlyPendingTimers())
  expect(screen.getAllByText('Punto de entrega 1: Ejercicios')).toHaveLength(2)
  expect(screen.getAllByText('Punto de entrega 2: Proyecto')).toHaveLength(2)
})

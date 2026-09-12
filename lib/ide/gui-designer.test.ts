import { describe, expect, it, vi } from 'vitest'
import {
  clampControl,
  generateGuiCode,
  nextControl,
  type GuiControl,
  type GuiWindow,
} from './gui-designer'

const window: GuiWindow = { title: 'Mi "interfaz"', width: 500, height: 400 }
const controls: GuiControl[] = [
  { id: '1', type: 'Label', variableName: 'titulo', text: 'Nombre', x: 40, y: 30, width: 180, height: 30 },
  { id: '2', type: 'Entry', variableName: 'nombre', x: 40, y: 80, width: 200, height: 30 },
]

describe('GUI designer helpers', () => {
  it('generates valid COA GUI and Tkinter structures', () => {
    expect(generateGuiCode(window, controls, 'coa')).toContain('import coa_gui as gui')
    const tkinter = generateGuiCode(window, controls, 'tkinter')
    expect(tkinter).toContain('import tkinter as tk')
    expect(tkinter).toContain('titulo = tk.Label(ventana, text="Nombre")')
    expect(tkinter).toContain('nombre.place(x=40, y=80, width=200, height=30)')
  })

  it('creates sequential names and keeps controls inside the canvas', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1)
    const created = nextControl('Label', controls, 490, 390, window)
    expect(created.variableName).toBe('label1')
    expect(created.x + created.width).toBeLessThanOrEqual(window.width)
    expect(clampControl({ ...created, x: -20, width: 900 }, window)).toMatchObject({ x: 0, width: 500 })
  })

  it('rejects empty, duplicated or unsafe variable names', () => {
    expect(() => generateGuiCode(window, [{ ...controls[0], variableName: '' }], 'tkinter')).toThrow()
    expect(() => generateGuiCode(window, [...controls, { ...controls[0], id: '3' }], 'coa')).toThrow()
  })
})

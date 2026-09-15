import { describe, expect, it, vi } from 'vitest'
import {
  clampControl,
  generateGuiCode,
  nextControl,
  restoreGuiDesign,
  type GuiControl,
  type GuiWindow,
} from './gui-designer'

const window: GuiWindow = { title: 'Mi "interfaz"', width: 500, height: 400 }
const controls: GuiControl[] = [
  { id: '1', type: 'Label', variableName: 'titulo', text: 'Nombre', x: 40, y: 30, width: 180, height: 30 },
  { id: '2', type: 'Entry', variableName: 'nombre', x: 40, y: 80, width: 200, height: 30 },
  { id: '3', type: 'Button', variableName: 'guardar', text: 'Guardar', x: 40, y: 130, width: 120, height: 35 },
  { id: '4', type: 'Frame', variableName: 'marco', x: 10, y: 10, width: 220, height: 160 },
]

describe('GUI designer helpers', () => {
  it('generates valid COA GUI and Tkinter structures', () => {
    expect(generateGuiCode(window, controls, 'coa')).toContain('import coa_gui as gui')
    const tkinter = generateGuiCode(window, controls, 'tkinter')
    expect(tkinter).toContain('import tkinter as tk')
    expect(tkinter).toContain('titulo = tk.Label(ventana, text="Nombre")')
    expect(tkinter).toContain('nombre.place(x=40, y=80, width=200, height=30)')
    expect(tkinter.indexOf('marco = tk.Frame')).toBeLessThan(tkinter.indexOf('titulo = tk.Label'))
    const coa = generateGuiCode(window, controls, 'coa')
    expect(coa.indexOf('marco = gui.Frame')).toBeLessThan(coa.indexOf('guardar = gui.Button'))
  })
  it('converts preserved dialog logic when an imported design is exported', () => {
    const source = 'import coa_gui as gui\nwindow = gui.Tk()\ndef save():\n    gui.showinfo("Listo", "Guardado")\nwindow.mainloop()\n'
    const imported = {
      source, importRange: [0, 21] as [number, number], guiRanges: [[32, 35] as [number, number]],
      mainloopStart: source.indexOf('window.mainloop'), windowName: 'window', windowCreateEnd: source.indexOf('gui.Tk()') + 8,
      controls: {}, warning: true,
    }
    const result = generateGuiCode(window, [], 'tkinter', imported)
    expect(result).toContain('from tkinter import messagebox')
    expect(result).toContain('messagebox.showinfo("Listo", "Guardado")')
    expect(result).toContain('def save():')
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
    expect(() => generateGuiCode(window, [...controls, { ...controls[0], id: '5' }], 'coa')).toThrow()
  })

  it('restores a saved design and falls back for invalid data', () => {
    const restored = restoreGuiDesign({ window, controls })
    expect(restored.window.title).toBe('Mi "interfaz"')
    expect(restored.controls).toHaveLength(4)
    expect(restoreGuiDesign({ broken: true })).toEqual({
      window: { title: 'Mi interfaz', width: 500, height: 400 },
      controls: [],
    })
  })
})

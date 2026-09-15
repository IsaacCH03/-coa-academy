import { describe, expect, it } from 'vitest'
import { convertCoaGuiToTkinter, usesCoaGui } from './coa-gui-converter'

describe('COA GUI to Tkinter converter', () => {
  it('detects real imports and ignores comments and strings', () => {
    expect(usesCoaGui('import coa_gui as gui\nwindow = gui.Tk()')).toBe(true)
    expect(usesCoaGui('# import coa_gui as gui\nprint("gui.Tk()")')).toBe(false)
  })
  it('preserves Python logic and only converts visual references', () => {
    const source = `import coa_gui as gui\n\ndef save():\n    if entry.get() == "":\n        gui.showwarning("Aviso", "Falta")\n        return\n    answer = gui.askyesno("Guardar", "¿Continuar?")\n    if answer:\n        gui.showinfo("Listo", "Guardado")\n\nwindow = gui.Tk()\nentry = gui.Entry(window)\nbutton = gui.Button(window, text="Guardar", command=save)\nwindow.mainloop()`
    const result = convertCoaGuiToTkinter(source)
    expect(result).toContain('import tkinter as tk\nfrom tkinter import messagebox')
    expect(result).toContain('def save():\n    if entry.get() == "":')
    expect(result).toContain('messagebox.showwarning')
    expect(result).toContain('messagebox.askyesno')
    expect(result).toContain('window = tk.Tk()')
    expect(result).toContain('command=save')
  })
  it('adds simpledialog only when required', () => {
    expect(convertCoaGuiToTkinter('import coa_gui as gui\nname = gui.askstring("N", "M")')).toContain('from tkinter import simpledialog')
  })
})

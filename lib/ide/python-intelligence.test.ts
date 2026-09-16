import { describe, expect, it } from 'vitest'
import { PythonProjectIndex } from './python-intelligence'
import type { ProjectEntry } from './project'

const layered: ProjectEntry[] = [
  { path: 'presentation', kind: 'folder', content: '' },
  { path: 'business', kind: 'folder', content: '' },
  { path: 'presentation/ui.py', kind: 'file', content: `class UI:
    def showInfo(self, mensaje):
        """Muestra un mensaje informativo."""
        pass

    def showError(self, mensaje):
        pass
` },
  { path: 'business/logic.py', kind: 'file', content: `class Logic:
    def saludar(self, nombre):
        return "Hola " + nombre

    def sumar(self, a, b):
        return a + b
` },
  { path: 'business/controller.py', kind: 'file', content: `from business.logic import Logic
from presentation.ui import UI

class Controller:
    def __init__(self):
        self.logic = Logic()
        self.ui = UI()

    def mostrar_saludo(self, nombre):
        self.ui.sho
` },
]

describe('PythonProjectIndex', () => {
  it('resolves members from imported layered classes with real signatures', () => {
    const index = new PythonProjectIndex().update(layered)
    expect(index.members('business/controller.py', 'self.ui', 10).map((item) => item.signature)).toEqual(['showInfo(mensaje)', 'showError(mensaje)'])
    expect(index.members('business/controller.py', 'self.logic', 10).map((item) => item.signature)).toEqual(['saludar(nombre)', 'sumar(a, b)'])
  })

  it('completes project modules and imported symbols', () => {
    const index = new PythonProjectIndex().update(layered)
    expect(index.completions('business/controller.py', 1, 'from presentation.').map((item) => item.name)).toContain('ui')
    expect(index.completions('business/controller.py', 1, 'from presentation.ui import ').map((item) => item.name)).toContain('UI')
  })

  it('resolves definitions across files and local instances', () => {
    const entries = [...layered, { path: 'main.py', kind: 'file' as const, content: `class Persona:
    def saludar(self):
        pass
    def guardar(self):
        pass

persona = Persona()
persona.saludar()
` }]
    const index = new PythonProjectIndex().update(entries)
    expect(index.members('main.py', 'persona', 8).map((item) => item.name)).toEqual(['saludar', 'guardar'])
    expect(index.definition('main.py', 8, 'persona.saludar()', 10)).toMatchObject({ name: 'saludar', line: 2, path: 'main.py' })
    expect(index.definition('business/controller.py', 10, '        self.ui.showInfo("x")', 19)).toMatchObject({ name: 'showInfo', path: 'presentation/ui.py', line: 2 })
  })

  it('includes inherited methods and respects aliases', () => {
    const entries: ProjectEntry[] = [
      { path: 'models.py', kind: 'file', content: `class Persona:
    def saludar(self): pass
class Estudiante(Persona):
    def estudiar(self): pass
` },
      { path: 'main.py', kind: 'file', content: `from models import Estudiante as Alumno
e = Alumno()
e.
` },
    ]
    const index = new PythonProjectIndex().update(entries)
    expect(index.members('main.py', 'e', 3).map((item) => item.name)).toEqual(['estudiar', 'saludar'])
  })

  it('updates changed and removed files without keeping ghost symbols', () => {
    const index = new PythonProjectIndex().update(layered)
    const changed = layered.map((entry) => entry.path === 'presentation/ui.py' ? { ...entry, content: `${entry.content}\n    def eliminar(self):\n        pass\n` } : entry)
    index.update(changed)
    expect(index.members('business/controller.py', 'self.ui', 10).map((item) => item.name)).toContain('eliminar')
    index.update(changed.filter((entry) => entry.path !== 'presentation/ui.py'))
    expect(index.members('business/controller.py', 'self.ui', 10)).toEqual([])
  })

  it('keeps the previous valid symbols during a temporary incomplete edit', () => {
    const index = new PythonProjectIndex().update(layered)
    index.update(layered.map((entry) => entry.path === 'presentation/ui.py' ? { ...entry, content: 'class UI:\n    def sho' } : entry))
    expect(index.members('business/controller.py', 'self.ui', 10).map((item) => item.name)).toContain('showInfo')
  })

  it('offers the supported COA GUI catalog only for its module alias', () => {
    const index = new PythonProjectIndex().update([{ path: 'main.py', kind: 'file', content: 'import coa_gui as gui\ngui.' }])
    expect(index.members('main.py', 'gui', 2).map((item) => item.name)).toEqual(expect.arrayContaining(['Tk', 'Label', 'showinfo', 'askstring', 'askyesno']))
  })
  it('resolves members even when Monaco has added deep temporary indentation', () => {
    const index=new PythonProjectIndex().update([
      {path:'business/logic.py',kind:'file',content:'class Logic:\n        def saludar(self, nombre):\n                return nombre'},
      {path:'business/controller.py',kind:'file',content:'from business.logic import Logic\n\nclass Controller:\n    def __init__(self):\n            self.logic = Logic()\n\n                        def probar(self):\n                                self.logic.saludar'},
    ])
    expect(index.definition('business/controller.py',8,'                                self.logic.saludar',51)).toMatchObject({path:'business/logic.py',name:'saludar',line:2})
  })
})

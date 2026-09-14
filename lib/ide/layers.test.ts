import { describe, expect, it } from 'vitest'
import {
  analyzeLayerClasses, architectureStatus, buildConnectionChange,
  buildObjectChange, buildReturnChange, encapsulationChange, layerOf, reviewLayerConnections,
} from './layers'
import type { ProjectEntry } from './project'

const file = (path: string, content = ''): ProjectEntry => ({ path, kind: 'file', content })
const folder = (path: string): ProjectEntry => ({ path, kind: 'folder', content: '' })

describe('Builder de programación por capas', () => {
  it('recognizes all four COA layers', () => {
    expect(architectureStatus(['presentation', 'business', 'domain', 'data'].map(folder))).toEqual({ presentation: true, business: true, domain: true, data: true })
  })
  it('reports a partial architecture without creating folders', () => {
    const entries = [folder('business'), folder('domain')]
    expect(architectureStatus(entries)).toEqual({ presentation: false, business: true, domain: true, data: false })
    expect(entries).toHaveLength(2)
  })
  it('creates a Business import and object from Presentation', () => {
    const target = analyzeLayerClasses([file('business/logic.py', 'class Logic:\n    pass')])[0]
    const change = buildObjectChange('', 'presentation/main.py', target, 'logic', [])
    expect(change.content).toContain('from business.logic import Logic')
    expect(change.content).toContain('logic = Logic()')
  })
  it('does not duplicate an existing import', () => {
    const target = analyzeLayerClasses([file('business/logic.py', 'class Logic:\n    pass')])[0]
    const change = buildObjectChange('from business.logic import Logic', 'presentation/main.py', target, 'logic', [])
    expect(change.content.match(/from business\.logic import Logic/g)).toHaveLength(1)
  })
  it('does not duplicate an existing object', () => {
    const target = analyzeLayerClasses([file('business/logic.py', 'class Logic:\n    pass')])[0]
    const change = buildObjectChange('from business.logic import Logic\nlogic = Logic()', 'presentation/main.py', target, 'logic', [])
    expect(change.content.match(/logic = Logic\(\)/g)).toHaveLength(1)
  })
  it('detects constructor parameters without self', () => {
    const classes = analyzeLayerClasses([file('domain/persona.py', 'class Persona:\n    def __init__(self, nombre, edad):\n        self.nombre = nombre\n        self.edad = edad')])
    expect(classes[0].constructor).toEqual(['nombre', 'edad'])
  })
  it('detects Data method parameters without self', () => {
    const classes = analyzeLayerClasses([file('data/files.py', 'class Files:\n    def guardar(self, persona):\n        pass')])
    expect(classes[0].methods).toEqual([{ name: 'guardar', parameters: ['persona'] }])
  })
  it('finds incompatible parameters across layers', () => {
    const findings = reviewLayerConnections([
      file('business/logic.py', 'class Logic:\n    def registrar(self, nombre):\n        pass'),
      file('presentation/main.py', 'logic.registrar(nombre, edad)'),
    ])
    expect(findings.some((item) => item.severity === 'error' && item.message.includes('se envían 2'))).toBe(true)
  })
  it.each([
    ['data/files.py', 'from presentation.main import Main'],
    ['presentation/main.py', 'from data.files import Files'],
  ])('warns about an unusual dependency from %s', (path, content) => {
    expect(reviewLayerConnections([file(path, content)]).some((item) => item.severity === 'warning')).toBe(true)
  })
  it.each([
    ['business/logic.py', 'from domain.persona import Persona'],
    ['business/logic.py', 'from data.files import Files'],
  ])('accepts a usual dependency from %s', (path, content) => {
    expect(reviewLayerConnections([file(path, content)]).some((item) => item.severity === 'ok')).toBe(true)
  })
  it('identifies files outside the COA architecture without failing', () => {
    expect(layerOf('main.py')).toBeNull()
    expect(layerOf('services/api.py')).toBeNull()
  })
  it('encapsulates attributes and avoids duplicate getter/setter methods', () => {
    const source = 'class Persona:\n    def __init__(self, nombre):\n        self.nombre = nombre\n'
    const first = encapsulationChange(source, 'domain/persona.py', 'Persona', ['nombre'], 'Getter + Setter')
    const second = encapsulationChange(first.content, first.path, 'Persona', ['nombre'], 'Getter + Setter')
    expect(first.content).toContain('self.__nombre = nombre')
    expect(first.content).toContain('def get_nombre(self):')
    expect(first.content).toContain('def set_nombre(self, nombre):')
    expect(second.content.match(/def get_nombre/g)).toHaveLength(1)
    expect(second.content.match(/def set_nombre/g)).toHaveLength(1)
  })
  it('uses the real module path and supports several classes per file', () => {
    const classes = analyzeLayerClasses([file('business/persona_logic.py', 'class PersonaLogic:\n    pass\n\nclass VentaLogic:\n    pass')])
    expect(classes.map((item) => item.name)).toEqual(['PersonaLogic', 'VentaLogic'])
    expect(buildObjectChange('', 'presentation/main.py', classes[0], 'personaLogic', []).content).toContain('from business.persona_logic import PersonaLogic')
  })
  it('connects a detected method with its parameters', () => {
    const target = analyzeLayerClasses([file('data/files.py', 'class Files:\n    def guardar(self, persona):\n        pass')])[0]
    const change = buildConnectionChange('', 'business/logic.py', target, 'files', 'guardar', ['persona'])
    expect(change.content).toContain('files.guardar(persona)')
  })
  it('adds a Data dependency to an existing Business constructor without replacing its parameters', () => {
    const target = analyzeLayerClasses([file('data/files.py', 'class Files:\n    pass')])[0]
    const source = 'class Logic:\n    def __init__(self, modo):\n        self.modo = modo\n'
    const change = buildConnectionChange(source, 'business/logic.py', target, 'files', '', [])
    expect(change.content).toContain('def __init__(self, modo):')
    expect(change.content).toContain('self.files = Files()')
    expect(change.content.match(/def __init__/g)).toHaveLength(1)
  })
  it('adds a return inside the last detected method and does not duplicate it', () => {
    const source = 'class Logic:\n    def total(self):\n        resultado = 10\n'
    const first = buildReturnChange(source, 'business/logic.py', 'resultado')
    const second = buildReturnChange(first.content, first.path, 'resultado')
    expect(first.content).toContain('        return resultado')
    expect(second.content.match(/return resultado/g)).toHaveLength(1)
  })
})

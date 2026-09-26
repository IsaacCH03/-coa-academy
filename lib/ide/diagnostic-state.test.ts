import { describe, expect, it, vi } from 'vitest'
import { applyDiagnosticMarkers, DiagnosticGeneration, modelPath } from './diagnostic-state'
import type { CodeDiagnostic } from './diagnostics'

const diagnostic: CodeDiagnostic = {
  id: 'indent-main',
  path: 'main.py',
  origin: 'static',
  severity: 'error',
  line: 2,
  column: 1,
  endLine: 2,
  endColumn: 5,
  message: 'Indentación incorrecta',
  explanation: 'Revisa este bloque.',
}

describe('estado de diagnósticos del IDE', () => {
  it('descarta una generación anterior cuando empieza un análisis nuevo', () => {
    const generations = new DiagnosticGeneration()
    const oldRequest = generations.begin()
    const currentRequest = generations.begin()

    expect(generations.isCurrent(oldRequest)).toBe(false)
    expect(generations.isCurrent(currentRequest)).toBe(true)
    generations.invalidate()
    expect(generations.isCurrent(currentRequest)).toBe(false)
  })

  it('distribuye marcadores por archivo y limpia modelos sin errores actuales', () => {
    const main = { uri: { path: '/main.py' } }
    const other = { uri: { path: '/carpeta/otro.py' } }
    const setModelMarkers = vi.fn()
    const monaco = {
      MarkerSeverity: { Error: 8, Warning: 4, Info: 2 },
      editor: { getModels: () => [main, other], setModelMarkers },
    }

    applyDiagnosticMarkers(monaco as never, [diagnostic])

    expect(setModelMarkers).toHaveBeenNthCalledWith(1, main, 'coa-diagnostics', [
      expect.objectContaining({ startLineNumber: 2, severity: 8 }),
    ])
    expect(setModelMarkers).toHaveBeenNthCalledWith(2, other, 'coa-diagnostics', [])
  })

  it('normaliza rutas codificadas de modelos Monaco', () => {
    expect(modelPath('/carpeta%20uno/main.py')).toBe('carpeta uno/main.py')
  })
})

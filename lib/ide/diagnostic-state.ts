import type { Monaco } from '@monaco-editor/react'
import type { CodeDiagnostic } from './diagnostics'

const MARKER_OWNER = 'coa-diagnostics'

export class DiagnosticGeneration {
  private current = 0

  begin() {
    this.current += 1
    return this.current
  }

  invalidate() {
    this.current += 1
  }

  isCurrent(generation: number) {
    return generation === this.current
  }
}

export function modelPath(uriPath: string) {
  try {
    return decodeURIComponent(uriPath).replace(/^\//, '')
  } catch {
    return uriPath.replace(/^\//, '')
  }
}

export function applyDiagnosticMarkers(monaco: Monaco, diagnostics: CodeDiagnostic[]) {
  for (const model of monaco.editor.getModels()) {
    const path = modelPath(model.uri.path)
    const markers = diagnostics
      .filter((item) => item.path === path)
      .map((item) => ({
        startLineNumber: item.line,
        startColumn: item.column,
        endLineNumber: item.endLine,
        endColumn: item.endColumn,
        message: `${item.message}\n\n${item.explanation}`,
        severity:
          item.severity === 'error'
            ? monaco.MarkerSeverity.Error
            : item.severity === 'warning'
              ? monaco.MarkerSeverity.Warning
              : monaco.MarkerSeverity.Info,
        source: item.origin === 'runtime' ? 'Ejecución COA' : 'Diagnósticos COA',
      }))
    monaco.editor.setModelMarkers(model, MARKER_OWNER, markers)
  }
}

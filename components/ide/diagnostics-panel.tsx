'use client'
import type { CodeDiagnostic, DiagnosticFix } from '@/lib/ide/diagnostics'

const icons = { error: '❌', warning: '⚠️', suggestion: '💡' }
export function DiagnosticsPanel({ diagnostics, onSelect, onFix }: {
  diagnostics: CodeDiagnostic[]
  onSelect: (diagnostic: CodeDiagnostic) => void
  onFix: (diagnostic: CodeDiagnostic, fix: DiagnosticFix) => void
}) {
  return (
    <section className="diagnostics-panel" aria-label="Problemas">
      <header><strong>PROBLEMAS</strong></header>
      {!diagnostics.length ? <p>No se encontraron problemas.</p> : diagnostics.map((item) => (
        <article key={item.id}>
          <button onClick={() => onSelect(item)}>
            <span>{icons[item.severity]} {item.path ?? 'Archivo actual'} · Línea {item.line}</span>
            <strong>{item.message}</strong>
            <small>{item.explanation}</small>
          </button>
          {item.fix && <button className="diagnostic-fix" onClick={() => onFix(item, item.fix!)}>💡 {item.fix.title}</button>}
        </article>
      ))}
    </section>
  )
}

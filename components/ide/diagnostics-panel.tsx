'use client'
import type { CodeDiagnostic, DiagnosticFix } from '@/lib/ide/diagnostics'

const icons = { error: '❌', warning: '⚠️', suggestion: '💡' }
export function DiagnosticsPanel({ diagnostics, onSelect, onFix }: {
  diagnostics: CodeDiagnostic[]
  onSelect: (diagnostic: CodeDiagnostic) => void
  onFix: (fix: DiagnosticFix) => void
}) {
  return (
    <section className="diagnostics-panel" aria-label="Problemas">
      <header><strong>PROBLEMAS</strong></header>
      {!diagnostics.length ? <p>No se encontraron problemas.</p> : diagnostics.map((item) => (
        <article key={item.id}>
          <button onClick={() => onSelect(item)}>
            <span>{icons[item.severity]} Línea {item.line}</span>
            <strong>{item.message}</strong>
            <small>{item.explanation}</small>
          </button>
          {item.fix && <button className="diagnostic-fix" onClick={() => onFix(item.fix!)}>💡 {item.fix.title}</button>}
        </article>
      ))}
    </section>
  )
}

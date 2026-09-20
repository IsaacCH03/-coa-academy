'use client'
import { Sheet, Check } from 'lucide-react'
import type { ExtensionState } from '@/lib/ide/extensions'

export function ExtensionsPanel({ extensions, onChange }: { extensions: ExtensionState; onChange: (value: ExtensionState) => void }) {
  const excel = extensions['excel-viewer']
  const set = (installed: boolean, enabled: boolean) => onChange({ ...extensions, 'excel-viewer': { installed, enabled } })
  return <section className="ide-panel extensions-panel">
    <p className="ide-eyebrow">EXTENSIONES</p>
    <h2>Extensiones</h2>
    <p className="ide-muted">Herramientas locales que amplían el workspace.</p>
    <article className="extension-card">
      <Sheet size={30}/><div><h3>Excel Viewer</h3><p>Visualiza archivos .xlsx directamente en COA Python Studio.</p>
      {excel.installed ? <><p className="extension-installed"><Check size={15}/> Instalado {excel.enabled ? 'y activo' : '· desactivado'}</p><div className="extension-actions"><button className="ide-secondary" onClick={()=>set(true,!excel.enabled)}>{excel.enabled?'Desactivar':'Activar'}</button><button className="ide-text-button" onClick={()=>set(false,false)}>Desinstalar</button></div></> : <button className="ide-primary" onClick={()=>set(true,true)}>Instalar</button>}
      </div>
    </article>
    <p className="ide-tip">La instalación se guarda solo en este navegador. El visor se descarga únicamente al abrir un archivo Excel.</p>
  </section>
}

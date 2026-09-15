'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Square, Download, ArrowLeft, RotateCcw, Settings } from 'lucide-react'
import { GithubIcon as Github } from './github-icon'
export function Toolbar({
  active,
  canRun,
  busy,
  canStop,
  onRun,
  onStop,
  onDownload,
  onGithub,
  onRestart,
  needsRestart,
  onSettings,
}: {
  active: string
  canRun: boolean
  busy: boolean
  canStop: boolean
  onRun: () => void
  onStop: () => void
  onDownload: (project: boolean) => void
  onGithub: () => void
  onRestart: () => void
  needsRestart: boolean
  onSettings: () => void
}) {
  return (
    <header className="ide-toolbar">
      <div className="ide-brand">
        <Link href="/" title="Volver a COA">
          <Image src="/coa-icon.png" width={40} height={40} alt="COA" />
        </Link>
        <div>
          <strong>
            COA <span>Python Studio</span>
          </strong>
          <small>{active || 'Mi proyecto'}</small>
        </div>
        <button className="ide-settings-button" aria-label="Configuración" title="Configuración" onClick={onSettings}><Settings size={18}/></button>
      </div>
      <div className="ide-toolbar-actions">
        <button
          className="ide-run"
          disabled={!canRun || busy}
          onClick={onRun}
          title="Ejecutar (Ctrl+Enter)"
        >
          <Play size={16} fill="currentColor" /> <span>Ejecutar</span>
        </button>
        <button className="ide-stop" disabled={!canStop} onClick={onStop}>
          <Square size={14} fill="currentColor" /> <span>Detener</span>
        </button>
        {needsRestart && (
          <button onClick={onRestart}>
            <RotateCcw size={15} /> Recargar Python
          </button>
        )}
        <details className="ide-download">
          <summary>
            <Download size={16} />
            <span>Descargar</span>
          </summary>
          <div>
            <button disabled={!active} onClick={() => onDownload(false)}>
              Archivo actual
            </button>
            <button onClick={() => onDownload(true)}>
              Proyecto completo (.zip)
            </button>
          </div>
        </details>
        <button onClick={onGithub}>
          <Github size={17} />
          <span>GitHub</span>
        </button>
        <Link className="ide-back" href="/">
          <ArrowLeft size={15} /> <span>Volver a COA</span>
        </Link>
      </div>
    </header>
  )
}

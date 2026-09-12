'use client'
import { useEffect, useState } from 'react'
import { GithubIcon as Github } from './github-icon'
import { githubService, type GitHubSession } from '@/lib/ide/github-client'
import type { Project } from '@/lib/ide/project'
export function GithubPanel({
  project,
  onImport,
  onError,
  onSave,
}: {
  project: Project
  onImport: (p: Project) => void
  onError: (message: string) => void
  onSave: () => Promise<void>
}) {
  const [session, setSession] = useState<GitHubSession | null>(null)
  const [repository, setRepository] = useState('')
  const [name, setName] = useState('mi-proyecto-python')
  const [create, setCreate] = useState(true)
  const [privateRepo, setPrivate] = useState(true)
  const [message, setMessage] = useState('Mi práctica de Python en COA')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [result, setResult] = useState('')
  useEffect(() => {
    githubService
      .session()
      .then(setSession)
      .catch((e) => onError(e.message))
  }, [onError])
  async function upload() {
    setBusy(true)
    setConfirm(false)
    try {
      const r = await githubService.upload(
        project,
        repository,
        message,
        create,
        name,
        privateRepo,
      )
      setRepository(r.repository)
      setCreate(false)
      setResult(r.url)
    } catch (e) {
      onError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="ide-panel">
      <p className="ide-eyebrow">TU PORTAFOLIO</p>
      <h2>
        <Github size={21} /> GitHub
      </h2>
      {!session ? (
        <p>Consultando conexión…</p>
      ) : !session.configured ? (
        <div className="ide-tip">
          <strong>Configura GitHub para conectar tu cuenta</strong>
          <p>
            El administrador de COA debe configurar la aplicación OAuth.
            Mientras tanto, puedes guardar y descargar tu proyecto completo.
          </p>
        </div>
      ) : !session.connected ? (
        <>
          <p>
            Guarda tus proyectos en tu cuenta de GitHub. La conexión permite
            acceder a repositorios públicos y privados.
          </p>
          <button
            className="ide-primary wide"
            onClick={async () => {
              await onSave()
              window.location.assign(
                new URL('/api/ide/github/auth', window.location.origin).href,
              )
            }}
          >
            Conectar GitHub
          </button>
        </>
      ) : (
        <>
          <p className="ide-tip">
            Conectado como <strong>{session.login}</strong>
          </p>
          <button
            className="ide-text-button"
            disabled={busy}
            onClick={async () => {
              try {
                await githubService.disconnect()
                setSession({ configured: true, connected: false })
              } catch (e) {
                onError((e as Error).message)
              }
            }}
          >
            Desconectar cuenta
          </button>
          <label className="ide-check">
            <input
              type="checkbox"
              checked={create}
              disabled={busy}
              onChange={(e) => setCreate(e.target.checked)}
            />{' '}
            Crear un repositorio nuevo
          </label>
          {create ? (
            <>
              <label className="ide-field">
                Nombre
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="ide-field">
                Visibilidad
                <select
                  value={privateRepo ? 'private' : 'public'}
                  onChange={(e) => setPrivate(e.target.value === 'private')}
                >
                  <option value="private">Privado</option>
                  <option value="public">Público</option>
                </select>
              </label>
            </>
          ) : (
            <label className="ide-field">
              Repositorio
              <input
                placeholder="usuario/repositorio"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
              />
            </label>
          )}
          <label className="ide-field">
            Mensaje de commit
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <p className="ide-muted">
            Se suben tus archivos actuales. Los archivos remotos con la misma
            ruta se actualizan; los demás se conservan.
          </p>
          {!confirm ? (
            <button
              className="ide-primary wide"
              disabled={busy}
              onClick={() => setConfirm(true)}
            >
              {busy ? 'Trabajando…' : 'Subir a GitHub'}
            </button>
          ) : (
            <div className="ide-inline-form">
              <p>
                ¿Confirmas subir{' '}
                {project.entries.filter((e) => e.kind === 'file').length}{' '}
                archivos a{' '}
                {create
                  ? `${session.login}/${name} (${privateRepo ? 'privado' : 'público'})`
                  : repository}
                ?
              </p>
              <div className="ide-row">
                <button onClick={() => setConfirm(false)}>Cancelar</button>
                <button className="ide-primary" onClick={() => void upload()}>
                  Confirmar subida
                </button>
              </div>
            </div>
          )}
          {result && (
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="ide-text-button"
            >
              Ver proyecto en GitHub
            </a>
          )}
          <hr />
          <h3>Abrir repositorio</h3>
          <label className="ide-field">
            usuario/repositorio
            <input
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
            />
          </label>
          <button
            className="ide-secondary wide"
            disabled={busy || !repository}
            onClick={async () => {
              setBusy(true)
              try {
                const r = await githubService.import(repository)
                onImport(r.project)
              } catch (e) {
                onError((e as Error).message)
              } finally {
                setBusy(false)
              }
            }}
          >
            Importar proyecto
          </button>
        </>
      )}
    </section>
  )
}

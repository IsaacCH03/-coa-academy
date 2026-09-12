'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { loadProject, saveProject } from '@/lib/ide/persistence'
import { newProject, validateEntries, type Project } from '@/lib/ide/project'

export function useProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [saveStatus, setSaveStatus] = useState('Abriendo proyecto…')
  const [storageError, setStorageError] = useState('')
  const current = useRef<Project | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const queue = useRef(Promise.resolve())
  const save = useCallback(() => {
    clearTimeout(timer.current)
    const snapshot = current.current
    if (!snapshot) return Promise.resolve()
    setSaveStatus('Guardando…')
    queue.current = queue.current
      .catch(() => {})
      .then(() => saveProject(snapshot))
      .then(() => {
        if (current.current === snapshot)
          setSaveStatus('Guardado en este navegador')
        setStorageError('')
      })
      .catch(() => {
        setSaveStatus('Sin guardar')
        setStorageError(
          'No se pudo guardar en este navegador. Descarga tu proyecto para conservarlo; comprueba espacio y permisos.',
        )
      })
    return queue.current
  }, [])
  useEffect(() => {
    let live = true
    loadProject()
      .then((p) => {
        if (!live) return
        current.current = p ?? newProject()
        setProject(current.current)
        setSaveStatus(p ? 'Proyecto recuperado' : 'Guardado automático activo')
      })
      .catch(() => {
        if (!live) return
        current.current = newProject()
        setProject(current.current)
        setStorageError(
          'No se pudo recuperar el proyecto guardado. No sobrescribiremos sus datos hasta que edites. Puedes descargar tu trabajo.',
        )
        setSaveStatus('Almacenamiento no disponible')
      })
    const flush = () => {
      if (timer.current) void save()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', flush)
    return () => {
      live = false
      flush()
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', flush)
    }
  }, [save])
  const update = useCallback(
    (value: Project | ((p: Project) => Project)) => {
      if (!current.current) return
      const next = typeof value === 'function' ? value(current.current) : value
      try {
        validateEntries(next.entries)
      } catch (error) {
        setStorageError(
          (error as Error).message +
            ' El cambio no se aplicó; tu proyecto anterior se conserva.',
        )
        return
      }
      current.current = next
      setProject(next)
      setSaveStatus('Cambios sin guardar…')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        timer.current = undefined
        void save()
      }, 250)
    },
    [save],
  )
  return { project, update, save, saveStatus, storageError }
}

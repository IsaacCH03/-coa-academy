'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, BookOpen, CheckCircle2, ChevronDown, PartyPopper, Play } from 'lucide-react'

export type ModuleTocItem = {
  id: string
  label: string
}

export function ModuleExperience({
  moduleId,
  moduleLabel,
  items,
  nextHref,
  nextLabel,
  completionTitle,
  completionDescription,
  children,
}: {
  moduleId: string
  moduleLabel: string
  items: ModuleTocItem[]
  nextHref?: string
  nextLabel?: string
  completionTitle?: string
  completionDescription?: string
  children: ReactNode
}) {
  const storageKey = `coa-course-position:${moduleId}`
  const visitedKey = `coa-course-visited:${moduleId}`
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const [visited, setVisited] = useState<string[]>([])
  const [resumePosition, setResumePosition] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    let storedPosition = 0
    let storedVisited: unknown = []
    try {
      storedPosition = Number(localStorage.getItem(storageKey) ?? 0)
      storedVisited = JSON.parse(localStorage.getItem(visitedKey) ?? '[]')
    } catch {
      // Reading may fail when browser storage is unavailable or malformed.
    }
    const visitedIds = new Set<string>(
      Array.isArray(storedVisited)
        ? storedVisited.filter((id): id is string =>
            typeof id === 'string' && items.some((item) => item.id === id))
        : [],
    )
    let position = Number.isFinite(storedPosition) && storedPosition > 0 ? storedPosition : 0
    let dirty = false
    let saveTimer = 0
    const save = () => {
      if (!dirty) return
      try {
        localStorage.setItem(storageKey, String(position))
        localStorage.setItem(visitedKey, JSON.stringify([...visitedIds]))
        dirty = false
      } catch {
        // Keep the module usable even if persistence is blocked or full.
      }
    }
    const update = (persist = false) => {
      const marker = window.innerHeight * 0.38
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const element = document.getElementById(item.id)
        if (element && element.getBoundingClientRect().top <= marker) {
          current = item.id
          visitedIds.add(item.id)
        }
      }
      setActiveId(current)
      setVisited([...visitedIds])
      setShowTop(window.scrollY > 700)
      if (persist) {
        position = window.scrollY
        dirty = true
        window.clearTimeout(saveTimer)
        saveTimer = window.setTimeout(save, 180)
      }
    }
    const initialFrame = window.requestAnimationFrame(() => {
      setResumePosition(position)
      update()
    })
    const onScroll = () => update(true)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') save()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.cancelAnimationFrame(initialFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', save)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearTimeout(saveTimer)
      save()
    }
  }, [items, storageKey, visitedKey])

  const progress = useMemo(
    () => (items.length ? Math.round((visited.length / items.length) * 100) : 0),
    [items.length, visited.length],
  )

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
          <span className="hidden text-xs font-semibold text-foreground sm:block">
            Progreso de aprendizaje
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs font-bold text-primary">{progress}%</span>
        </div>
      </div>

      {resumePosition > 250 && (
        <div className="mx-auto max-w-7xl px-4 pt-5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: resumePosition, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-[1.02]"
          >
            <Play className="h-4 w-4" />
            Continuar donde quedaste
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:py-12">
        <aside className="mb-8 lg:mb-0">
          <div className="lg:sticky lg:top-28">
            <div className="relative lg:hidden">
              <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={activeId}
                onChange={(event) => goTo(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-border bg-card pl-10 pr-10 text-sm font-semibold text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                aria-label="Índice del módulo"
              >
                {items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <nav className="hidden rounded-2xl border border-border bg-card p-3 shadow-sm lg:block" aria-label="Índice del módulo">
              <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Contenido
              </p>
              <ul className="max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(item.id)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeId === item.id
                          ? 'bg-secondary font-semibold text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          {children}

          <section className="mt-16 rounded-3xl border border-accent/40 bg-secondary p-7 text-center md:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <PartyPopper className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-foreground">
              {completionTitle ?? `¡Has completado el ${moduleLabel}!`}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              {completionDescription ??
                'Ahora puedes revisar tus ejercicios, consultar nuevamente los recursos o continuar con tu aprendizaje.'}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <ArrowUp className="h-4 w-4" />
                Volver al inicio
              </button>
              {nextHref && (
                <Link
                  href={nextHref}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {nextLabel ?? 'Siguiente módulo'}
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}

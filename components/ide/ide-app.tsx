'use client'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  Files,
  Bot,
  GraduationCap,
  PanelsTopLeft,
  X,
  Circle,
  ChevronLeft,
  PanelLeftOpen,
} from 'lucide-react'
import type { editor } from 'monaco-editor'
import type { Monaco } from '@monaco-editor/react'
import { Toolbar } from './toolbar'
import { LearnPanel } from './learn-panel'
import { FileExplorer } from './file-explorer'
import { ConsolePanel } from './console-panel'
import { ExercisePanel } from './exercise-panel'
import { GithubPanel } from './github-panel'
import { ConfirmDialog } from './confirm-dialog'
import { GuiDesigner } from './gui-designer'
import { CoaGuiPreview } from './coa-gui-preview'
import { DiagnosticsPanel } from './diagnostics-panel'
import { useProject } from './use-project'
import {
  addEntries,
  newProject,
  restoreProject,
  validateEntries,
  mergeRuntimeEntries,
  type Project,
} from '@/lib/ide/project'
import { PythonRuntime, type RuntimeState } from '@/lib/ide/runtime'
import type { CoaGuiPreview as CoaGuiPreviewModel } from '@/lib/ide/runtime'
import { insertionAt } from '@/lib/ide/insertion'
import { educationalHints, explainCode } from '@/lib/ide/education'
import { matchesOutput, type Exercise } from '@/lib/ide/exercises'
import {
  explainRuntimeError,
  type CodeDiagnostic,
  type DiagnosticFix,
  type RuntimeDiagnostic,
} from '@/lib/ide/diagnostics'
import type { BuilderChange } from '@/lib/ide/layers'

const CodeEditor = dynamic(
  () => import('./code-editor').then((m) => m.CodeEditor),
  {
    ssr: false,
    loading: () => <p className="ide-loading">Cargando editor…</p>,
  },
)
const statusLabels: Record<RuntimeState, string> = {
  loading: 'Cargando Python…',
  ready: 'Python listo',
  running: 'Ejecutando…',
  input: 'Esperando tu respuesta…',
  stopped: 'Programa detenido',
  error: 'Python no disponible',
}
type Panel = 'learn' | 'files' | 'ai' | 'exercise' | 'designer' | 'github'

export function IdeApp() {
  const { project, update, save, saveStatus, storageError } = useProject()
  const [state, setState] = useState<RuntimeState>('loading')
  const [output, setOutput] = useState('')
  const [pythonError, setPythonError] = useState('')
  const [notice, setNotice] = useState('')
  const [panel, setPanel] = useState<Panel | null>('learn')
  const [welcome, setWelcome] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [explanation, setExplanation] = useState<string[]>([])
  const [exercise, setExercise] = useState('hello')
  const [results, setResults] = useState<boolean[]>([])
  const [checking, setChecking] = useState(false)
  const [replacement, setReplacement] = useState<Project | null>(null)
  const [guiPreview, setGuiPreview] = useState<CoaGuiPreviewModel | null>(null)
  const [cursor, setCursor] = useState({ source: '', offset: 0 })
  const [diagnostics, setDiagnostics] = useState<CodeDiagnostic[]>([])
  const [runtimeDiagnostic, setRuntimeDiagnostic] = useState<RuntimeDiagnostic | null>(null)
  const [runtimeMarker, setRuntimeMarker] = useState<CodeDiagnostic | null>(null)
  const [problemsOpen, setProblemsOpen] = useState(false)
  const runtime = useRef<PythonRuntime | null>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const diagnosticsRef = useRef<CodeDiagnostic[]>([])
  const projectRef = useRef(project)
  const pendingLocation = useRef<{ path: string; line: number; column: number } | null>(null)
  const pendingFix = useRef<DiagnosticFix | null>(null)
  const codeActions = useRef<{ dispose(): void } | null>(null)
  const area = useRef<HTMLDivElement>(null)
  const cancelTests = useRef(false)
  const busy = state === 'running' || state === 'input' || checking
  const collapsed =
    !!project?.consoleCollapsed && state !== 'input' && !expanded
  const source =
    project?.entries.find((e) => e.path === project.active)?.content ?? ''
  const allDiagnostics = useMemo(() => runtimeMarker ? [...diagnostics, runtimeMarker] : diagnostics, [diagnostics, runtimeMarker])
  useEffect(() => { projectRef.current = project }, [project])
  const append = useCallback(
    (text: string) => setOutput((o) => (o + text).slice(-220000)),
    [],
  )
  const report = useCallback((message: string) => setNotice(message), [])
  const analyzeBuilder = useCallback(
    (code: string, offset: number) =>
      runtime.current!.analyzeBuilder(code, offset),
    [],
  )
  useEffect(() => {
    const runner = new PythonRuntime({
      state: setState,
      output: append,
      error: (technical) => {
        setPythonError(technical)
        const explained = explainRuntimeError(technical)
        const current = projectRef.current
        const path = explained.path ?? current?.active
        setRuntimeDiagnostic({ ...explained, path })
        if (path && explained.line) {
          setRuntimeMarker({
            id: `runtime-${path}-${explained.line}`,
            path,
            origin: 'runtime',
            severity: 'error',
            line: explained.line,
            column: explained.column ?? 1,
            endLine: explained.line,
            endColumn: 1000,
            message: explained.title,
            explanation: explained.explanation,
            technical,
          })
        }
      },
    })
    runtime.current = runner
    runner.start()
    const frame = requestAnimationFrame(() => {
      try {
        setWelcome(localStorage.getItem('coa-ide-welcome') !== 'seen')
      } catch {
        /* Welcome remains optional. */
      }
      if (window.innerWidth < 768) setPanel(null)
      if (new URLSearchParams(window.location.search).get('github') === 'error')
        setNotice(
          'No se pudo conectar GitHub. Inténtalo de nuevo desde su panel.',
        )
    })
    return () => {
      cancelAnimationFrame(frame)
      cancelTests.current = true
      runner.dispose()
      codeActions.current?.dispose()
    }
  }, [append])
  useEffect(() => {
    if (!project?.active.endsWith('.py') || state !== 'ready') return
    let active = true
    let retry: ReturnType<typeof setTimeout>
    const analyze = () => {
      void runtime.current!.analyzeDiagnostics(project.entries).then(
        (result) => {
          if (!active) return
          diagnosticsRef.current = result
          setDiagnostics(result)
        },
        (error) => {
          if (active) {
            setNotice(`No se pudo completar Diagnósticos: ${(error as Error).message}`)
            retry = setTimeout(analyze, 180)
          }
        },
      )
    }
    const debounce = setTimeout(analyze, 600)
    return () => {
      active = false
      clearTimeout(debounce)
      clearTimeout(retry)
    }
  }, [source, project?.active, project?.entries, state])
  useEffect(() => {
    const model = editorRef.current?.getModel()
    const monaco = monacoRef.current
    if (!model || !monaco || !project) return
    const visible = allDiagnostics.filter((item) => item.path === project.active)
    diagnosticsRef.current = visible
    monaco.editor.setModelMarkers(model, 'coa-diagnostics', visible.map((item) => ({
      startLineNumber: item.line,
      startColumn: item.column,
      endLineNumber: item.endLine,
      endColumn: item.endColumn,
      message: `${item.message}\n\n${item.explanation}`,
      severity: item.severity === 'error' ? monaco.MarkerSeverity.Error : item.severity === 'warning' ? monaco.MarkerSeverity.Warning : monaco.MarkerSeverity.Info,
      source: item.origin === 'runtime' ? 'Ejecución COA' : 'Diagnósticos COA',
    })))
  }, [allDiagnostics, project])
  useEffect(() => {
    const target = pendingLocation.current
    if (!target || target.path !== project?.active) return
    const frame = requestAnimationFrame(() => {
      editorRef.current?.setPosition({ lineNumber: target.line, column: target.column })
      editorRef.current?.revealLineInCenter(target.line)
      editorRef.current?.focus()
      pendingLocation.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [project?.active])
  useEffect(() => {
    const fix = pendingFix.current
    if (!fix) return
    const frame = requestAnimationFrame(() => {
      pendingFix.current = null
      const ed = editorRef.current
      if (!ed) return
      ed.executeEdits('coa-diagnostics', [{ range: {
        startLineNumber: fix.startLine, startColumn: fix.startColumn,
        endLineNumber: fix.endLine, endColumn: fix.endColumn,
      }, text: fix.text }])
      ed.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [project?.active])
  function dismissWelcome() {
    setWelcome(false)
    try {
      localStorage.setItem('coa-ide-welcome', 'seen')
    } catch {
      /* No persistence available. */
    }
  }
  const run = useCallback(async () => {
    if (!project || busy || state !== 'ready') return
    if (!project.active.endsWith('.py')) {
      report('Selecciona un archivo .py para ejecutar.')
      return
    }
    setPythonError('')
    setRuntimeDiagnostic(null)
    setRuntimeMarker(null)
    setGuiPreview(null)
    setOutput(`❯ ${project.active}\n`)
    setNotice('')
    try {
      await save()
      const result = await runtime.current!.run(project)
      setGuiPreview(result.gui ?? null)
      if (result.entries) {
        validateEntries(result.entries)
        // The editor is read-only during execution, so runtime writes cannot overwrite new edits.
        const entries = result.entries
        update((current) => mergeRuntimeEntries(project, current, entries))
      }
      if (result.ok) append('\nPrograma finalizado.\n')
    } catch (e) {
      report((e as Error).message)
    }
  }, [project, busy, state, report, save, update, append])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return
      if (event.key.toLowerCase() === 's' || event.key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
        if (event.key === 'Enter') void run()
        else void save()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [run, save])
  function stop() {
    cancelTests.current = true
    runtime.current?.stop()
    append(
      '\nPrograma detenido. Pulsa Recargar Python para volver a ejecutar.\n',
    )
  }
  function open(path: string) {
    update((p) => ({
      ...p,
      active: path,
      tabs: [...new Set([...p.tabs, path])],
    }))
    if (window.innerWidth < 768) setPanel(null)
  }
  function closeTab(path: string) {
    update((p) => {
      const tabs = p.tabs.filter((t) => t !== path)
      return {
        ...p,
        tabs,
        active: p.active === path ? (tabs[0] ?? '') : p.active,
      }
    })
  }
  function insert(code: string) {
    const ed = editorRef.current
    if (busy || !project?.active.endsWith('.py')) {
      report('Abre un archivo .py para agregar código.')
      return
    }
    const range = ed?.getSelection()
    if (!ed || !range) {
      report('Coloca el cursor en el editor antes de agregar código.')
      return
    }
    const edit = insertionAt(ed.getValue(), range, code)
    ed.pushUndoStop()
    ed.executeEdits('coa-builder', [edit])
    ed.pushUndoStop()
    ed.focus()
    if (window.innerWidth < 768) setPanel(null)
  }
  function applyBuilderChanges(changes: BuilderChange[]) {
    update((current) => ({
      ...current,
      entries: current.entries.map((entry) => {
        const change = changes.find((item) => item.path === entry.path)
        return change && entry.kind === 'file' ? { ...entry, content: change.content } : entry
      }),
    }))
    const first = changes[0]?.path
    if (first && first !== project?.active) open(first)
  }
  function applyDiagnosticFix(item: CodeDiagnostic, fix: DiagnosticFix) {
    if (item.path && item.path !== project?.active) {
      pendingFix.current = fix
      open(item.path)
      return
    }
    applyEditorFix(fix)
  }
  function applyEditorFix(fix: DiagnosticFix) {
    const ed = editorRef.current
    if (!ed) return
    ed.executeEdits('coa-diagnostics', [
      {
        range: {
          startLineNumber: fix.startLine,
          startColumn: fix.startColumn,
          endLineNumber: fix.endLine,
          endColumn: fix.endColumn,
        },
        text: fix.text,
      },
    ])
    ed.focus()
  }
  function explain() {
    const ed = editorRef.current
    const selection = ed?.getSelection()
    const fragment =
      selection && ed
        ? ed.getModel()?.getValueInRange(selection) ||
          ed.getModel()?.getLineContent(selection.startLineNumber) ||
          ''
        : source
    setExplanation(explainCode(fragment))
    setPanel('learn')
  }
  async function download(all: boolean) {
    if (!project) return
    try {
      const service = await import('@/lib/ide/downloads')
      if (all)
        service.downloadBlob(
          await service.projectZip(project),
          'proyecto-coa.zip',
        )
      else
        service.downloadBlob(
          new Blob([source], { type: 'text/plain;charset=utf-8' }),
          project.active.split('/').pop() || 'main.py',
        )
    } catch {
      report('No se pudo descargar. Inténtalo de nuevo.')
    }
  }
  function loadExercise(e: Exercise) {
    if (!project) return
    const base = `ejercicio-${e.id}`
    let path = base + '.py'
    let index = 2
    while (project.entries.some((entry) => entry.path === path))
      path = `${base}-${index++}.py`
    update(
      addEntries(project, [{ path, kind: 'file', content: e.initialCode }]),
    )
    setResults([])
  }
  async function check(e: Exercise) {
    if (!project || state !== 'ready' || busy) return
    if (!project.active.endsWith('.py')) {
      report('Selecciona el archivo Python de tu ejercicio.')
      return
    }
    setChecking(true)
    setResults([])
    setPythonError('')
    cancelTests.current = false
    setOutput(`Comprobando ${project.active} · ${e.title}\n`)
    try {
      for (const [index, test] of e.tests.entries()) {
        if (cancelTests.current) break
        append(`\nCaso ${index + 1}\n`)
        const result = await runtime.current!.run(project, test.inputs)
        setResults((r) => [
          ...r,
          result.ok && matchesOutput(result.output, test.expected),
        ])
      }
    } catch (error) {
      report((error as Error).message)
    } finally {
      setChecking(false)
    }
  }
  function resize(clientY: number) {
    const bounds = area.current?.getBoundingClientRect()
    if (bounds)
      update((p) => ({
        ...p,
        consoleHeight: Math.round(
          Math.max(
            120,
            Math.min(bounds.height * 0.65, bounds.bottom - clientY),
          ),
        ),
      }))
  }
  if (!project)
    return (
      <main className="coa-ide">
        <p className="ide-loading">Abriendo tu espacio de Python…</p>
      </main>
    )
  return (
    <main className="coa-ide">
      <Toolbar
        active={project.active}
        canRun={state === 'ready' && project.active.endsWith('.py')}
        busy={busy}
        canStop={['loading', 'running', 'input'].includes(state)}
        onRun={() => void run()}
        onStop={stop}
        onDownload={(all) => void download(all)}
        onGithub={() => setPanel((p) => (p === 'github' ? null : 'github'))}
        onRestart={() => runtime.current?.start()}
        needsRestart={state === 'stopped' || state === 'error'}
      />
      {welcome && (
        <div className="ide-welcome">
          <div>
            <strong>Bienvenido al IDE de COA</strong>
            <span>
              Escribe Python, ejecútalo y abre Builder cuando necesites ayuda.
            </span>
          </div>
          <button onClick={dismissWelcome}>Comenzar</button>
          <button className="ide-text-button" onClick={dismissWelcome}>
            Ya sé cómo funciona
          </button>
        </div>
      )}
      {(notice || storageError) && (
        <div className="ide-notice" role="status">
          <span>{notice || storageError}</span>
          {notice && (
            <button aria-label="Cerrar aviso" onClick={() => setNotice('')}>
              <X size={16} />
            </button>
          )}
        </div>
      )}
      <div className="ide-workspace">
        <nav className="ide-activity" aria-label="Herramientas del IDE">
          {(
            [
              { id: 'learn', label: 'Builder', icon: BookOpen },
              { id: 'files', label: 'Archivos', icon: Files },
              { id: 'ai', label: 'COA IA', icon: Bot },
              { id: 'exercise', label: 'Ejercicios', icon: GraduationCap },
              { id: 'designer', label: 'Diseñador', icon: PanelsTopLeft },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              aria-label={item.label}
              title={item.label}
              aria-pressed={panel === item.id}
              className={panel === item.id ? 'active' : ''}
              onClick={() => setPanel((p) => (p === item.id ? null : item.id))}
            >
              <item.icon size={23} />
              <small>{item.label}</small>
            </button>
          ))}
          <span className="ide-activity-bottom">PY</span>
        </nav>
        {panel && panel !== 'designer' && (
          <>
            <button
              className="ide-drawer-backdrop"
              aria-label="Cerrar panel"
              onClick={() => setPanel(null)}
            />
            <aside className="ide-sidebar">
              <button
                className="ide-close-panel"
                aria-label="Cerrar panel"
                title="Cerrar panel"
                onClick={() => setPanel(null)}
              >
                <ChevronLeft size={18} />
              </button>
              {panel === 'learn' && (
                <LearnPanel
                  source={source}
                  cursorOffset={cursor.source === source ? cursor.offset : source.length}
                  onAnalyze={analyzeBuilder}
                  entries={project.entries}
                  activePath={project.active}
                  onApplyChanges={applyBuilderChanges}
                  mode={project.helpMode}
                  onMode={(helpMode) => update((p) => ({ ...p, helpMode }))}
                  onInsert={insert}
                  onExplain={explain}
                  explanation={explanation}
                  hints={
                    project.helpMode === 'free'
                      ? []
                      : educationalHints(source, pythonError)
                  }
                  disabled={busy || !project.active.endsWith('.py')}
                />
              )}
              {panel === 'files' && (
                <FileExplorer
                  project={project}
                  onChange={update}
                  onOpen={open}
                  onError={report}
                  onNew={() => setReplacement(newProject())}
                  disabled={busy}
                />
              )}
              {panel === 'exercise' && (
                <ExercisePanel
                  selected={exercise}
                  onSelect={(id) => {
                    setExercise(id)
                    setResults([])
                  }}
                  onLoad={loadExercise}
                  onCheck={(e) => void check(e)}
                  results={results}
                  busy={busy}
                  ready={state === 'ready'}
                />
              )}
              {panel === 'github' && (
                <GithubPanel
                  project={project}
                  onImport={(p) => setReplacement(restoreProject(p))}
                  onError={report}
                  onSave={save}
                />
              )}
              {panel === 'ai' && (
                <section className="ide-panel ide-ai">
                  <div className="ide-ai-icon">
                    <Bot size={38} />
                  </div>
                  <p className="ide-eyebrow">UN COMPAÑERO PARA APRENDER</p>
                  <h2>COA IA</h2>
                  <span className="ide-badge">Próximamente</span>
                  <p>
                    Un espacio para entender errores, explorar tu código y
                    recibir pistas sin perder la oportunidad de pensar.
                  </p>
                  <p className="ide-muted">
                    El Builder ya funciona y no necesita
                    inteligencia artificial.
                  </p>
                  <button
                    className="ide-primary wide"
                    onClick={() => setPanel('learn')}
                  >
                    <BookOpen size={16} /> Abrir Builder
                  </button>
                </section>
              )}
            </aside>
          </>
        )}
        {panel === 'designer' && (
          <GuiDesigner
            design={project.guiDesign}
            onChange={(guiDesign) => update((p) => ({ ...p, guiDesign }))}
            onSave={save}
            onAnalyze={(source) => runtime.current!.analyzeGui(source)}
          />
        )}
        <div
          className="ide-editor-area"
          ref={area}
          style={{ display: panel === 'designer' ? 'none' : undefined }}
        >
          <div
            className="ide-tabs"
            role="tablist"
            aria-label="Archivos abiertos"
          >
            {!panel && (
              <button
                title="Abrir explorador"
                aria-label="Abrir explorador"
                onClick={() => setPanel('files')}
              >
                <PanelLeftOpen size={17} />
              </button>
            )}
            {project.tabs.map((path) => (
              <div
                className={
                  'ide-tab ' + (path === project.active ? 'active' : '')
                }
                key={path}
              >
                <button
                  role="tab"
                  aria-selected={path === project.active}
                  onClick={() => open(path)}
                >
                  <span className="ide-py">
                    {path.endsWith('.py') ? 'py' : '·'}
                  </span>
                  {path.split('/').pop()}
                </button>
                <button
                  aria-label={`Cerrar ${path}`}
                  title={`Cerrar ${path}`}
                  onClick={() => closeTab(path)}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
          <div
            className="ide-editor"
            style={{ display: expanded ? 'none' : undefined }}
          >
            {project.active ? (
              <CodeEditor
                path={project.active}
                content={source}
                readOnly={busy}
                onChange={(content) =>
                  {
                    setRuntimeMarker(null)
                    setRuntimeDiagnostic(null)
                    update((p) => ({
                      ...p,
                      entries: p.entries.map((e) =>
                        e.path === p.active ? { ...e, content } : e,
                      ),
                    }))
                  }
                }
                onMount={(ed, monaco) => {
                  editorRef.current = ed
                  monacoRef.current = monaco
                  codeActions.current?.dispose()
                  codeActions.current = monaco.languages.registerCodeActionProvider(
                    'python',
                    {
                      provideCodeActions(model, range) {
                        const fixes = diagnosticsRef.current.filter(
                          (item) =>
                            item.fix &&
                            item.line <= range.endLineNumber &&
                            item.endLine >= range.startLineNumber,
                        )
                        return {
                          actions: fixes.map((item) => ({
                            title: `💡 ${item.fix!.title}`,
                            kind: 'quickfix',
                            isPreferred: true,
                            edit: {
                              edits: [
                                {
                                  resource: model.uri,
                                  textEdit: {
                                    range: {
                                      startLineNumber: item.fix!.startLine,
                                      startColumn: item.fix!.startColumn,
                                      endLineNumber: item.fix!.endLine,
                                      endColumn: item.fix!.endColumn,
                                    },
                                    text: item.fix!.text,
                                  },
                                  versionId: model.getVersionId(),
                                },
                              ],
                            },
                          })),
                          dispose() {},
                        }
                      },
                    },
                  )
                  const position = ed.getPosition()
                  if (position)
                    setCursor({
                      source: ed.getValue(),
                      offset: ed.getModel()?.getOffsetAt(position) ?? 0,
                    })
                  ed.onDidChangeCursorPosition(({ position: next }) =>
                    setCursor({
                      source: ed.getValue(),
                      offset: ed.getModel()?.getOffsetAt(next) ?? 0,
                    }),
                  )
                }}
              />
            ) : (
              <div className="ide-empty">
                <Files size={32} />
                <h2>Tu próxima idea empieza aquí</h2>
                <p>Crea un archivo o abre uno desde el explorador.</p>
                <button
                  className="ide-primary"
                  onClick={() => setPanel('files')}
                >
                  Abrir archivos
                </button>
              </div>
            )}
            {guiPreview && (
              <CoaGuiPreview
                preview={guiPreview}
                onClose={() => setGuiPreview(null)}
                onCommand={async (id, values) => {
                  try {
                    const next = await runtime.current!.invokeGui(id, values)
                    setGuiPreview(next)
                    return next
                  } catch (error) {
                    report((error as Error).message)
                    throw error
                  }
                }}
              />
            )}
          </div>
          {!expanded && !collapsed && (
            <div
              className="ide-separator"
              role="separator"
              aria-label="Cambiar tamaño de consola"
              aria-orientation="horizontal"
              aria-valuemin={120}
              aria-valuemax={500}
              aria-valuenow={project.consoleHeight}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  update((p) => ({
                    ...p,
                    consoleHeight: Math.min(
                      500,
                      Math.max(
                        120,
                        p.consoleHeight + (e.key === 'ArrowUp' ? 20 : -20),
                      ),
                    ),
                  }))
                }
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                resize(e.clientY)
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  resize(e.clientY)
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  e.currentTarget.releasePointerCapture(e.pointerId)
              }}
            />
          )}
          <div
            className={
              'ide-console-container ' +
              (expanded ? 'expanded' : collapsed ? 'collapsed' : '')
            }
            style={expanded ? undefined : { height: project.consoleHeight }}
          >
            <ConsolePanel
              output={output}
              diagnostic={runtimeDiagnostic}
              waiting={state === 'input'}
              onInput={(text) => {
                try {
                  runtime.current?.input(text)
                } catch (e) {
                  report((e as Error).message)
                }
              }}
              onClear={() => {
                setOutput('')
                setRuntimeDiagnostic(null)
              }}
              expanded={expanded}
              collapsed={collapsed}
              onCollapse={() => {
                setExpanded(false)
                update((p) => ({ ...p, consoleCollapsed: !collapsed }))
              }}
              onExpand={() => setExpanded((e) => !e)}
            />
          </div>
        </div>
      </div>
      <footer className="ide-status">
        <span>
          <Circle
            size={8}
            fill="currentColor"
            className={state === 'ready' ? 'ide-success' : ''}
          />
          {statusLabels[state]}
        </span>
        <span title="Ctrl+S para guardar">{saveStatus}</span>
        <button
          className="diagnostics-summary"
          aria-expanded={problemsOpen}
          onClick={() => setProblemsOpen((open) => !open)}
        >
          ❌ {allDiagnostics.filter((item) => item.severity === 'error').length}
          {'  '}⚠️ {allDiagnostics.filter((item) => item.severity === 'warning').length}
          {'  '}💡 {allDiagnostics.filter((item) => item.fix).length}
        </button>
        <span className="ide-status-help">Python · UTF-8 · 4 espacios</span>
      </footer>
      {problemsOpen && (
        <DiagnosticsPanel
          diagnostics={allDiagnostics}
          onSelect={(item) => {
            const path = item.path ?? project.active
            pendingLocation.current = { path, line: item.line, column: item.column }
            if (path !== project.active) open(path)
            else {
              editorRef.current?.setPosition({ lineNumber: item.line, column: item.column })
              editorRef.current?.revealLineInCenter(item.line)
              editorRef.current?.focus()
              pendingLocation.current = null
            }
          }}
          onFix={applyDiagnosticFix}
        />
      )}
      {replacement && (
        <ConfirmDialog
          title="Reemplazar proyecto actual"
          onCancel={() => setReplacement(null)}
          onConfirm={() => {
            if (busy) stop()
            update(replacement)
            setReplacement(null)
            setResults([])
          }}
        >
          <p>
            Se reemplazará el proyecto de este navegador. Descarga una copia si
            deseas conservarlo.
          </p>
          <button className="ide-secondary" onClick={() => void download(true)}>
            Descargar proyecto actual
          </button>
        </ConfirmDialog>
      )}
    </main>
  )
}

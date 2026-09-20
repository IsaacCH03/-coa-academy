'use client'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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
  Blocks,
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
import { SettingsPanel } from './settings-panel'
import { CoaGuiDialog } from './coa-gui-dialog'
import { GeneratedCodePanel } from './generated-code-panel'
import { EditorGroup } from './editor-group'
import { ExtensionsPanel } from './extensions-panel'
import { useProject } from './use-project'
import {
  addEntries,
  newProject,
  restoreProject,
  validateEntries,
  mergeRuntimeEntries,
  type Project,
} from '@/lib/ide/project'
import { PythonRuntime, type CoaGuiDialogRequest, type RuntimeState } from '@/lib/ide/runtime'
import type { CoaGuiPreview as CoaGuiPreviewModel } from '@/lib/ide/runtime'
import { builderInsertion } from '@/lib/ide/insertion'
import { educationalHints, explainCode } from '@/lib/ide/education'
import { matchesOutput, type Exercise } from '@/lib/ide/exercises'
import {
  explainRuntimeError,
  type CodeDiagnostic,
  type DiagnosticFix,
  type RuntimeDiagnostic,
} from '@/lib/ide/diagnostics'
import type { BuilderChange } from '@/lib/ide/layers'
import { DEFAULT_SETTINGS, accentColor, derivedColors, quickInsertion, type AppearanceProfile, type QuickAction, type StudioSettings } from '@/lib/ide/personalization'
import { deleteCustomBackground, loadCustomBackground, loadProfiles, loadSettings, saveCustomBackground, saveProfiles, saveSettings } from '@/lib/ide/personalization-storage'
import { convertCoaGuiToTkinter, usesCoaGui } from '@/lib/ide/coa-gui-converter'
import { entryBlob } from '@/lib/ide/binary'
import { DEFAULT_EXTENSIONS, loadExtensions, saveExtensions, type ExtensionState } from '@/lib/ide/extensions'

const statusLabels: Record<RuntimeState, string> = {
  loading: 'Cargando Python…',
  ready: 'Python listo',
  running: 'Ejecutando…',
  input: 'Esperando tu respuesta…',
  stopped: 'Programa detenido',
  error: 'Python no disponible',
}
type Panel = 'learn' | 'files' | 'ai' | 'exercise' | 'designer' | 'github' | 'settings' | 'extensions'

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
  const [guiDialog, setGuiDialog] = useState<CoaGuiDialogRequest | null>(null)
  const [previewDialog, setPreviewDialog] = useState<CoaGuiDialogRequest | null>(null)
  const [tkinterCode, setTkinterCode] = useState('')
  const [cursor, setCursor] = useState({ source: '', offset: 0 })
  const [diagnostics, setDiagnostics] = useState<CodeDiagnostic[]>([])
  const [runtimeDiagnostic, setRuntimeDiagnostic] = useState<RuntimeDiagnostic | null>(null)
  const [runtimeMarker, setRuntimeMarker] = useState<CodeDiagnostic | null>(null)
  const [problemsOpen, setProblemsOpen] = useState(false)
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_SETTINGS)
  const [profiles, setProfiles] = useState<AppearanceProfile[]>([])
  const [backgroundUrl, setBackgroundUrl] = useState('')
  const [mobileFocused, setMobileFocused] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [focusDismissed, setFocusDismissed] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [personalizationReady, setPersonalizationReady] = useState(false)
  const [extensions, setExtensions] = useState<ExtensionState>(DEFAULT_EXTENSIONS)
  const [extensionsReady, setExtensionsReady] = useState(false)
  const runtime = useRef<PythonRuntime | null>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const editorSelections = useRef(new WeakMap<editor.ICodeEditor, { model: editor.ITextModel; selection: import('monaco-editor').Selection }>())
  const editorRefs = useRef<Partial<Record<1 | 2, editor.IStandaloneCodeEditor>>>({})
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
  const activeGroup = project?.activeEditorGroup === 2 && project.splitEnabled ? 2 : 1
  const activePath = activeGroup === 2 ? (project?.secondaryActive || project?.active || '') : (project?.active || '')
  const source = project?.entries.find((e) => e.path === activePath)?.content ?? ''
  const allDiagnostics = useMemo(() => runtimeMarker ? [...diagnostics, runtimeMarker] : diagnostics, [diagnostics, runtimeMarker])
  useEffect(() => { projectRef.current = project }, [project])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const restoredSettings = loadSettings()
      setSettings(restoredSettings)
      setProfiles(loadProfiles())
      setPersonalizationReady(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => { if (!personalizationReady) return; try { saveSettings(settings) } catch { /* Personalization stays optional. */ } }, [settings, personalizationReady])
  useEffect(() => { if (!personalizationReady) return; try { saveProfiles(profiles) } catch { /* Profiles stay optional. */ } }, [profiles, personalizationReady])
  useEffect(() => { const frame=requestAnimationFrame(()=>{setExtensions(loadExtensions());setExtensionsReady(true)}); return()=>cancelAnimationFrame(frame) },[])
  useEffect(() => { if(extensionsReady) try { saveExtensions(extensions) } catch { /* Local extension state is optional. */ } },[extensions,extensionsReady])
  useEffect(() => {
    if (!personalizationReady || settings.background !== 'custom') return
    let active = true
    void loadCustomBackground(settings.customBackgroundId).then((blob) => {
      if (!active) return
      if (!blob) { setBackgroundUrl(''); setNotice('El fondo personalizado de este perfil ya no está disponible.'); return }
      const next = URL.createObjectURL(blob)
      setBackgroundUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return next })
    })
    return () => { active = false }
  }, [personalizationReady, settings.background, settings.customBackgroundId])
  useEffect(() => {
    const visible = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visible)
    return () => document.removeEventListener('visibilitychange', visible)
  }, [])
  useEffect(() => {
    const viewport = window.visualViewport
    const check = () => {
      const mobile = matchMedia('(max-width: 767px)').matches
      const keyboard = viewport ? window.innerHeight - viewport.height > 140 : mobileFocused
      setKeyboardVisible(mobile && keyboard)
      if (!mobileFocused || !mobile || !keyboard) setFocusDismissed(false)
      document.documentElement.style.setProperty('--coa-visible-height', `${viewport?.height ?? window.innerHeight}px`)
    }
    viewport?.addEventListener('resize', check)
    window.addEventListener('resize', check)
    check()
    return () => { viewport?.removeEventListener('resize', check); window.removeEventListener('resize', check) }
  }, [mobileFocused])
  const append = useCallback(
    (text: string) => setOutput((o) => (o + text).slice(-220000)),
    [],
  )
  const report = useCallback((message: string) => setNotice(message), [])
  async function saveAppearanceProfile(name: string) {
    let snapshot: StudioSettings = { ...settings, quickBar: [...settings.quickBar] }
    if (snapshot.background === 'custom') {
      const blob = await loadCustomBackground(snapshot.customBackgroundId)
      if (!blob) {
        report('Vuelve a subir el GIF antes de guardar este perfil; el archivo anterior ya no está disponible.')
        return false
      }
      snapshot = { ...snapshot, customBackgroundId: await saveCustomBackground(blob) }
    }
    setProfiles((current) => [...current, { id: crypto.randomUUID(), name, settings: snapshot }])
    return true
  }
  async function deleteAppearanceProfile(profile: AppearanceProfile) {
    const remaining = profiles.filter((item) => item.id !== profile.id)
    setProfiles(remaining)
    const assetId = profile.settings.customBackgroundId
    const stillUsed = settings.customBackgroundId === assetId || remaining.some((item) => item.settings.customBackgroundId === assetId)
    if (assetId && !stillUsed) await deleteCustomBackground(assetId)
  }
  async function removeCurrentBackground() {
    if (backgroundUrl) URL.revokeObjectURL(backgroundUrl)
    setBackgroundUrl('')
    const assetId = settings.customBackgroundId
    const usedByProfile = profiles.some((profile) => profile.settings.customBackgroundId === assetId)
    if (assetId && !usedByProfile) await deleteCustomBackground(assetId)
  }
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
      dialog: setGuiDialog,
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
    if (!project || !activePath.endsWith('.py') || state !== 'ready') return
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
  }, [source, activePath, project, state])
  useEffect(() => {
    const model = editorRef.current?.getModel()
    const monaco = monacoRef.current
    if (!model || !monaco || !project) return
    const visible = allDiagnostics.filter((item) => item.path === activePath)
    diagnosticsRef.current = allDiagnostics
    monaco.editor.setModelMarkers(model, 'coa-diagnostics', visible.map((item) => ({
      startLineNumber: item.line,
      startColumn: item.column,
      endLineNumber: item.endLine,
      endColumn: item.endColumn,
      message: `${item.message}\n\n${item.explanation}`,
      severity: item.severity === 'error' ? monaco.MarkerSeverity.Error : item.severity === 'warning' ? monaco.MarkerSeverity.Warning : monaco.MarkerSeverity.Info,
      source: item.origin === 'runtime' ? 'Ejecución COA' : 'Diagnósticos COA',
    })))
  }, [allDiagnostics, project, activePath])
  useEffect(() => {
    const target = pendingLocation.current
    if (!target || target.path !== activePath) return
    const frame = requestAnimationFrame(() => {
      const targetEditor = editorRefs.current[activeGroup] ?? editorRef.current
      editorRef.current = targetEditor ?? null
      targetEditor?.setPosition({ lineNumber: target.line, column: target.column })
      targetEditor?.revealLineInCenter(target.line)
      targetEditor?.focus()
      setTimeout(()=>targetEditor?.focus(),0)
      pendingLocation.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [activePath, activeGroup])
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
  }, [activePath])
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
    if (!activePath.endsWith('.py')) {
      report('Selecciona un archivo .py para ejecutar.')
      return
    }
    setPythonError('')
    setRuntimeDiagnostic(null)
    setRuntimeMarker(null)
    setGuiPreview(null)
    setOutput(`❯ ${activePath}\n`)
    setNotice('')
    try {
      await save()
      const result = await runtime.current!.run({ ...project, active: activePath })
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
  }, [project, activePath, busy, state, report, save, update, append])
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
    setGuiDialog(null)
    append(
      '\nPrograma detenido. Pulsa Recargar Python para volver a ejecutar.\n',
    )
  }
  function open(path: string) {
    update((p) => p.activeEditorGroup === 2 && p.splitEnabled ? { ...p, secondaryActive: path, secondaryTabs: [...new Set([...(p.secondaryTabs ?? []), path])] } : { ...p, active: path, tabs: [...new Set([...p.tabs, path])] })
    if (window.innerWidth < 768) setPanel(null)
  }
  function openAside(path: string, orientation: 'right' | 'down' = 'right') {
    if (window.innerWidth < 768) { report('Split Editor está disponible en pantallas más grandes.'); open(path); return }
    update((p) => ({ ...p, splitEnabled: true, splitOrientation: orientation, activeEditorGroup: 2, secondaryActive: path, secondaryTabs: [...new Set([...(p.secondaryTabs ?? []), path])] }))
    setPanel(null)
  }
  function closeTab(path: string, group: 1 | 2 = activeGroup) {
    update((p) => {
      const tabs = (group === 1 ? p.tabs : (p.secondaryTabs ?? [])).filter((t) => t !== path)
      if (group === 2) return { ...p, secondaryTabs: tabs, secondaryActive: p.secondaryActive === path ? (tabs[0] ?? '') : p.secondaryActive, splitEnabled: tabs.length > 0, activeEditorGroup: tabs.length ? p.activeEditorGroup : 1 }
      return {
        ...p,
        tabs,
        active: p.active === path ? (tabs[0] ?? '') : p.active,
      }
    })
  }
  function closeSplit() {
    update((p) => ({ ...p, tabs: [...new Set([...p.tabs, ...(p.secondaryTabs ?? [])])], splitEnabled: false, activeEditorGroup: 1, secondaryActive: '', secondaryTabs: [] }))
  }
  function insert(code: string) {
    const ed = monacoRef.current?.editor.getEditors().find((candidate) => candidate.hasTextFocus()) ?? editorRef.current
    const model = ed?.getModel()
    if (busy || model?.getLanguageId() !== 'python') {
      report('Abre un archivo .py para agregar código.')
      return
    }
    const saved = ed && editorSelections.current.get(ed)
    const range = ed?.getSelection() ?? (saved?.model === model ? saved?.selection : null)
    if (!ed || !range) {
      report('Coloca el cursor en el editor antes de agregar código.')
      return
    }
    const plan = builderInsertion(ed.getValue(), range, code, model!.getOptions())
    ed.pushUndoStop()
    ed.executeEdits('coa-builder', plan.edits)
    const preceding = model!.getValue().replace(/\r\n/g, '\n').slice(0, plan.cursorOffset).split('\n')
    const next = { lineNumber: preceding.length, column: preceding.at(-1)!.length + 1 }
    ed.setSelection({ startLineNumber: next.lineNumber, startColumn: next.column, endLineNumber: next.lineNumber, endColumn: next.column + plan.selectionLength })
    ed.revealPositionInCenterIfOutsideViewport(next)
    ed.pushUndoStop()
    ed.focus()
    if (window.innerWidth < 768) setPanel(null)
  }
  function quickAction(action: QuickAction) {
    const ed = editorRef.current
    if (!ed) return
    if (action === '←' || action === '→') {
      const position = ed.getPosition(); if (!position) return
      const offset = ed.getModel()?.getOffsetAt(position) ?? 0
      const next = ed.getModel()?.getPositionAt(Math.max(0, offset + (action === '←' ? -1 : 1)))
      if (next) ed.setPosition(next)
    } else if (action === 'Tab' || action === 'Desindentar') {
      ed.trigger('coa-mobile', action === 'Tab' ? 'tab' : 'outdent', null)
    } else if (action === 'Enter') {
      ed.trigger('coa-shortcuts', 'type', { text: '\n' })
    } else if (action === 'Backspace') {
      ed.trigger('coa-shortcuts', 'deleteLeft', null)
    } else {
      const pairs: Partial<Record<QuickAction, [string, string]>> = { '()':['(',')'], '[]':['[',']'], '{}':['{','}'], '""':['"','"'], "''":["'","'"] }
      const selection = ed.getSelection()
      const pair = pairs[action]
      if (pair && selection) {
        const selected = ed.getModel()?.getValueInRange(selection) ?? ''
        ed.executeEdits('coa-shortcuts', [{ range: selection, text: `${pair[0]}${selected}${pair[1]}` }])
        if (!selected) ed.trigger('coa-shortcuts', 'cursorLeft', null)
      } else {
        const value = quickInsertion(action)
        ed.trigger('coa-shortcuts', 'type', { text: value.text })
        if (value.cursorBack) ed.trigger('coa-shortcuts', 'cursorLeft', null)
      }
    }
    ed.focus()
  }
  function applyBuilderChanges(changes: BuilderChange[]) {
    if (busy) return
    for (const change of changes.filter((item) => !item.blocked)) {
      const ed = Object.values(editorRefs.current).find((candidate) => decodeURIComponent(candidate?.getModel()?.uri.path ?? '').replace(/^\//, '') === change.path)
      const model = ed?.getModel()
      if (!ed || !model) continue
      const before = model.getValue(), after = change.content
      let start = 0, end = 0
      while (start < Math.min(before.length, after.length) && before[start] === after[start]) start++
      while (end < Math.min(before.length, after.length) - start && before[before.length - end - 1] === after[after.length - end - 1]) end++
      const from = model.getPositionAt(start), to = model.getPositionAt(before.length - end)
      ed.pushUndoStop()
      ed.executeEdits('coa-builder-refactor', [{ range: { startLineNumber: from.lineNumber, startColumn: from.column, endLineNumber: to.lineNumber, endColumn: to.column }, text: after.slice(start, after.length - end) }])
      ed.pushUndoStop()
    }
    update((current) => ({
      ...current,
      entries: current.entries.map((entry) => {
        const change = changes.find((item) => item.path === entry.path && !item.blocked)
        return change && entry.kind === 'file' ? { ...entry, content: change.content } : entry
      }),
    }))
    const first = changes[0]?.path
    if (first && first !== activePath) open(first)
  }
  function applyDiagnosticFix(item: CodeDiagnostic, fix: DiagnosticFix) {
    if (item.path && item.path !== activePath) {
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
          entryBlob(project.entries.find((entry)=>entry.path===activePath)!),
          activePath.split('/').pop() || 'main.py',
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
    if (!activePath.endsWith('.py')) {
      report('Selecciona el archivo Python de tu ejercicio.')
      return
    }
    setChecking(true)
    setResults([])
    setPythonError('')
    cancelTests.current = false
    setOutput(`Comprobando ${activePath} · ${e.title}\n`)
    try {
      for (const [index, test] of e.tests.entries()) {
        if (cancelTests.current) break
        append(`\nCaso ${index + 1}\n`)
        const result = await runtime.current!.run({ ...project, active: activePath }, test.inputs)
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
  function activateEditor(group: 1 | 2) {
    editorRef.current = editorRefs.current[group] ?? null
    const ed = editorRef.current, position = ed?.getPosition()
    if (ed && position) setCursor({ source: ed.getValue(), offset: ed.getModel()?.getOffsetAt(position) ?? 0 })
    update((p) => ({ ...p, activeEditorGroup: group }))
    setMobileFocused(true)
  }
  function mountEditor(group: 1 | 2, ed: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRefs.current[group] = ed
    if (group === activeGroup) editorRef.current = ed
    monacoRef.current = monaco
    if (!codeActions.current) codeActions.current = monaco.languages.registerCodeActionProvider('python', {
      provideCodeActions(model, range) {
        const path = decodeURIComponent(model.uri.path).replace(/^\//, '')
        const fixes = diagnosticsRef.current.filter((item) => item.path === path && item.fix && item.line <= range.endLineNumber && item.endLine >= range.startLineNumber)
        return { actions: fixes.map((item) => ({ title: `💡 ${item.fix!.title}`, kind: 'quickfix', isPreferred: true, edit: { edits: [{ resource: model.uri, textEdit: { range: { startLineNumber: item.fix!.startLine, startColumn: item.fix!.startColumn, endLineNumber: item.fix!.endLine, endColumn: item.fix!.endColumn }, text: item.fix!.text }, versionId: model.getVersionId() }] } })), dispose() {} }
      },
    })
    const remember = () => {
      const model = ed.getModel(), selection = ed.getSelection(), position = ed.getPosition()
      if (model && selection) editorSelections.current.set(ed, { model, selection })
      if (editorRef.current === ed && position) setCursor({ source: ed.getValue(), offset: model?.getOffsetAt(position) ?? 0 })
    }
    const subscriptions = [ed.onDidFocusEditorText(() => { editorRef.current = ed; remember() }), ed.onDidChangeCursorSelection(remember), ed.onDidChangeModel(remember), ed.onDidChangeModelContent(remember)]
    ed.onDidDispose(() => {
      subscriptions.forEach((subscription) => subscription.dispose())
      editorSelections.current.delete(ed)
      if (editorRefs.current[group] === ed) delete editorRefs.current[group]
      if (editorRef.current === ed) editorRef.current = null
    })
    remember()
  }
  function navigateDefinition(path: string, line: number, column: number) {
    const secondHasFile = project?.splitEnabled && (project.secondaryTabs ?? []).includes(path)
    const group: 1 | 2 = secondHasFile ? 2 : 1
    pendingLocation.current = { path, line, column }
    if (group === activeGroup && activePath === path) {
      requestAnimationFrame(()=>{const ed=editorRefs.current[group];editorRef.current=ed??null;ed?.setPosition({lineNumber:line,column});ed?.revealLineInCenter(line);ed?.focus();pendingLocation.current=null})
      return
    }
    update((p) => group === 2 ? { ...p, activeEditorGroup: 2, secondaryActive: path } : { ...p, activeEditorGroup: 1, active: path, tabs: [...new Set([...p.tabs, path])] })
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
  const colors = derivedColors(accentColor(settings))
  const focusMode = settings.mobileFocus && mobileFocused && keyboardVisible && !focusDismissed
  const studioStyle = { '--accent': colors.accent, '--accent-hover': colors.hover, '--selection': colors.selection, '--accent-subtle': colors.subtle, '--studio-bg': colors.background, '--studio-bg-secondary': colors.backgroundSecondary, '--surface': colors.surface, '--surface-elevated': colors.surfaceElevated, '--editor-bg': colors.editor, '--console-bg': colors.console, '--sidebar-bg': colors.sidebar, '--header-bg': colors.header, '--status-bg': colors.status, '--tab-bg': colors.tab, '--tab-active-bg': colors.tabActive, '--palette-border': colors.border, '--text-primary': colors.text, '--text-secondary': colors.textSecondary, '--background-opacity': settings.wallpaperVisibility / 100, '--interface-solid': `${100 - settings.interfaceTransparency}%`, '--background-blur': `${settings.backgroundBlur}px`, '--background-darkness': settings.backgroundDarkness / 100, '--custom-background': backgroundUrl ? `url("${backgroundUrl}")` : 'none' } as CSSProperties
  return (
    <main className={`coa-ide theme-${settings.style} density-${settings.density}${settings.highContrast ? ' high-contrast' : ''}${settings.reduceMotion ? ' reduce-motion' : ''}${focusMode ? ' mobile-focus' : ''}${settings.pauseHidden && !pageVisible ? ' background-paused' : ''}${settings.background !== 'none' ? ' coa-wallpaper-active' : ''}`} data-accent={settings.accent} data-background={settings.background} data-wallpaper={settings.background !== 'none'} data-animation={settings.animation} data-fit={settings.backgroundFit} style={studioStyle}>
      {settings.background !== 'none' && <div className="ide-background" aria-hidden="true" />}
      {settings.background !== 'none' && <div className="ide-background-overlay" aria-hidden="true" />}
      <Toolbar
        active={activePath}
        canRun={state === 'ready' && activePath.endsWith('.py')}
        busy={busy}
        canStop={['loading', 'running', 'input'].includes(state)}
        onRun={() => void run()}
        onStop={stop}
        onDownload={(all) => void download(all)}
        onGithub={() => setPanel((p) => (p === 'github' ? null : 'github'))}
        onRestart={() => runtime.current?.start()}
        needsRestart={state === 'stopped' || state === 'error'}
        onSettings={() => setPanel((p) => p === 'settings' ? null : 'settings')}
        canExportTkinter={usesCoaGui(source)}
        onExportTkinter={() => {
          try { setTkinterCode(convertCoaGuiToTkinter(source)) }
          catch (error) { report((error as Error).message) }
        }}
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
              { id: 'extensions', label: 'Extensiones', icon: Blocks },
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
                  cursorOffset={cursor.source === source ? cursor.offset : 0}
                  onAnalyze={analyzeBuilder}
                  entries={project.entries}
                  activePath={activePath}
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
                  disabled={busy || !activePath.endsWith('.py')}
                />
              )}
              {panel === 'files' && (
                <FileExplorer
                  project={project}
                  onChange={update}
                  onOpen={open}
                  onOpenAside={openAside}
                  onError={report}
                  onNew={() => setReplacement(newProject())}
                  disabled={busy}
                  explorerLabel={settings.style === 'eclipse' ? 'PACKAGE EXPLORER' : settings.style === 'vscode' ? 'EXPLORER' : 'EXPLORADOR'}
                  themedIcons={settings.style === 'eclipse'}
                />
              )}
              {panel === 'settings' && <SettingsPanel settings={settings} profiles={profiles} customBackgroundUrl={backgroundUrl} onChange={setSettings} onProfiles={setProfiles} onSaveProfile={saveAppearanceProfile} onDeleteProfile={deleteAppearanceProfile} notice={report} onImage={saveCustomBackground} onRemoveImage={removeCurrentBackground} onPreviewDialog={() => setPreviewDialog({kind:'showinfo',title:'Información',message:'Así se verán las ventanas emergentes de COA GUI.'})} onReset={() => { if (!confirm('¿Restaurar la configuración visual predeterminada? Tus proyectos no se eliminarán.')) return; void removeCurrentBackground(); setSettings({...DEFAULT_SETTINGS,quickBar:[...DEFAULT_SETTINGS.quickBar]}) }} />}
              {panel === 'extensions' && <ExtensionsPanel extensions={extensions} onChange={setExtensions}/>}
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
          style={{
            display: panel === 'designer' ? 'none' : undefined,
            '--console-height': `${collapsed || expanded ? 0 : project.consoleHeight}px`,
          } as CSSProperties}
        >
          {settings.splitToolbar && <div className="ide-split-toolbar"><button aria-label="Abrir explorador" title="Abrir explorador" onClick={()=>setPanel('files')}><PanelLeftOpen size={16}/></button><button onClick={()=>openAside(activePath,'right')}>Dividir a la derecha</button><button onClick={()=>openAside(activePath,'down')}>Dividir abajo</button>{project.splitEnabled&&<button onClick={closeSplit}>Cerrar división</button>}<button className="ide-split-toolbar-close" aria-label="Desactivar barra de división" title="Desactivar barra de división" onClick={()=>setSettings(current=>({...current,splitToolbar:false}))}><X size={18}/></button></div>}
          <div className={`ide-editor-split ${project.splitEnabled ? `active ${project.splitOrientation}` : ''}`} style={{ display: expanded ? 'none' : undefined, '--split-ratio': `${project.splitRatio ?? 50}%` } as CSSProperties}>
            <EditorGroup group={1} path={project.active} tabs={project.tabs} entries={project.entries} readOnly={busy} settings={settings} excelViewerEnabled={extensions['excel-viewer'].enabled} onInstallExcelViewer={()=>setExtensions(current=>({...current,'excel-viewer':{installed:true,enabled:true}}))} onActivate={()=>activateEditor(1)} onOpen={(path)=>{update(p=>({...p,active:path,activeEditorGroup:1}));}} onClose={(path)=>closeTab(path,1)} onChange={(path,content)=>{setRuntimeMarker(null);setRuntimeDiagnostic(null);update(p=>({...p,entries:p.entries.map(e=>e.path===path?{...e,content}:e)}))}} onMount={(ed,monaco)=>mountEditor(1,ed,monaco)} onNavigate={navigateDefinition} onNotice={report}/>
            {project.splitEnabled&&<><div className="ide-split-divider" role="separator" aria-label="Redimensionar editores" tabIndex={0} onPointerDown={(e)=>e.currentTarget.setPointerCapture(e.pointerId)} onPointerMove={(e)=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))return;const box=e.currentTarget.parentElement?.getBoundingClientRect();if(!box)return;const ratio=project.splitOrientation==='down'?(e.clientY-box.top)/box.height*100:(e.clientX-box.left)/box.width*100;update(p=>({...p,splitRatio:Math.min(75,Math.max(25,Math.round(ratio)))}));editorRefs.current[1]?.layout();editorRefs.current[2]?.layout()}}/><EditorGroup group={2} path={project.secondaryActive ?? ''} tabs={project.secondaryTabs ?? []} entries={project.entries} readOnly={busy} settings={settings} excelViewerEnabled={extensions['excel-viewer'].enabled} onInstallExcelViewer={()=>setExtensions(current=>({...current,'excel-viewer':{installed:true,enabled:true}}))} onActivate={()=>activateEditor(2)} onOpen={(path)=>update(p=>({...p,secondaryActive:path,activeEditorGroup:2}))} onClose={(path)=>closeTab(path,2)} onChange={(path,content)=>{setRuntimeMarker(null);setRuntimeDiagnostic(null);update(p=>({...p,entries:p.entries.map(e=>e.path===path?{...e,content}:e)}))}} onMount={(ed,monaco)=>mountEditor(2,ed,monaco)} onNavigate={navigateDefinition} onNotice={report}/></>}
          </div>
          <div className="ide-editor-overlay">
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
          {tkinterCode && <GeneratedCodePanel code={tkinterCode} title="CÓDIGO TKINTER GENERADO" testId="editor-tkinter-code" onClose={() => setTkinterCode('')} />}
          {settings.writingShortcuts && settings.shortcutVisibility !== 'mobile' && !expanded && <div className="ide-writing-shortcuts desktop" aria-label="Atajos de escritura">{settings.quickBar.slice(0,settings.shortcutCount).map((action)=><button key={action} onPointerDown={(e)=>e.preventDefault()} onClick={()=>quickAction(action)}>{action}</button>)}</div>}
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
              fontSize={settings.consoleFontSize}
              onZoomIn={() => setSettings(current => ({ ...current, consoleFontSize: Math.min(28, current.consoleFontSize + 1) }))}
              onZoomOut={() => setSettings(current => ({ ...current, consoleFontSize: Math.max(10, current.consoleFontSize - 1) }))}
              diagnostic={runtimeDiagnostic}
              title={settings.style === 'eclipse' ? 'Console' : settings.style === 'python' ? 'Python Shell' : settings.style === 'vscode' ? 'PROBLEMS  OUTPUT  CONSOLE' : 'CONSOLA'}
              prompt={settings.style === 'cmd' ? settings.cmdPrompt : settings.style === 'python' ? '>>>' : undefined}
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
      {mobileFocused && (focusMode || settings.writingShortcuts && settings.shortcutVisibility !== 'desktop') && <div className="ide-quickbar" aria-label="Barra rápida de programación">{focusMode && <button className="focus-exit" onClick={() => setFocusDismissed(true)}>Salir de enfoque</button>}{settings.writingShortcuts && settings.shortcutVisibility !== 'desktop' && settings.quickBar.slice(0,settings.shortcutCount).map((action) => <button key={action} onPointerDown={(e) => e.preventDefault()} onClick={() => quickAction(action)}>{action}</button>)}</div>}
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
      {(guiDialog || previewDialog) && <CoaGuiDialog request={(guiDialog || previewDialog)!} useTheme={settings.coaGuiDialogUseTheme} position={settings.coaGuiDialogPosition} onAnswer={(value) => { if (guiDialog) { setGuiDialog(null); try { runtime.current?.answerDialog(value) } catch (error) { report((error as Error).message) } } else setPreviewDialog(null) }} />}
    </main>
  )
}

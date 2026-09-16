'use client'
import Editor, { loader, type Monaco, type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { configurePython, goToPythonDefinition, setPythonNavigation, updatePythonProject } from '@/lib/ide/completions'
import { accentColor, derivedColors, type StudioSettings } from '@/lib/ide/personalization'
import type { ProjectEntry } from '@/lib/ide/project'

loader.config({
  paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' },
})
export type EditorHandle = editor.IStandaloneCodeEditor
export function CodeEditor({
  path,
  content,
  onChange,
  onMount,
  readOnly,
  settings,
  onFocus,
  entries,
  onNavigate,
  onNotice,
}: {
  path: string
  content: string
  onChange: (value: string) => void
  onMount: OnMount
  readOnly: boolean
  settings: StudioSettings
  onFocus: () => void
  entries: ProjectEntry[]
  onNavigate: (path: string, line: number, column: number) => void
  onNotice: (message: string) => void
}) {
  const [failed, setFailed] = useState(false)
  const monacoRef = useRef<Monaco | null>(null)
  const palette = useMemo(() => derivedColors(accentColor(settings)), [settings])
  const wallpaper = settings.background !== 'none'
  const monacoTheme = `coa-${settings.accent}-${settings.style}-${wallpaper ? 'wallpaper' : 'solid'}`
  const applyMonacoTheme = useCallback((monaco: Monaco) => {
    const light = settings.style === 'python' && !wallpaper
    const alpha = Math.round((1 - settings.interfaceTransparency / 100) * 255).toString(16).padStart(2, '0')
    const solidBackground = settings.style === 'cmd' ? '#000000' : settings.style === 'onlinegdb' ? '#2b2d31' : palette.editor
    const solidGutter = settings.style === 'cmd' ? '#000000' : settings.style === 'onlinegdb' ? '#25272b' : palette.background
    const background = light ? '#ffffff' : wallpaper ? `${solidBackground}${alpha}` : solidBackground
    const gutter = light ? '#f4f4f4' : wallpaper ? `${solidGutter}${alpha}` : solidGutter
    monaco.editor.defineTheme(monacoTheme, {
      base: light ? 'vs' : 'vs-dark', inherit: true,
      rules: [
        { token: 'keyword', foreground: light ? '0033B3' : palette.hover.slice(1), fontStyle: 'bold' },
        { token: 'string', foreground: light ? '067D17' : 'A9DC76' },
        { token: 'number', foreground: light ? '1750EB' : 'FFD866' },
        { token: 'comment', foreground: light ? '708090' : '8294AA', fontStyle: 'italic' },
        { token: 'type.identifier', foreground: light ? '267F99' : '78DCE8' },
        { token: 'identifier', foreground: light ? '202020' : palette.text.slice(1) },
        { token: 'class', foreground: light ? '267F99' : '78DCE8', fontStyle: 'bold' },
        { token: 'function', foreground: light ? '795E26' : 'A9DC76' },
        { token: 'method', foreground: light ? '795E26' : settings.style === 'cmd' ? '55FF55' : 'FFD866' },
        { token: 'property', foreground: light ? '001080' : 'FC9867' },
        { token: 'parameter', foreground: light ? '9C6500' : 'FFB86C' },
        { token: 'module', foreground: light ? '267F99' : '66D9EF' },
        { token: 'delimiter', foreground: light ? '333333' : 'D8DEE9' },
      ],
      colors: {
        'editor.background': background,
        'editor.foreground': light ? '#202020' : palette.text,
        'editorGutter.background': gutter,
        'editor.lineHighlightBackground': light ? '#eef4ff' : wallpaper ? `${palette.surface}99` : palette.surface,
        'editor.selectionBackground': `${palette.accent}77`,
        'editor.inactiveSelectionBackground': `${palette.selection}88`,
        'editorCursor.foreground': palette.hover,
        'editorLineNumber.foreground': light ? '#777777' : palette.textSecondary,
        'editorLineNumber.activeForeground': palette.hover,
        'editorIndentGuide.background1': wallpaper ? `${palette.border}88` : palette.border,
        'editorIndentGuide.activeBackground1': palette.accent,
        'editorError.foreground': '#ff5f67', 'editorWarning.foreground': '#ffbf47',
      },
    })
    monaco.editor.setTheme(monacoTheme)
  }, [monacoTheme, palette, settings.interfaceTransparency, settings.style, wallpaper])
  useEffect(() => {
    if (monacoRef.current) applyMonacoTheme(monacoRef.current)
    // All visual dependencies are represented by this unique theme name and transparency values.
  }, [applyMonacoTheme])
  useEffect(() => {
    const timeout = setTimeout(() => updatePythonProject(entries), 280)
    return () => clearTimeout(timeout)
  }, [entries])
  useEffect(() => {
    setPythonNavigation(onNavigate, onNotice)
    return () => setPythonNavigation()
  }, [onNavigate, onNotice])
  useEffect(() => {
    let active = true
    const timeout = setTimeout(() => {
      if (active) setFailed(true)
    }, 90000)
    const request = loader.init()
    request.then(
      () => clearTimeout(timeout),
      () => {
        clearTimeout(timeout)
        if (active) setFailed(true)
      },
    )
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [])
  if (failed)
    return (
      <div className="ide-editor-error">
        <p>
          No se pudo cargar el editor. Puedes continuar escribiendo en el editor
          simple y recargar después.
        </p>
        <textarea
          aria-label="Editor Python simple"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
        />
      </div>
    )
  return (
    <Editor
      height="100%"
      path={path}
      language={
        path.endsWith('.py')
          ? 'python'
          : path.endsWith('.json')
            ? 'json'
            : path.endsWith('.md')
              ? 'markdown'
              : 'plaintext'
      }
      value={content}
      onChange={(value) => onChange(value ?? '')}
      theme={monacoTheme}
      onMount={(editor, monaco) => {
        monacoRef.current = monaco
        applyMonacoTheme(monaco)
        editor.onDidFocusEditorText(onFocus)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
          const model = editor.getModel(), position = editor.getPosition()
          if (model && position) goToPythonDefinition(model, position)
        })
        onMount(editor, monaco)
      }}
      beforeMount={(monaco) => {
        configurePython(monaco)
        applyMonacoTheme(monaco)
      }}
      loading={<p className="ide-loading">Cargando editor…</p>}
      options={{
        readOnly,
        fontSize: settings.fontSize,
        fontFamily: `${settings.fontFamily}, monospace`,
        lineHeight: Math.round(settings.fontSize * settings.lineHeight),
        minimap: { enabled: settings.minimap },
        padding: { top: 20 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        lineNumbers: settings.lineNumbers ? 'on' : 'off',
        renderLineHighlight: settings.highlightLine ? 'line' : 'none',
        autoClosingBrackets: settings.autoCloseBrackets ? 'always' : 'never',
        autoClosingQuotes: settings.autoCloseQuotes ? 'always' : 'never',
        quickSuggestions: true,
        ariaLabel: 'Editor de código',
        fixedOverflowWidgets: true,
      }}
    />
  )
}

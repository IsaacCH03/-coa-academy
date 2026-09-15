'use client'
import Editor, { loader, type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useEffect, useState } from 'react'
import { configurePython } from '@/lib/ide/completions'
import { accentColor, derivedColors, type StudioSettings } from '@/lib/ide/personalization'

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
}: {
  path: string
  content: string
  onChange: (value: string) => void
  onMount: OnMount
  readOnly: boolean
  settings: StudioSettings
  onFocus: () => void
}) {
  const [failed, setFailed] = useState(false)
  const palette = derivedColors(accentColor(settings))
  const monacoTheme = `coa-${settings.accent}-${settings.style}`
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
        editor.onDidFocusEditorText(onFocus)
        onMount(editor, monaco)
      }}
      beforeMount={(monaco) => {
        configurePython(monaco)
        const light = settings.style === 'python'
        monaco.editor.defineTheme(monacoTheme, {
          base: light ? 'vs' : 'vs-dark', inherit: true,
          rules: [
            { token: 'keyword', foreground: light ? '0033B3' : palette.hover.slice(1), fontStyle: 'bold' },
            { token: 'string', foreground: light ? '067D17' : 'A9DC76' },
            { token: 'number', foreground: light ? '1750EB' : 'FFD866' },
            { token: 'comment', foreground: light ? '708090' : '8294AA', fontStyle: 'italic' },
          ],
          colors: {
            'editor.background': light ? '#ffffff' : palette.editor,
            'editor.foreground': light ? '#202020' : palette.text,
            'editorGutter.background': light ? '#f4f4f4' : palette.background,
            'editor.lineHighlightBackground': light ? '#eef4ff' : palette.surface,
            'editor.selectionBackground': `${palette.accent}66`,
            'editorCursor.foreground': palette.hover,
            'editorLineNumber.foreground': light ? '#777777' : palette.textSecondary,
            'editorLineNumber.activeForeground': palette.hover,
            'editorError.foreground': '#ff5f67', 'editorWarning.foreground': '#ffbf47',
          },
        })
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

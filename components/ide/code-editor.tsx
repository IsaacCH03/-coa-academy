'use client'
import Editor, { loader, type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useEffect, useState } from 'react'
import { configurePython } from '@/lib/ide/completions'
import type { StudioSettings } from '@/lib/ide/personalization'

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
      theme={settings.style === 'python' || settings.style === 'eclipse' ? 'light' : 'vs-dark'}
      onMount={(editor, monaco) => {
        editor.onDidFocusEditorText(onFocus)
        onMount(editor, monaco)
      }}
      beforeMount={configurePython}
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

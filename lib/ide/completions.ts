import type { Monaco } from '@monaco-editor/react'
import type { editor, IDisposable, Position } from 'monaco-editor'
import type { ProjectEntry } from './project'
import { PythonProjectIndex, type PythonSymbol, type PythonSymbolKind } from './python-intelligence'

const configured = new WeakMap<object, IDisposable[]>()
const intelligence = new PythonProjectIndex()
let navigate: ((path: string, line: number, column: number) => void) | undefined
let notify: ((message: string) => void) | undefined

function modelPath(model: editor.ITextModel) {
  return decodeURIComponent(model.uri.path).replace(/^\//, '')
}

function symbolKind(monaco: Monaco, kind: PythonSymbolKind) {
  const kinds = monaco.languages.CompletionItemKind
  return kind === 'class' ? kinds.Class : kind === 'module' ? kinds.Module
    : kind === 'method' ? kinds.Method : kind === 'property' ? kinds.Property
      : ['parameter', 'variable'].includes(kind) ? kinds.Variable : kinds.Function
}

function detail(symbol: PythonSymbol) {
  const origin = symbol.path === 'python' ? 'Python' : symbol.path === 'coa_gui' ? 'API COA GUI' : symbol.path
  const owner = symbol.className ? ` de ${symbol.className}` : ''
  const label = symbol.kind === 'method' ? `Método${owner}` : symbol.kind === 'class' ? 'Clase'
    : symbol.kind === 'module' ? 'Módulo' : symbol.kind === 'property' ? 'Atributo'
      : symbol.kind === 'variable' ? 'Variable' : 'Función'
  return `${label} · ${origin}`
}

export function updatePythonProject(entries: ProjectEntry[]) { intelligence.update(entries) }

export function setPythonNavigation(nextNavigate?: typeof navigate, nextNotify?: typeof notify) {
  navigate = nextNavigate; notify = nextNotify
}

export function goToPythonDefinition(model: editor.ITextModel, position: Position) {
  const symbol = intelligence.definition(modelPath(model), position.lineNumber, model.getLineContent(position.lineNumber), position.column)
  if (!symbol || symbol.path === 'python' || symbol.path === 'coa_gui') {
    notify?.('No se encontró la definición.'); return false
  }
  navigate?.(symbol.path, symbol.line, symbol.column)
  return true
}

export function configurePython(monaco: Monaco) {
  if (configured.has(monaco)) return
  const disposables: IDisposable[] = []
  disposables.push(monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.'],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position)
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
      const prefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
      return { suggestions: intelligence.completions(modelPath(model), position.lineNumber, prefix).map((symbol) => {
        const callable = ['function', 'method'].includes(symbol.kind)
        return {
          label: symbol.signature ?? symbol.name, filterText: symbol.name,
          sortText: `${symbol.sortGroup}-${symbol.name.toLowerCase()}`,
          insertText: callable ? `${symbol.name}(\${0})` : symbol.name,
          documentation: symbol.docstring ? { value: symbol.docstring } : undefined,
          detail: detail(symbol), kind: symbolKind(monaco, symbol.kind),
          insertTextRules: callable ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
          range,
        }
      }) }
    },
  }))
  disposables.push(monaco.languages.registerHoverProvider('python', {
    provideHover(model, position) {
      const symbol = intelligence.definition(modelPath(model), position.lineNumber, model.getLineContent(position.lineNumber), position.column)
      if (!symbol) return null
      const contents = [{ value: `**${symbol.signature ?? `${symbol.kind} ${symbol.name}`}**` }, { value: detail(symbol) }]
      if (symbol.docstring) contents.push({ value: symbol.docstring })
      return { contents }
    },
  }))
  disposables.push(monaco.languages.registerSignatureHelpProvider('python', {
    signatureHelpTriggerCharacters: ['(', ','],
    provideSignatureHelp(model, position) {
      const prefix = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column })
      const symbol = intelligence.callAt(modelPath(model), position.lineNumber, prefix)
      if (!symbol?.signature) return null
      const params = symbol.parameters ?? []
      const currentCall = prefix.slice(prefix.lastIndexOf('(') + 1)
      const activeParameter = Math.min(params.length - 1, (currentCall.match(/,/g) ?? []).length)
      return { value: { signatures: [{ label: symbol.signature, documentation: symbol.docstring, parameters: params.map((label) => ({ label })) }], activeSignature: 0, activeParameter: Math.max(0, activeParameter) }, dispose() {} }
    },
  }))
  disposables.push(monaco.languages.registerDefinitionProvider('python', {
    provideDefinition(model, position) {
      const symbol = intelligence.definition(modelPath(model), position.lineNumber, model.getLineContent(position.lineNumber), position.column)
      if (!symbol || symbol.path !== modelPath(model)) return null
      return { uri: model.uri, range: { startLineNumber: symbol.line, startColumn: symbol.column, endLineNumber: symbol.line, endColumn: symbol.column + symbol.name.length } }
    },
  }))
  const tokenKinds: PythonSymbolKind[] = ['module', 'class', 'function', 'method', 'parameter', 'property', 'variable']
  disposables.push(monaco.languages.registerDocumentSemanticTokensProvider('python', {
    getLegend: () => ({ tokenTypes: tokenKinds, tokenModifiers: ['declaration'] }),
    provideDocumentSemanticTokens(model) {
      const path = modelPath(model), tokens: Array<{ line: number; start: number; length: number; kind: PythonSymbolKind; declaration: boolean }> = []
      for (let line = 1; line <= model.getLineCount(); line++) {
        const text = model.getLineContent(line)
        for (const match of text.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
          const column = (match.index ?? 0) + 1
          const symbol = intelligence.definition(path, line, text, column)
          if (symbol) tokens.push({ line: line - 1, start: column - 1, length: match[0].length, kind: symbol.kind, declaration: symbol.path === path && symbol.line === line && symbol.column === column })
        }
      }
      tokens.sort((a, b) => a.line - b.line || a.start - b.start)
      const data: number[] = []; let previousLine = 0, previousStart = 0
      for (const token of tokens) { const deltaLine = token.line - previousLine; const deltaStart = deltaLine === 0 ? token.start - previousStart : token.start; data.push(deltaLine, deltaStart, token.length, tokenKinds.indexOf(token.kind), token.declaration ? 1 : 0); previousLine = token.line; previousStart = token.start }
      return { data: new Uint32Array(data), resultId: String(model.getVersionId()) }
    },
    releaseDocumentSemanticTokens() {},
  }))
  configured.set(monaco, disposables)
}

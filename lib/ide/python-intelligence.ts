import type { ProjectEntry } from './project'
import { pythonCodeMask } from './python-source'
import { standardFileMembers } from './python-files'

/** Tolerates an unfinished class body, but never treats a nested function as a method. */
export function builderClassAt(source: string, offset: number, tabSize = 4) {
  const prefix = pythonCodeMask(source.slice(0, offset))
  const lines = prefix.split(/\r?\n/)
  const stack: { indent: number; kind: string; name?: string }[] = []
  const width = (line: string) => (line.match(/^[\t ]*/)?.[0] ?? '').split('').reduce((n, ch) => ch === '\t' ? n + tabSize - n % tabSize : n + 1, 0)
  for (const line of lines.slice(0, -1)) {
    if (!line.trim()) continue
    const indent = width(line)
    while (stack.length && stack.at(-1)!.indent >= indent) stack.pop()
    if (line.trimEnd().endsWith(':')) {
      const match = line.trim().match(/^(class|(?:async\s+)?def)\s+([\p{L}_][\p{L}\p{N}_]*)/u)
      stack.push({ indent, kind: match?.[1] ?? 'block', name: match?.[2] })
    }
  }
  const current = lines.at(-1) ?? ''
  const indent = width(current)
  if (!current.trim()) {
    // An entirely empty line immediately after ':' inherits one level.
    const implicit = !current && lines.length > 1 && lines.at(-2)!.trimEnd().endsWith(':')
    if (!implicit) while (stack.length && stack.at(-1)!.indent >= indent) stack.pop()
  } else if (/^\s*class\s+\w+.*:\s*$/.test(current)) {
    return current.trim().match(/^class\s+(\w+)/)?.[1]
  } else while (stack.length && stack.at(-1)!.indent >= indent) stack.pop()
  const scope = [...stack].reverse().find((entry) => entry.kind !== 'block')
  return scope?.kind === 'class' ? scope.name : undefined
}

export type PythonSymbolKind =
  | 'module'
  | 'class'
  | 'function'
  | 'method'
  | 'parameter'
  | 'property'
  | 'variable'

export type PythonSymbol = {
  name: string
  kind: PythonSymbolKind
  path: string
  line: number
  column: number
  signature?: string
  parameters?: string[]
  docstring?: string
  className?: string
  typeName?: string
}

type ImportInfo = {
  local: string
  module: string
  imported?: string
  line: number
}

type PythonFile = {
  path: string
  module: string
  source: string
  symbols: PythonSymbol[]
  imports: ImportInfo[]
  classes: Map<string, PythonClass>
  variables: Map<string, PythonSymbol>
}

type PythonClass = {
  symbol: PythonSymbol
  bases: string[]
  methods: Map<string, PythonSymbol>
  attributes: Map<string, PythonSymbol>
  endLine: number
}

export type IntelligenceCompletion = PythonSymbol & {
  sortGroup: number
}

const IDENTIFIER = '[A-Za-z_][A-Za-z0-9_]*'
const builtins = [
  ['print', 'print(valor)', 'Muestra un valor en la consola.'],
  ['input', 'input(mensaje)', 'Solicita un dato y devuelve texto.'],
  ['int', 'int(valor)', 'Convierte un dato a entero.'],
  ['float', 'float(valor)', 'Convierte un dato a número decimal.'],
  ['str', 'str(valor)', 'Convierte un dato a texto.'],
  ['range', 'range(límite)', 'Produce una secuencia.'],
  ['len', 'len(valor)', 'Cuenta los elementos.'],
  ['sum', 'sum(valores)', 'Suma elementos numéricos.'],
  ['max', 'max(valores)', 'Devuelve el valor mayor.'],
  ['min', 'min(valores)', 'Devuelve el valor menor.'],
  ['open', 'open(ruta, mode="r", encoding="utf-8")', 'Abre un archivo; usa with para cerrarlo automáticamente.'],
  ['next', 'next(iterador, default)', 'Obtiene el siguiente elemento; default evita StopIteration.'],
] as const

const coaGuiMembers: Array<[string, PythonSymbolKind, string]> = [
  ['Tk', 'class', 'Tk()'], ['Label', 'class', 'Label(parent, text="")'],
  ['Entry', 'class', 'Entry(parent)'], ['Button', 'class', 'Button(parent, text="", command=None)'],
  ['Frame', 'class', 'Frame(parent)'], ['showinfo', 'function', 'showinfo(título, mensaje)'],
  ['showwarning', 'function', 'showwarning(título, mensaje)'], ['showerror', 'function', 'showerror(título, mensaje)'],
  ['askstring', 'function', 'askstring(título, mensaje)'], ['askinteger', 'function', 'askinteger(título, mensaje)'],
  ['askfloat', 'function', 'askfloat(título, mensaje)'], ['askyesno', 'function', 'askyesno(título, mensaje)'],
  ['askokcancel', 'function', 'askokcancel(título, mensaje)'],
]
const excelMembers = {
  workbook: [['save','save(ruta)','Guarda el libro XLSX.'],['create_sheet','create_sheet(título)','Crea una hoja.'],['remove','remove(hoja)','Elimina una hoja.'],['sheetnames','sheetnames','Lista los nombres de hojas.'],['active','active','Devuelve la hoja activa.']],
  worksheet: [['append','append(fila)','Agrega una fila.'],['iter_rows','iter_rows(values_only=False)','Recorre las filas.'],['iter_cols','iter_cols(values_only=False)','Recorre las columnas.'],['cell','cell(fila, columna, value=None)','Obtiene o escribe una celda.'],['max_row','max_row','Última fila con datos.'],['max_column','max_column','Última columna con datos.'],['title','title','Nombre de la hoja.']],
} as const
const excelSymbols = (kind: keyof typeof excelMembers): PythonSymbol[] => excelMembers[kind].map(([name,signature,docstring])=>({name,signature,docstring,kind:signature.includes('(')?'method':'property',path:'openpyxl',line:1,column:1}))

function moduleFromPath(path: string) {
  return path.replace(/\.py$/i, '').replace(/\/__init__$/, '').replaceAll('/', '.')
}

function indentation(line: string) {
  return line.match(/^\s*/)?.[0].replaceAll('\t', '    ').length ?? 0
}

function parameters(raw: string) {
  return raw.split(',').map((part) => part.trim().split(/[:=]/)[0].trim())
    .filter((part) => part && part !== 'self' && part !== 'cls' && new RegExp(`^${IDENTIFIER}$`).test(part))
}

function docstringAfter(lines: string[], lineIndex: number) {
  for (let index = lineIndex + 1; index < Math.min(lines.length, lineIndex + 4); index++) {
    const value = lines[index].trim()
    if (!value) continue
    const match = value.match(/^(?:[rubf]*)(["']{3})([\s\S]*?)\1\s*$/i)
    return match?.[2]?.trim()
  }
  return undefined
}

function parseFile(path: string, source: string): PythonFile {
  const file: PythonFile = {
    path, module: moduleFromPath(path), source, symbols: [], imports: [],
    classes: new Map(), variables: new Map(),
  }
  const lines = source.split(/\r?\n/)
  let currentClass: { value: PythonClass; indent: number } | undefined
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const indent = indentation(line)
    if (currentClass && indent <= currentClass.indent && !/^@/.test(trimmed)) {
      currentClass.value.endLine = index
      currentClass = undefined
    }

    let match = trimmed.match(new RegExp(`^class\\s+(${IDENTIFIER})(?:\\(([^)]*)\\))?\\s*:`))
    if (match) {
      const symbol: PythonSymbol = { name: match[1], kind: 'class', path, line: index + 1, column: line.indexOf(match[1]) + 1, signature: `class ${match[1]}`, docstring: docstringAfter(lines, index) }
      const value = { symbol, bases: (match[2] ?? '').split(',').map((base) => base.trim()).filter(Boolean), methods: new Map<string, PythonSymbol>(), attributes: new Map<string, PythonSymbol>(), endLine: lines.length }
      file.classes.set(symbol.name, value); file.symbols.push(symbol); currentClass = { value, indent }; continue
    }
    match = trimmed.match(new RegExp(`^(?:async\\s+)?def\\s+(${IDENTIFIER})\\s*\\(([^)]*)\\)\\s*(?:->\\s*[^:]+)?\\s*:`))
    if (match) {
      const params = parameters(match[2])
      const kind = currentClass && indent > currentClass.indent ? 'method' : 'function'
      const symbol: PythonSymbol = {
        name: match[1], kind, path, line: index + 1, column: line.indexOf(match[1]) + 1,
        signature: `${match[1]}(${params.join(', ')})`, parameters: params,
        docstring: docstringAfter(lines, index), className: kind === 'method' ? currentClass?.value.symbol.name : undefined,
      }
      file.symbols.push(symbol)
      if (kind === 'method') currentClass!.value.methods.set(symbol.name, symbol)
      for (const param of params) file.symbols.push({ name: param, kind: 'parameter', path, line: index + 1, column: line.indexOf(param) + 1 })
      continue
    }

    match = trimmed.match(new RegExp(`^from\\s+([\\w.]+)\\s+import\\s+(${IDENTIFIER})(?:\\s+as\\s+(${IDENTIFIER}))?`))
    if (match) { file.imports.push({ module: match[1], imported: match[2], local: match[3] ?? match[2], line: index + 1 }); continue }
    match = trimmed.match(new RegExp(`^import\\s+([\\w.]+)(?:\\s+as\\s+(${IDENTIFIER}))?`))
    if (match) { file.imports.push({ module: match[1], local: match[2] ?? match[1].split('.')[0], line: index + 1 }); continue }

    match = trimmed.match(new RegExp(`^(self\\.)?(${IDENTIFIER})\\s*=\\s*(${IDENTIFIER}(?:\\.${IDENTIFIER})*)\\s*\\(`))
    if (match) {
      const symbol: PythonSymbol = { name: match[2], kind: match[1] ? 'property' : 'variable', path, line: index + 1, column: line.indexOf(match[2]) + 1, typeName: match[3] }
      file.symbols.push(symbol)
      if (match[1] && currentClass) currentClass.value.attributes.set(symbol.name, symbol)
      else file.variables.set(symbol.name, symbol)
      continue
    }
    match = trimmed.match(new RegExp(`^(self\\.)?(${IDENTIFIER})\\s*=`))
    if (match) {
      const symbol: PythonSymbol = { name: match[2], kind: match[1] ? 'property' : 'variable', path, line: index + 1, column: line.indexOf(match[2]) + 1 }
      file.symbols.push(symbol)
      if (match[1] && currentClass) currentClass.value.attributes.set(symbol.name, symbol)
      else file.variables.set(symbol.name, symbol)
    }
  }
  return file
}

function likelyIncomplete(source: string) {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  const stack: string[] = []
  let quote = ''
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (quote) { if (char === quote && source[index - 1] !== '\\') quote = ''; continue }
    if (char === '"' || char === "'") { quote = char; continue }
    if ('([{'.includes(char)) stack.push(char)
    else if (pairs[char] && stack.pop() !== pairs[char]) return true
  }
  return !!quote || stack.length > 0 || /(?:^|\n)\s*(?:def|class)\s+\w*\s*$/m.test(source)
}

export class PythonProjectIndex {
  private files = new Map<string, PythonFile>()
  private modules = new Map<string, PythonFile>()

  update(entries: ProjectEntry[]) {
    const paths = new Set(entries.filter((entry) => entry.kind === 'file' && entry.path.toLowerCase().endsWith('.py')).map((entry) => entry.path))
    for (const path of this.files.keys()) if (!paths.has(path)) this.files.delete(path)
    for (const entry of entries) {
      if (!paths.has(entry.path)) continue
      const previous = this.files.get(entry.path)
      if (previous?.source === entry.content) continue
      if (previous && likelyIncomplete(entry.content)) {
        const partial = parseFile(entry.path, entry.content)
        const merged = parseFile(entry.path, previous.source)
        for (const [name, cls] of partial.classes) {
          const valid = merged.classes.get(name)
          if (valid) {
            for (const [method, symbol] of cls.methods) valid.methods.set(method, symbol)
            for (const [attribute, symbol] of cls.attributes) valid.attributes.set(attribute, symbol)
            valid.symbol = cls.symbol
          } else merged.classes.set(name, cls)
        }
        for (const [name, variable] of partial.variables) merged.variables.set(name, variable)
        merged.source = entry.content
        merged.imports = partial.imports.length ? partial.imports : merged.imports
        merged.symbols = [...new Map([...merged.symbols, ...partial.symbols].map((symbol) => [`${symbol.kind}:${symbol.className ?? ''}:${symbol.name}`, symbol])).values()]
        this.files.set(entry.path, merged)
      } else this.files.set(entry.path, parseFile(entry.path, entry.content))
    }
    this.modules = new Map([...this.files.values()].map((file) => [file.module, file]))
    return this
  }

  updateFile(path: string, source: string) {
    const previous = this.files.get(path)
    if (previous?.source === source) return this
    if (previous && likelyIncomplete(source)) {
      const partial = parseFile(path, source)
      const merged = parseFile(path, previous.source)
      for (const [name, cls] of partial.classes) {
        const valid = merged.classes.get(name)
        if (valid) {
          for (const [method, symbol] of cls.methods) valid.methods.set(method, symbol)
          for (const [attribute, symbol] of cls.attributes) valid.attributes.set(attribute, symbol)
          valid.symbol = cls.symbol
        } else merged.classes.set(name, cls)
      }
      for (const [name, variable] of partial.variables) merged.variables.set(name, variable)
      merged.source = source
      merged.imports = partial.imports.length ? partial.imports : merged.imports
      merged.symbols = [...new Map([...merged.symbols, ...partial.symbols].map((symbol) => [`${symbol.kind}:${symbol.className ?? ''}:${symbol.name}`, symbol])).values()]
      this.files.set(path, merged)
    } else this.files.set(path, parseFile(path, source))
    this.modules.set(moduleFromPath(path), this.files.get(path)!)
    return this
  }

  getFile(path: string) { return this.files.get(path) }
  moduleNames() { return [...this.modules.keys()] }

  private resolveImported(file: PythonFile, name: string): PythonSymbol | undefined {
    const item = file.imports.find((entry) => entry.local === name)
    if (!item) return undefined
    const target = this.modules.get(item.module)
    if (!item.imported) return target ? { name, kind: 'module', path: target.path, line: 1, column: 1 } : undefined
    return target?.symbols.find((symbol) => symbol.name === item.imported && ['class', 'function'].includes(symbol.kind))
  }

  private resolveClass(file: PythonFile, typeName: string): PythonClass | undefined {
    const simple = typeName.split('.').pop()!
    const local = file.classes.get(simple)
    if (local) return local
    const imported = this.resolveImported(file, simple)
    if (imported?.kind === 'class') return this.files.get(imported.path)?.classes.get(imported.name)
    const moduleAlias = typeName.includes('.') ? typeName.split('.')[0] : ''
    const member = typeName.includes('.') ? typeName.split('.').pop()! : ''
    const moduleImport = file.imports.find((item) => item.local === moduleAlias && !item.imported)
    return moduleImport ? this.modules.get(moduleImport.module)?.classes.get(member) : undefined
  }

  private classMembers(file: PythonFile, value: PythonClass, seen = new Set<string>()): PythonSymbol[] {
    const key = `${value.symbol.path}:${value.symbol.name}`
    if (seen.has(key)) return []
    seen.add(key)
    const result = [...value.attributes.values(), ...value.methods.values()]
    for (const base of value.bases) {
      const parent = this.resolveClass(file, base)
      if (parent) result.push(...this.classMembers(this.files.get(parent.symbol.path) ?? file, parent, seen))
    }
    return [...new Map(result.map((item) => [item.name, item])).values()]
  }

  private enclosingClass(file: PythonFile, line: number) {
    const candidates = [...file.classes.values()].filter((value) => value.symbol.line <= line && value.endLine >= line).sort((a, b) => b.symbol.line - a.symbol.line)
    return candidates[0]
  }

  private resolveValue(file: PythonFile, expression: string, line: number): PythonClass | PythonFile | 'coa_gui' | undefined {
    const directModule = file.imports.find((item) => !item.imported && item.module === expression)
    if (directModule) return directModule.module === 'coa_gui' ? 'coa_gui' : this.modules.get(directModule.module)
    const parts = expression.split('.').filter(Boolean)
    if (!parts.length) return undefined
    let value: PythonClass | PythonFile | 'coa_gui' | undefined
    const first = parts.shift()!
    if (first === 'self') {
      value = this.enclosingClass(file, line)
      if ((!value || !value.attributes.has(parts[0])) && parts.length) {
        const attributeName = parts[0]
        const owners = [...file.classes.values()].filter((item) => item.attributes.has(attributeName))
        const attribute = owners.length === 1 ? owners[0].attributes.get(attributeName) : undefined
        if (attribute?.typeName) { value = this.resolveClass(file, attribute.typeName); parts.shift() }
      }
    }
    else {
      const variable = file.variables.get(first)
      if (variable?.typeName) value = this.resolveClass(file, variable.typeName)
      else {
        const imported = file.imports.find((item) => item.local === first)
        if (imported?.module === 'coa_gui' && !imported.imported) value = 'coa_gui'
        else if (imported && !imported.imported) value = this.modules.get(imported.module)
        else {
          const cls = this.resolveClass(file, first)
          if (cls) value = cls
        }
      }
    }
    for (const part of parts) {
      if (!value || value === 'coa_gui' || !('methods' in value)) return undefined
      const attribute = value.attributes.get(part)
      if (!attribute?.typeName) return undefined
      value = this.resolveClass(this.files.get(value.symbol.path) ?? file, attribute.typeName)
    }
    return value
  }

  members(path: string, expression: string, line: number): PythonSymbol[] {
    const file = this.files.get(path)
    if (!file) return []
    const standard = this.modules.has('csv') ? [] : standardFileMembers(file.source, expression, line)
    if (standard.length) return standard.map(({ name, signature, docstring, module }) => ({ name, signature, docstring, kind: module === 'csv' ? 'function' : 'method', path: 'python', line: 1, column: 1 }))
    const escaped = expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const before = file.source.split(/\r?\n/).slice(0,line).join('\n')
    if (new RegExp(`(?:^|\\n)\\s*${escaped}\\s*=\\s*(?:Workbook|load_workbook)\\s*\\(`).test(before)) return excelSymbols('workbook')
    if (new RegExp(`(?:^|\\n)\\s*${escaped}\\s*=\\s*[A-Za-z_]\\w*(?:\\.active|\\s*\\[)`).test(before)) return excelSymbols('worksheet')
    const value = this.resolveValue(file, expression, line)
    if (value === 'coa_gui') return coaGuiMembers.map(([name, kind, signature]) => ({ name, kind, signature, path: 'coa_gui', line: 1, column: 1 }))
    if (!value) return []
    if ('methods' in value) return this.classMembers(this.files.get(value.symbol.path) ?? file, value)
    return value.symbols.filter((symbol) => ['class', 'function', 'variable'].includes(symbol.kind) && !symbol.name.startsWith('_'))
  }

  completions(path: string, line: number, prefix: string): IntelligenceCompletion[] {
    const file = this.files.get(path)
    if (!file) return []
    const importSymbols = prefix.match(/^\s*from\s+([\w.]*)\s+import\s+(\w*)$/)
    if (importSymbols) {
      if (importSymbols[1] === 'openpyxl') return ['Workbook','load_workbook'].map((name)=>({name,kind:name==='Workbook'?'class':'function',path:'openpyxl',line:1,column:1,sortGroup:0}))
      if (importSymbols[1] === 'openpyxl.styles') return ['Font','Alignment','PatternFill','Border','Side'].map((name)=>({name,kind:'class',path:'openpyxl',line:1,column:1,sortGroup:0}))
      const target = this.modules.get(importSymbols[1])
      return (target?.symbols ?? []).filter((symbol) => ['class', 'function', 'variable'].includes(symbol.kind) && !symbol.name.startsWith('_')).map((symbol) => ({ ...symbol, sortGroup: 0 }))
    }
    const importModule = prefix.match(/^\s*(?:from|import)\s+([\w.]*)$/)
    if (importModule) {
      const typed = importModule[1]
      const parent = typed.endsWith('.') ? typed.slice(0, -1) : typed.includes('.') ? typed.slice(0, typed.lastIndexOf('.')) : ''
      const start = parent ? `${parent}.` : ''
      const names = new Set<string>()
      for (const moduleName of this.moduleNames()) {
        if (!moduleName.startsWith(start) || moduleName === parent) continue
        names.add(moduleName.slice(start.length).split('.')[0])
      }
      return [...names].map((name) => ({ name, kind: 'module', path: this.modules.get(`${start}${name}`)?.path ?? path, line: 1, column: 1, sortGroup: 0 }))
    }
    const member = prefix.match(new RegExp(`(${IDENTIFIER}(?:\\.${IDENTIFIER})*)\\.(${IDENTIFIER})?$`))
    if (member) return this.members(path, member[1], line).map((symbol) => ({ ...symbol, sortGroup: 0 }))

    const result: IntelligenceCompletion[] = []
    for (const symbol of file.symbols) result.push({ ...symbol, sortGroup: 1 })
    for (const item of file.imports) {
      const symbol = this.resolveImported(file, item.local)
      result.push(symbol ? { ...symbol, name: item.local, sortGroup: 2 } : { name: item.local, kind: 'module', path: file.path, line: item.line, column: 1, sortGroup: 2 })
    }
    for (const target of this.files.values()) for (const symbol of target.symbols) if (['class', 'function'].includes(symbol.kind)) result.push({ ...symbol, sortGroup: 3 })
    for (const [name, signature, docstring] of builtins) result.push({ name, kind: 'function', path: 'python', line: 1, column: 1, signature, docstring, sortGroup: 4 })
    return [...new Map(result.map((symbol) => [symbol.name, symbol])).values()]
  }

  definition(path: string, line: number, lineText: string, column: number): PythonSymbol | undefined {
    const file = this.files.get(path)
    if (!file) return undefined
    const left = lineText.slice(0, Math.max(0, column - 1))
    const right = lineText.slice(Math.max(0, column - 1))
    const before = left.match(new RegExp(`(${IDENTIFIER})$`))?.[1] ?? ''
    const after = right.match(new RegExp(`^(${IDENTIFIER})`))?.[1] ?? ''
    const word = before + after
    if (!word) return undefined
    const wordStart = Math.max(0, column - 1 - before.length)
    const owner = lineText.slice(0, wordStart).match(new RegExp(`(${IDENTIFIER}(?:\\.${IDENTIFIER})*)\\.$`))?.[1]
    if (owner) return this.members(path, owner, line).find((symbol) => symbol.name === word)
    return file.symbols.find((symbol) => symbol.name === word && ['class', 'function'].includes(symbol.kind))
      ?? this.resolveImported(file, word)
      ?? [...this.files.values()].flatMap((target) => target.symbols).find((symbol) => symbol.name === word && ['class', 'function'].includes(symbol.kind))
  }

  callAt(path: string, line: number, prefix: string): PythonSymbol | undefined {
    const match = prefix.match(new RegExp(`(${IDENTIFIER}(?:\\.${IDENTIFIER})*)\\.(${IDENTIFIER})\\s*\\([^()]*$`))
    if (match) return this.members(path, match[1], line).find((symbol) => symbol.name === match[2])
    const local = prefix.match(new RegExp(`(${IDENTIFIER})\\s*\\([^()]*$`))
    return local ? this.definition(path, line, local[1], 1) : undefined
  }

  semanticSymbols(path: string) { return this.files.get(path)?.symbols ?? [] }
}

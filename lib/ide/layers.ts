import type { ProjectEntry } from './project'
import { moduleImportEdit } from './python-source'

export const coaLayers = ['presentation', 'business', 'domain', 'data'] as const
export type CoaLayer = (typeof coaLayers)[number]
export type LayerClass = {
  layer: CoaLayer | null
  path: string
  module: string
  projectRoot: string
  name: string
  constructor: string[]
  attributes: string[]
  methods: { name: string; parameters: string[] }[]
}
export type BuilderChange = { path: string; content: string; summary: string[]; blocked?: boolean }

const names = (value: string) => value.split(',').map((item) => item.trim().split(/[=:]/)[0].trim()).filter((item) => item && item !== 'self')
const relativeTo = (path: string, root = '') => root ? path.slice(root.length + 1) : path
const inside = (path: string, root = '') => !root || path === root || path.startsWith(root + '/')
export function layerOf(path: string, root = ''): CoaLayer | null {
  if (!inside(path, root)) return null
  const first = relativeTo(path.replace(/\\/g, '/'), root).split('/')[0].toLowerCase()
  return coaLayers.includes(first as CoaLayer) ? first as CoaLayer : null
}
export function architectureStatus(entries: ProjectEntry[], root = '') {
  return Object.fromEntries(coaLayers.map((layer) => {
    const path = root ? `${root}/${layer}` : layer
    return [layer, entries.some((entry) => entry.path === path && entry.kind === 'folder' || entry.path.startsWith(path + '/'))]
  })) as Record<CoaLayer, boolean>
}
export function analyzeLayerClasses(entries: ProjectEntry[], root = ''): LayerClass[] {
  const result: LayerClass[] = []
  for (const entry of entries) {
    const layer = layerOf(entry.path, root)
    if (!inside(entry.path, root) || entry.kind !== 'file' || !entry.path.endsWith('.py')) continue
    const lines = entry.content.split('\n')
    for (let index = 0; index < lines.length; index++) {
      const match = lines[index].match(/^class\s+([A-Za-z_]\w*)\s*(?:\([^)]*\))?\s*:/)
      if (!match) continue
      const classIndent = lines[index].match(/^\s*/)?.[0].length ?? 0
      const item: LayerClass = { layer, path: entry.path, module: relativeTo(entry.path, root).replace(/\.py$/, '').replace(/\//g, '.'), projectRoot: root, name: match[1], constructor: [], attributes: [], methods: [] }
      for (let cursor = index + 1; cursor < lines.length; cursor++) {
        const line = lines[cursor]
        if (line.trim() && (line.match(/^\s*/)?.[0].length ?? 0) <= classIndent) break
        const method = line.match(/^\s+def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:/)
        if (method) {
          const parameters = names(method[2])
          if (method[1] === '__init__') item.constructor = parameters
          else if (!method[1].startsWith('_')) item.methods.push({ name: method[1], parameters })
        }
        for (const attribute of line.matchAll(/self\.([A-Za-z_]\w*)\s*=/g)) {
          const publicName = attribute[1].replace(/^__/, '')
          if (!item.attributes.includes(publicName)) item.attributes.push(publicName)
        }
      }
      result.push(item)
    }
  }
  return result
}
export const moduleFor = (target: LayerClass) => target.module
export function ensureImport(source: string, target: LayerClass) {
  const statement = `from ${moduleFor(target)} import ${target.name}`
  const edit = moduleImportEdit(source, [statement])
  if (!edit) return { source, added: false }
  const offset = source.split('\n').slice(0, edit.range.startLineNumber - 1).reduce((n, line) => n + line.length + 1, 0) + edit.range.startColumn - 1
  return { source: source.slice(0, offset) + edit.text + source.slice(offset), added: true }
}
export function defaultObjectName(className: string) {
  return className.charAt(0).toLowerCase() + className.slice(1).replace(/Logic$/, 'Logic')
}
export function buildObjectChange(source: string, active: string, target: LayerClass, objectName: string, values: string[]) : BuilderChange {
  const imported = ensureImport(source, target)
  let content = imported.source
  const creation = `${objectName} = ${target.name}(${values.join(', ')})`
  const exists = new RegExp(`(?:self\\.)?${objectName}\\s*=\\s*${target.name}\\s*\\(`).test(content)
  const summary = imported.added ? [`import de ${target.name}`] : []
  if (!exists) {
    content = content.replace(/\s*$/, '') + `\n\n${creation}\n`
    summary.push(`creación del objeto ${objectName}`)
  }
  return { path: active, content, summary: summary.length ? summary : ['No se encontraron cambios necesarios'] }
}
export function buildConnectionChange(source: string, active: string, target: LayerClass, objectName: string, methodName: string, values: string[], options: { addImport: boolean; addObject: boolean; addCall: boolean; member?: boolean } = { addImport: true, addObject: true, addCall: true }): BuilderChange {
  let content = source
  const summary: string[] = []
  if (options.addImport) {
    const imported = ensureImport(content, target)
    content = imported.source
    if (imported.added) summary.push(`import de ${target.name}`)
  }
  const constructorValues = target.constructor.map((_, index) => values[index] || target.constructor[index]).join(', ')
  const creation = `${objectName} = ${target.name}(${constructorValues})`
  const dependency = layerOf(active, target.projectRoot) === 'business' && target.layer === 'data'
  const member = dependency || options.member === true
  if (options.addObject && !new RegExp(`(?:self\\.)?${objectName}\\s*=\\s*${target.name}\\s*\\(`).test(content)) {
    if (member) content = injectConstructorDependency(content, objectName, target.name, constructorValues)
    else content = content.replace(/\s*$/, '') + `\n\n${creation}\n`
    summary.push(`creación del objeto ${objectName}`)
  }
  if (options.addCall && methodName) {
    const method = target.methods.find((item) => item.name === methodName)
    const callValues = (method?.parameters ?? []).map((parameter, index) => values[index] || parameter)
    const call = `${member ? 'self.' : ''}${objectName}.${methodName}(${callValues.join(', ')})`
    if (!content.includes(call)) {
      content = content.replace(/\s*$/, '') + `\n${call}\n`
      summary.push(`llamada a ${methodName}()`)
    }
  }
  return { path: active, content, summary: summary.length ? summary : ['No se encontraron cambios necesarios'] }
}
export function buildReturnChange(source: string, path: string, value: string): BuilderChange {
  const lines = source.split('\n')
  const functions = lines.flatMap((line, index) => /^\s*def\s+[A-Za-z_]\w*\s*\(/.test(line) ? [{ index, indent: line.match(/^\s*/)?.[0] ?? '' }] : [])
  const fn = functions.at(-1)
  if (!fn) return { path, content: source, summary: ['No se encontró un método o función donde agregar return'] }
  let at = lines.length
  for (let index = fn.index + 1; index < lines.length; index++) {
    const indent = lines[index].match(/^\s*/)?.[0].length ?? 0
    if (lines[index].trim() && indent <= fn.indent.length) { at = index; break }
  }
  if (lines.slice(fn.index + 1, at).some((line) => line.trim() === `return ${value}`)) return { path, content: source, summary: [`El retorno de ${value} ya existe`] }
  lines.splice(at, 0, `${fn.indent}    return ${value}`)
  return { path, content: lines.join('\n'), summary: [`retorno de ${value}`] }
}
function injectConstructorDependency(source: string, objectName: string, className: string, values: string) {
  const lines = source.split('\n')
  const classIndex = lines.findIndex((line) => /^class\s+[A-Za-z_]\w*.*:/.test(line))
  if (classIndex < 0) return source.replace(/\s*$/, '') + `\n\n${objectName} = ${className}(${values})\n`
  const classIndent = lines[classIndex].match(/^\s*/)?.[0] ?? ''
  let end = lines.length
  for (let index = classIndex + 1; index < lines.length; index++) if (lines[index].trim() && (lines[index].match(/^\s*/)?.[0].length ?? 0) <= classIndent.length) { end = index; break }
  const initIndex = lines.findIndex((line, index) => index > classIndex && index < end && /^\s+def\s+__init__\s*\(/.test(line))
  if (initIndex >= 0) lines.splice(initIndex + 1, 0, `${classIndent}        self.${objectName} = ${className}(${values})`)
  else lines.splice(classIndex + 1, 0, `${classIndent}    def __init__(self):`, `${classIndent}        self.${objectName} = ${className}(${values})`, '')
  return lines.join('\n')
}
export function encapsulationChange(source: string, path: string, className: string, attributes: string[], mode: 'Getter' | 'Setter' | 'Getter + Setter'): BuilderChange {
  let content = source
  const summary: string[] = []
  for (const attribute of attributes) {
    const classMatch = new RegExp(`^class\\s+${className}\\b`, 'm').exec(content)
    if (!classMatch) continue
    const classStart = classMatch.index
    const following = content.slice(classStart + classMatch[0].length).search(/^class\s+/m)
    const classEnd = following < 0 ? content.length : classStart + classMatch[0].length + following
    let classBody = content.slice(classStart, classEnd)
    const publicAssignment = new RegExp(`self\\.${attribute}\\s*=`)
    if (publicAssignment.test(classBody)) {
      const firstLine = content.slice(0, classStart).split('\n').length
      const affected = classBody.split('\n').flatMap((line, index) => line.includes(`self.${attribute}`) ? [firstLine + index] : [])
      classBody = classBody.replace(new RegExp(`self\\.${attribute}\\b`, 'g'), `self.__${attribute}`)
      summary.push(`atributo ${attribute} pasará a self.__${attribute} en línea${affected.length === 1 ? '' : 's'} ${affected.join(', ')}`)
    }
    const additions: string[] = []
    if (mode.includes('Getter') && !new RegExp(`def\\s+get_${attribute}\\s*\\(`).test(classBody)) additions.push(`    def get_${attribute}(self):\n        return self.__${attribute}`)
    if (mode.includes('Setter') && !new RegExp(`def\\s+set_${attribute}\\s*\\(`).test(classBody)) additions.push(`    def set_${attribute}(self, ${attribute}):\n        self.__${attribute} = ${attribute}`)
    if (additions.length) {
      classBody = classBody.replace(/\s*$/, '') + '\n\n' + additions.join('\n\n') + '\n'
      summary.push(`${mode.toLowerCase()} de ${attribute}`)
    }
    content = content.slice(0, classStart) + classBody + content.slice(classEnd)
  }
  return { path, content, summary: summary.length ? summary : ['No se encontraron cambios necesarios'] }
}
export function reviewLayerConnections(entries: ProjectEntry[], root = '') {
  const classes = analyzeLayerClasses(entries, root)
  const findings: { severity: 'ok' | 'warning' | 'error'; message: string; path: string }[] = []
  for (const entry of entries.filter((item) => item.kind === 'file' && item.path.endsWith('.py'))) {
    if (!inside(entry.path, root)) continue
    const sourceLayer = layerOf(entry.path, root)
    if (!sourceLayer) continue
    for (const match of entry.content.matchAll(/^\s*from\s+(presentation|business|domain|data)(?:\.[\w.]+)?\s+import\s+([A-Za-z_]\w*)/gm)) {
      const target = match[1] as CoaLayer
      const unusual = (sourceLayer === 'data' && target === 'presentation') || (sourceLayer === 'domain' && target === 'presentation') || (sourceLayer === 'presentation' && target === 'data')
      findings.push({ severity: unusual ? 'warning' : 'ok', path: entry.path, message: unusual ? `${capitalize(sourceLayer)} está accediendo directamente a ${capitalize(target)}. En la arquitectura COA normalmente Presentation se comunica con Business.` : `${capitalize(sourceLayer)} importa ${match[2]} desde ${capitalize(target)} correctamente.` })
    }
    for (const call of entry.content.matchAll(/([A-Za-z_]\w*)\.([A-Za-z_]\w*)\(([^)]*)\)/g)) {
      const candidates = classes.flatMap((item) => item.methods).filter((item) => item.name === call[2])
      const counts = [...new Set(candidates.map((item) => item.parameters.length))]
      const method = counts.length === 1 ? candidates[0] : undefined
      if (method) {
        const received = call[3].trim() ? call[3].split(',').length : 0
        if (received !== method.parameters.length) findings.push({ severity: 'error', path: entry.path, message: `${call[2]}() recibe ${method.parameters.length} parámetros, pero aquí se envían ${received}.` })
      }
    }
  }
  return findings
}
export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export function projectRoots(entries: ProjectEntry[]) {
  const roots = entries.filter((entry) => entry.kind === 'folder').map((entry) => entry.path)
  return roots.filter((root) => coaLayers.some((layer) => entries.some((entry) => entry.path === `${root}/${layer}` || entry.path.startsWith(`${root}/${layer}/`))))
}
export function detectProjectRoot(active: string, entries: ProjectEntry[]) {
  const parts = active.replace(/\\/g, '/').split('/')
  const layerIndex = parts.findIndex((part) => coaLayers.includes(part.toLowerCase() as CoaLayer))
  if (layerIndex >= 0) return parts.slice(0, layerIndex).join('/')
  const roots = projectRoots(entries).filter((root) => active === root || active.startsWith(root + '/'))
  if (roots.length === 1) return roots[0]
  return coaLayers.some((layer) => entries.some((entry) => entry.path === layer || entry.path.startsWith(layer + '/'))) ? '' : null
}
export function wouldCreateCircularImport(entries: ProjectEntry[], active: string, target: LayerClass) {
  const currentModule = relativeTo(active, target.projectRoot).replace(/\.py$/, '').replace(/\//g, '.')
  const targetSource = entries.find((entry) => entry.path === target.path)?.content ?? ''
  return new RegExp(`^\\s*(?:from\\s+${currentModule.replace(/\./g, '\\.')}\\s+import|import\\s+${currentModule.replace(/\./g, '\\.')}\\b)`, 'm').test(targetSource)
}

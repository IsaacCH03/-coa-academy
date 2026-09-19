import { pythonCodeMask } from './python-source'

const APIs: Record<string, [string, string, string][]> = {
  csv: [
    ['reader', 'reader(archivo, delimiter=",")', 'Lee filas como listas de texto.'],
    ['writer', 'writer(archivo, delimiter=",")', 'Escribe filas CSV.'],
    ['DictReader', 'DictReader(archivo, delimiter=",")', 'Lee filas usando la cabecera como claves.'],
    ['DictWriter', 'DictWriter(archivo, fieldnames, delimiter=",")', 'Escribe diccionarios en las columnas indicadas.'],
    ['Sniffer', 'Sniffer()', 'Ayuda a reconocer el formato de un CSV.'],
  ],
  file: [
    ['read', 'read(size=-1)', 'Lee todo el contenido o hasta size caracteres.'],
    ['readline', 'readline(size=-1)', 'Lee una línea.'],
    ['readlines', 'readlines(hint=-1)', 'Devuelve una lista de líneas.'],
    ['write', 'write(texto)', 'Escribe texto y devuelve la cantidad escrita.'],
    ['writelines', 'writelines(lineas)', 'Escribe una colección de textos sin agregar saltos.'],
    ['seek', 'seek(offset, whence=0)', 'seek(0) vuelve al inicio.'],
    ['tell', 'tell()', 'Indica la posición actual.'],
    ['flush', 'flush()', 'Envía los datos pendientes al archivo.'],
    ['close', 'close()', 'Cierra el archivo; with lo hace automáticamente.'],
  ],
  writer: [['writerow', 'writerow(fila)', 'Escribe una fila.'], ['writerows', 'writerows(filas)', 'Escribe varias filas.']],
}
APIs.dictwriter = [...APIs.writer, ['writeheader', 'writeheader()', 'Escribe la cabecera.']]

/** Small, conservative binding pass for standard APIs; unknown objects stay unknown. */
export function standardFileMembers(source: string, expression: string, line: number) {
  if (!/^[A-Za-z_]\w*$/.test(expression)) return []
  const lines = pythonCodeMask(source).split(/\r?\n/)
  const scopes: { indent: number; bindings: Map<string, string> }[] = [{ indent: -1, bindings: new Map() }]
  const width = (text: string) => (text.match(/^[\t ]*/)?.[0] ?? '').replaceAll('\t', '    ').length
  for (let index = 0; index < Math.min(line, lines.length); index++) {
    const text = lines[index], trimmed = text.trim(), indent = width(text)
    if (!trimmed) continue
    while (scopes.length > 1 && indent <= scopes.at(-1)!.indent) scopes.pop()
    let bindings = scopes.at(-1)!.bindings
    const fn = trimmed.match(/^(?:async\s+)?def\s+(\w+)\s*\(([^)]*)\)/)
    const cls = trimmed.match(/^class\s+(\w+)/)
    if (fn || cls) {
      bindings.set((fn ?? cls)![1], '')
      bindings = new Map(bindings)
      if (fn) {
        for (const param of fn[2].split(',')) bindings.set(param.trim().replace(/^\*+/, '').split(/[:=]/)[0].trim(), '')
        // Prevent inherited module bindings from leaking into shadowed locals.
        for (let next = index + 1; next < lines.length; next++) {
          if (lines[next].trim() && width(lines[next]) <= indent) break
          const assigned = lines[next].trim().match(/^(\w+)\s*=(?!=)/)
          if (assigned) bindings.set(assigned[1], '')
        }
      }
      scopes.push({ indent, bindings }); continue
    }
    if (/^import\s/.test(trimmed)) {
      for (const raw of trimmed.slice(7).split(',')) {
        const item = raw.trim().match(/^(\w+)(?:\s+as\s+(\w+))?$/)
        if (item) bindings.set(item[2] ?? item[1], item[1] === 'csv' ? 'csv' : '')
      }
      continue
    }
    const imported = trimmed.match(/^from\s+\w+\s+import\s+(\w+)(?:\s+as\s+(\w+))?$/)
    if (imported) { bindings.set(imported[2] ?? imported[1], ''); continue }
    const file = trimmed.match(/^with\s+open\s*\(.*\)\s+as\s+(\w+)\s*:/)
    if (file && !bindings.has('open')) { bindings.set(file[1], 'file'); continue }
    const assign = trimmed.match(/^(\w+)\s*=\s*(.*)$/)
    if (assign) {
      let kind = ''
      if (/^open\s*\(/.test(assign[2]) && !bindings.has('open')) kind = 'file'
      const call = assign[2].match(/^(\w+)\.(writer|DictWriter)\s*\(/)
      if (call && bindings.get(call[1]) === 'csv') kind = call[2] === 'writer' ? 'writer' : 'dictwriter'
      bindings.set(assign[1], kind)
    }
  }
  const kind = scopes.at(-1)!.bindings.get(expression)
  return (APIs[kind ?? ''] ?? []).map(([name, signature, docstring]) => ({ name, signature, docstring, module: kind === 'csv' ? 'csv' : 'python' }))
}

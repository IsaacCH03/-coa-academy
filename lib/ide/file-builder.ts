import { generateCode, isPythonName, quote, type Field } from './builder'
import type { ProjectEntry } from './project'
import { excelOperations } from './excel-operations'

export type FileKind = 'TXT' | 'CSV' | 'Excel'
export type FileOperation = {
  id: string; kind: FileKind; group: string; title: string; help: string; method: string
  fields: Field[]; read?: boolean; write?: boolean; data?: boolean
  build: (v: Record<string, string>) => { body: string; result?: string; imports?: string[] }
}
const expr = (key: string, label: string, value: string): Field => ({ key, label, value, kind: 'expression' })
const select = (key: string, label: string, value: string, options: string[]): Field => ({ key, label, value, options })
const contents = expr('data', 'Contenido / variable (texto entre comillas)', '"Hola mundo\\n"')
const search = expr('data', 'Texto / variable a buscar', '"Ana"')
const column: Field = { key: 'column', label: 'Índice de columna (desde 0)', value: '0', kind: 'integer' }
const delimiter = select('delimiter', 'Delimitador', ';', [';', ','])
const header = select('header', '¿Tiene cabecera?', 'Sí', ['Sí', 'No'])
const reader: Field = { key: 'reader', label: 'Variable del lector', value: 'lector', kind: 'name' }
const row: Field = { key: 'row', label: 'Variable de fila', value: 'fila', kind: 'name' }
const writer: Field = { key: 'writer', label: 'Variable del escritor', value: 'escritor', kind: 'name' }
const open = (v: Record<string, string>, mode: string, csv = false) => `with open(${v.pathExpression}, ${quote(mode)}, encoding="utf-8"${csv ? ', newline=""' : ''}) as archivo:`
const readCsv = (v: Record<string, string>, retainHeader = false) => `${open(v, 'r', true)}\n    ${v.reader} = csv.reader(archivo, delimiter=${quote(v.delimiter)})${v.header === 'Sí' ? `\n    ${retainHeader ? 'cabecera = ' : ''}next(${v.reader}, ${retainHeader ? '[]' : 'None'})` : ''}`
const writeCsv = (v: Record<string, string>, mode = 'w') => `${open(v, mode, true)}\n    ${v.writer} = csv.writer(archivo, delimiter=${quote(v.delimiter)})`
const csvResult = (body: string, result?: string) => ({ body, result, imports: ['import csv'] })

const textFileOperations: FileOperation[] = [
  ...(['write', 'append', 'lines'] as const).map((id): FileOperation => ({
    id: `txt-${id}`, kind: 'TXT', group: 'Crear / escribir', title: { write: 'Crear / sobrescribir archivo', append: 'Agregar contenido', lines: 'Escribir varias líneas' }[id],
    help: id === 'lines' ? 'writelines() escribe los textos tal como están; incluye \\n al final de cada línea.' : id === 'write' ? 'El modo w crea el archivo o reemplaza su contenido.' : 'El modo a agrega al final sin borrar lo anterior.',
    method: { write: 'escribir_txt', append: 'agregar_txt', lines: 'escribir_lineas' }[id], data: true,
    fields: [id === 'lines' ? expr('data', 'Lista de líneas / variable', '["Ana\\n", "Luis\\n"]') : contents],
    build: (v) => ({ body: `${open(v, id === 'append' ? 'a' : 'w')}\n    archivo.${id === 'lines' ? 'writelines' : 'write'}(${v.data})` }),
  })),
  ...(['read', 'readline', 'readlines'] as const).map((api): FileOperation => ({
    id: `txt-${api}`, kind: 'TXT', group: 'Leer', title: { read: 'Leer todo', readline: 'Leer una línea', readlines: 'Leer todas las líneas' }[api],
    help: `${api}() ${api === 'read' ? 'devuelve todo el texto.' : api === 'readline' ? 'devuelve una línea.' : 'devuelve una lista de líneas.'}`,
    method: { read: 'leer_txt', readline: 'leer_linea', readlines: 'leer_lineas' }[api], fields: [],
    build: (v) => ({ body: `${open(v, 'r')}\n    contenido = archivo.${api}()`, result: 'contenido' }),
  })),
  { id: 'txt-iterate', kind: 'TXT', group: 'Leer', title: 'Recorrer línea por línea', help: 'Recorre el archivo sin cargarlo entero en memoria.', method: 'recorrer_txt', fields: [], build: (v) => ({ body: `${open(v, 'r')}\n    for linea in archivo:\n        print(linea, end="")` }) },
  { id: 'txt-search', kind: 'TXT', group: 'Buscar / contar', title: 'Buscar texto', help: 'Busca una coincidencia y termina el recorrido con break.', method: 'buscar_texto', fields: [search], data: true,
    build: (v) => ({ body: `encontrado = False\n${open(v, 'r')}\n    for linea in archivo:\n        if ${v.data} in linea:\n            encontrado = True\n            break`, result: 'encontrado' }) },
  { id: 'txt-count', kind: 'TXT', group: 'Buscar / contar', title: 'Contar líneas', help: 'Cuenta las líneas con un acumulador.', method: 'contar_lineas', fields: [],
    build: (v) => ({ body: `cantidad = 0\n${open(v, 'r')}\n    for linea in archivo:\n        cantidad += 1`, result: 'cantidad' }) },
  { id: 'txt-matches', kind: 'TXT', group: 'Buscar / contar', title: 'Contar coincidencias', help: 'count() cuenta las apariciones del texto en cada línea.', method: 'contar_coincidencias', fields: [search], data: true,
    build: (v) => ({ body: `cantidad = 0\n${open(v, 'r')}\n    for linea in archivo:\n        cantidad += linea.count(${v.data})`, result: 'cantidad' }) },
  { id: 'txt-report', kind: 'TXT', group: 'Reportes', title: 'Generar reporte TXT', help: 'Escribe un título y contenido en un reporte sencillo.', method: 'generar_reporte_txt', fields: [{ key: 'title', label: 'Título', value: 'Reporte' }, contents], data: true,
    build: (v) => ({ body: `${open(v, 'w')}\n    archivo.write(${quote(v.title + '\n' + '='.repeat(v.title.length) + '\n')})\n    archivo.write(str(${v.data}))\n    archivo.write("\\n")` }) },
  { id: 'txt-open', kind: 'TXT', group: 'Herramientas', title: 'Abrir archivo personalizado', help: 'r: leer; w: reemplazar; a: agregar; r+: leer y escribir sin borrar; a+: leer y agregar. r y r+ requieren que exista. En a+, usa seek(0) antes de leer.', method: 'abrir_txt',
    fields: [select('mode', 'Modo', 'r', ['r', 'w', 'a', 'r+', 'a+'])], build: (v) => ({ body: `${open(v, v.mode)}\n    pass` }) },
  { id: 'txt-seek', kind: 'TXT', group: 'Herramientas', title: 'Volver al inicio · seek(0)', help: 'seek(0) mueve el cursor interno del archivo al inicio antes de leer.', method: 'leer_desde_inicio', fields: [],
    build: (v) => ({ body: `${open(v, 'a+')}\n    archivo.seek(0)\n    contenido = archivo.read()`, result: 'contenido' }) },
  { id: 'txt-exists', kind: 'TXT', group: 'Herramientas', title: 'Comprobar si existe', help: 'os.path.isfile() indica si la ruta corresponde a un archivo.', method: 'existe_archivo', fields: [],
    build: (v) => ({ body: `existe = os.path.isfile(${v.pathExpression})`, result: 'existe', imports: ['import os'] }) },
  ...(['create', 'row', 'rows'] as const).map((id): FileOperation => ({
    id: `csv-${id}`, kind: 'CSV', group: 'Crear / escribir', title: { create: 'Crear CSV', row: 'Agregar registro / escribir fila', rows: 'Escribir varias filas' }[id],
    help: id === 'create' ? 'Crea o sobrescribe el CSV. Puede escribir una cabecera.' : 'Agrega filas al final. newline="" evita líneas vacías adicionales.',
    method: { create: 'crear_csv', row: 'agregar_registro', rows: 'escribir_filas' }[id], write: true, data: id !== 'create',
    fields: id === 'create' ? [select('header', '¿Escribir cabecera?', 'Sí', ['Sí', 'No']), expr('headings', 'Cabecera (lista / variable)', '["nombre", "edad"]')] : [expr('data', id === 'row' ? 'Fila (lista / variable)' : 'Filas (lista de listas / variable)', id === 'row' ? '["Ana", 20]' : '[["Ana", 20], ["Luis", 22]]')],
    build: (v) => csvResult(writeCsv(v, id === 'create' ? 'w' : 'a') + (id === 'create' ? v.header === 'Sí' ? `\n    ${v.writer}.writerow(${v.headings})` : '' : `\n    ${v.writer}.${id === 'row' ? 'writerow' : 'writerows'}(${v.data})`)),
  })),
  { id: 'csv-read', kind: 'CSV', group: 'Leer', title: 'Leer CSV', help: 'csv.reader() interpreta las filas; list() las guarda en memoria.', method: 'leer_csv', read: true, fields: [],
    build: (v) => csvResult(`${readCsv(v)}\n    registros = list(${v.reader})`, 'registros') },
  { id: 'csv-iterate', kind: 'CSV', group: 'Leer', title: 'Recorrer filas', help: 'Lee cada fila. next(lector, None) salta la cabecera y acepta archivos vacíos.', method: 'recorrer_csv', read: true, fields: [row],
    build: (v) => csvResult(`${readCsv(v)}\n    for ${v.row} in ${v.reader}:\n        print(${v.row})`) },
  ...(['search', 'filter'] as const).map((id): FileOperation => ({
    id: `csv-${id}`, kind: 'CSV', group: 'Buscar / filtrar', title: id === 'search' ? 'Buscar registro' : 'Filtrar registros', help: 'Las columnas CSV son texto. str() convierte el valor comparado; las filas cortas se omiten.',
    method: id === 'search' ? 'buscar_registro' : 'filtrar_registros', read: true, data: true,
    fields: [row, column, ...(id === 'filter' ? [select('operator', 'Operador', '==', ['==', '!=', '>', '<', '>=', '<='])] : []), expr('data', 'Valor / variable a buscar', '"Ana"')],
    build: (v) => csvResult(`${id === 'search' ? 'encontrado = None' : 'registros = []'}\n${readCsv(v)}\n    for ${v.row} in ${v.reader}:\n        if len(${v.row}) > ${v.column} and ${v.row}[${v.column}] ${id === 'search' ? '==' : v.operator} str(${v.data}):\n            ${id === 'search' ? `encontrado = ${v.row}\n            break` : `registros.append(${v.row})`}`, id === 'search' ? 'encontrado' : 'registros'),
  })),
  { id: 'csv-report', kind: 'CSV', group: 'Reportes', title: 'Generar reporte desde CSV', help: 'Resume registros. En operaciones numéricas omite celdas vacías o no numéricas y devuelve None si no hay valores.', method: 'reporte_csv', read: true,
    fields: [select('aggregate', 'Operación del reporte', 'Contar registros', ['Contar registros', 'Sumar', 'Promedio', 'Mayor', 'Menor']), column, row],
    build: (v) => {
      if (v.aggregate === 'Contar registros') return csvResult(`cantidad = 0\n${readCsv(v)}\n    for ${v.row} in ${v.reader}:\n        cantidad += 1`, 'cantidad')
      const operation = { Sumar: 'sum(valores)', Promedio: 'sum(valores) / len(valores)', Mayor: 'max(valores)', Menor: 'min(valores)' }[v.aggregate]!
      return csvResult(`valores = []\n${readCsv(v)}\n    for ${v.row} in ${v.reader}:\n        if len(${v.row}) <= ${v.column}:\n            continue\n        try:\n            valores.append(float(${v.row}[${v.column}]))\n        except ValueError:\n            continue\nresultado = ${operation} if valores else None`, 'resultado')
    } },
  ...(['edit', 'delete'] as const).map((id): FileOperation => ({
    id: `csv-${id}`, kind: 'CSV', group: 'Editar / eliminar', title: id === 'edit' ? 'Editar registro' : 'Eliminar registro', help: 'Lee las filas, modifica los registros coincidentes en memoria y reescribe el archivo conservando la cabecera.',
    method: id === 'edit' ? 'editar_registro' : 'eliminar_registro', read: true, write: true, data: true,
    fields: [row, column, expr('data', 'Valor / variable a buscar', '"Ana"'), ...(id === 'edit' ? [expr('replacement', 'Nueva fila completa (lista / variable)', '["Ana", 21]')] : [])],
    build: (v) => csvResult(`# 1. Leer\n${readCsv(v, true)}\n    registros = list(${v.reader})\n\n# 2. Modificar en memoria\nactualizados = []\nfor ${v.row} in registros:\n    if len(${v.row}) > ${v.column} and ${v.row}[${v.column}] == str(${v.data}):\n        ${id === 'edit' ? `actualizados.append(${v.replacement})` : 'continue'}\n    else:\n        actualizados.append(${v.row})\n\n# 3. Reescribir\n${writeCsv(v)}${v.header === 'Sí' ? `\n    if cabecera:\n        ${v.writer}.writerow(cabecera)` : ''}\n    ${v.writer}.writerows(actualizados)`),
  })),
  { id: 'csv-dictread', kind: 'CSV', group: 'CSV con diccionarios', title: 'Leer con DictReader', help: 'La primera fila define las claves de cada diccionario.', method: 'leer_diccionarios_csv', fields: [reader],
    build: (v) => csvResult(`${open(v, 'r', true)}\n    ${v.reader} = csv.DictReader(archivo, delimiter=${quote(v.delimiter)})\n    registros = list(${v.reader})`, 'registros') },
  { id: 'csv-dictwrite', kind: 'CSV', group: 'CSV con diccionarios', title: 'Escribir con DictWriter', help: 'fieldnames determina las columnas. writeheader() escribe sus nombres.', method: 'escribir_diccionarios_csv', write: true, data: true,
    fields: [expr('headings', 'Columnas (lista / variable)', '["nombre", "edad"]'), expr('data', 'Lista de diccionarios / variable', '[{"nombre": "Ana", "edad": 20}]')],
    build: (v) => csvResult(`${open(v, 'w', true)}\n    ${v.writer} = csv.DictWriter(archivo, fieldnames=${v.headings}, delimiter=${quote(v.delimiter)})\n    ${v.writer}.writeheader()\n    ${v.writer}.writerows(${v.data})`) },
]

export const fileOperations: FileOperation[] = [...textFileOperations, ...excelOperations]

export function fileFields(operation: FileOperation) {
  return [...(operation.kind === 'CSV' ? [delimiter] : []), ...(operation.read ? [header, reader] : []), ...(operation.write ? [writer] : []), ...operation.fields]
}
export function projectDataFiles(entries: ProjectEntry[], kind: FileKind) {
  const extension = kind === 'Excel' ? '.xlsx' : '.' + kind.toLowerCase()
  return entries.filter((entry) => entry.kind === 'file' && entry.path.toLowerCase().endsWith(extension)).map((entry) => entry.path).sort()
}
export type FileGeneration = { form: 'code' | 'function'; method: string; className?: string; path: string; pathParameter: boolean; dataParameter: boolean }
export function generateFileCode(operation: FileOperation, values: Record<string, string>, settings: FileGeneration) {
  const v = { ...Object.fromEntries(fileFields(operation).map((field) => [field.key, field.value])), ...values }
  const parameters: string[] = settings.className ? ['self'] : []
  const asFunction = settings.form === 'function'
  if (asFunction && !isPythonName(settings.method)) throw new Error('El nombre debe ser un identificador Python válido.')
  const path = settings.path.trim().replaceAll('\\', '/')
  if (!(asFunction && settings.pathParameter) && (!path || path.startsWith('/') || /^[A-Za-z]:/.test(path) || path.split('/').includes('..') || /[\r\n\0]/.test(path))) throw new Error('Escribe una ruta relativa al proyecto, por ejemplo datos/ventas.csv.')
  if (asFunction && settings.pathParameter) parameters.push('ruta')
  v.pathExpression = asFunction && settings.pathParameter ? 'ruta' : quote(path)
  if (asFunction && settings.dataParameter && operation.data) { parameters.push('dato'); v.data = 'dato' }
  const fields = fileFields(operation).filter((field) => !(field.key === 'headings' && v.header === 'No') && !(field.key === 'column' && v.aggregate === 'Contar registros'))
  generateCode({ id: operation.id, title: operation.title, category: operation.group, description: operation.help, template: '', fields, generate: () => '' }, v)
  if ('column' in v && Number(v.column) < 0) throw new Error('El índice de columna debe ser 0 o mayor.')
  const reserved = new Set(['archivo', 'registros', 'actualizados', 'cabecera', 'contenido', 'cantidad', 'encontrado', 'valores', 'resultado', 'csv', 'os', 'open', 'print', 'list', 'len', 'str', 'float', 'next', 'sum', 'max', 'min', 'ValueError', ...parameters])
  for (const field of fields.filter((field) => field.kind === 'name')) {
    if (reserved.has(v[field.key])) throw new Error('Usa nombres diferentes para lector, escritor, fila y parámetros.')
    reserved.add(v[field.key])
  }
  const generated = operation.build(v)
  let body = generated.body + (generated.result ? `\n\n${asFunction ? 'return ' + generated.result : 'print(' + generated.result + ')'}` : '')
  if (asFunction) body = `def ${settings.method}(${parameters.join(', ')}):\n` + body.split('\n').map((line) => line ? '    ' + line : '').join('\n')
  return [...(generated.imports ?? []), ...(generated.imports?.length ? [''] : []), body].join('\n')
}

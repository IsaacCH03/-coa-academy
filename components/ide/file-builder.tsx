'use client'
import { useState } from 'react'
import { fileFields, fileOperations, generateFileCode, projectDataFiles, type FileKind } from '@/lib/ide/file-builder'
import { builderClassAt } from '@/lib/ide/python-intelligence'
import type { ProjectEntry } from '@/lib/ide/project'

export function FileBuilder({ kind, entries, source, cursorOffset, disabled, onInsert }: {
  kind: FileKind; entries: ProjectEntry[]; source: string; cursorOffset: number; disabled: boolean; onInsert: (code: string) => void
}) {
  const operations = fileOperations.filter((operation) => operation.kind === kind)
  const [operationId, setOperationId] = useState(operations[0].id)
  const operation = operations.find((item) => item.id === operationId) ?? operations[0]
  const [values, setValues] = useState<Record<string, string>>({})
  const [form, setForm] = useState<'code' | 'function'>(() => {
    try { return localStorage.getItem('coa-file-builder-form') === 'function' ? 'function' : 'code' } catch { return 'code' }
  })
  const files = projectDataFiles(entries, kind)
  const [path, setPath] = useState(files[0] ?? `datos.${kind.toLowerCase()}`)
  const [method, setMethod] = useState(operation.method)
  const [pathParameter, setPathParameter] = useState(false)
  const [dataParameter, setDataParameter] = useState(false)
  const className = builderClassAt(source, cursorOffset)
  const fields = fileFields(operation)
  const resolved = { ...Object.fromEntries(fields.map((field) => [field.key, field.value])), ...values }
  let code = '', error = ''
  try { code = generateFileCode(operation, resolved, { form, method, className, path, pathParameter, dataParameter }) }
  catch (cause) { error = (cause as Error).message }
  return <div className="file-builder">
    <label className="ide-field">Operación {kind}
      <select value={operation.id} onChange={(event) => {
        const next = operations.find((item) => item.id === event.target.value)!
        setOperationId(next.id); setMethod(next.method); setValues({})
      }}>
        {[...new Set(operations.map((item) => item.group))].map((group) => <optgroup key={group} label={group}>
          {operations.filter((item) => item.group === group).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </optgroup>)}
      </select>
    </label>
    <p className="ide-tip">{operation.help}</p>
    <label className="ide-field">Forma de generación
      <select value={form} onChange={(event) => {
        const next = event.target.value as typeof form
        setForm(next)
        try { localStorage.setItem('coa-file-builder-form', next) } catch { /* Optional preference. */ }
      }}><option value="code">Código suelto</option><option value="function">Métodos / funciones</option></select>
    </label>
    {form === 'function' && <>
      <label className="ide-field">Nombre del método / función<input value={method} onChange={(event) => setMethod(event.target.value)} /></label>
      <p className="ide-muted">{className ? `Método de ${className}: incluirá self.` : 'Función: no incluirá self.'}</p>
      <label className="ide-field">Archivo como<select value={pathParameter ? 'parameter' : 'fixed'} onChange={(event) => setPathParameter(event.target.value === 'parameter')}><option value="fixed">Ruta fija</option><option value="parameter">Recibir como parámetro · ruta</option></select></label>
    </>}
    {!(form === 'function' && pathParameter) && <>
      {files.length > 0 && <label className="ide-field">Archivos del proyecto<select value={files.includes(path) ? path : ''} onChange={(event) => setPath(event.target.value)}><option value="">Escribir otra ruta</option>{files.map((file) => <option key={file}>{file}</option>)}</select></label>}
      <label className="ide-field">Archivo / ruta<input value={path} onChange={(event) => setPath(event.target.value)} /><small>Ruta relativa a la raíz del Explorador. También puedes escribir una ruta nueva.</small></label>
    </>}
    {form === 'function' && operation.data && <label className="ide-field">Valor de entrada<select value={dataParameter ? 'parameter' : 'value'} onChange={(event) => setDataParameter(event.target.value === 'parameter')}><option value="value">Valor fijo / variable</option><option value="parameter">Recibir como parámetro · dato</option></select></label>}
    {fields.filter((field) => !(field.key === 'data' && form === 'function' && dataParameter) && !(field.key === 'headings' && resolved.header === 'No') && !(field.key === 'column' && resolved.aggregate === 'Contar registros')).map((field) => <label className="ide-field" key={field.key}>{field.label}
      {field.options ? <select value={resolved[field.key]} onChange={(event) => setValues((old) => ({ ...old, [field.key]: event.target.value }))}>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
        : <input value={resolved[field.key]} onChange={(event) => setValues((old) => ({ ...old, [field.key]: event.target.value }))} />}
    </label>)}
    <p className="ide-eyebrow">VISTA PREVIA</p>
    {error ? <p className="ide-warning" role="status">{error}</p> : <pre className="ide-preview"><code>{code}</code></pre>}
    <button className="ide-primary wide" disabled={disabled || !!error} onClick={() => onInsert(code)}>Insertar código</button>
    <small className="ide-muted">Se inserta en el cursor del editor. Los imports van arriba. Ctrl+Z deshace la inserción.</small>
  </div>
}

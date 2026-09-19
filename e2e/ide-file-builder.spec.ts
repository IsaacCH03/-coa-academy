import { expect, test, type Page } from '@playwright/test'
import { fileOperations, generateFileCode } from '../lib/ide/file-builder'
import type { CodeDiagnostic } from '../lib/ide/diagnostics'

async function monaco(page: Page, code?: string, line?: number, column?: number, group = 0) {
  return page.evaluate(async ({ code, line, column, group }) => {
    const api = await new Promise<typeof import('monaco-editor')>((resolve) => {
      (window as unknown as { require: (deps: string[], cb: (api: typeof import('monaco-editor')) => void) => void }).require(['vs/editor/editor.main'], resolve)
    })
    const ed = api.editor.getEditors()[group]
    if (code !== undefined) ed.setValue(code)
    if (line !== undefined) ed.setPosition({ lineNumber: line, column: column ?? 1 })
    if (code !== undefined || line !== undefined) ed.focus()
    return { code: ed.getValue().replace(/\r\n/g, '\n'), position: ed.getPosition() }
  }, { code, line, column, group })
}

test('Builder retains the real nested Monaco cursor across panel focus and undo', async ({ page }) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 90000 })
  const original = 'edad = 20\nif edad >= 18:\n    print("Mayor")\n    '
  await monaco(page, original, 4, 5)
  if (!(await page.getByRole('button', { name: 'Nivel 1' }).isVisible())) await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await page.getByRole('button', { name: /^while True/ }).click()
  await page.getByRole('button', { name: 'Agregar código', exact: true }).click()
  await expect.poll(async () => (await monaco(page)).code).toContain('    while True:\n        pass')
  await page.keyboard.press('Control+z')
  await expect.poll(async () => (await monaco(page)).code).toBe(original)
})

async function start(page: Page) {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.locator('.monaco-editor').first()).toBeVisible({ timeout: 90000 })
}
async function builder(page: Page) {
  if (!(await page.getByRole('button', { name: 'Nivel 1' }).isVisible())) await page.getByRole('button', { name: 'Builder', exact: true }).click()
}

test('deep nesting, automatic indentation, placeholders and themed Monaco retain their cursor', async ({ page }) => {
  await start(page)
  await monaco(page, 'if True:', 1, 9)
  await page.keyboard.press('Enter')
  await builder(page)
  await page.getByRole('button', { name: /^while True/ }).click()
  await page.getByRole('button', { name: 'Agregar código', exact: true }).click()
  expect((await monaco(page)).code).toContain('if True:\n    while True:')
  await page.getByRole('button', { name: 'Configuración', exact: true }).click()
  await page.getByRole('button', { name: 'Rosa', exact: true }).click()
  await page.getByRole('button', { name: /Fondos/ }).click()
  await page.getByRole('button', { name: 'Estrellas animadas', exact: true }).click()
  const original = 'def ejecutar():\n    if True:\n        for i in range(5):\n            '
  await monaco(page, original, 4, 13)
  await builder(page)
  await page.getByLabel('Nivel de ayuda').selectOption('assisted')
  await page.getByRole('button', { name: /^Bucle while/ }).click()
  await page.getByRole('button', { name: 'Agregar código', exact: true }).click()
  expect((await monaco(page)).code).toContain('            while condicion:\n                pass')
  await page.keyboard.insertText('print(i)')
  expect((await monaco(page)).code).toContain('                print(i)')
  expect((await monaco(page)).code).not.toContain('pass')
})

test('TXT functions, CSV imports and project file selectors use the current Monaco model', async ({ page }) => {
  await start(page)
  await monaco(page, 'class FilesTXT:\n    ', 2, 5)
  await builder(page)
  await page.getByRole('button', { name: 'Nivel 2', exact: true }).click()
  await page.getByRole('button', { name: 'TXT +', exact: true }).click()
  await page.getByLabel('Operación TXT').selectOption('txt-read')
  await page.getByLabel('Archivo / ruta').fill('datos/clientes.txt')
  await page.getByLabel('Forma de generación').selectOption('function')
  await expect(page.locator('.ide-preview')).toContainText('def leer_txt(self):')
  await page.getByRole('button', { name: 'Insertar código', exact: true }).click()
  expect((await monaco(page)).code).toContain('class FilesTXT:\n    def leer_txt(self):\n        with open("datos/clientes.txt"')
  await page.keyboard.press('Control+z')
  expect((await monaco(page)).code).toBe('class FilesTXT:\n    ')
  await monaco(page, 'if True:\n    ', 2, 5)
  await page.getByRole('button', { name: 'Volver', exact: true }).click()
  await page.getByRole('button', { name: 'CSV +', exact: true }).click()
  await expect(page.getByLabel('Forma de generación')).toHaveValue('function')
  await page.getByLabel('Forma de generación').selectOption('code')
  await page.getByLabel('Operación CSV').selectOption('csv-iterate')
  await page.getByRole('button', { name: 'Insertar código', exact: true }).click()
  const actual = (await monaco(page)).code
  expect(actual).toContain('import csv\nif True:\n    with open(')
  expect(actual).toContain('        for fila in lector:')
  expect(actual).toContain('next(lector, None)')
  await page.keyboard.press('Control+z')
  expect((await monaco(page)).code).toBe('if True:\n    ')
  await page.keyboard.press('Control+y')
  expect((await monaco(page)).code).toBe(actual)
  await page.getByRole('button', { name: 'Insertar código', exact: true }).click()
  expect((await monaco(page)).code.match(/^import csv$/gm)).toHaveLength(1)
})

test('split editor inserts in group two and keeps group one unchanged', async ({ page }) => {
  await start(page)
  await monaco(page, '# grupo uno\n', 2, 1)
  await page.getByRole('button', { name: 'Configuración', exact: true }).click()
  await page.getByRole('button', { name: /Editor/ }).click()
  await page.getByLabel('Barra de división de código').check()
  await page.getByRole('button', { name: 'Dividir a la derecha', exact: true }).click()
  await expect(page.locator('.monaco-editor')).toHaveCount(2)
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await page.locator('summary[aria-label="Crear elemento"]').click()
  await page.getByRole('button', { name: 'Nuevo archivo', exact: true }).click()
  await page.getByLabel('Nombre o ruta', { exact: true }).fill('logic.py')
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
  await monaco(page, 'if True:\n    ', 2, 5, 1)
  await builder(page)
  await page.getByRole('button', { name: /^for con range/ }).click()
  await page.getByRole('button', { name: 'Agregar código', exact: true }).click()
  expect((await monaco(page, undefined, undefined, undefined, 1)).code).toContain('if True:\n    for i in range(')
  expect((await monaco(page)).code).toBe('# grupo uno\n')
})

test('TXT and CSV selectors show real project paths and allow manual paths', async ({ page }) => {
  await start(page)
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  for (const path of ['datos/clientes.txt', 'datos/ventas.txt', 'datos/clientes.csv', 'datos/ventas.csv']) {
    await page.locator('summary[aria-label="Crear elemento"]').click()
    await page.getByRole('button', { name: 'Nuevo archivo', exact: true }).click()
    await page.getByLabel('Nombre o ruta', { exact: true }).fill(path)
    await page.getByRole('button', { name: 'Crear', exact: true }).click()
  }
  await page.getByRole('tab', { name: 'py main.py', exact: true }).click()
  await monaco(page, 'if True:\n    ', 2, 5)
  await builder(page)
  await page.getByRole('button', { name: 'Nivel 2', exact: true }).click()
  for (const kind of ['TXT', 'CSV']) {
    await page.getByRole('button', { name: `${kind} +`, exact: true }).click()
    const files = page.getByLabel('Archivos del proyecto')
    await expect(files.locator('option')).toHaveText(['Escribir otra ruta', `datos/clientes.${kind.toLowerCase()}`, `datos/ventas.${kind.toLowerCase()}`])
    await files.selectOption(`datos/ventas.${kind.toLowerCase()}`)
    await expect(page.locator('.ide-preview')).toContainText(`datos/ventas.${kind.toLowerCase()}`)
    await page.getByLabel('Archivo / ruta').fill(`reportes/nuevo.${kind.toLowerCase()}`)
    await expect(page.locator('.ide-preview')).toContainText(`reportes/nuevo.${kind.toLowerCase()}`)
    if (kind === 'TXT') {
      await page.getByLabel('Operación TXT').selectOption('txt-iterate')
      await page.getByRole('button', { name: 'Insertar código', exact: true }).click()
      expect((await monaco(page)).code).toContain('if True:\n    with open("reportes/nuevo.txt"')
    }
    await page.getByRole('button', { name: 'Volver', exact: true }).click()
  }
  await expect(page.getByRole('button', { name: /Excel/ })).toBeDisabled()
})

test('CSV diagnostics offer a Monaco code action and Ctrl+Space knows CSV and file APIs', async ({ page }) => {
  await start(page)
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 90000 })
  const source = '"""Módulo de ejemplo."""\nfrom __future__ import annotations\nwith open("datos.csv") as archivo:\n    lector = csv.reader(archivo)\n    print(list(lector))'
  await monaco(page, source, 4, 15)
  await page.locator('.diagnostics-summary').click()
  await expect(page.getByText('Se está utilizando csv, pero el módulo csv no está importado.')).toBeVisible()
  await page.getByRole('button', { name: '💡 Importar csv', exact: true }).click()
  expect((await monaco(page)).code).toContain('from __future__ import annotations\nimport csv\nwith open')
  await monaco(page, 'import csv\ncsv.', 2, 5)
  await page.keyboard.press('Control+Space')
  await expect(page.locator('.suggest-widget')).toContainText('DictReader')
  await page.keyboard.press('Escape')
  await monaco(page, 'with open("datos.txt") as archivo:\n    archivo.', 2, 13)
  await page.keyboard.press('Control+Space')
  await expect(page.locator('.suggest-widget')).toContainText('readlines')
  await page.keyboard.press('Escape')
  // The actual Monaco lightbulb provider must offer the same fix as the panel.
  await monaco(page, source, 4, 15)
  await expect(page.getByText('Se está utilizando csv, pero el módulo csv no está importado.')).toBeVisible()
  await page.locator('.diagnostics-summary').click()
  await monaco(page, undefined, 4, 15)
  await page.keyboard.press('Control+.')
  await expect(page.getByText('💡 Importar csv', { exact: true })).toBeVisible()
})

test('all TXT/CSV operations execute in Python and diagnostics are scoped and actionable', async ({ page }) => {
  await page.goto('/ide')
  const samples = fileOperations.map((op) => ({ id: op.id, kind: op.kind, method: op.method, code: generateFileCode(op, {}, { form: 'function', method: op.method, path: 'datos.txt', pathParameter: true, dataParameter: false }) }))
  const result = await page.evaluate(async (samples) => {
    const worker = new Worker('/ide/python-worker.js')
    const request = (message: object, expected: string) => new Promise<Record<string, unknown>>((resolve, reject) => {
      const timer = setTimeout(() => { worker.terminate(); reject(new Error('Python worker timeout')) }, 90000)
      const listener = (event: MessageEvent) => {
        if (event.data.type === expected || event.data.type.endsWith('error') || event.data.type === 'fatal') {
          clearTimeout(timer); worker.removeEventListener('message', listener)
          if (event.data.type === expected) resolve(event.data); else reject(new Error(event.data.text))
        }
      }
      worker.addEventListener('message', listener); worker.postMessage(message)
    })
    try {
      await request({ type: 'init' }, 'ready')
      const harness = `import json, ast\nsamples = json.loads(${JSON.stringify(JSON.stringify(samples))})\nfor sample in samples:\n    ast.parse(sample["code"])\n    ruta = "datos.txt" if sample["kind"] == "TXT" else "datos.csv"\n    with open(ruta, "w", encoding="utf-8", newline="") as archivo:\n        archivo.write("Ana\\nLuis\\n" if sample["kind"] == "TXT" else "nombre;edad\\nAna;20\\nLuis;22\\n")\n    scope = {}\n    exec(sample["code"], scope)\n    result = scope[sample["method"]](ruta)\n    if sample["id"] == "txt-read": assert result == "Ana\\nLuis\\n"\n    if sample["id"] == "txt-count": assert result == 2\n    if sample["id"] == "txt-search": assert result is True\n    if sample["id"] == "csv-read": assert result == [["Ana", "20"], ["Luis", "22"]]\n    if sample["id"] in ("csv-edit", "csv-delete"):\n        with open(ruta, encoding="utf-8") as archivo: contents = archivo.read()\n        assert contents.startswith("nombre;edad\\n")\n        assert ("Ana;21" in contents) if sample["id"] == "csv-edit" else ("Ana" not in contents)\nprint("ALL_FILE_OPERATIONS_OK")\n`
      const execution = await request({ type: 'run', active: 'main.py', entries: [{ path: 'main.py', kind: 'file', content: harness }], inputs: [] }, 'done')
      const cases = [
        ['missing.py', 'with open("datos.csv") as archivo:\n    lector = csv.reader(archivo)\n    print(list(lector))'],
        ['typos.py', 'import csv as tabla\nwith open("datos.txt") as archivo:\n    print(archivo.red())\n    lector = tabla.reder(archivo)\n    print(lector)'],
        ['unknown.py', 'def f(archivo, csv):\n    archivo.red()\n    csv.reder()'],
        ['modes.py', 'open("datos.txt", "xxy")'],
        ['valid-modes.py', ['r', 'w', 'a', 'x', 'r+', 'a+', 'rb', 'br+', 'w+b', 'xt'].map((mode) => `open("datos.txt", "${mode}")`).join('\n')],
        ...samples.map((sample) => [sample.id + '.py', sample.code]),
      ]
      const diagnostics = await request({ type: 'analyze-diagnostics', entries: cases.map(([path, content]) => ({ path, content, kind: 'file' })) }, 'diagnostics-result')
      return { execution, diagnostics: diagnostics.result }
    } finally { worker.terminate() }
  }, samples)
  expect(result.execution.ok).toBe(true)
  expect(result.execution.output).toContain('ALL_FILE_OPERATIONS_OK')
  const diagnostics = result.diagnostics as CodeDiagnostic[]
  expect(diagnostics.find((item) => item.path === 'missing.py')?.fix?.title).toBe('Importar csv')
  expect(diagnostics.filter((item) => item.path === 'typos.py').map((item) => item.fix?.title)).toEqual(expect.arrayContaining(['Cambiar a "read"', 'Cambiar a "reader"']))
  expect(diagnostics.filter((item) => item.path === 'unknown.py' || item.path === 'valid-modes.py')).toEqual([])
  expect(diagnostics.find((item) => item.path === 'modes.py')?.message).toContain('no es válido')
  expect(diagnostics.filter((item) => /^(txt|csv)-/.test(item.path ?? ''))).toEqual([])
})

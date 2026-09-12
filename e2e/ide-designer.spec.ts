import { test, expect, type Page } from '@playwright/test'

async function edit(page: Page, code: string) {
  await page.evaluate((source) => navigator.clipboard.writeText(source), code)
  await page.locator('.monaco-editor').first().click({ position: { x: 140, y: 45 } })
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Control+v')
  await page.waitForTimeout(100)
}

test('visual designer creates, moves, edits, deletes and exports controls', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })

  await edit(page, 'print("El editor conserva este código")')
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  const canvas = page.getByLabel('Área de diseño')
  await expect(canvas).toBeVisible()
  for (const [index, type] of ['Label', 'Entry', 'Button', 'Frame'].entries()) {
    await page
      .locator('.gui-palette')
      .getByRole('button', { name: type, exact: true })
      .dragTo(canvas, { targetPosition: { x: 70 + index * 70, y: 70 + index * 55 } })
  }
  await expect(canvas.getByRole('button')).toHaveCount(4)

  const label = canvas.getByRole('button', { name: 'Label label1' })
  await label.click()
  const properties = page.locator('.gui-properties')
  await properties.getByLabel('Texto').fill('Nombre del estudiante')
  await properties.getByLabel('Ancho').fill('190')
  await properties.getByLabel('Alto').fill('40')
  await expect(label).toHaveText('Nombre del estudiante')
  const before = await label.boundingBox()
  if (!before) throw new Error('No se encontró el Label en el lienzo.')
  await page.mouse.move(before.x + 20, before.y + 15)
  await page.mouse.down()
  await page.mouse.move(before.x + 70, before.y + 55, { steps: 5 })
  await page.mouse.up()
  const after = await label.boundingBox()
  expect(after?.x).toBeGreaterThan(before.x + 30)

  await canvas.getByRole('button', { name: 'Button button1' }).click()
  await properties.getByLabel('Texto').fill('Guardar')
  await properties.getByLabel('Nombre de variable').fill('guardar')
  await canvas.getByRole('button', { name: 'Frame frame1' }).click()
  await properties.getByRole('button', { name: 'Eliminar componente' }).click()
  await expect(canvas.getByRole('button')).toHaveCount(3)
  await page
    .locator('.gui-palette')
    .getByRole('button', { name: 'Frame', exact: true })
    .dragTo(canvas, { targetPosition: { x: 25, y: 40 } })

  await page.getByRole('button', { name: 'Generar código COA GUI' }).click()
  await expect(page.getByTestId('gui-code')).toContainText('import coa_gui as gui')
  const coaCode = (await page.getByTestId('gui-code').textContent()) ?? ''
  expect(coaCode.indexOf('frame1 = gui.Frame')).toBeLessThan(
    coaCode.indexOf('label1 = gui.Label'),
  )
  await page.getByRole('button', { name: 'Copiar código' }).click()
  await expect(page.getByRole('button', { name: 'Copiado' })).toBeVisible()
  const copiedCoa = await page.evaluate(() => navigator.clipboard.readText())
  expect(copiedCoa).toContain('import coa_gui as gui')
  await page.getByRole('button', { name: 'Exportar a Tkinter' }).click()
  await expect(page.getByTestId('gui-code')).toContainText('import tkinter as tk')
  await expect(page.getByTestId('gui-code')).toContainText('text="Guardar"')
  const tkinter = (await page.getByTestId('gui-code').textContent()) ?? ''
  expect(tkinter.indexOf('frame1 = tk.Frame')).toBeLessThan(
    tkinter.indexOf('label1 = tk.Label'),
  )

  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await expect(page.locator('.monaco-editor')).toBeVisible()
  await expect(page.locator('.view-lines')).toContainText('El editor conserva este código')
  await edit(page, copiedCoa)
  await page.keyboard.press('Control+Enter')
  const preview = page.getByLabel('Vista gráfica COA GUI')
  await expect(preview).toBeVisible()
  await expect(preview.getByText('Nombre del estudiante')).toBeVisible()
  await expect(preview.getByRole('textbox')).toBeVisible()
  await expect(preview.getByRole('button', { name: 'Guardar' })).toBeVisible()
  await expect(preview.locator('.coa-gui-frame')).toBeVisible()
  await preview.getByRole('button', { name: 'Cerrar vista gráfica' }).click()
  await edit(page, 'print("Hola COA")')
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('python-output')).toContainText('Hola COA')

  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  const palette = page.locator('.gui-palette')
  await palette.getByLabel('Título').fill('Diseño persistente')
  await palette.getByLabel('Ancho').fill('520')
  await palette.getByLabel('Alto').fill('410')
  await page.getByRole('button', { name: 'Guardar diseño' }).click()
  await expect(page.getByText('Diseño guardado', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  await expect(page.getByLabel('Área de diseño').getByText('Nombre del estudiante')).toBeVisible()
  await expect(palette.getByLabel('Título')).toHaveValue('Diseño persistente')

  await page.reload()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  await expect(page.getByLabel('Área de diseño').getByRole('button')).toHaveCount(4)
  await expect(palette.getByLabel('Título')).toHaveValue('Diseño persistente')
  await expect(palette.getByLabel('Ancho')).toHaveValue('520')
  await expect(palette.getByLabel('Alto')).toHaveValue('410')

  await page.getByRole('button', { name: 'Limpiar diseño' }).click()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(page.getByLabel('Área de diseño').getByRole('button')).toHaveCount(4)
  await page.getByRole('button', { name: 'Limpiar diseño' }).click()
  await page.getByRole('button', { name: 'Limpiar', exact: true }).click()
  await expect(page.getByLabel('Área de diseño').getByRole('button')).toHaveCount(0)
  await expect(palette.getByLabel('Título')).toHaveValue('Mi interfaz')
  await expect(palette.getByLabel('Ancho')).toHaveValue('500')
  await expect(palette.getByLabel('Alto')).toHaveValue('400')
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  await expect(page.getByLabel('Área de diseño').getByRole('button')).toHaveCount(0)
})

test('COA GUI Entry.get, Button command and config update the live interface', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  const calculator = `import coa_gui as gui

ventana = gui.Tk()
ventana.title("Calculadora")
ventana.geometry("400x300")
numero1 = gui.Entry(ventana)
numero1.place(x=50, y=40, width=150, height=30)
numero2 = gui.Entry(ventana)
numero2.place(x=50, y=90, width=150, height=30)
resultado = gui.Label(ventana, text="Resultado:")
resultado.place(x=50, y=140, width=200, height=30)

def sumar():
    n1 = int(numero1.get())
    n2 = int(numero2.get())
    resultado.config(text="Resultado: " + str(n1 + n2))

boton = gui.Button(ventana, text="Sumar", command=sumar)
boton.place(x=50, y=190, width=120, height=35)
ventana.mainloop()`
  await edit(page, calculator)
  await page.keyboard.press('Control+Enter')
  let preview = page.getByLabel('Vista gráfica COA GUI')
  await expect(preview).toBeVisible()
  const entries = preview.getByRole('textbox')
  await entries.nth(0).fill('10')
  await entries.nth(1).fill('25')
  await preview.getByRole('button', { name: 'Sumar' }).click()
  await expect(preview.getByText('Resultado: 35', { exact: true })).toBeVisible()
  await preview.getByRole('button', { name: 'Cerrar vista gráfica' }).click()

  const consoleProgram = `import coa_gui as gui
ventana = gui.Tk()
ventana.geometry("300x200")
entrada = gui.Entry(ventana)
entrada.place(x=30, y=30, width=150, height=30)
def mostrar():
    print("Contenido:", entrada.get())
boton = gui.Button(ventana, text="Mostrar", command=mostrar)
boton.place(x=30, y=80, width=100, height=35)
ventana.mainloop()`
  await edit(page, consoleProgram)
  await page.keyboard.press('Control+Enter')
  preview = page.getByLabel('Vista gráfica COA GUI')
  await preview.getByRole('textbox').fill('Evelio')
  await expect(page.getByTestId('python-output')).not.toContainText('Contenido: Evelio')
  await preview.getByRole('button', { name: 'Mostrar' }).click()
  await expect(page.getByTestId('python-output')).toContainText('Contenido: Evelio')
})

test('COA GUI Entry.delete clears one or several fields and updates get()', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  const program = `import coa_gui as gui

ventana = gui.Tk()
ventana.title("Prueba Entry delete")
ventana.geometry("400x260")

entrada_nombre = gui.Entry(ventana)
entrada_nombre.place(x=50, y=30, width=200, height=30)
entrada_edad = gui.Entry(ventana)
entrada_edad.place(x=50, y=70, width=200, height=30)
entrada_curso = gui.Entry(ventana)
entrada_curso.place(x=50, y=110, width=200, height=30)

def limpiar_campos():
    entrada_nombre.delete(0, "end")
    entrada_edad.delete(0, "end")
    entrada_curso.delete(0, "end")
    print("Contenido:", entrada_nombre.get())

boton = gui.Button(ventana, text="Limpiar", command=limpiar_campos)
boton.place(x=50, y=170, width=120, height=35)
ventana.mainloop()`
  await edit(page, program)
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  const fields = page.locator('.coa-gui-entry')
  await fields.nth(0).fill('Evelio')
  await fields.nth(1).fill('30')
  await fields.nth(2).fill('Python')
  await page.locator('.coa-gui-button', { hasText: 'Limpiar' }).click()
  await expect(fields.nth(0)).toHaveValue('')
  await expect(fields.nth(1)).toHaveValue('')
  await expect(fields.nth(2)).toHaveValue('')
  await expect(page.getByTestId('python-output')).toContainText('Contenido:')
  await expect(page.getByTestId('python-output')).not.toContainText('AttributeError')
})

test('imports COA GUI with AST and preserves calculator logic while editing visuals', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  const canvas = page.getByLabel('Área de diseño')
  await page
    .locator('.gui-palette')
    .getByRole('button', { name: 'Label', exact: true })
    .dragTo(canvas, { targetPosition: { x: 50, y: 50 } })

  await page.getByRole('button', { name: 'Importar código COA GUI' }).click()
  const importer = page.getByRole('dialog', { name: 'Importar código COA GUI' })
  const sourceInput = importer.getByLabel('Código COA GUI')
  await sourceInput.fill('import coa_gui as gui\nif:')
  await importer.getByRole('button', { name: 'Cargar en diseñador' }).click()
  await expect(page.getByText('No se pudo importar el código porque contiene un error de sintaxis.')).toBeVisible()
  await expect(canvas.getByRole('button')).toHaveCount(1)
  await sourceInput.fill('print("sin interfaz")')
  await importer.getByRole('button', { name: 'Cargar en diseñador' }).click()
  await expect(page.getByText('No se encontró una interfaz COA GUI compatible.')).toBeVisible()

  const calculator = `import coa_gui as gui

ventana = gui.Tk()
ventana.title("Calculadora")
ventana.geometry("400x300")

numero1 = gui.Entry(ventana)
numero1.place(x=50, y=40, width=150, height=30)

numero2 = gui.Entry(ventana)
numero2.place(x=50, y=90, width=150, height=30)

resultado = gui.Label(
    ventana,
    text="Resultado:"
)
resultado.place(x=50, y=140, width=200, height=30)

def sumar():
    n1 = int(numero1.get())
    n2 = int(numero2.get())

    suma = n1 + n2

    resultado.config(
        text="Resultado: " + str(suma)
    )

def limpiar():
    numero1.delete(0, "end")

boton = gui.Button(
    ventana,
    text="Sumar",
    command=sumar
)
boton.place(x=50, y=190, width=120, height=35)

ventana.mainloop()`
  await sourceInput.fill(calculator)
  await importer.getByRole('button', { name: 'Cargar en diseñador' }).click()
  const replacement = page.getByRole('dialog', { name: 'Reemplazar diseño actual' })
  await replacement.getByRole('button', { name: 'Cancelar' }).click()
  await expect(canvas.getByRole('button')).toHaveCount(1)
  await importer.getByRole('button', { name: 'Cargar en diseñador' }).click()
  await replacement.getByRole('button', { name: 'Importar' }).click()

  await expect(canvas).toHaveCSS('width', '400px')
  await expect(canvas).toHaveCSS('height', '300px')
  await expect(canvas.getByRole('button')).toHaveCount(4)
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await page.getByRole('button', { name: 'Diseñador', exact: true }).click()
  const importedButton = canvas.getByRole('button', { name: 'Button boton' })
  await importedButton.click()
  const properties = page.locator('.gui-properties')
  await properties.getByLabel('Texto').fill('Calcular')
  await properties.getByLabel('Posición X').fill('220')
  await properties.getByLabel('Posición Y').fill('200')
  await page.getByRole('button', { name: 'Generar código COA GUI' }).click()
  const generated = page.getByTestId('gui-code')
  await expect(generated).toContainText('def sumar():')
  await expect(generated).toContainText('numero1.get()')
  await expect(generated).toContainText('numero1.delete(0, "end")')
  await expect(generated).toContainText('resultado.config(')
  await expect(generated).toContainText('command=sumar')
  await expect(generated).toContainText('text="Calcular"')
  await expect(generated).toContainText('x=220, y=200, width=120, height=35')
  await page.getByRole('button', { name: 'Copiar código' }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())

  await page.getByRole('button', { name: 'Exportar a Tkinter' }).click()
  await expect(generated).toContainText('import tkinter as tk')
  await expect(generated).toContainText('numero1 = tk.Entry(ventana)')
  await expect(generated).toContainText('numero1.delete(0, "end")')
  await expect(generated).toContainText('def sumar():')
  await expect(generated).toContainText('command=sumar')

  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await edit(page, copied)
  await page.keyboard.press('Control+Enter')
  const preview = page.getByLabel('Vista gráfica COA GUI')
  const entries = preview.getByRole('textbox')
  await entries.nth(0).fill('7')
  await entries.nth(1).fill('7')
  await preview.getByRole('button', { name: 'Calcular' }).click()
  await expect(preview.getByText('Resultado: 14', { exact: true })).toBeVisible()
})

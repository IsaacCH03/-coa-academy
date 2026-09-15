import { expect, test, type Page } from '@playwright/test'

async function edit(page: Page, code: string) {
  await page.locator('.monaco-editor textarea').focus()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(code)
}

async function start(page: Page) {
  await page.goto('/ide')
  const welcomeButton = page.getByRole('button', { name: 'Comenzar', exact: true })
  if (await welcomeButton.isVisible()) await welcomeButton.click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
}

async function createFile(page: Page, path: string) {
  await page.getByRole('button', { name: 'Nuevo archivo' }).click()
  await page.getByLabel('Nombre o ruta', { exact: true }).fill(path)
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
}

test('marks syntax, indentation and clear misspellings with safe fixes', async ({ page }) => {
  await start(page)
  await edit(page, 'if edad >= 18\n    print("Mayor")')
  await expect(page.getByRole('button', { name: /❌ 1/ })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /❌ 1/ }).click()
  await expect(page.getByText('Falta ":" al final del if.')).toBeVisible()
  await page.getByRole('button', { name: /Agregar ":"/ }).click()
  await expect(page.getByRole('button', { name: /❌ 0/ })).toBeVisible({ timeout: 10000 })

  await edit(page, 'while x < 10:')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText('print(x)')
  await expect(page.getByRole('button', { name: /❌ 1/ })).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Esta línea debe estar indentada dentro del bloque anterior.')).toBeVisible()
  await page.getByRole('button', { name: /Indentar esta línea/ }).click()

  await edit(page, 'nombre = "Ana"\nprint(nomre)')
  await expect(page.getByRole('button', { name: /⚠️ 2/ })).toBeVisible({ timeout: 10000 })
  await expect(page.getByText(/¿Querías escribir "nombre"/)).toBeVisible()
  await page.getByRole('button', { name: /Cambiar por "nombre"/ }).click()
  await expect(page.getByRole('button', { name: /⚠️ 0/ })).toBeVisible({ timeout: 10000 })
})

test('understands COA GUI imports, APIs, required arguments and false positives', async ({ page }) => {
  await start(page)
  await edit(page, 'import os\n\ngui.showinfo("Información", "Hola")')
  await expect(page.locator('.diagnostics-summary')).toContainText('⚠️ 2', { timeout: 10000 })
  await page.locator('.diagnostics-summary').click()
  await expect(page.getByText('COA GUI se está utilizando, pero no está importado.')).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Importar COA GUI' }).click()
  await expect(page.locator('.monaco-editor')).toContainText('import os')
  await expect(page.locator('.monaco-editor')).toContainText('import coa_gui as gui')
  await expect(page.getByText('COA GUI se está utilizando, pero no está importado.')).toHaveCount(0, { timeout: 10000 })

  await edit(page, 'import coa_gui as gui\n\ngui.showinf("Información", "Hola")')
  await expect(page.getByText('"showinf" no existe en COA GUI.')).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Cambiar a "showinfo"' }).click()
  await expect(page.locator('.monaco-editor')).toContainText('gui.showinfo')
  await expect(page.getByText('"showinf" no existe en COA GUI.')).toHaveCount(0, { timeout: 10000 })

  await edit(page, 'import coa_gui as gui\n\ngui.showinfo("Información")')
  await expect(page.getByText('Falta el mensaje de la ventana emergente.')).toBeVisible({ timeout: 10000 })
  await edit(page, 'gui = "Hola"\nprint(gui)')
  await expect(page.getByText(/COA GUI se está utilizando/)).toHaveCount(0, { timeout: 10000 })
  await expect(page.getByRole('button', { name: 'Importar COA GUI' })).toHaveCount(0)
})

test('explains unhandled runtime errors without translating prints or caught errors', async ({ page }) => {
  await start(page)
  const cases = [
    ['numero = int("hola")', 'No se pudo convertir "hola" a un número entero.'],
    ['print(10 / 0)', 'No puedes dividir entre cero.'],
    ['lista = [1, 2]\nprint(lista[10])', 'Intentaste acceder a una posición que no existe.'],
    ['persona = {"nombre": "Ana"}\nprint(persona["edad"])', 'No se encontró la clave "edad" en el diccionario.'],
    ['open("inexistente.txt")', 'No se encontró el archivo "inexistente.txt".'],
    ['from business.loggic import Logic', 'Python no encontró el módulo "business".'],
    ['x = 1\nx.mostar_datos', 'no tiene un atributo o método llamado "mostar_datos"'],
  ]
  for (const [code, message] of cases) {
    await edit(page, code)
    await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
    await expect(page.locator('.runtime-diagnostic')).toContainText(message)
    await expect(page.locator('.monaco-editor .squiggly-error')).not.toHaveCount(0)
    await expect(page.getByText('Ver detalle técnico')).toBeVisible()
    await expect(page.getByText('Python listo', { exact: true })).toBeVisible()
  }
  await edit(page, 'print("Corregido")')
  await expect(page.locator('.runtime-diagnostic')).toHaveCount(0)
  await expect(page.locator('.monaco-editor .squiggly-error')).toHaveCount(0, { timeout: 10000 })
})

test('keeps controlled exceptions and user prints unchanged', async ({ page }) => {
  await start(page)
  // The base64 payload is a literal try/except program. Keeping the editor
  // input on one line avoids Monaco's automatic indentation affecting the test.
  await edit(
    page,
    'import base64; exec(base64.b64decode("dHJ5OgogICAgaW50KCdob2xhJykKZXhjZXB0IFZhbHVlRXJyb3I6CiAgICBwcmludCgnRXJyb3IgY29udHJvbGFkbycpCnByaW50KCdIZWxsbyB3b3JsZCcp"))',
  )
  await expect(page.getByRole('button', { name: /❌ 0/ })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByTestId('python-output')).toContainText('Error controlado')
  await expect(page.getByTestId('python-output')).toContainText('Hello world')
  await expect(page.locator('.runtime-diagnostic')).toHaveCount(0)
})

test('detects only certain literal and function problems before execution', async ({ page }) => {
  await start(page)
  await edit(page, 'resultado = 10 / 0')
  await expect(page.getByRole('button', { name: /❌ 1/ })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /❌ 1/ }).click()
  await expect(page.getByText('No puedes dividir entre cero.', { exact: true })).toBeVisible()

  await edit(page, 'divisor = int(input())\nresultado = 10 / divisor')
  await expect(page.getByText('No puedes dividir entre cero.', { exact: true })).toHaveCount(0, { timeout: 10000 })
  await expect(page.getByText(/no puede convertirse directamente/)).toHaveCount(0)

  await edit(page, 'lista = [1, 2]\nprint(lista[10])')
  await expect(page.getByText('La lista tiene 2 elementos y la posición 10 no existe.', { exact: true })).toBeVisible({ timeout: 10000 })

  await edit(page, 'persona = {"nombre": "Ana"}\nprint(persona["edad"])')
  await expect(page.getByText('La clave "edad" no existe en este diccionario.', { exact: true })).toBeVisible({ timeout: 10000 })

  await edit(page, 'def sumar(a, b): return a + b\nsumar(10)')
  await expect(page.getByText('La función "sumar" necesita 2 argumentos y recibió 1.', { exact: true })).toBeVisible({ timeout: 10000 })

  await edit(page, 'numero = int(input())')
  await expect(page.getByText(/no puede convertirse directamente/)).toHaveCount(0, { timeout: 10000 })

  await edit(page, 'resultado = 50')
  await expect(page.getByText('La variable "resultado" se creó pero no se utiliza.', { exact: true })).toBeVisible({ timeout: 10000 })
})

test('checks local paths and navigates to a runtime error in another file', async ({ page }) => {
  await start(page)
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await createFile(page, 'business/logic.py')
  await edit(page, 'def fallar():\n    return 10 / 0')
  await createFile(page, 'ventas.csv')
  await page.getByRole('button', { name: 'main.py', exact: true }).click()

  await edit(page, 'from business.loggic import fallar')
  await expect(page.getByRole('button', { name: /❌ 2/ })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /❌ 2/ }).click()
  await expect(page.getByText('No se encontró el módulo local "business.loggic".', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /Cambiar por "business.logic"/ })).toBeVisible()

  await edit(page, 'open("ventas.cvs")')
  await expect(page.getByText('No se encontró el archivo local "ventas.cvs".', { exact: true })).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: /Cambiar por "ventas.csv"/ })).toBeVisible()

  await edit(page, 'from business.logic import fallar\nfallar()')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.locator('.runtime-diagnostic')).toContainText('business/logic.py, línea 2')
  await expect(page.locator('.runtime-diagnostic')).toContainText('No puedes dividir entre cero.')
  await page.getByRole('button', { name: /business\/logic.py · Línea 2/ }).last().click()
  await expect(page.getByRole('tab', { name: /logic.py/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.monaco-editor .squiggly-error')).not.toHaveCount(0)
})

test('explains condition assignment and validates class methods conservatively', async ({ page }) => {
  await start(page)
  await edit(page, 'if nombre = "Ana": print(nombre)')
  await expect(page.getByRole('button', { name: /❌ 1/ })).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: /❌ 1/ }).click()
  await expect(page.getByText('Dentro de una condición no puedes usar "=" de esta manera.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Cambiar = por ==/ }).click()

  await edit(page, 'class Persona:')
  await page.keyboard.press('Enter')
  await page.keyboard.insertText('def saludar(self): pass')
  await page.keyboard.press('Enter')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText('persona = Persona()')
  await page.keyboard.press('Enter')
  await page.keyboard.insertText('persona.saludarrr()')
  await expect(page.getByText('Persona no tiene un método llamado "saludarrr".', { exact: true })).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: /Cambiar por "saludar"/ })).toBeVisible()

  await edit(page, 'class Persona:')
  await page.keyboard.press('Enter')
  await page.keyboard.insertText('def mostrar(): pass')
  await expect(page.getByText('El método "mostrar" debe recibir self como primer parámetro.', { exact: true })).toBeVisible({ timeout: 10000 })
})

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
  await expect(page.getByRole('button', { name: /⚠️ 1/ })).toBeVisible({ timeout: 10000 })
  await expect(page.getByText(/¿Querías escribir "nombre"/)).toBeVisible()
  await page.getByRole('button', { name: /Cambiar por "nombre"/ }).click()
  await expect(page.getByRole('button', { name: /⚠️ 0/ })).toBeVisible({ timeout: 10000 })
})

test('explains unhandled runtime errors without translating prints or caught errors', async ({ page }) => {
  await start(page)
  const cases = [
    ['numero = int("hola")', 'No se pudo convertir "hola" a un número entero.'],
    ['print(10 / 0)', 'No puedes dividir entre cero.'],
    ['lista = [1, 2]\nprint(lista[10])', 'Intentaste acceder a una posición que no existe.'],
    ['persona = {"nombre": "Ana"}\nprint(persona["edad"])', 'No se encontró la clave "edad" en el diccionario.'],
    ['open("inexistente.txt")', 'No se encontró el archivo solicitado.'],
    ['from business.loggic import Logic', 'No se pudo encontrar el módulo "business".'],
    ['x = 1\nx.mostar_datos', 'no tiene un atributo o método llamado "mostar_datos"'],
  ]
  for (const [code, message] of cases) {
    await edit(page, code)
    await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
    await expect(page.locator('.runtime-diagnostic')).toContainText(message)
    await expect(page.getByText('Ver detalle técnico')).toBeVisible()
    await expect(page.getByText('Python listo', { exact: true })).toBeVisible()
  }
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

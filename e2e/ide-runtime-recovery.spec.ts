import { expect, test, type Page } from '@playwright/test'

async function start(page: Page) {
  await page.goto('/ide')
  const welcome = page.getByRole('button', { name: 'Ya sé cómo funciona', exact: true })
  if (await welcome.isVisible()) await welcome.click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
}

async function edit(page: Page, code: string) {
  await page.locator('.monaco-editor textarea').first().focus()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(code)
}

async function answer(page: Page, value: string) {
  const input = page.getByRole('textbox', { name: 'Respuesta para Python' })
  await expect(input).toBeVisible()
  await input.fill(value)
  await page.getByRole('button', { name: 'Enviar respuesta' }).click()
}

test('supports consecutive, empty, Unicode and numeric input without mixing requests', async ({ page }) => {
  await start(page)
  await edit(page, 'a = input("Uno: ")\nb = input("Dos: ")\nc = int(input("Tres: "))\nprint(repr(a), b, c)')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await answer(page, '')
  await answer(page, 'año ✓')
  await answer(page, '42')
  await expect(page.getByTestId('python-output')).toContainText("'' año ✓ 42")
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible()

  await edit(page, 'numero = int(input("Número: "))')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await answer(page, 'no-es-un-número')
  await expect(page.locator('.runtime-diagnostic')).toContainText('No se pudo convertir')
  await expect(page.getByText('Ver detalle técnico')).toBeVisible()
})

test('stop and restart replace a blocked worker while preserving source', async ({ page }) => {
  await start(page)
  await edit(page, 'while True:\n    pass')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await page.getByRole('button', { name: 'Detener', exact: true }).click()
  await expect(page.getByText('Cargando Python…', { exact: true })).toBeVisible()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toContainText('while True:')
  await edit(page, 'print("recuperado")')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByTestId('python-output')).toContainText('recuperado')

  await edit(page, 'nombre = input("Nombre: ")\nprint(nombre)')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByRole('textbox', { name: 'Respuesta para Python' })).toBeVisible()
  await page.getByRole('button', { name: 'Detener', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.getByRole('textbox', { name: 'Respuesta para Python' })).toHaveCount(0)

  await edit(page, 'while True:\n    pass')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await page.getByRole('button', { name: 'Reiniciar entorno' }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toContainText('while True:')
})

test('accepts inherited methods conservatively and keeps real indentation errors', async ({ page }) => {
  await start(page)
  await edit(page, `class Base:
    def mostrar(self):
        print("ok")
class Intermedia(Base):
    pass
class Extra:
    def extra(self):
        pass
class Estudiante(Intermedia, Extra):
    pass
estudiante = Estudiante()
estudiante.mostrar()
estudiante.extra()`)
  await expect(page.getByText(/no tiene un método llamado/)).toHaveCount(0, { timeout: 10000 })

  await edit(page, 'class Dinamica(BaseExterna):\n    pass\nobjeto = Dinamica()\nobjeto.metodo_externo()')
  await expect(page.getByText(/no tiene un método llamado/)).toHaveCount(0, { timeout: 10000 })

  await edit(page, 'if True:\nprint("mal")')
  await expect(page.getByText('Esta línea debe estar indentada dentro del bloque anterior.')).toBeVisible({ timeout: 10000 })
})

test('flushes output without newlines and when Python requests flush', async ({ page }) => {
  await start(page)
  await edit(page, 'for i in range(5):\n    print(i, end=" ")\nprint("Fin")\nprint("Procesando...", end="", flush=True)\nprint(" listo")')
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByTestId('python-output')).toContainText('0 1 2 3 4 Fin')
  await expect(page.getByTestId('python-output')).toContainText('Procesando... listo')
})

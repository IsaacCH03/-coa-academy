import { test, expect, type Page } from '@playwright/test'

async function edit(page: Page, code: string) {
  await page.locator('.monaco-editor').first().click({ position: { x: 140, y: 45 } })
  await page.keyboard.press('Control+a')
  await page.keyboard.insertText(code)
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

  await page.getByRole('button', { name: 'Generar código COA GUI' }).click()
  await expect(page.getByTestId('gui-code')).toContainText('import coa_gui as gui')
  await expect(page.getByTestId('gui-code')).not.toContainText('frame1')
  await page.getByRole('button', { name: 'Exportar a Tkinter' }).click()
  await expect(page.getByTestId('gui-code')).toContainText('import tkinter as tk')
  await expect(page.getByTestId('gui-code')).toContainText('text="Guardar"')
  await page.getByRole('button', { name: 'Copiar código' }).click()
  await expect(page.getByRole('button', { name: 'Copiado' })).toBeVisible()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('import tkinter as tk')
  expect(copied).toContain('guardar = tk.Button')

  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await expect(page.locator('.monaco-editor')).toBeVisible()
  await expect(page.locator('.view-lines')).toContainText('El editor conserva este código')
  await edit(page, `compile(${JSON.stringify(copied)}, "interfaz.py", "exec")\nprint("Tkinter válido")`)
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('python-output')).toContainText('Tkinter válido')
})

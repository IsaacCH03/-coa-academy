import { test, expect, type Page } from '@playwright/test'
async function edit(page: Page, code: string) {
  await page
    .locator('.monaco-editor')
    .first()
    .click({ position: { x: 140, y: 45 } })
  await page.keyboard.press('Control+a')
  await page.keyboard.insertText(code)
}
async function ready(page: Page) {
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({
    timeout: 100000,
  })
}
test('Python, input, imports, persistence, builder, exercises and downloads', async ({
  page,
}) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Ya sé cómo funciona' }).click()
  await ready(page)
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByTestId('python-output')).toContainText('Hola mundo')
  await ready(page)
  await edit(
    page,
    'nombre = input("¿Cómo te llamas?: ")\nprint("Hola", nombre)',
  )
  await page.keyboard.press('Control+Enter')
  await expect(
    page.getByRole('textbox', { name: 'Respuesta para Python' }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Respuesta para Python' })
    .fill('Evelio')
  await page.getByRole('button', { name: 'Enviar respuesta' }).click()
  await expect(page.getByTestId('python-output')).toContainText('Hola Evelio')
  await ready(page)
  await edit(page, 'while True:\n    print("hola")')
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('python-output')).toContainText('hola')
  await page.getByRole('button', { name: 'Detener', exact: true }).click()
  await expect(
    page.getByText('Programa detenido', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Reiniciar entorno' }).click()
  await ready(page)
  await expect(page.getByText('Entorno reiniciado correctamente.')).toBeVisible()
  await expect(page.locator('.monaco-editor').first()).toContainText('while True:')
  await edit(page, 'print("Entorno recuperado")')
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('python-output')).toContainText('Entorno recuperado')
  await ready(page)
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await page.locator('summary[aria-label="Crear elemento"]').click()
  await page.getByRole('button', { name: 'Nuevo archivo', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Nombre o ruta' })
    .fill('business/logic.py')
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
  await edit(page, 'def saludar():\n    return "Importación correcta"')
  await page.getByRole('tab', { name: 'py main.py' }).click()
  await edit(
    page,
    'from business.logic import saludar\nprint(saludar())\nwith open("resultado.txt", "w") as f:\n    f.write("Guardado desde Python")',
  )
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('python-output')).toContainText(
    'Importación correcta',
  )
  await ready(page)
  await expect(
    page.getByRole('button', { name: 'resultado.txt', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Guardado en este navegador', { exact: true }),
  ).toBeVisible()
  await page.reload()
  await ready(page)
  await expect(page.getByRole('tab', { name: 'py main.py' })).toBeVisible()
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'logic.py', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await page
    .getByRole('button', { name: 'Variable de texto', exact: false })
    .click()
  await page.getByLabel('Nombre de la variable', { exact: true }).fill('nombre')
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Evelio')
  await expect(page.locator('.ide-preview')).toContainText('nombre = "Evelio"')
  await edit(page, '')
  await page.getByRole('button', { name: 'Agregar código' }).click()
  await page.getByRole('button', { name: 'Ejercicios', exact: true }).click()
  await page
    .getByRole('combobox', { name: 'Elige un reto' })
    .selectOption('greater')
  await page
    .getByRole('button', { name: 'Crear archivo para este ejercicio' })
    .click()
  await edit(
    page,
    'a = int(input("A: "))\nb = int(input("B: "))\nprint(max(a, b))',
  )
  await page.getByRole('button', { name: 'Comprobar archivo actual' }).click()
  await expect(
    page.getByText('Caso 3: Correcto', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Necesito una pista' }).click()
  await expect(
    page.getByText('Piensa qué estructura permite tomar una decisión.'),
  ).toBeVisible()
  await page.locator('.ide-download summary').click()
  const fileDownload = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Archivo actual', exact: true })
    .click()
  expect((await fileDownload).suggestedFilename()).toBe('ejercicio-greater.py')
  const zipDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Proyecto completo (.zip)' }).click()
  expect((await zipDownload).suggestedFilename()).toBe('proyecto-coa.zip')
  await page.locator('.ide-download summary').click()
  await page.getByRole('button', { name: 'GitHub', exact: true }).click()
  await expect(
    page.getByText('Configura GitHub para conectar tu cuenta', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await page.screenshot({
    path: test.info().outputPath('ide-desktop.png'),
    fullPage: true,
  })
})
test('home CTA and mobile layout', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('link', { name: 'Abrir IDE Online' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Abrir IDE Online' }).click()
  await expect(page).toHaveURL(/\/ide$/)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Ejecutar', exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'COA Python Builder' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Cerrar panel', exact: true })
    .last()
    .click()
  await ready(page)
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await page.screenshot({
    path: test.info().outputPath('ide-mobile.png'),
    fullPage: true,
  })
})

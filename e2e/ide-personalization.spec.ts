import { expect, test } from '@playwright/test'

async function openStudio(page: import('@playwright/test').Page) {
  await page.goto('/ide')
  const start = page.getByRole('button', { name: 'Comenzar', exact: true })
  if (await start.isVisible()) await start.click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
}

test('themes, special styles and explorer presentation apply without changing files', async ({ page }) => {
  await openStudio(page)
  await page.getByRole('button', { name: 'Configuración' }).click()
  await page.getByRole('button', { name: 'Rosa', exact: true }).click()
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-accent', 'pink')
  await page.getByLabel('Color personalizado').fill('#2255aa')
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-accent', 'custom')
  for (const style of ['vscode','eclipse','onlinegdb','python','cmd']) {
    await page.getByLabel('Estilo especial').selectOption(style)
    await expect(page.locator('.coa-ide')).toHaveClass(new RegExp(`theme-${style}`))
  }
  await page.getByLabel('Estilo especial').selectOption('eclipse')
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await expect(page.getByText('PACKAGE EXPLORER', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'main.py', exact: true })).toBeVisible()
})

test('background controls, editor settings and profiles persist locally', async ({ page }) => {
  await openStudio(page)
  await page.getByRole('button', { name: 'Configuración' }).click()
  await page.getByRole('button', { name: /Fondos/ }).click()
  await page.getByRole('button', { name: 'Ciudad nocturna' }).click()
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-background', 'city')
  await page.getByRole('button', { name: /Editor/ }).click()
  await page.getByLabel('Tamaño de fuente').fill('16')
  await page.getByRole('button', { name: /Perfiles/ }).click()
  await page.getByLabel('Nombre').fill('Mi Setup')
  await page.getByRole('button', { name: 'Guardar perfil' }).click()
  await expect(page.getByLabel('Nombre de Mi Setup')).toHaveValue('Mi Setup')
  await page.reload()
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-background', 'city')
  await page.getByRole('button', { name: 'Configuración' }).click()
  await page.getByRole('button', { name: /Perfiles/ }).click()
  await expect(page.getByLabel('Nombre de Mi Setup')).toBeVisible()
})

test('mobile quick bar inserts pairs, navigates and can be customized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openStudio(page)
  await page.locator('.monaco-editor textarea').focus()
  await expect(page.getByLabel('Barra rápida de programación')).toBeVisible()
  await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace')
  await page.getByLabel('Barra rápida de programación').getByRole('button', { name: '()', exact: true }).click()
  await page.keyboard.insertText('x')
  await expect.poll(() => page.locator('.monaco-editor textarea').inputValue()).toContain('(x)')
  await page.getByRole('button', { name: 'Configuración' }).click()
  await page.getByRole('button', { name: /Móvil/ }).click()
  await page.getByLabel('Agregar atajo').selectOption('print()')
  await expect(page.getByLabel('Quitar print()')).toBeVisible()
  await page.reload()
  await page.locator('.monaco-editor textarea').focus()
  await expect(page.getByLabel('Barra rápida de programación').getByRole('button', { name: 'print()', exact: true })).toBeVisible()
})

test('custom background stays local, validates files and reset preserves the project', async ({ page }) => {
  await openStudio(page)
  await page.getByRole('button', { name: 'Configuración' }).click()
  await page.getByRole('button', { name: /Fondos/ }).click()
  const upload = page.locator('input[type=file][accept*="image/png"]')
  await upload.setInputFiles({ name: 'fondo.png', mimeType: 'image/png', buffer: Buffer.from('89504e470d0a1a0a', 'hex') })
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-background', 'custom')
  await page.reload()
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-background', 'custom')
  await page.getByRole('button', { name: 'Configuración' }).click()
  await page.getByRole('button', { name: /Restablecer/ }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Restaurar configuración predeterminada' }).click()
  await expect(page.locator('.coa-ide')).toHaveAttribute('data-background', 'none')
  await expect(page.getByRole('tab', { name: /main.py/ })).toBeVisible()
})

test('mobile keyboard reduction enters focus mode and can be dismissed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    const viewport = new EventTarget() as EventTarget & { height: number; width: number }
    viewport.height = 520; viewport.width = 390
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport })
  })
  await openStudio(page)
  await page.locator('.monaco-editor textarea').focus()
  await expect(page.locator('.coa-ide')).toHaveClass(/mobile-focus/)
  await expect(page.getByRole('button', { name: 'Salir de enfoque' })).toBeVisible()
  await page.getByRole('button', { name: 'Salir de enfoque' }).click()
  await expect(page.locator('.coa-ide')).not.toHaveClass(/mobile-focus/)
  await expect(page.getByRole('button', { name: 'Configuración' })).toBeVisible()
})

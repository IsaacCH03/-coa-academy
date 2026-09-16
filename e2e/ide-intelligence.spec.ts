import { expect, test, type Page } from '@playwright/test'
import path from 'node:path'

async function edit(page: Page, code: string) {
  await page.locator('.monaco-editor textarea').focus()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(code)
}

async function createFile(page: Page, path: string, code: string) {
  await page.getByRole('button', { name: 'Nuevo archivo', exact: true }).click()
  await page.getByLabel('Nombre o ruta', { exact: true }).fill(path)
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
  await edit(page, code)
}

test('project intelligence completes layered objects and Ctrl+B opens their definitions', async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/**', async (route) => {
    const relative = new URL(route.request().url()).pathname.split('/min/')[1]
    await route.fulfill({ path: path.join(process.cwd(), 'node_modules/monaco-editor/min', relative) })
  })
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Ya sé cómo funciona', exact: true }).click()
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()

  await createFile(page, 'presentation/ui.py', `class UI:
    def showInfo(self, mensaje):
        """Muestra un mensaje informativo."""
        pass

    def showError(self, mensaje):
        pass
`)
  await createFile(page, 'business/logic.py', `class Logic:
    def saludar(self, nombre):
        return "Hola " + nombre

    def sumar(self, a, b):
        return a + b
`)
  await createFile(page, 'business/controller.py', `from business.logic import Logic
from presentation.ui import UI

class Controller:
    def __init__(self):
        self.logic = Logic()
        self.ui = UI()

    def mostrar_saludo(self, nombre):
        self.ui.sho`)

  await page.waitForTimeout(500)
  await page.locator('.monaco-editor textarea').focus()
  await page.keyboard.press('Control+Space')
  const suggestions = page.locator('.suggest-widget')
  await expect(suggestions).toBeVisible()
  await expect(suggestions).toContainText('showInfo')
  await expect(suggestions).toContainText('showError')
  await page.keyboard.press('Escape')

  await page.getByRole('tab', { name: 'py ui.py' }).click()
  await edit(page, `class UI:
    def showInfo(self, mensaje): pass
    def showError(self, mensaje): pass
    def limpiarCampos(self): pass`)
  await expect(page.locator('.monaco-editor')).toContainText('limpiarCampos')
  await expect(page.getByText('Guardado en este navegador', { exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'py controller.py' }).click()
  await edit(page, `from business.logic import Logic
from presentation.ui import UI
class Controller:
    def __init__(self):
        self.logic = Logic()
        self.ui = UI()
    def probar(self):
        self.ui.`)
  await page.waitForTimeout(500)
  await page.keyboard.press('Control+Space')
  await expect(suggestions).toContainText('limpiarCampos')
  await page.keyboard.press('Escape')

  await edit(page, `from business.logic import Logic
logic = Logic()
logic.`)
  await page.waitForTimeout(350)
  await page.keyboard.press('Control+Space')
  await expect(suggestions).toContainText('saludar(nombre)')
  await expect(suggestions).toContainText('sumar(a, b)')
  await page.keyboard.press('Escape')

  await edit(page, 'from presentation.')
  await page.waitForTimeout(350)
  await page.keyboard.press('Control+Space')
  await expect(suggestions).toContainText('ui')
  await page.keyboard.press('Escape')

  await edit(page, 'from presentation.ui import ')
  await page.waitForTimeout(350)
  await page.keyboard.press('Control+Space')
  await expect(suggestions).toContainText('UI')
  await page.keyboard.press('Escape')

  await edit(page, `from business.logic import Logic
from presentation.ui import UI

class Controller:
    def __init__(self):
        self.logic = Logic()
        self.ui = UI()

    def probar(self):
        self.logic.saludar`)
  await page.waitForTimeout(500)
  await page.keyboard.press('Control+B')
  await expect(page.getByRole('tab', { name: 'py logic.py' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.monaco-editor')).toContainText('def saludar(self, nombre):')
})

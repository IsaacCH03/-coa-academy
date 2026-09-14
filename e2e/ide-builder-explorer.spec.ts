import { expect, test, type Page } from '@playwright/test'

async function edit(page: Page, code: string) {
  await page.locator('.monaco-editor textarea').focus()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(code)
}

async function create(page: Page, kind: 'archivo' | 'carpeta', name: string) {
  await page.getByRole('button', { name: kind === 'archivo' ? 'Nuevo archivo' : 'Nueva carpeta' }).click()
  await page.getByLabel('Nombre o ruta', { exact: true }).fill(name)
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
}

test('Builder analyzes current Python and generates intelligent structures', async ({ page }) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await edit(page, `edad = 20
nombre = "Ana"
contador = 0
limite = 10
nombres = ["Ana", "Luis"]

class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

    def mostrar_datos(self):
        print(self.nombre)

`)
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Nivel 1' })).toBeVisible()
  await page.getByRole('button', { name: /^Condición if/ }).click()
  await page.getByLabel('Variable', { exact: true }).fill('edad')
  await page.getByLabel('Operador').selectOption('>=')
  await page.getByLabel('Valor a comparar').fill('18')
  await expect(page.locator('.ide-preview')).toContainText('if edad >= 18:\n    pass')
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: 'for / recorrer lista' }).click()
  await page.getByLabel('Colección').fill('nombres')
  await page.getByLabel('Variable de iteración').fill('nombre')
  await expect(page.locator('.ide-preview')).toContainText('for nombre in nombres:')
  await page.getByLabel('Forma de recorrer').selectOption('Por índice')
  await page.getByLabel('Variable de iteración').fill('i')
  await expect(page.locator('.ide-preview')).toContainText('for i in range(len(nombres)):')
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: 'Nivel 2' }).click()
  await page.getByRole('button', { name: 'Crear objeto +', exact: true }).click()
  await expect(page.getByLabel('Clase', { exact: true })).toHaveValue('Persona')
  await expect(page.getByText('Valores: nombre, edad')).toBeVisible()
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: /^Crear herencia/ }).click()
  await expect(page.getByLabel('Parámetros heredados')).toHaveValue('nombre, edad')
  await expect(page.locator('.ide-preview')).toContainText('super().__init__(nombre, edad)')
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: /^Crear polimorfismo/ }).click()
  await expect(page.getByLabel('Método disponible')).toHaveValue('mostrar_datos')
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: 'Nivel 3' }).click()
  await expect(page.locator('.ide-tip')).toContainText('Nivel 3')
  await expect(page.locator('.ide-tip')).toContainText('Próximamente')
})

test('file explorer creates, collapses, persists and downloads nested folders', async ({ page }) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await expect(page.getByText('Python listo', { exact: true })).toBeVisible({ timeout: 100000 })
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await create(page, 'carpeta', 'Proyecto')
  await page.getByRole('button', { name: 'Proyecto', exact: true }).click()
  await expect(page.getByTestId('selected-folder')).toContainText('Proyecto')
  await create(page, 'carpeta', 'business')
  await page.getByRole('button', { name: 'business', exact: true }).click()
  await create(page, 'carpeta', 'data')
  await page.getByRole('button', { name: 'data', exact: true }).click()
  await create(page, 'archivo', 'files.py')
  await expect(page.getByRole('button', { name: 'files.py', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Proyecto', exact: true }).click()
  await expect(page.getByRole('button', { name: 'files.py', exact: true })).toBeHidden()
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await expect(page.getByRole('button', { name: 'files.py', exact: true })).toBeHidden()
  await page.getByRole('button', { name: 'Proyecto', exact: true }).click()
  await expect(page.getByRole('button', { name: 'files.py', exact: true })).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar Proyecto', exact: true }).click()
  await expect((await download).suggestedFilename()).toBe('Proyecto.zip')
})

import { test, expect, type Page } from '@playwright/test'
import { actions, generateCode } from '../lib/ide/builder'
import { exercises } from '../lib/ide/exercises'
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

test('real Python errors and every demonstration exercise', async ({
  page,
}) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await ready(page)
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await edit(page, 'int("no es un número")')
  await page.keyboard.press('Control+Enter')
  await expect(page.locator('.runtime-diagnostic')).toContainText('No se pudo convertir')
  await page.getByText('Ver detalle técnico').click()
  await expect(page.locator('.runtime-diagnostic')).toContainText('ValueError:')
  await expect(
    page.getByText('Revisa el dato recibido.', { exact: false }),
  ).toBeVisible()
  await ready(page)
  await page.getByRole('button', { name: 'Ejercicios', exact: true }).click()
  const solutions: Record<string, string> = {
    hello: 'print("Hola COA")',
    sum: 'a = int(input())\nb = int(input())\nprint(a + b)',
    greater: 'a = int(input())\nb = int(input())\nprint(max(a, b))',
  }
  for (const exercise of exercises) {
    await page
      .getByRole('combobox', { name: 'Elige un reto' })
      .selectOption(exercise.id)
    await page
      .getByRole('button', { name: 'Crear archivo para este ejercicio' })
      .click()
    await edit(page, solutions[exercise.id])
    await page.getByRole('button', { name: 'Comprobar archivo actual' }).click()
    for (let i = 1; i <= exercise.tests.length; i++) {
      await expect(
        page.getByText(`Caso ${i}: Correcto`, { exact: true }),
      ).toBeVisible()
    }
    await ready(page)
  }
})

test('help modes, indentation, files, preferences and console controls', async ({
  page,
}) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await ready(page)
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await page
    .getByRole('combobox', { name: 'Nivel de ayuda' })
    .selectOption('assisted')
  await page.getByRole('button', { name: 'Condición if', exact: false }).click()
  await expect(page.locator('.ide-preview')).toHaveText(
    'if condicion:\n    pass',
  )
  await expect(page.getByLabel('Variable', { exact: true })).toHaveCount(0)
  await page
    .getByRole('combobox', { name: 'Nivel de ayuda' })
    .selectOption('free')
  await expect(
    page.getByRole('button', { name: 'Agregar código' }),
  ).toHaveCount(0)
  await edit(page, 'if True:\n    ')
  await page
    .getByRole('combobox', { name: 'Nivel de ayuda' })
    .selectOption('guided')
  await page.getByRole('button', { name: 'Volver', exact: true }).click()
  await page.getByRole('button', { name: 'Imprimir', exact: false }).click()
  await page
    .getByRole('textbox', { name: 'Texto', exact: true })
    .fill('Indentado')
  await page.getByRole('button', { name: 'Agregar código' }).click()
  await page.getByRole('button', { name: 'Ejecutar', exact: true }).click()
  await expect(page.getByTestId('python-output')).toContainText('Indentado')
  await ready(page)
  await edit(page, 'edad = int(input("Edad: "))')
  await page.getByRole('button', { name: 'Explicar selección o línea' }).click()
  await expect(
    page.getByText('int(...) convierte un valor a un número entero.'),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Archivos', exact: true }).click()
  await page.locator('summary[aria-label="Crear elemento"]').click()
  await page.getByRole('button', { name: 'Nueva carpeta', exact: true }).click()
  await page.getByLabel('Nombre o ruta').fill('datos')
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
  await page.locator('summary[aria-label="Crear elemento"]').click()
  await page.getByRole('button', { name: 'Nuevo archivo', exact: true }).click()
  await page.getByLabel('Nombre o ruta').fill('datos/nota.txt')
  await page.getByRole('button', { name: 'Crear', exact: true }).click()
  await edit(page, 'Contenido de prueba')
  await page.locator('summary[aria-label="Acciones de datos"]').click()
  await page.getByRole('button', { name: 'Renombrar / mover', exact: true }).click()
  await page.getByLabel('Nuevo nombre o ruta').fill('recursos')
  await page.getByRole('button', { name: 'Renombrar', exact: true }).click()
  await expect(
    page.locator('summary[aria-label="Acciones de recursos/nota.txt"]'),
  ).toBeVisible()
  await page.locator('summary[aria-label="Acciones de recursos"]').click()
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'nota.txt', exact: true }),
  ).toBeVisible()
  await page.locator('summary[aria-label="Acciones de recursos"]').click()
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click()
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'nota.txt', exact: true }),
  ).toHaveCount(0)
  await page.locator('input[type=file]:not([webkitdirectory])').setInputFiles({
    name: 'importado.py',
    mimeType: 'text/plain',
    buffer: Buffer.from('print("Archivo local")'),
  })
  await expect(page.getByRole('tab', { name: 'py importado.py' })).toBeVisible()
  await page.getByRole('button', { name: 'Maximizar consola' }).click()
  await expect(page.locator('.ide-editor')).toBeHidden()
  await page.getByRole('button', { name: 'Restaurar consola' }).click()
  await page.getByRole('separator').focus()
  await page.keyboard.press('ArrowUp')
  await expect(page.getByRole('separator')).toHaveAttribute(
    'aria-valuenow',
    '260',
  )
  await page.getByRole('button', { name: 'Contraer consola' }).click()
  await expect(page.getByTestId('python-output')).toBeHidden()
  await page.getByRole('button', { name: 'Builder', exact: true }).click()
  await page
    .getByRole('combobox', { name: 'Nivel de ayuda' })
    .selectOption('free')
  await page.keyboard.press('Control+s')
  await expect(
    page.getByText('Guardado en este navegador', { exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('combobox', { name: 'Nivel de ayuda' }),
  ).toHaveValue('free')
  await expect(
    page.getByRole('button', { name: 'Mostrar consola' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Mostrar consola' }).click()
  await expect(page.getByRole('separator')).toHaveAttribute(
    'aria-valuenow',
    '260',
  )
})

test('all Builder defaults compile in Python and console output stays text', async ({
  page,
}) => {
  await page.goto('/ide')
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click()
  await ready(page)
  const snippets = actions.map((action) => {
    const code = generateCode(
      action,
      Object.fromEntries(
        action.fields.map((field) => [field.key, field.value]),
      ),
    )
    return action.id === 'return' ? 'def prueba():\n    ' + code : code
  })
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 45000 })
  await edit(
    page,
    `samples = ${JSON.stringify(snippets)}\nfor code in samples:\n    compile(code, "builder", "exec")\nprint("Generadores válidos")\nprint('<img src=x onerror=alert(1)>')`,
  )
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('python-output')).toContainText(
    'Generadores válidos',
  )
  await expect(page.getByTestId('python-output')).toContainText(
    '<img src=x onerror=alert(1)>',
  )
  await expect(page.getByTestId('python-output').locator('img')).toHaveCount(0)
  await ready(page)
  await edit(
    page,
    'a = input("Primero: ")\nb = input("Segundo: ")\nprint(repr(a), b)',
  )
  await page.keyboard.press('Control+Enter')
  await expect(
    page.getByRole('textbox', { name: 'Respuesta para Python' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Enviar respuesta' }).click()
  await expect(page.getByTestId('python-output')).toContainText('Segundo:')
  await page
    .getByRole('textbox', { name: 'Respuesta para Python' })
    .fill('año ✓')
  await page.getByRole('button', { name: 'Enviar respuesta' }).click()
  await expect(page.getByTestId('python-output')).toContainText("'' año ✓")
})

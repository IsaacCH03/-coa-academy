import { expect, test } from '@playwright/test'

test('el contenido académico real requiere sesión y conserva el destino', async ({ page }) => {
  await page.goto('/cursos/logica-de-programacion/curso')
  await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fcursos%2Flogica-de-programacion%2Fcurso$/)

  await page.goto('/cursos/python-practico/curso/modulo-4')
  await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fcursos%2Fpython-practico%2Fcurso%2Fmodulo-4$/)
})

test('las páginas públicas de los cursos disponibles siguen accesibles', async ({ page }) => {
  for (const route of ['/cursos/logica-de-programacion', '/cursos/python-practico']) {
    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
  }
})

test('Programación con IA sigue respetando su estado coming soon', async ({ page }) => {
  const response = await page.goto('/cursos/programacion-con-ia')
  expect(response?.status()).toBe(404)
})

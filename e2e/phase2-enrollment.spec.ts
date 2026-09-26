import { expect, test } from '@playwright/test'

test.describe('Fase 2 pública y protección de rutas', () => {
  test('el botón público inicia el flujo interno de matrícula', async ({ page }) => {
    await page.goto('/cursos/python-practico')
    const enrollment = page.getByRole('link', { name: 'Inscribirme' })
    await expect(enrollment).toHaveAttribute('href', '/inscripcion/python-practico')
    await enrollment.click()
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Finscripcion%2Fpython-practico$/)
  })

  test('un curso pago abre WhatsApp y no una inscripción interna inexistente', async ({ page }) => {
    await page.goto('/cursos/python-nivel-1')
    const enrollment = page.getByRole('link', { name: 'Inscribirme' })
    await expect(enrollment).toHaveAttribute('href', /https:\/\/wa\.me\/50660045660\?text=/)
    await expect(enrollment).toHaveAttribute('href', /Python%20Nivel%201/)
    await expect(enrollment).not.toHaveAttribute('href', /\/inscripcion\//)
  })

  test('un visitante no abre inscripción ni contenido académico privado', async ({ page }) => {
    await page.goto('/inscripcion/python-practico')
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Finscripcion%2Fpython-practico$/)

    await page.goto('/mi-coa/cursos/python-practico')
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fmi-coa%2Fcursos%2Fpython-practico$/)

    await page.goto('/cursos/python-practico/curso/modulo-2')
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fcursos%2Fpython-practico%2Fcurso%2Fmodulo-2$/)
  })

  test('un visitante no abre la administración de cursos', async ({ page }) => {
    await page.goto('/admin/cursos/python-practico')
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fadmin%2Fcursos%2Fpython-practico$/)
  })

  test('el catálogo y certificados continúan públicos', async ({ page }) => {
    for (const route of ['/', '/cursos/python-practico', '/certificados', '/certificados/COA-PYB-2026-0001']) {
      const response = await page.goto(route)
      expect(response?.status(), route).toBe(200)
      await expect(page).not.toHaveURL(/\/cuenta\/iniciar-sesion/)
    }
  })
})

import { expect, test } from '@playwright/test'

test.describe('cuentas y rutas protegidas', () => {
  test('prioriza el acceso de cuenta y conserva Escríbenos en escritorio', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Registrarse' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Escríbenos', exact: true })).toBeVisible()
  })

  test('mantiene cuenta, navegación y WhatsApp accesibles en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Registrarse' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Escríbenos por WhatsApp' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Cursos', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })

  test('Mi COA del header público lleva al login para visitantes', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /^Más/ }).click()
    await page.getByRole('menuitem', { name: /Mi COA/ }).click()
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion$/)
  })

  test('muestra registro, login y recuperación', async ({ page }) => {
    await page.goto('/cuenta/registro')
    await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible()
    await expect(page.getByLabel('Nombre completo')).toBeVisible()

    await page.goto('/cuenta/iniciar-sesion')
    await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible()
    await page.getByRole('link', { name: '¿Olvidaste tu contraseña?' }).click()
    await expect(page.getByRole('heading', { name: 'Recupera tu contraseña' })).toBeVisible()
  })

  test('un enlace de confirmación expirado ofrece reenviar confirmación', async ({ page }) => {
    await page.goto('/cuenta/error?motivo=enlace-vencido&flujo=confirmacion&next=%2F')
    const resend = page.getByRole('link', { name: 'Solicitar un nuevo enlace de confirmación' })
    await expect(resend).toHaveAttribute('href', '/cuenta/reenviar-confirmacion?next=%2F')
    await resend.click()
    await expect(page.getByRole('heading', { name: 'Reenviar correo de confirmación' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enviar nuevo enlace' })).toBeVisible()
    await expect(page).not.toHaveURL(/\/cuenta\/recuperar/)
  })

  test('valida el registro antes de contactar al proveedor', async ({ page }) => {
    await page.goto('/cuenta/registro')
    await page.getByLabel('Nombre completo').fill('Ana Estudiante')
    await page.getByLabel('Correo electrónico').fill('ana@ejemplo.com')
    await page.getByLabel('Contraseña', { exact: true }).fill('corta1')
    await page.getByLabel('Confirmar contraseña').fill('corta1')
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click()
    await expect(page.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeVisible()
  })

  test('redirige visitantes de Mi COA al login', async ({ page }) => {
    await page.goto('/mi-coa')
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fmi-coa$/)
    await expect(page.getByRole('heading', { name: 'Inicia sesión' })).toBeVisible()
  })

  test('redirige visitantes del panel administrativo al login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/cuenta\/iniciar-sesion\?next=%2Fadmin$/)
  })

  test('una sesión normal no abre el formulario de restablecimiento', async ({ page }) => {
    await page.goto('/cuenta/restablecer')
    await expect(page).toHaveURL(/\/cuenta\/recuperar\?enlace=requerido$/)
    await expect(page.getByText('Solicita y abre un nuevo enlace de recuperación para cambiar tu contraseña.')).toBeVisible()
  })

  test('aplica headers generales sin forzar HSTS en localhost HTTP', async ({ request }) => {
    const response = await request.get('/')
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
    expect(response.headers()['x-frame-options']).toBe('DENY')
    expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(response.headers()['content-security-policy-report-only']).toContain("default-src 'self'")
    expect(response.headers()['strict-transport-security']).toBeUndefined()
  })

  test('mantiene públicas las páginas existentes', async ({ page }) => {
    for (const route of ['/', '/cursos/python-nivel-1', '/certificados', '/certificados/COA-PYB-2026-0001', '/ide']) {
      const response = await page.goto(route)
      expect(response?.status(), route).toBe(200)
      await expect(page).not.toHaveURL(/\/cuenta\/iniciar-sesion/)
    }
  })
})

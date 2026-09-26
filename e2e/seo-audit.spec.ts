import { expect, test } from '@playwright/test'

test('public pages render meaningful HTML and self-referencing social metadata', async ({ page }) => {
  const pages = ['/', '/cursos/python-practico', '/certificados', '/experiencia-profesional', '/ide', '/terminos-y-condiciones']

  for (const path of pages) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    const expectedUrl = `https://www.cursoscoa.com${path === '/' ? '' : path}`
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expectedUrl)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedUrl)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /coa-logo\.png$/)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
    expect((await page.locator('body').innerText()).trim().length).toBeGreaterThan(100)
  }
})

test('unknown routes use the localized 404 and remain noindex', async ({ page }) => {
  const response = await page.goto('/ruta-inexistente-de-auditoria')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'No encontramos esta página' })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
})

test('private routes are excluded from indexing and public discovery files stay canonical', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  const robotsText = await robots.text()
  expect(robotsText).toContain('Disallow: /admin')
  expect(robotsText).toContain('Disallow: /mi-coa')
  expect(robotsText).toContain('Disallow: /cuenta')
  expect(robotsText).toContain('Sitemap: https://www.cursoscoa.com/sitemap.xml')

  const sitemap = await request.get('/sitemap.xml')
  const sitemapText = await sitemap.text()
  expect(sitemapText).toContain('<loc>https://www.cursoscoa.com/</loc>')
  expect(sitemapText).not.toMatch(/<loc>[^<]+\/(admin|mi-coa|cuenta|auth|api)(?:\/|<)/)
})

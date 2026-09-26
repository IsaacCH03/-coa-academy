import { expect, test } from '@playwright/test'

test('the public home does not render a personalized course rail for visitors', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Continúa aprendiendo' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Encuentra el curso ideal para seguir aprendiendo' })).toBeVisible()
})

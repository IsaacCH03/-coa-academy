import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  timeout: 180000,
  expect: { timeout: 15000 },
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
    actionTimeout: 15000,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: 'list',
})

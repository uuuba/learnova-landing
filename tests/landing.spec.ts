import { test, expect } from '@playwright/test'

test('language and theme survive reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Courses picked')
  const oldTheme = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: /Switch to .* theme/ }).click()
  const newTheme = oldTheme === 'dark' ? 'light' : 'dark'
  await expect(page.locator('html')).toHaveAttribute('data-theme', newTheme)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', newTheme)
  await page.screenshot({ path: 'docs/screenshots/visitor-en.png', fullPage: true })
})

test('invalid subscription shows validation error without a database write', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'UA', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
  await page.getByLabel('Email', { exact: true }).fill('invalid')
  const response = page.waitForResponse(r => r.url().endsWith('/api/subscribe') && r.request().method() === 'POST')
  await page.locator('form').getByRole('button', { name: 'Залишити email' }).click()
  expect((await response).status()).toBe(400)
  await expect(page.locator('form').getByRole('status')).toContainText('Перевір email')
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  await page.locator('#subscribe').screenshot({ path: 'docs/screenshots/validation-error.png' })
})

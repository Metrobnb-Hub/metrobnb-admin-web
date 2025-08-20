import { test, expect } from '@playwright/test'

test('invoices page loads', async ({ page }) => {
  await page.goto('/invoices')
  await expect(page.locator('h1')).toContainText('Invoices')
})

test('invoice generation flow', async ({ page }) => {
  await page.goto('/partners')
  
  // Click generate invoice button (assuming it exists)
  await page.click('[data-testid="generate-invoice"]')
  
  // Fill form and submit
  await page.selectOption('select[name="partnerId"]', { index: 1 })
  await page.click('button[type="submit"]')
  
  // Should navigate to invoice detail page
  await expect(page).toHaveURL(/.*invoices\/.*/)
})
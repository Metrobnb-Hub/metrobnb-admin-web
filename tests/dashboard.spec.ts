import { test, expect } from '@playwright/test'

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/MetroBNB/)
  await expect(page.locator('h1')).toContainText('Dashboard')
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  
  // Test partners navigation
  await page.click('text=Partners')
  await expect(page).toHaveURL(/.*partners/)
  
  // Test bookings navigation
  await page.click('text=Bookings')
  await expect(page).toHaveURL(/.*bookings/)
})
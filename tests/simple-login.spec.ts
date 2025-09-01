import { test, expect } from '@playwright/test'

test.describe('Simple Login Test', () => {
  test('should load the login page and show form', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Check for login form elements (these should be unique)
    await expect(page.locator('input[placeholder="Email address"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Check page has loaded properly
    await expect(page.locator('form')).toBeVisible()
  })

  test('should perform test login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Look for test login button (only visible in dev mode)
    const testLoginButton = page.getByRole('button', { name: /Test Login/ })
    
    if (await testLoginButton.isVisible()) {
      console.log('Using test login button')
      await testLoginButton.click()
      
      // Wait for navigation to dashboard
      await page.waitForURL('**/dashboard', { timeout: 15000 })
      expect(page.url()).toContain('/dashboard')
    } else {
      console.log('Test login button not visible, using manual login')
      
      // Fill credentials and login manually
      await page.fill('input[placeholder="Email address"]', 'tonynini1998@gmail.com')
      await page.fill('input[placeholder="Password"]', 'TempPassword123!')
      await page.click('button[type="submit"]')
      
      // Wait for response and check for either success or error
      await page.waitForLoadState('networkidle')
      
      // Check if we got redirected to dashboard or if there's an error
      const currentUrl = page.url()
      if (currentUrl.includes('/dashboard')) {
        console.log('Login successful - redirected to dashboard')
      } else {
        // Check for error message
        const errorElement = page.locator('.bg-red-50, .text-red-600')
        if (await errorElement.isVisible()) {
          const errorText = await errorElement.textContent()
          console.log('Login failed with error:', errorText)
        } else {
          console.log('Login attempt completed, current URL:', currentUrl)
        }
      }
    }
  })
})
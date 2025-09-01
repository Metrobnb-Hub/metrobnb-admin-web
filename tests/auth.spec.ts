import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should redirect to login page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('should show login form elements', async ({ page }) => {
    await page.goto('/login')
    
    // Check branding
    await expect(page.locator('h1')).toContainText('MetroBNB')
    await expect(page.locator('text=BETA TESTING')).toBeVisible()
    
    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in')
    
    // Check test login button (dev only)
    await expect(page.locator('text=🚀 Test Login')).toBeVisible()
  })

  test('should perform test login successfully', async ({ page }) => {
    await page.goto('/login')
    
    // Click test login button
    await page.click('text=🚀 Test Login')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Should show user info in sidebar
    await expect(page.locator('text=Tony Nini')).toBeVisible()
    await expect(page.locator('text=MetroBNB')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.click('text=🚀 Test Login')
    await expect(page).toHaveURL('/dashboard')
    
    // Click logout button in sidebar
    await page.click('text=Logout')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
    
    // Should not show user info anymore
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should show registration form', async ({ page }) => {
    await page.goto('/register')
    
    // Check step 1 elements
    await expect(page.locator('h2')).toContainText("Let's get started")
    await expect(page.locator('input[placeholder="Your full name"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Email address"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Create a password"]')).toBeVisible()
    
    // Check progress indicator
    await expect(page.locator('text=Step 1 of 3')).toBeVisible()
  })

  test('should navigate through registration steps', async ({ page }) => {
    await page.goto('/register')
    
    // Step 1: Fill basic info
    await page.fill('input[placeholder="Your full name"]', 'John Doe')
    await page.fill('input[placeholder="Email address"]', 'john@example.com')
    await page.fill('input[placeholder="Create a password"]', 'password123')
    await page.click('text=Continue')
    
    // Step 2: Business type
    await expect(page.locator('h2')).toContainText('How do you manage properties?')
    await page.click('text=Individual Property Owner')
    await page.fill('input[placeholder="Company/Organization name"]', 'John Properties')
    await page.click('text=Continue')
    
    // Step 3: Plan selection
    await expect(page.locator('h2')).toContainText('Choose your plan')
    await expect(page.locator('text=₱1,499')).toBeVisible()
    await expect(page.locator('text=₱4,999')).toBeVisible()
    
    // Should have Starter plan selected by default
    await expect(page.locator('.border-blue-500')).toContainText('Starter')
  })

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })

  test('should maintain session after page reload', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.click('text=🚀 Test Login')
    await expect(page).toHaveURL('/dashboard')
    
    // Reload page
    await page.reload()
    
    // Should still be on dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Tony Nini')).toBeVisible()
  })

  test('should show mobile-responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')
    
    // Mobile header should be visible
    await expect(page.locator('.lg\\:hidden h1')).toContainText('MetroBNB')
    
    // Desktop branding should be hidden
    await expect(page.locator('.hidden.lg\\:flex')).not.toBeVisible()
  })
})

test.describe('Registration Flow', () => {
  test('should validate step 1 form', async ({ page }) => {
    await page.goto('/register')
    
    // Continue button should be disabled initially
    await expect(page.locator('text=Continue')).toBeDisabled()
    
    // Fill partial form
    await page.fill('input[placeholder="Your full name"]', 'John Doe')
    await expect(page.locator('text=Continue')).toBeDisabled()
    
    // Fill complete form
    await page.fill('input[placeholder="Email address"]', 'john@example.com')
    await page.fill('input[placeholder="Create a password"]', 'password123')
    await expect(page.locator('text=Continue')).toBeEnabled()
  })

  test('should validate step 2 form', async ({ page }) => {
    await page.goto('/register')
    
    // Complete step 1
    await page.fill('input[placeholder="Your full name"]', 'John Doe')
    await page.fill('input[placeholder="Email address"]', 'john@example.com')
    await page.fill('input[placeholder="Create a password"]', 'password123')
    await page.click('text=Continue')
    
    // Step 2: Continue should be disabled
    await expect(page.locator('text=Continue').last()).toBeDisabled()
    
    // Select business type
    await page.click('text=Individual Property Owner')
    await expect(page.locator('text=Continue').last()).toBeDisabled()
    
    // Fill organization name
    await page.fill('input[placeholder="Company/Organization name"]', 'John Properties')
    await expect(page.locator('text=Continue').last()).toBeEnabled()
  })

  test('should allow going back in registration', async ({ page }) => {
    await page.goto('/register')
    
    // Complete step 1
    await page.fill('input[placeholder="Your full name"]', 'John Doe')
    await page.fill('input[placeholder="Email address"]', 'john@example.com')
    await page.fill('input[placeholder="Create a password"]', 'password123')
    await page.click('text=Continue')
    
    // Go back to step 1
    await page.click('text=Back')
    await expect(page.locator('h2')).toContainText("Let's get started")
    
    // Form should retain values
    await expect(page.locator('input[placeholder="Your full name"]')).toHaveValue('John Doe')
  })
})
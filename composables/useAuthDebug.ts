/**
 * Auth Debug Utility
 *
 * Helps diagnose authentication token issues
 */

export const useAuthDebug = () => {
  const checkAuthToken = () => {
    const tokenCookie = useCookie('auth_token')
    const refreshCookie = useCookie('refresh_token')
    const userCookie = useCookie('user_data')

    const debug = {
      hasAuthToken: !!tokenCookie.value,
      hasRefreshToken: !!refreshCookie.value,
      hasUserData: !!userCookie.value,
      tokenLength: tokenCookie.value?.length || 0,
      tokenPreview: tokenCookie.value ? `${tokenCookie.value.substring(0, 20)}...` : 'none',
      cookies: {
        auth_token: tokenCookie.value ? 'exists' : 'missing',
        refresh_token: refreshCookie.value ? 'exists' : 'missing',
        user_data: userCookie.value ? 'exists' : 'missing'
      }
    }

    console.log('🔐 Auth Debug:', debug)
    return debug
  }

  const testInvoiceRequest = async () => {
    const config = useRuntimeConfig()
    const tokenCookie = useCookie('auth_token')

    console.log('🧪 Testing Invoice Request...')
    console.log('📍 API Base URL:', config.public.apiBaseUrl)
    console.log('🔑 Token exists:', !!tokenCookie.value)
    console.log('🔑 Token preview:', tokenCookie.value ? `${tokenCookie.value.substring(0, 20)}...` : 'MISSING')

    try {
      // Manual fetch to see exact headers being sent
      const response = await fetch(`${config.public.apiBaseUrl}/api/invoices/?page=1&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenCookie.value}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      console.log('✅ Response status:', response.status)
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log('📦 Data:', data)
        return { success: true, data }
      } else {
        const error = await response.text()
        console.error('❌ Error:', error)
        return { success: false, error }
      }
    } catch (error: any) {
      console.error('❌ Request failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  const compareTokens = async () => {
    console.log('🔍 Comparing token handling...')

    const tokenCookie = useCookie('auth_token')
    const { $api } = useNuxtApp()

    // Test 1: Check token in cookie
    console.log('\n1️⃣ Cookie Token:')
    console.log('  Exists:', !!tokenCookie.value)
    console.log('  Length:', tokenCookie.value?.length || 0)

    // Test 2: Check if $api includes token
    console.log('\n2️⃣ Testing with $api (should auto-include token):')
    try {
      const response = await $api('/api/partners', { method: 'GET' })
      console.log('  ✅ Partners request successful')
    } catch (error: any) {
      console.log('  ❌ Partners request failed:', error.message)
    }

    // Test 3: Check invoice request
    console.log('\n3️⃣ Testing invoice request:')
    try {
      const response = await $api('/api/invoices/?page=1&limit=10', { method: 'GET' })
      console.log('  ✅ Invoice request successful')
    } catch (error: any) {
      console.log('  ❌ Invoice request failed:', error.message)
      console.log('  Status:', error.response?.status)
      console.log('  Data:', error.response?._data)
    }
  }

  return {
    checkAuthToken,
    testInvoiceRequest,
    compareTokens
  }
}

// Global keyboard shortcut to run auth debug (Ctrl+Shift+A)
if (process.client && process.dev) {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      const { checkAuthToken, compareTokens } = useAuthDebug()
      console.clear()
      console.log('🔐 Running Auth Diagnostics...\n')
      checkAuthToken()
      compareTokens()
    }
  })

  console.log('💡 Press Ctrl+Shift+A to run auth diagnostics')
}

/**
 * Invoice CORS Tester
 *
 * Specifically tests CORS for invoice endpoint vs other endpoints
 */

export const useInvoiceCorsTest = () => {
  const config = useRuntimeConfig()

  const testEndpointCors = async (endpoint: string) => {
    const url = `${config.public.apiBaseUrl}${endpoint}`

    console.log(`\n🧪 Testing CORS for: ${endpoint}`)

    // Test 1: OPTIONS preflight request
    try {
      const optionsResponse = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'authorization,content-type'
        }
      })

      console.log(`  OPTIONS response:`, {
        status: optionsResponse.status,
        headers: {
          'access-control-allow-origin': optionsResponse.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': optionsResponse.headers.get('access-control-allow-methods'),
          'access-control-allow-credentials': optionsResponse.headers.get('access-control-allow-credentials')
        }
      })

      if (!optionsResponse.headers.get('access-control-allow-origin')) {
        console.error(`  ❌ No CORS headers in OPTIONS response!`)
        return false
      }
    } catch (error: any) {
      console.error(`  ❌ OPTIONS request failed:`, error.message)
      return false
    }

    // Test 2: Actual GET request
    try {
      const tokenCookie = useCookie('auth_token')
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenCookie.value}`,
          'Content-Type': 'application/json'
        }
      })

      console.log(`  GET response:`, {
        status: getResponse.status,
        corsHeader: getResponse.headers.get('access-control-allow-origin')
      })

      return getResponse.ok
    } catch (error: any) {
      console.error(`  ❌ GET request failed:`, error.message)
      return false
    }
  }

  const compareEndpoints = async () => {
    console.log('🔬 Comparing CORS across endpoints...\n')
    console.log('=' .repeat(60))

    const endpoints = [
      '/api/partners',
      '/api/units',
      '/api/services',
      '/api/invoices/?page=1&limit=10',
      '/api/invoices/archive'
    ]

    const results: Record<string, boolean> = {}

    for (const endpoint of endpoints) {
      results[endpoint] = await testEndpointCors(endpoint)
      await new Promise(resolve => setTimeout(resolve, 500)) // Delay between tests
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📊 CORS Test Results:\n')

    const table = Object.entries(results).map(([endpoint, success]) => ({
      Endpoint: endpoint,
      Status: success ? '✅ WORKING' : '❌ CORS BLOCKED'
    }))

    console.table(table)

    return results
  }

  const getInvoiceCorsDetails = async () => {
    const url = `${config.public.apiBaseUrl}/api/invoices/?page=1&limit=10`

    console.log('🔍 Detailed CORS check for invoices...\n')

    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'authorization,content-type'
        }
      })

      const headers = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
        'access-control-max-age': response.headers.get('access-control-max-age')
      }

      console.log('Response Status:', response.status)
      console.log('CORS Headers:', headers)

      if (!headers['access-control-allow-origin']) {
        console.error('\n❌ PROBLEM FOUND: Invoice endpoint is missing CORS headers!')
        console.log('\n📝 Backend fix needed:')
        console.log('   The /api/invoices/ route needs CORS configuration')
      } else {
        console.log('\n✅ Invoice endpoint has CORS configured')
      }

      return headers
    } catch (error: any) {
      console.error('❌ Failed to check CORS:', error.message)
      return null
    }
  }

  return {
    testEndpointCors,
    compareEndpoints,
    getInvoiceCorsDetails
  }
}

// Add keyboard shortcut (Ctrl+Shift+I for Invoice test)
if (process.client && process.dev) {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      const { compareEndpoints } = useInvoiceCorsTest()
      console.clear()
      console.log('🧪 Running Invoice CORS Test...\n')
      compareEndpoints()
    }
  })

  console.log('💡 Press Ctrl+Shift+I to test invoice CORS')
}

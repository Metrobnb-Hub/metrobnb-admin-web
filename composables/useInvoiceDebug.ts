/**
 * Comprehensive Invoice CORS & Auth Debugger
 *
 * Run this to diagnose why invoice endpoint has CORS issues
 * while other endpoints work fine.
 */

export const useInvoiceDebug = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie('auth_token')

  /**
   * Test a single endpoint with detailed logging
   */
  const testEndpoint = async (endpoint: string, name: string) => {
    const url = `${config.public.apiBaseUrl}${endpoint}`

    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${name}`)
    console.log(`URL: ${url}`)
    console.log(`${'='.repeat(60)}`)

    // Step 1: Test OPTIONS (CORS preflight)
    console.log('\n1️⃣ Testing OPTIONS (CORS Preflight)...')
    try {
      const optionsResp = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'authorization,content-type'
        }
      })

      const corsHeaders = {
        'access-control-allow-origin': optionsResp.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': optionsResp.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': optionsResp.headers.get('access-control-allow-headers'),
        'access-control-allow-credentials': optionsResp.headers.get('access-control-allow-credentials'),
        'access-control-max-age': optionsResp.headers.get('access-control-max-age')
      }

      console.log('  Status:', optionsResp.status)
      console.log('  CORS Headers:', JSON.stringify(corsHeaders, null, 2))

      if (!corsHeaders['access-control-allow-origin']) {
        console.error('  ❌ MISSING CORS HEADERS!')
        console.log('  This endpoint does NOT have CORS configured')
        return { success: false, step: 'OPTIONS', reason: 'Missing CORS headers' }
      }

      if (optionsResp.status !== 200 && optionsResp.status !== 204) {
        console.error(`  ❌ OPTIONS returned ${optionsResp.status} (expected 200 or 204)`)
        return { success: false, step: 'OPTIONS', reason: `Wrong status ${optionsResp.status}` }
      }

      console.log('  ✅ OPTIONS request successful')
    } catch (error: any) {
      console.error('  ❌ OPTIONS request failed:', error.message)
      return { success: false, step: 'OPTIONS', reason: error.message }
    }

    // Step 2: Test GET with token
    console.log('\n2️⃣ Testing GET with Authorization...')
    console.log('  Token exists:', !!tokenCookie.value)
    console.log('  Token preview:', tokenCookie.value ? `${tokenCookie.value.substring(0, 30)}...` : 'MISSING')

    try {
      const getResp = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenCookie.value}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      })

      console.log('  Status:', getResp.status)
      console.log('  CORS Header:', getResp.headers.get('access-control-allow-origin') || 'MISSING')

      if (!getResp.ok) {
        const errorText = await getResp.text()
        console.error('  ❌ Request failed')
        console.log('  Error:', errorText.substring(0, 200))
        return {
          success: false,
          step: 'GET',
          reason: `HTTP ${getResp.status}`,
          statusCode: getResp.status
        }
      }

      const data = await getResp.json()
      console.log('  ✅ GET request successful')
      console.log('  Data preview:', JSON.stringify(data).substring(0, 100) + '...')

      return { success: true, data }
    } catch (error: any) {
      console.error('  ❌ GET request failed:', error.message)

      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('fetch')) {
        console.error('  🔴 THIS IS A CORS ERROR!')
        console.log('  The backend is blocking this request')
      }

      return { success: false, step: 'GET', reason: error.message }
    }
  }

  /**
   * Compare invoice endpoint vs working endpoints
   */
  const compareEndpoints = async () => {
    console.clear()
    console.log('🔬 Invoice CORS Diagnostic Tool')
    console.log('================================\n')
    console.log('Current Origin:', window.location.origin)
    console.log('API Base URL:', config.public.apiBaseUrl)
    console.log('\n')

    const results: Record<string, any> = {}

    // Test working endpoints
    console.log('📊 Testing WORKING endpoints (for comparison)...')
    results['partners'] = await testEndpoint('/api/partners', 'Partners (Working)')
    await new Promise(r => setTimeout(r, 1000))

    results['units'] = await testEndpoint('/api/units', 'Units (Working)')
    await new Promise(r => setTimeout(r, 1000))

    // Test invoice endpoints
    console.log('\n\n📋 Testing INVOICE endpoints (problematic)...')
    results['invoices'] = await testEndpoint('/api/invoices?page=1&limit=10', 'Invoices List')
    await new Promise(r => setTimeout(r, 1000))

    results['invoices_archive'] = await testEndpoint('/api/invoices/archive', 'Invoices Archive')

    // Summary
    console.log('\n\n')
    console.log('═'.repeat(60))
    console.log('📊 SUMMARY')
    console.log('═'.repeat(60))

    const summary = Object.entries(results).map(([name, result]) => ({
      Endpoint: name,
      Status: result.success ? '✅ Working' : '❌ Failed',
      'Failed Step': result.success ? '-' : result.step,
      Reason: result.success ? '-' : result.reason
    }))

    console.table(summary)

    // Analysis
    console.log('\n📝 ANALYSIS:\n')

    const workingEndpoints = Object.entries(results)
      .filter(([_, r]) => r.success)
      .map(([name]) => name)

    const failingEndpoints = Object.entries(results)
      .filter(([_, r]) => !r.success)
      .map(([name]) => name)

    if (failingEndpoints.includes('invoices') || failingEndpoints.includes('invoices_archive')) {
      console.log('🔴 PROBLEM CONFIRMED: Invoice endpoints have CORS issues')
      console.log('\n💡 This is a BACKEND issue. Here\'s what to check:\n')

      console.log('1️⃣ Check if invoice routes are in a separate router file')
      console.log('   - Invoice routes might not inherit global CORS middleware')
      console.log('   - Solution: Add CORS to the invoice router specifically\n')

      console.log('2️⃣ Check route registration order')
      console.log('   - CORS middleware must be added BEFORE routes')
      console.log('   - Solution: Move CORS middleware above route imports\n')

      console.log('3️⃣ Check for route-specific middleware')
      console.log('   - Invoice routes might have middleware blocking CORS')
      console.log('   - Solution: Remove blocking middleware\n')

      console.log('4️⃣ Check OPTIONS handler')
      console.log('   - Invoice routes might be missing OPTIONS handler')
      console.log('   - Solution: Add @router.options() decorator\n')

      // Check if it's specifically OPTIONS failing
      const optionsFailing = failingEndpoints.some(name => {
        const result = results[name]
        return result.step === 'OPTIONS'
      })

      if (optionsFailing) {
        console.log('⚠️  SPECIFIC ISSUE: OPTIONS request failing')
        console.log('   This means the backend is not responding to CORS preflight')
        console.log('   \n   Backend fix needed:')
        console.log('   ```python')
        console.log('   @router.options("/api/invoices/")')
        console.log('   async def invoices_options():')
        console.log('       return {"status": "ok"}')
        console.log('   ```\n')
      }

      // Check if it's GET failing with CORS
      const corsFailing = failingEndpoints.some(name => {
        const result = results[name]
        return result.reason?.includes('CORS') || result.reason?.includes('fetch')
      })

      if (corsFailing) {
        console.log('⚠️  SPECIFIC ISSUE: GET request blocked by CORS')
        console.log('   The backend is not setting CORS headers on actual responses')
        console.log('   \n   Backend fix needed:')
        console.log('   ```python')
        console.log('   app.add_middleware(')
        console.log('       CORSMiddleware,')
        console.log('       allow_origins=["' + window.location.origin + '"],')
        console.log('       allow_credentials=True,')
        console.log('       allow_methods=["*"],')
        console.log('       allow_headers=["*"]')
        console.log('   )')
        console.log('   ```\n')
      }

      // Check auth token
      if (!tokenCookie.value) {
        console.log('⚠️  WARNING: No auth token found!')
        console.log('   You might not be logged in')
        console.log('   Login first, then run this test again\n')
      }

    } else {
      console.log('✅ All endpoints working!')
      console.log('   CORS is configured correctly')
    }

    console.log('\n📋 See docs/INVOICE_CORS_FIX.md for detailed backend fixes')
    console.log('\n')

    return results
  }

  /**
   * Test with raw curl command (copy-paste to terminal)
   */
  const generateCurlTest = () => {
    const url = `${config.public.apiBaseUrl}/api/invoices?page=1&limit=10`
    const token = tokenCookie.value

    console.log('\n📋 TEST WITH CURL:\n')
    console.log('Copy this command and run in your terminal:\n')
    console.log('```bash')
    console.log(`curl -X OPTIONS '${url}' \\`)
    console.log(`  -H 'Origin: ${window.location.origin}' \\`)
    console.log(`  -H 'Access-Control-Request-Method: GET' \\`)
    console.log(`  -H 'Access-Control-Request-Headers: authorization,content-type' \\`)
    console.log(`  -v`)
    console.log('```\n')
    console.log('Expected output should include:')
    console.log('< Access-Control-Allow-Origin: ' + window.location.origin)
    console.log('< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS')
    console.log('< Access-Control-Allow-Credentials: true\n')

    if (token) {
      console.log('\nTest actual GET request:\n')
      console.log('```bash')
      console.log(`curl '${url}' \\`)
      console.log(`  -H 'Authorization: Bearer ${token}' \\`)
      console.log(`  -H 'Accept: application/json' \\`)
      console.log(`  -v`)
      console.log('```\n')
    }
  }

  return {
    testEndpoint,
    compareEndpoints,
    generateCurlTest
  }
}

// Auto-register keyboard shortcut
if (process.client && process.dev) {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'X') {
      const { compareEndpoints } = useInvoiceDebug()
      compareEndpoints()
    }
  })

  console.log('💡 Press Ctrl+Shift+X to run comprehensive invoice diagnostic')
}

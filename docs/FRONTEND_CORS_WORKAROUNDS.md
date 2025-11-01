# Frontend CORS Workarounds & Diagnostics

## Problem

The `/api/invoices/` endpoint has CORS issues while other endpoints work fine. This is a **backend configuration issue**, but there are frontend diagnostics and workarounds we can use.

---

## Quick Diagnostics

### 1. Press `Ctrl+Shift+X` in Browser Console

This runs the comprehensive invoice diagnostic tool:

```javascript
// Automatically available in dev mode
// Press Ctrl+Shift+X
```

This will:
- Test OPTIONS preflight for all endpoints
- Compare invoice vs working endpoints (partners, units)
- Show exactly where CORS fails (OPTIONS or GET)
- Provide specific backend fix recommendations
- Generate curl commands for backend testing

### 2. Manual Browser Test

Open DevTools Console and run:

```javascript
const { compareEndpoints } = useInvoiceDebug()
await compareEndpoints()
```

Expected output:
```
📊 SUMMARY
┌─────────┬────────────────┬─────────────┬────────────────────┐
│ Endpoint│ Status         │ Failed Step │ Reason             │
├─────────┼────────────────┼─────────────┼────────────────────┤
│ partners│ ✅ Working     │ -           │ -                  │
│ units   │ ✅ Working     │ -           │ -                  │
│ invoices│ ❌ Failed      │ OPTIONS     │ Missing CORS       │
└─────────┴────────────────┴─────────────┴────────────────────┘
```

---

## Frontend Workarounds Applied

### 1. Cache Busting for Invoice Requests ✅

**File:** `plugins/api.client.ts`

Invoice GET requests now include a timestamp parameter to bypass stale CORS cache:

```typescript
// Before: /api/invoices?page=1&limit=10
// After:  /api/invoices?page=1&limit=10&_t=1705234567890
```

This helps if browser cached a failed CORS response.

### 2. Credentials Included ✅

**File:** `plugins/api.client.ts`

Invoice requests explicitly include credentials:

```typescript
options.credentials = 'include'
```

This ensures cookies are sent with the request.

### 3. Enhanced Error Messages ✅

**File:** `plugins/api.client.ts`

CORS errors on invoice endpoints now show:

```
🔴 Invoice CORS Error Detected
This is a backend configuration issue.
Press Ctrl+Shift+X to run diagnostics
```

Plus a toast notification:
```
Title: Invoice Access Issue
Description: Unable to load invoices due to server configuration.
             Please contact support.
```

### 4. Request Deduplication ✅

**File:** `plugins/api.client.ts`

Prevents multiple concurrent requests to same invoice endpoint (which could trigger multiple CORS errors):

```typescript
const requestKey = `${method}:${url}:${body}`
if (pendingRequests.has(requestKey)) {
  return cachedPromise
}
```

---

## Understanding CORS Errors

### What is CORS?

**Cross-Origin Resource Sharing** - Browser security that prevents websites from making requests to different domains without permission.

### Why Only Invoices?

If only `/api/invoices/` has CORS issues:

1. **Invoice routes registered differently** - Might be in separate router that doesn't inherit global CORS
2. **Route order issue** - CORS middleware might be added after invoice routes
3. **Route-specific middleware** - Invoice routes might have middleware blocking CORS
4. **Missing OPTIONS handler** - Invoice routes might not handle preflight requests

### CORS Preflight (OPTIONS Request)

Before making the actual request, browsers send an OPTIONS request to check if CORS is allowed:

```http
OPTIONS /api/invoices/ HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization,content-type
```

Backend must respond with:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: authorization,content-type
Access-Control-Allow-Credentials: true
```

If backend doesn't send these headers, browser blocks the actual request.

---

## What Frontend CANNOT Fix

❌ **Frontend cannot bypass CORS** - It's enforced by the browser, not the server.

❌ **Frontend cannot add CORS headers** - Only backend can set these headers.

❌ **Disabling CORS in browser** - Not recommended, security risk, won't work in production.

✅ **Frontend CAN:**
- Diagnose exactly where CORS fails
- Provide clear error messages
- Generate test commands for backend
- Optimize requests to avoid unnecessary preflight

---

## Diagnostic Tools Available

### Tool 1: Invoice Debug (`useInvoiceDebug`)

**Keyboard:** `Ctrl+Shift+X`

**Features:**
- Tests OPTIONS and GET for each endpoint
- Compares working vs failing endpoints
- Shows exactly which CORS headers are missing
- Generates curl commands for backend testing

**Usage:**
```javascript
const { compareEndpoints, generateCurlTest } = useInvoiceDebug()

// Full comparison test
await compareEndpoints()

// Generate curl commands
generateCurlTest()
```

### Tool 2: Invoice CORS Test (`useInvoiceCorsTest`)

**Keyboard:** `Ctrl+Shift+I`

**Features:**
- Quick CORS check for invoice endpoints
- Compares multiple invoice routes
- Shows CORS header details

**Usage:**
```javascript
const { compareEndpoints, getInvoiceCorsDetails } = useInvoiceCorsTest()

// Compare endpoints
await compareEndpoints()

// Detailed CORS check
await getInvoiceCorsDetails()
```

### Tool 3: Auth Debug (`useAuthDebug`)

**Keyboard:** `Ctrl+Shift+A`

**Features:**
- Checks if auth token exists and is valid
- Tests if token is being sent to invoice endpoint
- Compares token handling across endpoints

**Usage:**
```javascript
const { checkAuthToken, testInvoiceRequest, compareTokens } = useAuthDebug()

// Check token status
checkAuthToken()

// Test invoice request specifically
await testInvoiceRequest()

// Compare token handling
await compareTokens()
```

---

## Testing Steps

### Step 1: Verify CORS is the Problem

1. Open DevTools → Console
2. Press `Ctrl+Shift+X`
3. Look for the summary table
4. Check if invoices show "Failed Step: OPTIONS"

If OPTIONS fails → **Backend CORS not configured**

### Step 2: Check Auth Token

1. Press `Ctrl+Shift+A`
2. Check "hasAuthToken: true"
3. Look at token preview

If no token → **Login first, then test again**

### Step 3: Test with curl

1. Press `Ctrl+Shift+X`
2. Scroll down to see curl commands
3. Copy and run in terminal
4. Share output with backend team

```bash
curl -X OPTIONS 'https://metrobnb-api.onrender.com/api/invoices?page=1&limit=10' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: authorization,content-type' \
  -v
```

Expected (working):
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
< Access-Control-Allow-Credentials: true
```

Actual (broken):
```
< HTTP/1.1 404 Not Found
(No CORS headers)
```

### Step 4: Test Actual Request

```bash
curl 'https://metrobnb-api.onrender.com/api/invoices?page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Accept: application/json' \
  -v
```

If this works but browser fails → **CORS issue confirmed**

---

## What to Tell Backend Team

Share this information with your backend developer:

### Issue Summary

```
Only /api/invoices/ endpoint has CORS errors.
Other endpoints (/api/partners, /api/units) work fine.

This indicates invoice routes are missing CORS configuration.
```

### Evidence

1. **OPTIONS request fails:**
   ```
   curl -X OPTIONS 'https://metrobnb-api.onrender.com/api/invoices' \
     -H 'Origin: http://localhost:3000' \
     -v

   Result: No CORS headers returned
   ```

2. **Direct curl works:**
   ```
   curl 'https://metrobnb-api.onrender.com/api/invoices' \
     -H 'Authorization: Bearer TOKEN'

   Result: Data returned successfully
   ```

3. **Other endpoints work in browser:**
   ```
   /api/partners - ✅ Works
   /api/units    - ✅ Works
   /api/invoices - ❌ CORS blocked
   ```

### Required Fix

Invoice routes need CORS configuration. See [INVOICE_CORS_FIX.md](./INVOICE_CORS_FIX.md) for backend solutions.

---

## Browser-Specific Issues

### Chrome/Edge

- Strict CORS enforcement
- Shows detailed error in console
- Network tab shows "(failed) net::ERR_FAILED"

### Firefox

- Similar to Chrome
- Error: "CORS request did not succeed"

### Safari

- Strictest CORS enforcement
- Less detailed error messages

---

## Common Frontend Mistakes to Avoid

### ❌ Don't Disable CORS in Browser

```bash
# DON'T DO THIS
chrome --disable-web-security --user-data-dir="/tmp/chrome"
```

Why: Only works locally, won't work in production, security risk.

### ❌ Don't Use CORS Proxy Services

```javascript
// DON'T DO THIS
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
fetch(proxyUrl + apiUrl)
```

Why: Security risk, unreliable, violates data privacy.

### ❌ Don't Remove Authorization Header

```javascript
// DON'T DO THIS - Won't authenticate
delete options.headers.Authorization
```

Why: Request will fail with 401 Unauthorized.

### ✅ DO: Use Diagnostics and Fix Backend

```javascript
// DO THIS
const { compareEndpoints } = useInvoiceDebug()
await compareEndpoints()
// Then share results with backend team
```

---

## Temporary Workarounds (Development Only)

### Option 1: Use Backend Locally

If you have access to backend code:

1. Run backend locally on `http://localhost:8000`
2. Update `.env`:
   ```
   NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
3. Test invoices locally (no CORS on same origin)

### Option 2: Browser Extension (Dev Only)

Install CORS Unblock extension (Chrome/Firefox):
- **Chrome:** [CORS Unblock](https://chrome.google.com/webstore)
- **Firefox:** [CORS Everywhere](https://addons.mozilla.org/firefox)

⚠️ **WARNING:** Only use in development! Disable before deploying.

---

## Production Checklist

Before deploying to production:

- [ ] All diagnostic tools working (`Ctrl+Shift+X`, etc.)
- [ ] CORS errors show helpful messages
- [ ] Backend team notified of CORS issue
- [ ] curl tests documented
- [ ] No CORS browser extensions enabled
- [ ] No CORS workarounds that bypass security

---

## Need More Help?

### 1. Run Full Diagnostics

```javascript
// In browser console
const { compareEndpoints } = useInvoiceDebug()
await compareEndpoints()
```

Copy the entire output and share with backend team.

### 2. Check Network Tab

1. Open DevTools → Network
2. Filter by "Fetch/XHR"
3. Click on failed invoice request
4. Check "Headers" tab
5. Look for red CORS error

### 3. Share This Information

- Screenshot of diagnostic output (`Ctrl+Shift+X`)
- Network tab screenshot showing CORS error
- curl command that works vs browser that fails
- Backend framework (FastAPI, Express, etc.)

---

## Related Documents

- [INVOICE_CORS_FIX.md](./INVOICE_CORS_FIX.md) - Backend fixes for CORS
- [AUTH_TOKEN_TROUBLESHOOTING.md](./AUTH_TOKEN_TROUBLESHOOTING.md) - Token issues
- [API_IMPROVEMENTS.md](./API_IMPROVEMENTS.md) - General API improvements

---

## Summary

**CORS is a backend issue that must be fixed on the backend.**

Frontend provides:
- ✅ Comprehensive diagnostics
- ✅ Clear error messages
- ✅ Testing tools
- ✅ Evidence for backend team

Frontend cannot:
- ❌ Bypass CORS security
- ❌ Add CORS headers to responses
- ❌ Fix the root cause

**Next Step:** Run `Ctrl+Shift+X` → Share results with backend developer → Fix on backend using [INVOICE_CORS_FIX.md](./INVOICE_CORS_FIX.md)

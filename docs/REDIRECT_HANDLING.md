# HTTP Redirect Handling (307/308)

## Overview

The API client now properly handles HTTP redirects, specifically 307 (Temporary Redirect) and 308 (Permanent Redirect).

---

## How Redirects Are Handled

### 1. Automatic Following

**File:** `plugins/api.client.ts:99`

```typescript
const api = $fetch.create({
  baseURL: config.public.apiBaseUrl,
  timeout: 30000,
  redirect: 'follow', // Automatically follow redirects (307, 308, etc.)
  // ...
})
```

The `redirect: 'follow'` option tells the Fetch API to automatically follow all redirect responses (3xx status codes).

### 2. Debug Logging

**File:** `plugins/api.client.ts:159-170`

```typescript
// Handle 307 Temporary Redirect (should be handled automatically, but log for debugging)
if (response.status === 307 || response.status === 308) {
  if (process.dev) {
    console.warn('[API] Redirect detected:', {
      status: response.status,
      location: response.headers.get('location'),
      originalUrl: options.url
    })
  }
  // $fetch should handle this automatically with redirect: 'follow'
  return
}
```

In development mode, any redirect will be logged to the console so you can see what's happening.

---

## Understanding HTTP Redirects

### 307 Temporary Redirect

- **Purpose:** Tells the client to make the same request to a different URL
- **Behavior:** The request method and body MUST NOT be changed
- **Use Case:** Temporary URL change, load balancing, A/B testing

**Example:**
```
Request:  POST /api/invoices/ (with body: { page: 1, limit: 10 })
Response: 307 Temporary Redirect
          Location: /api/invoices (no trailing slash)

Client automatically retries:
Request:  POST /api/invoices (with SAME body: { page: 1, limit: 10 })
```

### 308 Permanent Redirect

- **Purpose:** Similar to 307 but indicates a permanent URL change
- **Behavior:** The request method and body MUST NOT be changed
- **Use Case:** Permanent URL structure change

### 301/302 vs 307/308

| Code | Name | Method Preservation | Use Case |
|------|------|---------------------|----------|
| 301  | Moved Permanently | ❌ May change POST to GET | Old-style permanent redirect |
| 302  | Found | ❌ May change POST to GET | Old-style temporary redirect |
| 307  | Temporary Redirect | ✅ Preserves method/body | Modern temporary redirect |
| 308  | Permanent Redirect | ✅ Preserves method/body | Modern permanent redirect |

---

## Common Redirect Scenarios

### Scenario 1: Trailing Slash Redirect

Your backend might redirect based on trailing slashes:

```
Client sends: GET /api/invoices?page=1&limit=10
Backend:      307 -> /api/invoices/?page=1&limit=10
Client follows automatically
```

**Frontend handling:** ✅ Automatic (with `redirect: 'follow'`)

### Scenario 2: CORS with Redirects

If your backend redirects to a different domain:

```
Request:  GET https://api.example.com/invoices
Response: 307 -> https://cdn.example.com/invoices

POTENTIAL ISSUE: CORS preflight may fail if cdn.example.com
doesn't have CORS configured!
```

**Solution:** Ensure CORS is configured on BOTH domains.

### Scenario 3: Authorization Header on Redirects

The Fetch API **preserves headers** when following same-origin redirects but **may drop them** on cross-origin redirects.

**Example:**
```
Same-origin (✅ Headers preserved):
https://api.example.com/invoices -> https://api.example.com/v2/invoices

Cross-origin (⚠️ Headers may be dropped):
https://api.example.com/invoices -> https://newapi.example.com/invoices
```

**Our handling:** We use `credentials: 'include'` implicitly, but Authorization header might be dropped on cross-origin redirects for security reasons.

---

## Debugging Redirects

### 1. Check Browser Console

In development mode, redirects are logged:

```
[API] Redirect detected: {
  status: 307,
  location: '/api/invoices/',
  originalUrl: '/api/invoices?page=1&limit=10'
}
```

### 2. Check Network Tab

1. Open DevTools → Network
2. Look for requests with status **307** or **308**
3. Check the **Headers** tab:
   - **Request URL:** Original URL
   - **Location header:** Redirect target
4. You should see **two requests**:
   - Original request (307 status)
   - Followed request (200 status)

### 3. Test with curl

```bash
# Show redirect without following
curl -I https://metrobnb-api.onrender.com/api/invoices

# Should show something like:
# HTTP/2 307
# location: /api/invoices/

# Follow redirects
curl -L https://metrobnb-api.onrender.com/api/invoices

# -L flag tells curl to follow redirects
```

---

## Potential Issues & Solutions

### Issue 1: Infinite Redirect Loop

**Symptoms:**
- Request never completes
- Console shows multiple redirect logs
- Browser times out

**Cause:**
```
/api/invoices -> 307 -> /api/invoices/ -> 307 -> /api/invoices -> ...
```

**Solution:** Fix backend to not redirect back and forth.

### Issue 2: POST Body Lost on Redirect

**Symptoms:**
- POST request works initially
- After redirect, backend receives empty body

**Cause:** Backend using 301/302 instead of 307/308

**Solution:** Backend should use 307/308 for POST/PUT/PATCH redirects.

### Issue 3: CORS Errors After Redirect

**Symptoms:**
- Initial request succeeds (307 response)
- Redirect target fails with CORS error

**Cause:** Redirect target URL doesn't have CORS configured

**Solution:** Add CORS headers to redirect target.

---

## Backend Best Practices

### 1. Use 307/308 for API Redirects

```python
# ✅ GOOD - Preserves method and body
@app.get("/api/invoices")
async def redirect_invoices():
    return RedirectResponse(
        url="/api/invoices/",
        status_code=307  # or 308 for permanent
    )

# ❌ BAD - May change POST to GET
@app.get("/api/invoices")
async def redirect_invoices():
    return RedirectResponse(
        url="/api/invoices/",
        status_code=302  # Old-style redirect
    )
```

### 2. Avoid Redirects for API Endpoints

Better to handle both URLs:

```python
# ✅ BEST - Handle both with and without trailing slash
@app.get("/api/invoices")
@app.get("/api/invoices/")
async def get_invoices(page: int = 1, limit: int = 10):
    # Your logic here
    pass
```

### 3. Configure CORS for Redirect Targets

If you must redirect, ensure CORS is set up on the target:

```python
# If redirecting from /api/invoices to /api/v2/invoices
# Both endpoints need CORS!

@app.options("/api/invoices")
@app.options("/api/v2/invoices")  # Don't forget this!
async def cors_preflight():
    return Response(headers={
        "Access-Control-Allow-Origin": "https://your-frontend.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*"
    })
```

---

## Testing Redirects

### Test 1: Check if Redirect Happens

```javascript
// In browser console
fetch('https://metrobnb-api.onrender.com/api/invoices', {
  redirect: 'manual'  // Don't follow, just show redirect
})
.then(r => {
  if (r.type === 'opaqueredirect') {
    console.log('Redirect detected!')
  }
  console.log('Status:', r.status)
  console.log('Redirected:', r.redirected)
  console.log('Final URL:', r.url)
})
```

### Test 2: Check Redirect Preservation

```javascript
// Test if POST body is preserved
fetch('https://metrobnb-api.onrender.com/api/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ test: 'data' }),
  redirect: 'follow'
})
.then(r => r.json())
.then(data => console.log('Data after redirect:', data))
```

### Test 3: Use Diagnostic Tool

Press `Ctrl+Shift+X` to run invoice diagnostics, which will show redirects in the output.

---

## Configuration Summary

### Current Settings

```typescript
// plugins/api.client.ts
const api = $fetch.create({
  redirect: 'follow',  // ✅ Automatically follow all redirects
  timeout: 30000,
  // ...
})
```

### Redirect Modes Available

```typescript
redirect: 'follow'   // ✅ Follow all redirects (default for $fetch)
redirect: 'manual'   // ❌ Don't follow, return redirect response
redirect: 'error'    // ❌ Throw error on redirect
```

We use `'follow'` which is appropriate for API clients.

---

## Related Documentation

- [INVOICE_CORS_FIX.md](./INVOICE_CORS_FIX.md) - CORS configuration
- [FRONTEND_CORS_WORKAROUNDS.md](./FRONTEND_CORS_WORKAROUNDS.md) - Frontend diagnostics
- [API_IMPROVEMENTS.md](./API_IMPROVEMENTS.md) - General API improvements

---

## Summary

**Redirect Handling:** ✅ Fully Automatic

- 307/308 redirects are followed automatically
- Request method and body are preserved
- Authorization headers are preserved (same-origin)
- Debug logging in development mode
- No action needed from frontend for most cases

**When to investigate:**
- If you see redirect logs in console frequently
- If requests fail after redirect
- If CORS errors appear after working initially

The system is now configured to handle redirects properly!

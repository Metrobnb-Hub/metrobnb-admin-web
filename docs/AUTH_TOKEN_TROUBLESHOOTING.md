# Auth Token Troubleshooting Guide

## Problem: Invoice Endpoint Not Receiving Auth Token

If you're seeing requests to `/api/invoices/` without the Authorization header, here's how to diagnose and fix it.

---

## Quick Diagnostics

### 1. Press `Ctrl+Shift+A` (Development Mode)

This runs the auth diagnostics tool and shows:
- Whether auth token exists in cookies
- Token preview (first 20 characters)
- Comparison between different endpoints

### 2. Check Browser Console

Look for this debug log when making invoice requests:

```
[API Debug] Invoice request: {
  endpoint: '/api/invoices/?page=1&limit=10',
  hasToken: true/false,
  tokenPreview: 'eyJhbGciOiJIUzI1NiI...'
}
```

### 3. Check Network Tab

1. Open DevTools → Network
2. Click on the `/api/invoices/` request
3. Check **Request Headers** → Should see:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiI...
   ```

---

## Common Causes & Solutions

### Cause 1: Cookie Not Accessible

**Symptoms:**
- Token exists but not being sent
- Works in Postman but not in browser

**Check:**
```javascript
// In browser console
document.cookie.includes('auth_token')
```

**Solution:**
Your backend needs to set cookies with correct attributes:

```python
# Backend (FastAPI example)
response.set_cookie(
    key="auth_token",
    value=token,
    httponly=False,  # ⚠️ Must be False for JavaScript access
    secure=True,     # HTTPS only
    samesite="lax",  # Or "none" for cross-origin
    max_age=900      # 15 minutes
)
```

### Cause 2: Token Expired

**Symptoms:**
- 401 Unauthorized responses
- Token exists but is old

**Check:**
```javascript
// Decode JWT token (first 20 chars shown in debug)
const token = useCookie('auth_token').value
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Expires:', new Date(payload.exp * 1000))
```

**Solution:**
Auto-handled by the API plugin (refreshes token automatically).

### Cause 3: Wrong Cookie Domain

**Symptoms:**
- Works on localhost but not in production
- Cookie set but not accessible

**Check:**
```javascript
// Check cookie domain
document.cookie.split(';').find(c => c.includes('auth_token'))
```

**Solution - Backend:**
```python
# Don't set specific domain for SameSite cookies
response.set_cookie(
    key="auth_token",
    # domain=".example.com",  # ❌ Remove this
    samesite="lax"
)
```

### Cause 4: CORS Blocking Credentials

**Symptoms:**
- Cookies not sent on cross-origin requests
- Works on same domain

**Solution - Backend:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,  # ✅ MUST be True for cookies
    allow_methods=["*"],
    allow_headers=["*"]
)
```

**Solution - Frontend:**
Already handled! The plugin automatically includes credentials.

### Cause 5: httpOnly Cookie (Can't Access from JavaScript)

**Symptoms:**
- Cookie visible in DevTools → Application → Cookies
- But `useCookie('auth_token').value` is `null`

**Check:**
Look at the cookie in DevTools:
- If "HttpOnly" column is ✅ → **This is the problem**

**Solution - Backend:**
```python
response.set_cookie(
    key="auth_token",
    httponly=False  # ✅ Change to False for JS access
)
```

**Security Note:**
If you need httpOnly cookies, you'll need to handle auth differently (server-side sessions or different architecture).

---

## Solutions Applied

### 1. Debug Logging Added ✅

The `apiClient` in [composables/api.ts](../composables/api.ts) now logs invoice requests:

```typescript
if (process.dev && endpoint.includes('invoices')) {
  console.log('[API Debug] Invoice request:', {
    endpoint,
    hasToken: !!tokenCookie.value,
    tokenPreview: tokenCookie.value ? '...' : 'MISSING'
  })
}
```

### 2. Explicit Token Header ✅

Added redundant Authorization header to ensure token is always sent:

```typescript
headers: {
  ...options.headers,
  // Belt and suspenders - ensure token is set
  ...(tokenCookie.value && {
    'Authorization': `Bearer ${tokenCookie.value}`
  })
}
```

### 3. Auth Debug Tool ✅

Created [composables/useAuthDebug.ts](../composables/useAuthDebug.ts) with:
- `Ctrl+Shift+A` - Run auth diagnostics
- `checkAuthToken()` - Check token status
- `testInvoiceRequest()` - Test invoice endpoint directly
- `compareTokens()` - Compare token handling across endpoints

---

## Testing Steps

### 1. Check Token Exists

```javascript
// Browser console
const token = useCookie('auth_token')
console.log('Has token:', !!token.value)
console.log('Token:', token.value?.substring(0, 50))
```

### 2. Test Manual Request

```javascript
// Browser console
const config = useRuntimeConfig()
const token = useCookie('auth_token').value

fetch(`${config.public.apiBaseUrl}/api/invoices/?page=1&limit=10`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(e => console.error('❌ Failed:', e))
```

### 3. Use Debug Tool

```javascript
// Browser console
const { testInvoiceRequest } = useAuthDebug()
await testInvoiceRequest()
```

---

## Backend Checklist

Make sure your backend has:

- [ ] CORS enabled with `allow_credentials=True`
- [ ] Cookie set with `httponly=False` (for JS access)
- [ ] Cookie `samesite="lax"` or `"none"` (with `secure=True`)
- [ ] `/api/invoices/` endpoint accepts `Authorization` header
- [ ] OPTIONS request handled for CORS preflight
- [ ] Token validation working correctly

---

## Frontend Checklist

- [x] Plugin sets Authorization header automatically
- [x] Debug logging for invoice requests
- [x] Explicit token header as backup
- [x] Auth debug tool available (`Ctrl+Shift+A`)
- [x] Token refresh on 401 errors

---

## Example Backend CORS Configuration

### FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app"
    ],
    allow_credentials=True,  # ✅ Required for cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=86400  # Cache preflight for 24 hours
)
```

### Setting Cookies

```python
from fastapi import Response

@app.post("/api/auth/login")
async def login(response: Response, credentials: LoginRequest):
    # ... authenticate user ...

    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    # Set cookies
    response.set_cookie(
        key="auth_token",
        value=access_token,
        httponly=False,  # ✅ Allow JS access
        secure=True,     # HTTPS only
        samesite="lax",  # Cross-site protection
        max_age=900,     # 15 minutes
        path="/"
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,   # ✅ Can be httponly (not accessed by JS)
        secure=True,
        samesite="lax",
        max_age=604800,  # 7 days
        path="/"
    )

    return {"success": True, "data": {...}}
```

---

## If Still Not Working

1. **Run full diagnostics:**
   ```javascript
   // Press Ctrl+Shift+A or run:
   const { compareTokens } = useAuthDebug()
   await compareTokens()
   ```

2. **Check if other endpoints work:**
   ```javascript
   const api = useApi()
   await api.getPartners() // Does this work?
   await api.getInvoices() // Does this fail?
   ```

3. **Compare Network requests:**
   - Open DevTools → Network
   - Filter by "Fetch/XHR"
   - Compare `/api/partners` vs `/api/invoices/`
   - Check if both have Authorization header

4. **Test with curl:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://metrobnb-api.onrender.com/api/invoices/?page=1&limit=10
   ```

---

## Contact Support

If issue persists after trying all solutions:

1. Take screenshot of:
   - Network tab showing missing Authorization header
   - Console with `Ctrl+Shift+A` output
   - Cookie storage (DevTools → Application → Cookies)

2. Provide:
   - Browser (Chrome/Firefox/etc.)
   - Environment (localhost/production)
   - Error messages

3. Share debug output:
   ```javascript
   const { checkAuthToken } = useAuthDebug()
   checkAuthToken()
   ```

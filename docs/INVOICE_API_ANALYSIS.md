# Invoice API Call Analysis - CORS Issue Root Cause

## Summary

After carefully analyzing all invoice-related pages and components, I've identified **potential issues with how invoice endpoints are being called**.

---

## Invoice Endpoints Being Used

### 1. `/api/invoices` - List Invoices (GET)
**Used in:** `pages/accounting/invoices/index.vue:460`

```typescript
getInvoices: async (filters: any = {}) => {
  const params = new URLSearchParams()
  // ... build params
  const query = params.toString()
  return await apiClient<any>(`/api/invoices${query ? `?${query}` : ''}`)
}
```

**Actual call from page:**
```typescript
const result = showArchive.value
  ? await getArchivedInvoices(filters)
  : await getInvoices(filters)
```

**Problem:** When `filters` has `page` and `limit`:
- URL becomes: `/api/invoices?page=1&limit=10`
- This is correct ✅

### 2. `/api/invoices/archive` - Archived Invoices (GET)
**Used in:** `pages/accounting/invoices/index.vue:474`

```typescript
getArchivedInvoices: async (filters: any = {}) => {
  const params = new URLSearchParams()
  // ... build params
  const query = params.toString()
  return await apiClient<any>(`/api/invoices/archive${query ? `?${query}` : ''}`)
}
```

**Actual URL:** `/api/invoices/archive?page=1&limit=10`
- This is correct ✅

### 3. `/api/invoices/{id}` - Get Invoice By ID (GET)
**Used in:** `pages/accounting/invoices/[id].vue:253`

```typescript
getInvoiceById: async (invoiceId: string) => {
  return await apiClient<any>(`/api/invoices/${invoiceId}`)
}
```

**Actual call:**
```typescript
const response = await getInvoiceById(route.params.id as string)
```

**Actual URL:** `/api/invoices/abc-123-def-456`
- This is correct ✅

### 4. `/api/invoices/draft` - Create Draft (POST)
**Used in:** `components/InvoiceDraftModal.vue:218`

```typescript
createDraftInvoice: async (partnerId: string, startDate: string, endDate: string) => {
  return await apiClient<any>('/api/invoices/draft', {
    method: 'POST',
    body: JSON.stringify({
      partner_id: partnerId,
      start_date: startDate,
      end_date: endDate
    })
  })
}
```

**Actual call:**
```typescript
const result = await createDraftInvoice(
  form.value.partner_id,
  startDate,
  endDate
)
```

**Actual URL:** `/api/invoices/draft` (POST)
- This is correct ✅

---

## Potential Issues Found

### Issue 1: Missing Query String Prefix

**Location:** `composables/api.ts:460`

```typescript
getInvoices: async (filters: any = {}) => {
  const params = new URLSearchParams()
  if (filters.partner_id) params.append('partner_id', filters.partner_id)
  if (filters.status) params.append('status', filters.status)
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())
  // ...

  const query = params.toString()
  return await apiClient<any>(`/api/invoices${query ? `?${query}` : ''}`)
  //                                          ^^^^^^^^^^^^^^^^^^^^^^^^
  //                                          This looks correct
}
```

**Analysis:** ✅ This is actually correct. The `?` is properly added when query exists.

### Issue 2: URL Construction in Pages

**Location:** `pages/accounting/invoices/index.vue:443-460`

```typescript
const loadInvoices = async () => {
  try {
    isLoading.value = true

    const filters = {
      ...(filterStatus.value !== 'all' && { status: filterStatus.value }),
      ...(filterPartner.value !== 'all' && { partner_id: filterPartner.value }),
      page: currentPage.value,         // ✅ Number
      limit: itemsPerPage.value        // ✅ Number
    }

    const result = showArchive.value
      ? await getArchivedInvoices(filters)
      : await getInvoices(filters)
```

**Analysis:** ✅ Filters are constructed correctly.

---

## ACTUAL Problem: URL Path Format

Looking at the error you're experiencing and comparing with other endpoints, the issue might be:

### Hypothesis 1: Trailing Slash Issue

Your backend might expect:
- `/api/invoices/` (with trailing slash)

But frontend is calling:
- `/api/invoices` (without trailing slash)

**Check backend routes:**
```python
# If backend has this:
@router.get("/api/invoices/")  # ❌ Requires trailing slash
async def get_invoices():
    pass

# But frontend calls:
/api/invoices?page=1  # ❌ No trailing slash - CORS fails!

# Should be:
/api/invoices/?page=1  # ✅ With trailing slash
```

### Hypothesis 2: Query Parameter Encoding

The backend might not be handling query parameters in the same way for invoice routes:

```
/api/partners?page=1       # ✅ Works (no CORS)
/api/invoices?page=1       # ❌ CORS error
/api/invoices/?page=1      # ✅ Might work?
```

### Hypothesis 3: Route Registration Order

Invoice routes might be registered AFTER a catch-all route:

```python
# Wrong order (example):
@app.get("/api/{catchall:path}")  # ❌ Catches /api/invoices first
async def catch_all():
    pass

# Then invoice routes don't match!
@router.get("/api/invoices/")     # Never reached!
async def get_invoices():
    pass
```

---

## Frontend Fixes to Try

### Fix 1: Add Trailing Slash to Invoice Endpoints

**File:** `composables/api.ts`

```typescript
getInvoices: async (filters: any = {}) => {
  const params = new URLSearchParams()
  // ... build params
  const query = params.toString()
  // Add trailing slash before query params
  return await apiClient<any>(`/api/invoices/${query ? `?${query}` : ''}`)
  //                                          ^ Added slash
},

getArchivedInvoices: async (filters: any = {}) => {
  const params = new URLSearchParams()
  // ... build params
  const query = params.toString()
  return await apiClient<any>(`/api/invoices/archive${query ? `?${query}` : ''}`)
  //                                                 ^ Already has slash
},

getInvoiceById: async (invoiceId: string) => {
  // No change needed - dynamic segment doesn't need trailing slash
  return await apiClient<any>(`/api/invoices/${invoiceId}`)
},
```

### Fix 2: Use Consistent URL Builder

Create a helper function:

```typescript
// Add to composables/api.ts
const buildApiUrl = (path: string, params?: Record<string, any>) => {
  // Ensure path starts with /api
  if (!path.startsWith('/api')) {
    path = `/api${path.startsWith('/') ? '' : '/'}${path}`
  }

  // Add trailing slash for list endpoints
  if (path.endsWith('/invoices') || path.endsWith('/archive')) {
    path = `${path}/`
  }

  // Add query params
  if (params) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'all') {
        query.append(key, value.toString())
      }
    })
    const queryString = query.toString()
    if (queryString) {
      path = `${path}?${queryString}`
    }
  }

  return path
}

// Then use it:
getInvoices: async (filters: any = {}) => {
  return await apiClient<any>(buildApiUrl('/invoices', filters))
},
```

---

## Testing the Fix

### Test 1: Check Current URL Format

Add logging to see actual URLs being called:

```typescript
// In composables/api.ts - apiClient function
const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  console.log('🔍 Invoice API Call:', {
    endpoint,
    fullUrl: `${config.public.apiBaseUrl}${endpoint}`,
    method: options.method || 'GET'
  })

  // ... rest of function
}
```

### Test 2: Try Manual URL with Trailing Slash

In browser console:

```javascript
// Current (might be failing):
fetch('https://metrobnb-api.onrender.com/api/invoices?page=1&limit=10', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})

// Try with trailing slash:
fetch('https://metrobnb-api.onrender.com/api/invoices/?page=1&limit=10', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
```

### Test 3: Compare with Working Endpoint

```javascript
// Partners (working):
fetch('https://metrobnb-api.onrender.com/api/partners', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})

// Invoices (broken):
fetch('https://metrobnb-api.onrender.com/api/invoices?page=1&limit=10', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
```

---

## Backend Checklist

Share this with your backend developer:

### 1. Check Route Definitions

```python
# Are invoice routes defined with trailing slash?
@router.get("/api/invoices/")      # ← With slash
# or
@router.get("/api/invoices")       # ← Without slash

# Frontend needs to match this exactly!
```

### 2. Check CORS Middleware Order

```python
# CORS must be added BEFORE routes
app.add_middleware(CORSMiddleware, ...)  # ✅ FIRST

# Then add routes
app.include_router(invoices_router)      # ✅ AFTER CORS
```

### 3. Check if Invoice Routes are in Separate File

```python
# invoices/router.py might be missing CORS
router = APIRouter(prefix="/api/invoices", tags=["invoices"])

# Options handler needed for CORS preflight
@router.options("/")
@router.options("")
async def invoices_options():
    return {"status": "ok"}
```

### 4. Test Backend Directly

```bash
# Test OPTIONS (CORS preflight)
curl -X OPTIONS 'https://metrobnb-api.onrender.com/api/invoices/?page=1&limit=10' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: GET' \
  -v

# Should return CORS headers
```

---

## Files Analyzed

### Pages
- ✅ `pages/accounting/invoices/index.vue` - Main invoice list
- ✅ `pages/accounting/invoices/[id].vue` - Invoice detail
- ✅ `pages/invoice.vue` - Public invoice view

### Components
- ✅ `components/InvoiceDraftModal.vue` - Creates draft invoices
- ✅ `components/partners/InvoiceGeneratorModal.vue` - Generates invoices
- ✅ `components/partners/PartnerInvoice.vue` - Invoice display

### Composables
- ✅ `composables/api.ts` - All API methods (lines 408-506)
- ✅ `composables/useInvoiceWorkflow.ts` - Invoice state management

---

## Next Steps

1. **Add logging** to see actual URLs being called
2. **Try trailing slash fix** in composables/api.ts
3. **Test with browser console** to compare URLs
4. **Share findings with backend** developer
5. **Run diagnostic tool** (`Ctrl+Shift+X`) to confirm fix

---

## Quick Fix to Test

**File:** `composables/api.ts`

Change line 460 from:
```typescript
return await apiClient<any>(`/api/invoices${query ? `?${query}` : ''}`)
```

To:
```typescript
return await apiClient<any>(`/api/invoices/${query ? `?${query}` : ''}`)
//                                          ^ Added trailing slash
```

And line 474 already has the slash, so it should work.

Then test and see if CORS error persists.

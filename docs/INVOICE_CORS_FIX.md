# Invoice CORS Fix - Specific Route Issue

## Problem

**Only** the `/api/invoices/` endpoint has CORS issues. Other endpoints (`/api/partners`, `/api/units`, etc.) work fine.

This means your global CORS is configured correctly, but the invoice route specifically is missing CORS.

---

## Run Diagnostic

Press **`Ctrl+Shift+I`** in browser console or run:

```javascript
const { compareEndpoints } = useInvoiceCorsTest()
await compareEndpoints()
```

This will show exactly which endpoints have CORS working and which don't.

---

## Backend Fixes (Choose One Based on Your Setup)

### Fix 1: Invoice Routes in Different Router/Blueprint

If your invoices are in a separate router file that doesn't inherit CORS:

#### FastAPI (Python)

```python
# invoices/router.py or routes/invoices.py
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter(prefix="/api/invoices", tags=["invoices"])

# Add CORS to this specific router
@router.options("/")
@router.options("")
@router.options("/archive")
async def invoices_options():
    """Handle CORS preflight for invoices"""
    return {"status": "ok"}

@router.get("/")
async def get_invoices(page: int = 1, limit: int = 10):
    # Your code
    pass

# In main.py
from invoices.router import router as invoices_router

app.include_router(invoices_router)

# Make sure global CORS is added BEFORE this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### Fix 2: Invoice Route Has Custom Middleware

If invoices have route-specific middleware blocking CORS:

```python
# Remove or modify middleware on invoice routes
@router.get("/api/invoices/")
# @app.middleware("http")  # ❌ Remove this if it's blocking CORS
async def get_invoices():
    pass
```

### Fix 3: Missing OPTIONS Handler

Explicitly add OPTIONS method handler:

#### FastAPI

```python
from fastapi import APIRouter, Response

router = APIRouter()

# Add OPTIONS handler for each invoice endpoint
@router.options("/api/invoices/")
async def invoices_options(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return {"status": "ok"}

@router.options("/api/invoices/archive")
async def invoices_archive_options(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return {"status": "ok"}

# Your actual endpoints
@router.get("/api/invoices/")
async def get_invoices(page: int = 1, limit: int = 10):
    # Your code
    pass

@router.get("/api/invoices/archive")
async def get_archived_invoices():
    # Your code
    pass
```

#### Express (Node.js)

```javascript
const express = require('express');
const router = express.Router();

// Add OPTIONS handler
router.options('/invoices*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Your actual routes
router.get('/invoices', async (req, res) => {
  // Your code
});
```

### Fix 4: Route Order Issue

Make sure CORS middleware is added BEFORE invoice routes:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Add CORS FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=86400
)

# ✅ Then add routes
from routes.invoices import router as invoices_router
app.include_router(invoices_router)

# ❌ DON'T add CORS after routes
```

### Fix 5: Check for Route-Specific CORS Override

Look for code like this in your invoice routes:

```python
# ❌ BAD - Overrides global CORS
@router.get("/api/invoices/")
async def get_invoices(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "https://different-domain.com"
    # This overrides global CORS!
```

Remove or fix it:

```python
# ✅ GOOD - Let global CORS handle it
@router.get("/api/invoices/")
async def get_invoices():
    # Don't set CORS headers manually
```

---

## Testing the Fix

### 1. Test OPTIONS Request

```bash
curl -X OPTIONS https://metrobnb-api.onrender.com/api/invoices/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Should see:
```
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
< Access-Control-Allow-Credentials: true
```

### 2. Test in Browser Console

```javascript
const { getInvoiceCorsDetails } = useInvoiceCorsTest()
await getInvoiceCorsDetails()
```

Should show:
```
✅ Invoice endpoint has CORS configured
```

### 3. Test Actual Request

```javascript
const api = useApi()
const invoices = await api.getInvoices({ page: 1, limit: 10 })
console.log('✅ Invoices loaded:', invoices)
```

---

## Quick Fix (Temporary)

If you can't modify backend immediately, add this to your invoice routes file:

```python
# At the top of your invoice routes file
from fastapi import APIRouter, Request, Response

router = APIRouter()

@router.middleware("http")
async def add_cors_to_invoices(request: Request, call_next):
    """Temporary CORS fix for invoice routes only"""
    if request.method == "OPTIONS":
        return Response(
            headers={
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": "true"
            }
        )

    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
```

---

## Common Mistakes

### ❌ Mistake 1: CORS added after routes

```python
# Wrong order
app.include_router(invoices_router)
app.add_middleware(CORSMiddleware, ...)  # Too late!
```

### ❌ Mistake 2: OPTIONS method not in allowed methods

```python
# Missing OPTIONS
allow_methods=["GET", "POST", "PUT", "DELETE"]  # ❌ No OPTIONS!
```

### ❌ Mistake 3: Different domain in invoice-specific CORS

```python
# Global CORS allows localhost
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"])

# But invoice route overrides it
@router.get("/invoices/")
async def get_invoices(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "https://example.com"  # ❌ Different!
```

---

## Checklist

After backend update:

- [ ] CORS middleware added BEFORE invoice routes
- [ ] OPTIONS method included in allowed methods
- [ ] `allow_credentials=True` is set
- [ ] Invoice routes don't manually set CORS headers
- [ ] Tested OPTIONS request (returns 200 with CORS headers)
- [ ] Tested actual GET request (works from frontend)
- [ ] No route-specific middleware blocking CORS

---

## Still Not Working?

If invoice CORS still fails after trying all fixes:

1. **Check backend logs** for the OPTIONS request
2. **Print route list** to verify invoice routes are registered
3. **Test with curl** to isolate frontend vs backend issue
4. **Compare** working route (partners) vs broken route (invoices) in your code

### Debug Backend

```python
# Add logging to see what's happening
import logging
logging.basicConfig(level=logging.DEBUG)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"Request: {request.method} {request.url}")
    logging.info(f"Headers: {request.headers}")
    response = await call_next(request)
    logging.info(f"Response headers: {response.headers}")
    return response
```

This will show you exactly what headers are being sent and received.

---

## Need Help?

Share:
1. Output from `Ctrl+Shift+I` test
2. Your invoice routes file
3. How invoices are registered (router/blueprint)
4. Backend framework (FastAPI/Express/Django/etc.)

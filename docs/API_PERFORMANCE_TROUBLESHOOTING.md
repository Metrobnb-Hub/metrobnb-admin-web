# API Performance Troubleshooting Guide

## Why is my API slow in production but fast in Postman?

### TL;DR - Most Common Causes

1. **Render Cold Starts** (30-90 seconds first request) - Most likely your issue
2. **CORS Preflight Requests** (doubles request count)
3. **Sequential vs Parallel Requests** (waterfall loading)
4. **Missing Cache** (re-fetching same data)
5. **Network Latency** (browser → Vercel → Render vs Postman → Render)

---

## 1. Render Cold Starts 🥶 (MOST LIKELY)

### Problem

Render free tier spins down your API after **15 minutes of inactivity**. First request takes **30-90 seconds** to wake up.

**Postman is fast because:** You're testing immediately after recent activity.

**Your app is slow because:** User opens app → API is asleep → cold start → slow.

### Detection

Run diagnostics in your browser console:

```javascript
// Press Ctrl+Shift+D in development mode
// Or manually run:
const { testApiPerformance } = useApiWarmup()
await testApiPerformance()
```

Look for:
- First request > 10 seconds = Cold start confirmed
- Subsequent requests < 1 second = API is warm

### Solution

#### Option 1: Auto Warmup (Already Implemented) ✅

The API warmup plugin automatically pings your API every 10 minutes:

```typescript
// Already active in plugins/api-performance.client.ts
// Automatically enabled for render.com URLs
```

**Verify it's working:**
1. Open your deployed app
2. Open browser console
3. Look for: `🔥 API warmup started - Render cold starts prevention active`
4. Wait 10 minutes - you should see a background ping

#### Option 2: Upgrade Render Plan

**Starter Plan ($7/month):**
- No cold starts
- Always-on service
- Better performance

**Professional Plan ($25/month):**
- Dedicated resources
- Even better performance

#### Option 3: External Ping Service (Free)

Use a service like [UptimeRobot](https://uptimerobot.com/) or [Cron-Job.org](https://cron-job.org/) to ping your API every 5-10 minutes.

**Setup:**
1. Create free account
2. Add monitor for: `https://your-api.onrender.com/health` (note: no `/api` prefix)
3. Set interval: 5-10 minutes

---

## 2. CORS Preflight Requests ✈️

### Problem

Browsers make **TWO requests** for every API call:
1. **OPTIONS** (preflight) - Check CORS permissions
2. **GET/POST** (actual request)

Postman skips the preflight.

### Detection

Open browser DevTools → Network tab:
- Filter by "XHR/Fetch"
- Look for OPTIONS requests before each GET/POST
- Each pair doubles your load time

### Solution

**Backend Fix (Recommended):**

Add to your API (Python/FastAPI example):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-admin.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=86400  # Cache preflight for 24 hours
)
```

**Key:** `max_age=86400` caches the preflight result for 24 hours!

**Frontend Fix (Partial):**

Use simple requests when possible (no preflight needed):

```typescript
// ❌ Triggers preflight
await $fetch('/api/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Custom-Header': 'value'  // Custom header triggers preflight
  }
})

// ✅ No preflight (if server allows)
await $fetch('/api/data', {
  method: 'GET'
  // Authorization header is allowed without preflight if server configured
})
```

---

## 3. Sequential vs Parallel Requests 🏃‍♂️

### Problem

Loading data one-by-one instead of all at once.

**Sequential (Slow):**
```typescript
// ❌ Takes 3 seconds if each request takes 1s
const partners = await api.getPartners()    // 1s
const units = await api.getUnits()          // 1s
const services = await api.getServices()    // 1s
// Total: 3 seconds
```

**Parallel (Fast):**
```typescript
// ✅ Takes 1 second (all run simultaneously)
const [partners, units, services] = await Promise.all([
  api.getPartners(),
  api.getUnits(),
  api.getServices()
])
// Total: 1 second
```

### Detection

**Network Tab Waterfall:**
- Open DevTools → Network
- See requests in a waterfall pattern? = Sequential
- See requests starting at same time? = Parallel

### Solution

**Use the unified cache loader:**

```typescript
const { loadAll } = useUnifiedCache()

// Loads all resources in parallel
const data = await loadAll()
```

**Or manually:**

```typescript
// ✅ GOOD - Parallel
const [partners, units, services] = await Promise.all([
  loadPartners(),
  loadUnits(),
  loadServices()
])

// ❌ BAD - Sequential
const partners = await loadPartners()
const units = await loadUnits()
const services = await loadServices()
```

---

## 4. Missing Cache 💾

### Problem

Fetching the same data multiple times.

### Detection

Press **Ctrl+Shift+S** in development to see cache statistics:

```
Cache Hit Rate: 23%  ❌ LOW
Cache Hit Rate: 78%  ✅ GOOD
```

### Solution

**Always use unified cache for common data:**

```typescript
// ✅ GOOD - Uses cache
const { loadPartners, partners } = useUnifiedCache()
await loadPartners()

// ❌ BAD - No cache
const api = useApi()
const partners = await api.getPartners()
```

**Increase cache TTLs if data doesn't change often:**

Edit `composables/useUnifiedCache.ts`:

```typescript
const CACHE_TTL = {
  partners: 30 * 60 * 1000,  // Increase from 10 to 30 minutes
  units: 30 * 60 * 1000,
  // ...
}
```

---

## 5. Network Latency 🌐

### Problem

**Your App Path:**
```
User (Browser) → Vercel (Frontend) → Render (API)
```

**Postman Path:**
```
Postman → Render (API)
```

Your app has an extra hop through Vercel!

### Detection

Run the diagnostics test:

```javascript
// Press Ctrl+Shift+D
const { testApiPerformance } = useApiDiagnostics()
await testApiPerformance()
```

Check "Average Network Latency":
- < 500ms = Excellent
- 500-1000ms = Good
- 1000-2000ms = Fair
- > 2000ms = Poor (check deployment regions)

### Solution

**Deploy API and Frontend in Same Region:**

1. Check your Render API region (e.g., Oregon)
2. Deploy Vercel app to same region:

```json
// vercel.json
{
  "regions": ["sfo1"]  // San Francisco (close to Oregon)
}
```

**Use CDN for Static Assets:**

Ensure your `nuxt.config.ts` uses Vercel's CDN:

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'
  }
})
```

---

## Quick Diagnostic Checklist

Run this in production:

### Step 1: Test Cold Start

```javascript
// In browser console
const start = Date.now()
await fetch('https://your-api.onrender.com/health')
console.log(`Time: ${Date.now() - start}ms`)
```

**Results:**
- > 10 seconds = Cold start (use warmup)
- 2-5 seconds = CORS/latency (optimize CORS)
- < 2 seconds = Good!

### Step 2: Check Network Tab

1. Open DevTools → Network
2. Reload page
3. Count requests:
   - Seeing duplicate OPTIONS? = CORS preflight issue
   - Seeing waterfall pattern? = Sequential requests
   - Seeing parallel requests? = Good!

### Step 3: Run Automated Diagnostics

```javascript
// Press Ctrl+Shift+D or run:
const { testApiPerformance } = useApiDiagnostics()
await testApiPerformance()
```

### Step 4: Check Cache Performance

```javascript
// Press Ctrl+Shift+S or run:
const { analyzeCurrentPerformance } = useApiDiagnostics()
analyzeCurrentPerformance()
```

---

## Solutions Summary Table

| Problem | Detection | Solution | Effort |
|---------|-----------|----------|--------|
| Cold starts | First request > 10s | API warmup (already done) | ✅ Done |
| Cold starts | First request > 10s | Upgrade Render plan | Low |
| CORS preflight | OPTIONS before each request | Add max_age to CORS config | Low |
| Sequential requests | Waterfall in Network tab | Use Promise.all() | Medium |
| No caching | Low cache hit rate | Use useUnifiedCache() | Low |
| Network latency | High avg latency | Deploy to same region | Medium |

---

## Immediate Actions You Can Take

### 1. Enable API Warmup (Already Done ✅)

The warmup plugin is already installed. Verify it's running:

```typescript
// Check browser console for:
"🔥 API warmup started - Render cold starts prevention active"
```

### 2. Fix CORS on Backend

Add to your API:

```python
# FastAPI example
app.add_middleware(
    CORSMiddleware,
    max_age=86400  # Add this line!
)
```

### 3. Check Your Request Patterns

Search your codebase for sequential requests:

```bash
# Find potential issues
grep -r "await.*\nawait" pages/
```

Replace with `Promise.all()` where possible.

### 4. Monitor Performance

Use the built-in tools:

- **Ctrl+Shift+D** - Run full diagnostics
- **Ctrl+Shift+S** - Show current stats
- Check Network tab for patterns

---

## Expected Results After Fixes

| Metric | Before | After | Method |
|--------|--------|-------|--------|
| First load (cold) | 30-90s | 1-2s | API warmup |
| Subsequent loads | 2-5s | 0.5-1s | Caching |
| CORS overhead | 2x requests | 50% reduction | max_age |
| Parallel loads | 3s | 1s | Promise.all() |

---

## Still Slow? Advanced Debugging

### Enable Detailed Logging

Edit `plugins/api.client.ts`:

```typescript
// Change this line:
if (process.dev) {
  // Log stuff
}

// To this (to log in production):
if (true) {
  // Log stuff
}
```

### Check Render Logs

1. Go to Render Dashboard
2. Click your API service
3. Click "Logs" tab
4. Look for:
   - Slow queries
   - Database connection issues
   - Memory/CPU warnings

### Test API Directly

```bash
# Test from command line
time curl https://your-api.onrender.com/api/partners
```

If this is slow, the problem is in your API, not the frontend.

---

## Questions?

1. Run diagnostics: `Ctrl+Shift+D`
2. Check stats: `Ctrl+Shift+S`
3. Review Network tab in DevTools
4. Check Render logs
5. Open an issue with diagnostic results

---

## Useful Links

- [Render Docs - Scaling](https://render.com/docs/scaling)
- [CORS MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Chrome DevTools Network](https://developer.chrome.com/docs/devtools/network/)
- [UptimeRobot](https://uptimerobot.com/) - Free API monitoring

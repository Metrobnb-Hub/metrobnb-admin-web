# Performance Troubleshooting Guide

## Issue: Intermittent Slow API Loading

### Symptoms

- ✅ API is fast sometimes (< 1 second)
- ❌ API is very slow other times (30-60+ seconds)
- ❌ Requests timeout and get cancelled
- ⚠️ Inconsistent performance throughout the day

### Root Cause: Render.com Cold Starts

Your API is hosted on **Render.com free tier**, which has the following behavior:

```
┌─────────────────────────────────────────────────────────┐
│  Render.com Free Tier Behavior                          │
├─────────────────────────────────────────────────────────┤
│  Active usage    → Fast response (< 1s)                 │
│  15 min idle     → Server goes to sleep                 │
│  Next request    → Cold start (30-60s wake-up time)     │
│  After wake-up   → Fast again (< 1s)                    │
└─────────────────────────────────────────────────────────┘
```

**Real-world scenario:**

```
9:00 AM  - User logs in → 45 seconds (cold start)
9:01 AM  - Load invoices → 0.5 seconds (server awake)
9:05 AM  - Load partners → 0.3 seconds (server awake)
9:20 AM  - Load bookings → 50 seconds (cold start - 15 min passed)
9:21 AM  - Load expenses → 0.4 seconds (server awake)
```

---

## Previous Configuration Problems

### Problem 1: Timeout Too Short

**Before:**
```typescript
timeout: 30000 // 30 seconds
```

**Issue:** Render cold starts take 30-60 seconds, so requests would timeout before the server finished waking up.

**Fixed:**
```typescript
timeout: 90000 // 90 seconds - enough time for cold start
```

### Problem 2: Aggressive Retry on Timeout

**Before:**
```typescript
maxRetries: 3
initialDelay: 1000
maxDelay: 10000

// Total possible wait time:
// 30s (timeout) + 1s (wait) + 30s (retry 1) + 2s (wait) + 30s (retry 2) + 4s (wait) + 30s (retry 3)
// = 127 seconds of waiting!
```

**Issue:** If a cold start took 40 seconds, the first request would timeout, then retry (and timeout again), creating a very long wait time.

**Fixed:**
```typescript
maxRetries: 2 // Reduced
maxDelay: 5000 // Reduced
shouldRetry: (error) => {
  // Don't retry on timeout - just wait longer
  if (error.message?.includes('timeout')) {
    return false
  }
  return isNetworkError || is5xxError
}
```

### Problem 3: No User Feedback During Cold Start

**Before:** User just saw "loading" spinner with no explanation for 30+ seconds.

**Fixed:** Proactive notification when cold start is likely:

```typescript
// If it's been 10+ minutes since last request, show warning
if (timeSinceLastRequest > 10 * 60 * 1000) {
  toast.add({
    title: 'Loading...',
    description: 'First request may take 30-60 seconds as the server wakes up.',
    color: 'blue',
    timeout: 3000
  })
}
```

---

## Current Configuration

### Timeout Settings

**File:** [plugins/api.client.ts:98](../plugins/api.client.ts#L98)
```typescript
timeout: 90000 // 90 seconds - handles Render cold starts
```

**File:** [nuxt.config.ts:51](../nuxt.config.ts#L51)
```typescript
$fetch: {
  timeout: 90000 // 90 seconds - handles Render cold starts
}
```

### Retry Logic

**File:** [plugins/api.client.ts:295-315](../plugins/api.client.ts#L295-L315)
```typescript
{
  maxRetries: 2,
  initialDelay: 1000,
  maxDelay: 5000,
  shouldRetry: (error) => {
    // Don't retry timeouts (likely cold start)
    if (error.message?.includes('timeout')) {
      return false
    }
    // Only retry network errors and 5xx server errors
    return isNetworkError || is5xxError
  }
}
```

### Cold Start Detection

**File:** [plugins/api.client.ts:112-130](../plugins/api.client.ts#L112-L130)
```typescript
// Track time since last request
const timeSinceLastRequest = Date.now() - lastRequestTime

// Warn if likely cold start (10+ minutes idle)
if (timeSinceLastRequest > 10 * 60 * 1000) {
  toast.add({
    title: 'Loading...',
    description: 'First request may take 30-60 seconds as the server wakes up.'
  })
}
```

---

## Expected Behavior Now

### Scenario 1: First Request After Idle (Cold Start)

```
User Action: Load invoices after 15+ minutes idle
  ↓
Toast shown: "First request may take 30-60 seconds..."
  ↓
Wait 45 seconds (server waking up)
  ↓
Response received ✅
  ↓
Subsequent requests are fast (< 1s)
```

**User Experience:**
- ✅ Request completes successfully (no timeout)
- ✅ User is informed about delay
- ✅ No confusing "failed" errors

### Scenario 2: Subsequent Requests (Warm Server)

```
User Action: Load partners (server already awake)
  ↓
No toast shown (< 10 minutes since last request)
  ↓
Response received in 0.5 seconds ✅
```

**User Experience:**
- ✅ Fast response
- ✅ No unnecessary warnings

### Scenario 3: Network Error (Not Cold Start)

```
User Action: Load bookings (network issue)
  ↓
Request fails
  ↓
Retry 1 after 1 second → Fails
  ↓
Retry 2 after 2 seconds → Fails
  ↓
Show error toast ❌
```

**User Experience:**
- ✅ Automatic retries for transient errors
- ✅ Clear error message if all retries fail

---

## Performance Optimization Tips

### 1. Keep Server Warm (For Production)

**Option A: Upgrade Render Plan**
- Render paid plan ($7/month) keeps server always on
- No cold starts
- Consistent < 1 second response times

**Option B: Ping Service**
Free services that keep your API awake:
- [UptimeRobot](https://uptimerobot.com/) - Ping every 5 minutes
- [Cron-job.org](https://cron-job.org/) - Scheduled health checks
- Custom cron job: `curl https://metrobnb-api.onrender.com/health`

**Setup health check endpoint:**
```bash
# Add to your backend (if not already present)
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Then use UptimeRobot to ping every 5-10 minutes
```

### 2. Client-Side Loading States

Always show loading state during cold starts:

```vue
<template>
  <div v-if="isLoading" class="text-center py-12">
    <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
    <p class="mt-2">Loading data...</p>
    <p v-if="loadingTime > 5000" class="text-sm text-gray-500 mt-1">
      This is taking longer than usual. The server may be starting up.
    </p>
  </div>
</template>

<script setup>
const isLoading = ref(false)
const loadingTime = ref(0)
let startTime = 0

const loadData = async () => {
  isLoading.value = true
  startTime = Date.now()

  const interval = setInterval(() => {
    loadingTime.value = Date.now() - startTime
  }, 1000)

  try {
    await api.getData()
  } finally {
    clearInterval(interval)
    isLoading.value = false
    loadingTime.value = 0
  }
}
</script>
```

### 3. Cache Aggressively

Use the unified cache system to reduce API calls:

```typescript
const { partners, loadPartners } = useUnifiedCache()

// First call: May take 45s (cold start)
await loadPartners()

// Subsequent calls: Use cache (instant)
await loadPartners() // From cache, no API call
await loadPartners() // From cache, no API call

// After 5 minutes: API call again, but server is warm (< 1s)
await loadPartners()
```

### 4. Prefetch Data

Load data preemptively to avoid cold starts:

```typescript
// In app.vue or layout
onMounted(() => {
  // Preload common data when app starts
  const { loadAll } = useUnifiedCache()
  loadAll() // Partners, units, etc.
})
```

---

## Monitoring Performance

### Check Request Duration in Console

In development mode, all API requests are logged with duration:

```
[API Request] 2025-01-02T10:00:00.000Z GET /api/invoices
[API Response] 2025-01-02T10:00:45.123Z ✓ GET /api/invoices - 200 (45123ms)
                                                                    ^^^^^^
                                                                    45 seconds
```

**Interpreting durations:**
- **< 1 second**: ✅ Server is warm, normal operation
- **30-60 seconds**: ⚠️ Cold start detected
- **> 90 seconds**: ❌ Check for backend issues

### Check Network Tab

1. Open DevTools → Network
2. Look for requests to `metrobnb-api.onrender.com`
3. Check **Time** column

**What to look for:**
- Multiple fast requests (< 1s): ✅ Server is warm
- One slow request followed by fast ones: ⚠️ Cold start (expected)
- All requests slow: ❌ Backend performance issue

---

## Troubleshooting Specific Issues

### Issue: All Requests Are Slow (Not Just First)

**Possible Causes:**
1. Backend performance issue (not cold start)
2. Database queries are slow
3. Backend has high CPU usage

**Solution:**
Check backend logs on Render dashboard for errors or slow queries.

### Issue: Requests Still Timing Out After 90 Seconds

**Possible Causes:**
1. Backend is genuinely stuck/crashed
2. Database connection issue
3. Backend cold start is unusually slow

**Solution:**
```bash
# Check backend health directly
curl https://metrobnb-api.onrender.com/health

# If no response after 90s, backend needs investigation
```

### Issue: Cold Start Toast Shows Too Often

**Current threshold:** 10 minutes of inactivity

**To adjust** ([plugins/api.client.ts:117](../plugins/api.client.ts#L117)):
```typescript
// Change from 10 minutes to 15 minutes
if (timeSinceLastRequest > 15 * 60 * 1000) {
  // Show toast
}
```

### Issue: Want to Disable Cold Start Toast

```typescript
// Comment out or remove lines 112-130 in plugins/api.client.ts
// But keep the timeout at 90 seconds!
```

---

## Backend Recommendations

### 1. Add Health Check Endpoint

```python
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }
```

### 2. Log Slow Requests

```python
import time
from fastapi import Request

@app.middleware("http")
async def log_slow_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    if duration > 5:  # Log requests taking > 5 seconds
        logger.warning(f"Slow request: {request.method} {request.url.path} took {duration:.2f}s")

    return response
```

### 3. Optimize Database Queries

```python
# Add indexes for frequently queried fields
# Use select_related / prefetch_related for relationships
# Cache expensive queries
```

---

## Summary

### ✅ What's Fixed

- **Timeout increased** from 30s to 90s (handles cold starts)
- **Retry logic improved** (doesn't retry on timeout)
- **User feedback added** (toast notification for likely cold starts)
- **Request deduplication** (prevents duplicate concurrent requests)

### ⚠️ What to Expect

- **First request after idle**: 30-60 seconds (cold start - can't avoid on free tier)
- **Subsequent requests**: < 1 second (server is warm)
- **After 15 minutes idle**: Cold start happens again

### 🚀 Upgrade Options

**To eliminate cold starts completely:**

1. **Render Paid Plan** ($7/month)
   - Server always on
   - No cold starts
   - Faster response times

2. **Use Ping Service** (Free)
   - Keeps server warm
   - Still on free tier
   - 95% reduction in cold starts

3. **Self-hosted** (Variable cost)
   - Full control
   - No cold starts
   - Your infrastructure

---

## Related Documentation

- [REDIRECT_HANDLING.md](./REDIRECT_HANDLING.md) - HTTP redirect handling
- [API_IMPROVEMENTS.md](./API_IMPROVEMENTS.md) - API architecture
- [CACHE_MIGRATION_GUIDE.md](./CACHE_MIGRATION_GUIDE.md) - Caching strategy

---

**Last Updated:** 2025-01-02

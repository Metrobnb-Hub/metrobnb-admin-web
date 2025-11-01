# API Quick Reference Guide

## Quick Start

### 1. Load Cached Data

```typescript
const { loadPartners, partners, isLoading } = useUnifiedCache()

// Load data (uses cache if valid)
await loadPartners()

// Access reactive data
console.log(partners.value)
console.log(isLoading.partners)

// Force refresh
await loadPartners(true)
```

### 2. Make API Call with Error Handling

```typescript
import { wrapApiCall } from '~/composables/useApiResult'

const result = await wrapApiCall(
  () => api.getData(),
  { showToast: true }
)

if (result.isSuccess) {
  console.log(result.data)
} else {
  console.error(result.error.message)
}
```

### 3. Use Reactive API State in Component

```vue
<script setup lang="ts">
const { data, isLoading, error, execute } = useApiResult<Partner[]>([])

onMounted(() => {
  execute(() => api.getPartners(), { showToast: true })
})
</script>

<template>
  <UCard :loading="isLoading">
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <div v-for="item in data" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </UCard>
</template>
```

### 4. Cancel Requests

```typescript
const { cancelAllRequests } = useUnifiedCache()

onUnmounted(() => {
  cancelAllRequests()
})
```

---

## Common Patterns

### Pattern: Load Multiple Resources

```typescript
const { loadAll } = useUnifiedCache()

const { partners, units, services } = await loadAll()
```

### Pattern: Invalidate Cache After Mutation

```typescript
const { invalidateCache } = useUnifiedCache()

await api.createPartner(data)
invalidateCache('partners')
```

### Pattern: Custom Cached Request

```typescript
const { cachedRequest } = useUnifiedCache()

const data = await cachedRequest(
  'my-custom-key',
  async (signal) => api.getCustomData(signal),
  {
    ttl: 10 * 60 * 1000, // 10 minutes
    force: false
  }
)
```

### Pattern: Handle Errors Gracefully

```typescript
const result = await wrapApiCall(
  () => api.riskyOperation(),
  {
    errorMessage: 'Operation failed',
    showToast: true,
    onError: (error) => {
      // Custom error handling
      if (error.code === 'INSUFFICIENT_PERMISSIONS') {
        navigateTo('/unauthorized')
      }
    }
  }
)
```

---

## API Composables

### useUnifiedCache()

**Best for**: Common resources (partners, units, services, etc.)

```typescript
const {
  // Reactive data
  partners,
  units,
  services,
  expenses,
  bookingSources,
  paymentMethods,

  // Loading states
  isLoading,

  // Methods
  loadPartners,
  loadUnits,
  loadAll,
  invalidateCache,
  refreshData,

  // Advanced
  cachedRequest,
  cancelAllRequests,
  getCacheStats
} = useUnifiedCache()
```

### useApiResult()

**Best for**: Component-level API state management

```typescript
const {
  data,        // Ref<T | null>
  error,       // Ref<ApiError | null>
  isLoading,   // Ref<boolean>
  isSuccess,   // Ref<boolean>
  isError,     // Ref<boolean>
  execute,     // Execute API call
  reset        // Reset state
} = useApiResult<T>(initialData)
```

### useApi()

**Best for**: Direct API calls (use with wrapApiCall or useApiResult)

```typescript
const api = useApi()

// Don't use directly in components
const data = await api.getPartners()

// Instead, wrap with error handling
const result = await wrapApiCall(() => api.getPartners())
```

---

## Error Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| `NETWORK_ERROR` | Can't reach server | Check internet connection |
| `TIMEOUT_ERROR` | Request took too long | Retry or check server |
| `REQUEST_CANCELLED` | Request was aborted | Normal if intentional |
| `HTTP_400` | Bad request | Check request format |
| `HTTP_401` | Unauthorized | Re-login (auto-handled) |
| `HTTP_403` | Forbidden | Check permissions |
| `HTTP_404` | Not found | Resource doesn't exist |
| `HTTP_422` | Validation error | Check input data |
| `HTTP_429` | Rate limited | Slow down requests |
| `HTTP_500` | Server error | Wait and retry |

---

## Cache TTLs

| Resource | TTL | Reason |
|----------|-----|--------|
| Partners | 10 min | Moderate change frequency |
| Units | 10 min | Moderate change frequency |
| Services | 30 min | Rarely changes |
| Booking Sources | 30 min | Rarely changes |
| Payment Methods | 30 min | Rarely changes |
| Expenses | 5 min | More volatile |
| Bookings | 2 min | Very volatile |
| Analytics | 5 min | Calculated data |

---

## Debugging Tips

### Enable API Logging

Already enabled in development mode. Check browser console:

```
[API Request] 2025-01-15T10:30:45.123Z GET /api/partners
[API Response] 2025-01-15T10:30:45.456Z ✓ GET /api/partners - 200 (333ms)
```

### Check Cache Stats

```typescript
const { getCacheStats } = useUnifiedCache()
console.log(getCacheStats())
```

### Monitor Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Watch for duplicate or failed requests

### Clear Cache

```typescript
const { invalidateCache } = useUnifiedCache()

// Clear specific resource
invalidateCache('partners')

// Clear all
invalidateCache()
```

---

## Migration Checklist

- [ ] Replace `useGlobalCache` with `useUnifiedCache`
- [ ] Replace `useApiCache` with `useUnifiedCache`
- [ ] Replace direct `useApi()` calls with `wrapApiCall()`
- [ ] Add request cancellation in long-lived components
- [ ] Add cache invalidation after mutations
- [ ] Use `useApiResult` for component state
- [ ] Remove manual error handling (use standardized)
- [ ] Test cache behavior
- [ ] Test error handling
- [ ] Verify loading states

---

## Examples

### Example 1: List Page with Caching

```vue
<script setup lang="ts">
import type { Partner } from '~/types/api'

const { partners, isLoading, loadPartners, invalidateCache } = useUnifiedCache()

onMounted(() => {
  loadPartners()
})

async function handleCreate(data: any) {
  const api = useApi()
  await api.createPartner(data)
  invalidateCache('partners')
  await loadPartners(true)
}
</script>

<template>
  <div>
    <UCard :loading="isLoading.partners">
      <UButton @click="handleCreate(newPartner)">Create</UButton>
      <div v-for="partner in partners" :key="partner.id">
        {{ partner.name }}
      </div>
    </UCard>
  </div>
</template>
```

### Example 2: Form with Error Handling

```vue
<script setup lang="ts">
const { data, error, isLoading, execute } = useApiResult()
const formData = ref({ name: '', email: '' })

async function handleSubmit() {
  const api = useApi()
  await execute(
    () => api.createPartner(formData.value),
    {
      errorMessage: 'Failed to create partner',
      showToast: true,
      onSuccess: () => {
        navigateTo('/partners')
      }
    }
  )
}
</script>

<template>
  <UForm @submit="handleSubmit">
    <UAlert v-if="error" color="red">{{ error.message }}</UAlert>
    <UInput v-model="formData.name" label="Name" />
    <UButton type="submit" :loading="isLoading">Create</UButton>
  </UForm>
</template>
```

### Example 3: Data Fetching with Cancellation

```vue
<script setup lang="ts">
const { data, isLoading, execute } = useApiResult<Partner[]>([])
const controller = ref(new AbortController())

async function loadData() {
  const api = useApi()
  await execute(
    () => api.getPartners({ signal: controller.value.signal }),
    { showToast: true }
  )
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  controller.value.abort()
})

function refresh() {
  controller.value.abort()
  controller.value = new AbortController()
  loadData()
}
</script>
```

---

## Performance Tips

1. **Use cache for lists** - Don't fetch on every navigation
2. **Invalidate only when needed** - Not on every mount
3. **Cancel on unmount** - Prevent memory leaks
4. **Use appropriate TTLs** - Balance freshness vs performance
5. **Leverage request deduplication** - Automatic with new system
6. **Monitor cache size** - Check stats if memory issues

---

## When to Use What

| Scenario | Use |
|----------|-----|
| Load common resource (partners, units) | `useUnifiedCache()` |
| Component needs loading/error state | `useApiResult()` |
| One-off API call | `wrapApiCall()` |
| Need to cancel requests | `useUnifiedCache()` + AbortController |
| Custom cache key/TTL | `cachedRequest()` |
| Direct API access | `useApi()` (wrap with error handling) |
| Need retry logic | Already built-in to plugin |
| Debug cache issues | `getCacheStats()` |

---

## Support

- See [API_IMPROVEMENTS.md](./API_IMPROVEMENTS.md) for detailed documentation
- Check code in `composables/useUnifiedCache.ts`
- Enable development mode for detailed logs
- Use `getCacheStats()` for debugging

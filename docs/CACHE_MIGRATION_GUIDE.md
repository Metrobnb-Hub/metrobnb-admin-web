# Cache Migration Guide

## Overview

This guide helps you migrate from the old cache systems (`useGlobalCache`, `useApiCache`, `useCache`) to the new unified cache system (`useUnifiedCache`).

## Why Migrate?

**Benefits:**
- ✅ Single source of truth
- ✅ Better performance (LRU cache with limits)
- ✅ Request cancellation support
- ✅ Request deduplication
- ✅ Consistent API across all resources
- ✅ Better TypeScript support
- ✅ Comprehensive diagnostics

## Migration Steps

### Step 1: Replace Import

**Before:**
```typescript
const { partners, loadPartners } = useGlobalCache()
// or
const { partners, loadPartners } = useDataManager()
```

**After:**
```typescript
const { partners, loadPartners, isLoading } = useUnifiedCache()
```

### Step 2: Update Method Calls

The API is the same! No changes needed:

```typescript
// ✅ Works exactly the same
await loadPartners()        // Uses cache
await loadPartners(true)    // Force refresh
```

### Step 3: Access Loading States

**Before:**
```typescript
const loading = ref(false)
loading.value = true
await loadPartners()
loading.value = false
```

**After:**
```typescript
const { isLoading } = useUnifiedCache()
await loadPartners()
// isLoading.partners automatically managed
```

### Step 4: Invalidate Cache

**Before:**
```typescript
const { invalidateCache } = useGlobalCache()
invalidateCache('partners')
```

**After:**
```typescript
const { invalidateCache } = useUnifiedCache()
invalidateCache('partners') // Same!
```

## File-by-File Migration

### Files Using `useGlobalCache`

Need to replace `useGlobalCache` → `useUnifiedCache`:

1. ✅ `/pages/accounting/invoices/index.vue` - DONE
2. `/pages/partners/index.vue`
3. `/pages/partners/create.vue`
4. `/pages/accounting/expenses/create.vue`
5. `/components/accounting/BookingForm.vue`
6. `/components/accounting/AirbnbImportModal.vue`

### Files Using `useDataManager`

Already migrated! `useDataManager` now wraps `useUnifiedCache`:

- `/pages/partners/[id]/index.vue` ✅
- `/pages/accounting/expenses/index.vue` ✅
- `/pages/users/invite.vue` ✅
- `/pages/analytics/own-units.vue` ✅
- `/pages/analytics/partners.vue` ✅
- `/pages/accounting/journal-entries/index.vue` ✅
- And many more...

**No changes needed!** But you can optionally update to use `useUnifiedCache` directly for consistency.

## Migration Examples

### Example 1: Simple Page

**Before (`useGlobalCache`):**
```vue
<script setup lang="ts">
const { partners, loadPartners } = useGlobalCache()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await loadPartners()
  loading.value = false
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-for="partner in partners" :key="partner.id">
      {{ partner.name }}
    </div>
  </div>
</template>
```

**After (`useUnifiedCache`):**
```vue
<script setup lang="ts">
const { partners, loadPartners, isLoading } = useUnifiedCache()

onMounted(() => {
  loadPartners()
})
</script>

<template>
  <div v-if="isLoading.partners">Loading...</div>
  <div v-else>
    <div v-for="partner in partners" :key="partner.id">
      {{ partner.name }}
    </div>
  </div>
</template>
```

### Example 2: Multiple Resources

**Before:**
```vue
<script setup lang="ts">
const { partners, loadPartners, units, loadUnits } = useGlobalCache()

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits()
  ])
})
</script>
```

**After:**
```vue
<script setup lang="ts">
const { partners, units, loadAll, isLoading } = useUnifiedCache()

onMounted(() => {
  loadAll() // Loads everything in parallel!
})
</script>
```

### Example 3: With Invalidation

**Before:**
```vue
<script setup lang="ts">
const { partners, loadPartners, invalidateCache } = useGlobalCache()

const createPartner = async (data: any) => {
  await api.createPartner(data)
  invalidateCache('partners')
  await loadPartners(true)
}
</script>
```

**After:**
```vue
<script setup lang="ts">
const { partners, loadPartners, invalidateCache } = useUnifiedCache()

const createPartner = async (data: any) => {
  await api.createPartner(data)
  invalidateCache('partners')
  await loadPartners(true)
}
// Same code! Just using unified cache
</script>
```

### Example 4: Request Cancellation (NEW)

```vue
<script setup lang="ts">
const { loadPartners, cancelAllRequests } = useUnifiedCache()

onMounted(() => {
  loadPartners()
})

onUnmounted(() => {
  cancelAllRequests() // Clean up pending requests
})
</script>
```

## Available Resources in Unified Cache

```typescript
const {
  // Data (reactive refs)
  partners,
  units,
  expenses,
  services,
  bookingSources,
  paymentMethods,

  // Loading states (reactive)
  isLoading, // { partners: boolean, units: boolean, ... }

  // Load methods
  loadPartners,
  loadUnits,
  loadExpenses,
  loadServices,
  loadBookingSources,
  loadPaymentMethods,
  loadAll, // Load everything in parallel

  // Cache management
  invalidateCache,
  refreshData,

  // Advanced
  cachedRequest,
  cancelAllRequests,
  cancelRequest,
  getCacheStats
} = useUnifiedCache()
```

## Testing After Migration

### 1. Check Browser Console

You should see:
```
🔥 API warmup started
💡 Press Ctrl+Shift+D to run API diagnostics
```

### 2. Check Loading States

```vue
<template>
  <div>
    Partners loading: {{ isLoading.partners }}
    Units loading: {{ isLoading.units }}
  </div>
</template>
```

### 3. Run Diagnostics

Press `Ctrl+Shift+S` in browser to see cache statistics:

```javascript
Cache Hit Rate: 78%
LRU Cache Size: 45
Pending Requests: 0
```

### 4. Check Network Tab

- Look for fewer duplicate requests
- Check that requests are using cache
- Verify request deduplication is working

## Common Issues & Solutions

### Issue 1: "Cannot find name useUnifiedCache"

**Solution:** Make sure you're importing from the right place (it's a composable, auto-imported by Nuxt):

```typescript
// ❌ Don't do this
import { useUnifiedCache } from '~/composables/useUnifiedCache'

// ✅ Just use it directly
const { loadPartners } = useUnifiedCache()
```

### Issue 2: Loading state not updating

**Solution:** Use the reactive `isLoading` object:

```typescript
const { isLoading } = useUnifiedCache()

// ✅ Reactive
watch(() => isLoading.partners, (loading) => {
  console.log('Partners loading:', loading)
})

// ❌ Not reactive
const loading = isLoading.partners
```

### Issue 3: Cache not invalidating

**Solution:** Make sure you're calling `invalidateCache` after mutations:

```typescript
await api.createPartner(data)
invalidateCache('partners') // Clear cache
await loadPartners(true) // Force reload
```

### Issue 4: TypeScript errors

**Solution:** Make sure your types are up to date:

```typescript
import type { Partner, Unit } from '~/types/api'

const { partners } = useUnifiedCache()
// partners is Ref<Partner[]>
```

## Performance Tips

### 1. Use `loadAll` for Multiple Resources

```typescript
// ❌ Sequential (slow)
await loadPartners()
await loadUnits()
await loadServices()

// ✅ Parallel (fast)
await loadAll()
```

### 2. Don't Force Refresh Unless Needed

```typescript
// ❌ Always forces API call
await loadPartners(true)

// ✅ Uses cache if valid
await loadPartners()
```

### 3. Invalidate Specific Resources

```typescript
// ❌ Clears all cache
invalidateCache()

// ✅ Only clears partners
invalidateCache('partners')
```

### 4. Cancel Requests on Unmount

```typescript
onUnmounted(() => {
  cancelAllRequests()
})
```

## Rollback Plan

If you need to rollback:

1. The old composables still work (`useGlobalCache`, `useDataManager`)
2. Just change the import back
3. `useDataManager` is now a wrapper around `useUnifiedCache`, so it's already using the new system!

## Questions?

- Check [API_IMPROVEMENTS.md](./API_IMPROVEMENTS.md)
- Check [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)
- Run diagnostics: `Ctrl+Shift+D`
- Check cache stats: `Ctrl+Shift+S`

## Migration Checklist

- [x] `/pages/accounting/invoices/index.vue` - Migrated to `useUnifiedCache`
- [ ] `/pages/partners/index.vue`
- [ ] `/pages/partners/create.vue`
- [ ] `/pages/accounting/expenses/create.vue`
- [ ] `/components/accounting/BookingForm.vue`
- [ ] `/components/accounting/AirbnbImportModal.vue`

**Note:** Files using `useDataManager` are already using the unified cache under the hood!

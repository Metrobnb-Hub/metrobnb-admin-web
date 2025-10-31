<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">Smart Caching Example</h3>
    
    <!-- Cache Status -->
    <div class="mb-4 p-3 bg-gray-50 rounded">
      <div class="text-sm space-y-1">
        <div>Partners cached: {{ isCached('partners') ? '✅' : '❌' }}</div>
        <div>Units cached: {{ isCached('units') ? '✅' : '❌' }}</div>
        <div>Services cached: {{ isCached('services') ? '✅' : '❌' }}</div>
      </div>
    </div>

    <!-- Load Buttons -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <UButton @click="loadPartners(false)" :loading="loading.partners" size="sm">
        Load Partners (Cached)
      </UButton>
      
      <UButton @click="loadPartners(true)" :loading="loading.partners" size="sm" color="orange">
        Force Refresh Partners
      </UButton>
      
      <UButton @click="loadUnits(false)" :loading="loading.units" size="sm">
        Load Units (Cached)
      </UButton>
      
      <UButton @click="loadUnits(true)" :loading="loading.units" size="sm" color="orange">
        Force Refresh Units
      </UButton>
    </div>

    <!-- Clear Cache -->
    <div class="mb-4">
      <UButton @click="clearCache" size="sm" color="red" variant="outline">
        Clear All Cache
      </UButton>
    </div>

    <!-- Data Display -->
    <div class="space-y-4">
      <div v-if="partners.length > 0">
        <h4 class="font-medium">Partners ({{ partners.length }})</h4>
        <div class="text-sm text-gray-600">
          {{ partners.map(p => p.name).join(', ') }}
        </div>
      </div>
      
      <div v-if="units.length > 0">
        <h4 class="font-medium">Units ({{ units.length }})</h4>
        <div class="text-sm text-gray-600">
          {{ units.map(u => u.name).join(', ') }}
        </div>
      </div>
    </div>

    <!-- Performance Info -->
    <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
      <div><strong>Last Load Time:</strong> {{ lastLoadTime }}ms</div>
      <div><strong>Cache Hit:</strong> {{ wasFromCache ? 'Yes' : 'No' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartnerResponse, UnitResponse } from '~/types/generated-api'

const { 
  getCachedPartners, 
  getCachedUnits, 
  invalidateCache, 
  isCached 
} = useApiCache()

// State
const partners = ref<PartnerResponse[]>([])
const units = ref<UnitResponse[]>([])
const loading = ref({
  partners: false,
  units: false
})
const lastLoadTime = ref(0)
const wasFromCache = ref(false)

// Load partners with caching
const loadPartners = async (force = false) => {
  loading.value.partners = true
  const startTime = Date.now()
  
  try {
    wasFromCache.value = !force && isCached('partners')
    partners.value = await getCachedPartners(force)
    lastLoadTime.value = Date.now() - startTime
    
    const toast = useToast()
    toast.add({
      title: 'Partners Loaded',
      description: `${partners.value.length} partners (${wasFromCache.value ? 'cached' : 'fresh'}) in ${lastLoadTime.value}ms`,
      color: wasFromCache.value ? 'blue' : 'green'
    })
  } catch (error: any) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loading.value.partners = false
  }
}

// Load units with caching
const loadUnits = async (force = false) => {
  loading.value.units = true
  const startTime = Date.now()
  
  try {
    wasFromCache.value = !force && isCached('units')
    units.value = await getCachedUnits(force)
    lastLoadTime.value = Date.now() - startTime
    
    const toast = useToast()
    toast.add({
      title: 'Units Loaded',
      description: `${units.value.length} units (${wasFromCache.value ? 'cached' : 'fresh'}) in ${lastLoadTime.value}ms`,
      color: wasFromCache.value ? 'blue' : 'green'
    })
  } catch (error: any) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loading.value.units = false
  }
}

// Clear all cache
const clearCache = () => {
  invalidateCache()
  const toast = useToast()
  toast.add({
    title: 'Cache Cleared',
    description: 'All cached data has been cleared',
    color: 'orange'
  })
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Smart Cache Demo</h1>
    
    <!-- Navigation Simulation -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">Simulate Tab Switching</h2>
      <div class="flex space-x-2">
        <UButton 
          @click="currentTab = 'partners'" 
          :color="currentTab === 'partners' ? 'primary' : 'gray'"
        >
          Partners
        </UButton>
        <UButton 
          @click="currentTab = 'units'" 
          :color="currentTab === 'units' ? 'primary' : 'gray'"
        >
          Units
        </UButton>
        <UButton 
          @click="currentTab = 'bookings'" 
          :color="currentTab === 'bookings' ? 'primary' : 'gray'"
        >
          Bookings
        </UButton>
      </div>
    </div>

    <!-- Cache Status -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Cache Status</h3>
          <UButton @click="clearCache" size="sm" color="red" variant="outline">
            Clear Cache
          </UButton>
        </div>
      </template>
      
      <div class="grid grid-cols-3 gap-4 text-sm">
        <div class="text-center">
          <div class="font-medium">Partners</div>
          <div :class="isCached('partners') ? 'text-green-600' : 'text-gray-400'">
            {{ isCached('partners') ? '✅ Cached' : '❌ Not Cached' }}
          </div>
        </div>
        <div class="text-center">
          <div class="font-medium">Units</div>
          <div :class="isCached('units') ? 'text-green-600' : 'text-gray-400'">
            {{ isCached('units') ? '✅ Cached' : '❌ Not Cached' }}
          </div>
        </div>
        <div class="text-center">
          <div class="font-medium">Bookings</div>
          <div :class="isCached('bookings-{}') ? 'text-green-600' : 'text-gray-400'">
            {{ isCached('bookings-{}') ? '✅ Cached' : '❌ Not Cached' }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- Content based on current tab -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold capitalize">{{ currentTab }}</h3>
          <div class="text-sm text-gray-500">
            Load time: {{ loadTime }}ms
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <div class="mt-2 text-gray-500">Loading...</div>
      </div>
      
      <div v-else-if="currentTab === 'partners'" class="space-y-2">
        <div v-for="partner in data.partners" :key="partner.id" class="p-3 bg-gray-50 rounded">
          <div class="font-medium">{{ partner.name }}</div>
          <div class="text-sm text-gray-600">{{ partner.share_percentage }}% • {{ partner.partner_code }}</div>
        </div>
        <div v-if="data.partners.length === 0" class="text-gray-500 text-center py-4">
          No partners found
        </div>
      </div>
      
      <div v-else-if="currentTab === 'units'" class="space-y-2">
        <div v-for="unit in data.units" :key="unit.id" class="p-3 bg-gray-50 rounded">
          <div class="font-medium">{{ unit.name }}</div>
          <div class="text-sm text-gray-600">{{ unit.type || 'No type' }} • {{ unit.city || 'No city' }}</div>
        </div>
        <div v-if="data.units.length === 0" class="text-gray-500 text-center py-4">
          No units found
        </div>
      </div>
      
      <div v-else-if="currentTab === 'bookings'" class="space-y-2">
        <div v-for="booking in data.bookings" :key="booking.id" class="p-3 bg-gray-50 rounded">
          <div class="font-medium">{{ booking.guest_name }}</div>
          <div class="text-sm text-gray-600">{{ booking.start_date }} • ₱{{ booking.base_amount }}</div>
        </div>
        <div v-if="data.bookings.length === 0" class="text-gray-500 text-center py-4">
          No bookings found
        </div>
      </div>
    </UCard>

    <!-- Performance Info -->
    <div class="mt-6 p-4 bg-blue-50 rounded">
      <h4 class="font-medium mb-2">Performance Tips:</h4>
      <ul class="text-sm space-y-1">
        <li>• First load: Fetches from API (~100-500ms)</li>
        <li>• Subsequent loads: Instant from cache (~1-5ms)</li>
        <li>• Cache expires: Partners/Units (5min), Bookings (2min)</li>
        <li>• Switch tabs quickly to see the difference!</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartnerResponse, UnitResponse, BookingResponse } from '~/types/generated-api'

// Page setup
definePageMeta({
  title: 'Cache Demo',
  layout: 'default'
})

// API with caching
const { getPartners, getUnits, getBookings, cache } = useApi()

// Safe cache check function
const isCached = (key: string) => {
  return cache?.isCached ? cache.isCached(key) : false
}

// State
const currentTab = ref('partners')
const loading = ref(false)
const loadTime = ref(0)
const error = ref<string | null>(null)
const data = ref({
  partners: [] as PartnerResponse[],
  units: [] as UnitResponse[],
  bookings: [] as BookingResponse[]
})

// Load data based on current tab
const loadCurrentTab = async () => {
  loading.value = true
  error.value = null
  const startTime = Date.now()
  
  try {
    switch (currentTab.value) {
      case 'partners':
        data.value.partners = await getPartners()
        break
      case 'units':
        data.value.units = await getUnits()
        break
      case 'bookings':
        data.value.bookings = await getBookings()
        break
    }
  } catch (err: any) {
    error.value = err.message
    console.error('Load error:', err)
    
    // Show user-friendly error
    const toast = useToast()
    toast.add({
      title: 'Backend Error',
      description: 'Check server logs for 500 error details',
      color: 'red'
    })
  } finally {
    loadTime.value = Date.now() - startTime
    loading.value = false
  }
}

// Clear all cache
const clearCache = () => {
  if (cache?.refreshAll) {
    cache.refreshAll()
    const toast = useToast()
    toast.add({
      title: 'Cache Cleared',
      description: 'All cached data cleared. Next loads will be fresh.',
      color: 'orange'
    })
  }
}

// Watch tab changes
watch(currentTab, loadCurrentTab, { immediate: true })
</script>

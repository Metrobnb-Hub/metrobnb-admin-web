<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Own Units Analytics</h1>
        <p class="text-gray-600 dark:text-gray-400">Performance analytics for MetroBNB's directly owned units</p>
      </div>
      <UButton to="/analytics" variant="ghost">
        <UIcon name="i-heroicons-arrow-left" class="mr-2" />
        Back to Analytics
      </UButton>
    </div>

    <!-- Own Units Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-home-modern" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Own Units</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ownUnitsCount }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ ownUnitsRevenue.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <UIcon name="i-heroicons-calendar-days" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ownUnitsBookings }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg per Unit</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ avgRevenuePerUnit.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Own Units Performance -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Unit Performance</h3>
      </template>
      <div class="space-y-4">
        <div v-for="unit in ownUnits" :key="unit.id" 
             class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
              <UIcon name="i-heroicons-home" class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ unit.name }}</h4>
              <p class="text-sm text-gray-500">{{ unit.location }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-green-600 dark:text-green-400">₱{{ unit.revenue.toLocaleString() }}</p>
            <p class="text-sm text-gray-500">{{ unit.bookings }} bookings</p>
          </div>
        </div>
        
        <div v-if="!ownUnits.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No own units found. All units are managed by partners.
        </div>
      </div>
    </UCard>

    <!-- Recent Own Unit Bookings -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Recent Own Unit Bookings</h3>
      </template>
      <div class="space-y-3">
        <div v-for="booking in ownUnitBookings" :key="booking.id" 
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-calendar-days" class="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ booking.guest_name }}</p>
              <p class="text-sm text-gray-500">{{ booking.unit_name }} • {{ formatDate(booking.booking_date) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-green-600 dark:text-green-400">₱{{ parseFloat(booking.total_amount).toLocaleString() }}</p>
            <p class="text-xs text-gray-500">100% to MetroBNB</p>
          </div>
        </div>
        
        <div v-if="!ownUnitBookings.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No recent bookings for own units.
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getDashboardMetrics } = useApi()

const dashboardData = ref(null)

// Filter own units (units without partner_id or partner_id is MetroBNB)
const ownUnits = computed(() => {
  if (!Array.isArray(units.value)) return []
  
  // Mock data for now - replace with real logic to identify own units
  return units.value.filter(unit => !unit.partner_id || unit.partner_id === 'metrobnb').map(unit => ({
    ...unit,
    revenue: Math.floor(Math.random() * 50000) + 20000, // Mock revenue
    bookings: Math.floor(Math.random() * 15) + 5 // Mock bookings
  }))
})

const ownUnitsCount = computed(() => ownUnits.value.length)
const ownUnitsRevenue = computed(() => ownUnits.value.reduce((sum, unit) => sum + unit.revenue, 0))
const ownUnitsBookings = computed(() => ownUnits.value.reduce((sum, unit) => sum + unit.bookings, 0))
const avgRevenuePerUnit = computed(() => ownUnitsCount.value > 0 ? Math.floor(ownUnitsRevenue.value / ownUnitsCount.value) : 0)

// Filter bookings for own units only
const ownUnitBookings = computed(() => {
  const bookings = dashboardData.value?.recent_bookings || []
  // Mock filter - replace with real logic
  return bookings.filter(booking => !booking.partner_name || booking.partner_name === 'MetroBNB')
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'Invalid Date'
  }
}

const loadData = async () => {
  try {
    // Load data for own units only
    const response = await getDashboardMetrics({
      // Add filter for own units when backend supports it
    })
    dashboardData.value = response
  } catch (error) {
    console.error('Failed to load own units data:', error)
    dashboardData.value = null
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadData()
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Business Overview</h1>
        <p class="text-gray-600 dark:text-gray-400">Complete financial overview of your entire MetroBNB business</p>
      </div>
      <UButton to="/analytics" variant="ghost">
        <UIcon name="i-heroicons-arrow-left" class="mr-2" />
        Back to Analytics
      </UButton>
    </div>

    <!-- Financial Overview -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Financial Overview - {{ getCurrentMonth() }}</h3>
          <UButton @click="showFilters = !showFilters" variant="ghost" size="sm">
            <UIcon name="i-heroicons-funnel" class="mr-2" />
            Filters
          </UButton>
        </div>
      </template>
      
      <!-- Filters -->
      <div v-if="showFilters" class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormGroup label="Month">
            <USelect v-model="filters.month" :options="monthOptions" @change="applyFilters" />
          </UFormGroup>
          <UFormGroup label="Year">
            <USelect v-model="filters.year" :options="yearOptions" @change="applyFilters" />
          </UFormGroup>
          <UFormGroup label="Partner">
            <USelect v-model="filters.partner_id" :options="partnerOptions" @change="applyFilters" />
          </UFormGroup>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <UIcon name="i-heroicons-arrow-trending-up" class="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
          <p class="text-3xl font-bold text-green-600 dark:text-green-400">₱{{ totalRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">Own + Partner Units</p>
        </div>
        
        <div class="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <UIcon name="i-heroicons-building-office-2" class="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">MetroBNB Revenue</p>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">₱{{ metroBNBRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">Direct + Commission</p>
        </div>
        
        <div class="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <UIcon name="i-heroicons-receipt-percent" class="h-10 w-10 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
          <p class="text-3xl font-bold text-red-600 dark:text-red-400">₱{{ metroBNBExpenses.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">Operating costs</p>
        </div>
        
        <div class="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <UIcon name="i-heroicons-banknotes" class="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Profit</p>
          <p class="text-3xl font-bold" :class="netProfit >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'">
            ₱{{ netProfit.toLocaleString() }}
          </p>
          <p class="text-xs text-gray-500 mt-1">After all expenses</p>
        </div>
      </div>
    </UCard>

    <!-- Revenue Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Own vs Partner Revenue -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Revenue Breakdown</h3>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="flex items-center">
              <UIcon name="i-heroicons-home-modern" class="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Own Units Revenue</p>
                <p class="text-sm text-gray-500">Direct bookings</p>
              </div>
            </div>
            <p class="text-xl font-bold text-green-600 dark:text-green-400">₱{{ ownUnitsRevenue.toLocaleString() }}</p>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div class="flex items-center">
              <UIcon name="i-heroicons-users" class="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Partner Commission</p>
                <p class="text-sm text-gray-500">Revenue sharing</p>
              </div>
            </div>
            <p class="text-xl font-bold text-purple-600 dark:text-purple-400">₱{{ partnerCommission.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>

      <!-- Top Performing Units -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Top Performing Units</h3>
        </template>
        <div class="space-y-3">
          <div v-for="unit in topUnits" :key="unit.id" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <UIcon name="i-heroicons-home" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ unit.name }}</p>
                <p class="text-sm text-gray-500">{{ unit.type }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600 dark:text-green-400">₱{{ unit.revenue.toLocaleString() }}</p>
              <p class="text-xs text-gray-500">{{ unit.bookings }} bookings</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Recent Financial Activity</h3>
      </template>
      <div class="space-y-3">
        <div v-for="booking in recentBookings.slice(0, 8)" :key="booking.id" 
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-calendar-days" class="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ booking.guest_name }}</p>
              <p class="text-sm text-gray-500">{{ booking.unit_name }} • {{ formatDate(booking.booking_date) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-green-600 dark:text-green-400">₱{{ parseFloat(booking.total_amount).toLocaleString() }}</p>
            <p class="text-xs text-gray-500">{{ booking.partner_name || 'Own Unit' }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// Copy the same logic from dashboard.vue but with "Business Overview" context
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getDashboardMetrics } = useApi()

const dashboardData = ref(null)
const showFilters = ref(false)

const now = new Date()
const currentYear = now.getFullYear().toString()
const currentMonth = (now.getMonth() + 1).toString()

const filters = reactive({
  year: currentYear,
  month: currentMonth,
  partner_id: ''
})

// Financial computeds
const metroBNBRevenue = computed(() => parseFloat(dashboardData.value?.metrobnb_revenue || '0'))
const partnerRevenue = computed(() => parseFloat(dashboardData.value?.partner_revenue || '0'))
const metroBNBExpenses = computed(() => parseFloat(dashboardData.value?.metrobnb_expenses || '0'))
const totalRevenue = computed(() => metroBNBRevenue.value + partnerRevenue.value)
const netProfit = computed(() => metroBNBRevenue.value - metroBNBExpenses.value)

// Mock breakdown - replace with real data
const ownUnitsRevenue = computed(() => metroBNBRevenue.value * 0.6) // Assume 60% from own units
const partnerCommission = computed(() => metroBNBRevenue.value * 0.4) // 40% from partner commission

const recentBookings = computed(() => dashboardData.value?.recent_bookings || [])

// Mock top units - replace with real data
const topUnits = ref([
  { id: 1, name: 'Azure Tower Unit 1623', type: 'Own Unit', revenue: 45000, bookings: 12 },
  { id: 2, name: 'Makati Condo 2A', type: 'Partner Unit', revenue: 38000, bookings: 10 },
  { id: 3, name: 'BGC Loft Studio', type: 'Own Unit', revenue: 32000, bookings: 8 }
])

// Helper functions (same as dashboard)
const getCurrentMonth = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return 'Invalid Date'
  }
}

// Filter options (same as dashboard)
const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push({ label: i.toString(), value: i.toString() })
  }
  return [{ label: 'All Years', value: '' }, ...years.reverse()]
})

const monthOptions = computed(() => [
  { label: 'All Months', value: '' },
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' }
])

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return [{ label: 'All Partners', value: '' }]
  return [
    { label: 'All Partners', value: '' },
    ...partners.value.map(p => ({ label: p.name, value: p.id }))
  ]
})

const loadData = async () => {
  try {
    let startDate = ''
    let endDate = ''
    
    if (filters.year && filters.month) {
      const year = parseInt(filters.year)
      const month = parseInt(filters.month)
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`
    }
    
    const filterParams = {
      ...(filters.partner_id && { partner_id: filters.partner_id }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate })
    }
    
    const response = await getDashboardMetrics(filterParams)
    dashboardData.value = response
  } catch (error) {
    dashboardData.value = null
  }
}

const applyFilters = () => {
  loadData()
}

onMounted(async () => {
  try {
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadData()
    ])
  } catch (error) {
  }
})
</script>
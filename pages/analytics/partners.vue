<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Partner Analytics</h1>
        <p class="text-gray-600 dark:text-gray-400">Performance analytics for partner-managed units and revenue sharing</p>
      </div>
      <UButton to="/analytics" variant="ghost">
        <UIcon name="i-heroicons-arrow-left" class="mr-2" />
        Back to Analytics
      </UButton>
    </div>

    <!-- Partner Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg">
            <UIcon name="i-heroicons-users" class="h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Partners</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalPartners }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-metrobnb-700 dark:text-metrobnb-300" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Commission Earned</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalCommission.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg">
            <UIcon name="i-heroicons-home" class="h-8 w-8 text-metrobnb-800 dark:text-metrobnb-200" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Partner Units</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ partnerUnitsCount }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-6">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalOutstanding.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Partner Performance -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Partner Performance</h3>
          <USelect v-model="sortBy" :options="sortOptions" class="w-48" />
        </div>
      </template>
      <div class="space-y-4">
        <div v-for="partner in sortedPartners" :key="partner.id" 
             class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mr-4">
              <span class="text-metrobnb-600 dark:text-metrobnb-400 font-semibold">
                {{ partner.name.charAt(0) }}
              </span>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ partner.name }}</h4>
              <p class="text-sm text-gray-500">{{ partner.share_percentage || partner.sharePercentage }}% share • {{ partner.unitCount }} units</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-metrobnb-600 dark:text-metrobnb-400">₱{{ partner.revenue.toLocaleString() }}</p>
            <p class="text-sm" :class="partner.outstanding > 0 ? 'text-red-500' : 'text-gray-500'">
              {{ partner.outstanding > 0 ? `₱${partner.outstanding.toLocaleString()} due` : 'Settled' }}
            </p>
          </div>
        </div>
        
        <div v-if="!sortedPartners.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No partner data available.
        </div>
      </div>
    </UCard>

    <!-- Revenue Sharing Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Commission vs Partner Revenue -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Revenue Sharing</h3>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-metrobnb-50 dark:bg-metrobnb-900/20 rounded-lg">
            <div class="flex items-center">
              <UIcon name="i-heroicons-building-office-2" class="h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">MetroBNB Commission</p>
                <p class="text-sm text-gray-500">From partner units</p>
              </div>
            </div>
            <p class="text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400">₱{{ totalCommission.toLocaleString() }}</p>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-metrobnb-100 dark:bg-metrobnb-800/20 rounded-lg">
            <div class="flex items-center">
              <UIcon name="i-heroicons-users" class="h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Partner Revenue</p>
                <p class="text-sm text-gray-500">Total earned by partners</p>
              </div>
            </div>
            <p class="text-xl font-bold text-metrobnb-700 dark:text-metrobnb-300">₱{{ totalPartnerRevenue.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>

      <!-- Outstanding Invoices -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Outstanding Invoices</h3>
        </template>
        <div class="space-y-3">
          <div v-for="partner in partnersWithOutstanding" :key="partner.id" 
               class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div class="flex items-center">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ partner.name }}</p>
                <p class="text-sm text-gray-500">Overdue payment</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-red-600 dark:text-red-400">₱{{ partner.outstanding.toLocaleString() }}</p>
              <UButton to="/partners" size="xs" color="red" variant="ghost">
                Generate Invoice
              </UButton>
            </div>
          </div>
          
          <div v-if="!partnersWithOutstanding.length" class="text-center py-6">
            <UIcon name="i-heroicons-check-circle" class="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p class="text-gray-600 dark:text-gray-400">All partners are up to date!</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Partner Activity -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Recent Partner Bookings</h3>
      </template>
      <div class="space-y-3">
        <div v-for="booking in partnerBookings" :key="booking.id" 
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-calendar-days" class="h-5 w-5 text-metrobnb-500 mr-3" />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ booking.guest_name }}</p>
              <p class="text-sm text-gray-500">{{ booking.unit_name }} • {{ booking.partner_name }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-metrobnb-600 dark:text-metrobnb-400">₱{{ parseFloat(booking.total_amount).toLocaleString() }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(booking.booking_date) }}</p>
          </div>
        </div>
        
        <div v-if="!partnerBookings.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
          No recent partner bookings.
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getDashboardMetrics } = useApi()

const dashboardData = ref(null)
const sortBy = ref('revenue_desc')

const sortOptions = [
  { label: 'Revenue High-Low', value: 'revenue_desc' },
  { label: 'Revenue Low-High', value: 'revenue_asc' },
  { label: 'Outstanding High-Low', value: 'outstanding_desc' },
  { label: 'Name A-Z', value: 'name_asc' }
]

const totalPartners = computed(() => Array.isArray(partners.value) ? partners.value.length : 0)

const partnerUnitsCount = computed(() => {
  if (!Array.isArray(units.value)) return 0
  return units.value.filter(unit => unit.partner_id && unit.partner_id !== 'metrobnb').length
})

// Mock calculations - replace with real data from API
const revenueByPartner = computed(() => {
  return (dashboardData.value?.revenue_by_partner || []).map(partner => ({
    id: partner.partner_id,
    name: partner.partner_name,
    revenue: parseFloat(partner.revenue),
    sharePercentage: partner.metrobnb_share_percentage,
    outstanding: parseFloat(partner.actual_invoice),
    unitCount: Math.floor(Math.random() * 5) + 1 // Mock unit count
  }))
})

const totalCommission = computed(() => parseFloat(dashboardData.value?.metrobnb_revenue || '0'))
const totalPartnerRevenue = computed(() => parseFloat(dashboardData.value?.partner_revenue || '0'))
const totalOutstanding = computed(() => revenueByPartner.value.reduce((sum, partner) => sum + partner.outstanding, 0))

const sortedPartners = computed(() => {
  const partners = [...revenueByPartner.value]
  const [field, order] = sortBy.value.split('_')
  
  partners.sort((a, b) => {
    let aVal, bVal
    switch (field) {
      case 'revenue':
        aVal = a.revenue
        bVal = b.revenue
        break
      case 'outstanding':
        aVal = a.outstanding
        bVal = b.outstanding
        break
      case 'name':
        aVal = a.name
        bVal = b.name
        break
      default:
        return 0
    }
    
    if (field === 'name') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    
    return order === 'asc' ? aVal - bVal : bVal - aVal
  })
  
  return partners
})

const partnersWithOutstanding = computed(() => {
  return revenueByPartner.value.filter(partner => partner.outstanding > 0)
})

const partnerBookings = computed(() => {
  const bookings = dashboardData.value?.recent_bookings || []
  return bookings.filter(booking => booking.partner_name && booking.partner_name !== 'MetroBNB')
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
    const response = await getDashboardMetrics({
      // Add partner-specific filters when backend supports it
    })
    dashboardData.value = response
  } catch (error) {
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
  }
})
</script>
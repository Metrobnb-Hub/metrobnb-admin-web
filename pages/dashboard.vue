<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back! Here's your business overview.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalEarnings.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-plus-circle" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Add-on Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalAddonRevenue.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalExpenses.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <UIcon name="i-heroicons-chart-bar-square" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ netProfit.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <UIcon name="i-heroicons-users" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Partner Count</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ partners.length }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Bookings -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Recent Bookings</h3>
            <UButton to="/accounting/bookings" variant="ghost" size="sm">View All</UButton>
          </div>
        </template>
        
        <div class="space-y-3">
          <div 
            v-for="booking in recentBookings" 
            :key="booking.id"
            class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ booking.guestName }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ getUnitName(booking.unitId) }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(booking.date) }}</p>
            </div>
            <div class="text-right">
              <span class="font-semibold text-green-600 dark:text-green-400">
                ₱{{ getBookingTotal(booking).toFixed(2) }}
              </span>
              <div v-if="booking.addons?.length" class="text-xs text-gray-500 dark:text-gray-400">
                + {{ booking.addons.length }} add-on{{ booking.addons.length > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
          
          <div v-if="!recentBookings.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No bookings yet. <NuxtLink to="/accounting/bookings" class="text-blue-600 hover:underline">Add your first booking</NuxtLink>
          </div>
        </div>
      </UCard>

      <!-- Top Partners -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Top Partners</h3>
            <UButton to="/accounting/partners" variant="ghost" size="sm">View All</UButton>
          </div>
        </template>
        
        <div class="space-y-3">
          <div 
            v-for="partner in topPartners" 
            :key="partner.id"
            class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  {{ partner.name.charAt(0) }}
                </span>
              </div>
              <span class="ml-3 font-medium text-gray-900 dark:text-white">{{ partner.name }}</span>
            </div>
            <span class="font-semibold text-gray-900 dark:text-white">
              ₱{{ partner.earnings.toFixed(2) }}
            </span>
          </div>
          
          <div v-if="!topPartners.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No partner earnings yet.
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { partners, loadFromStorage: loadPartners } = usePartnerStore()
const { units, loadFromStorage: loadUnits } = useUnitStore()
const { getBookings, getExpenses, getBookingTotal, getDashboardMetrics } = useApi()

// Reactive data from mock API
const bookings = ref([])
const expenses = ref([])

const totalEarnings = computed(() => {
  if (!Array.isArray(bookings.value) || bookings.value.length === 0) return 0
  return bookings.value.reduce((sum, booking) => {
    const total = getBookingTotal(booking)
    return sum + (typeof total === 'number' ? total : 0)
  }, 0)
})

const totalAddonRevenue = computed(() => {
  if (!Array.isArray(bookings.value) || bookings.value.length === 0) return 0
  return bookings.value.reduce((sum, booking) => {
    if (!booking || !Array.isArray(booking.addons)) return sum
    const addonsTotal = booking.addons.reduce((addonSum, addon) => {
      return addonSum + (typeof addon?.amount === 'number' ? addon.amount : 0)
    }, 0)
    return sum + addonsTotal
  }, 0)
})

const totalExpenses = computed(() => {
  if (!Array.isArray(expenses.value) || expenses.value.length === 0) return 0
  return expenses.value.reduce((sum, expense) => {
    return sum + (typeof expense?.amount === 'number' ? expense.amount : 0)
  }, 0)
})

const netProfit = computed(() => totalEarnings.value - (totalExpenses.value || 0))

const recentBookings = computed(() => {
  if (!Array.isArray(bookings.value) || bookings.value.length === 0) return []
  return [...bookings.value]
    .filter(booking => booking && booking.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const topPartners = computed(() => {
  if (!Array.isArray(partners) || partners.length === 0) return []
  if (!Array.isArray(bookings.value) || bookings.value.length === 0) return []
  return [...partners]
    .filter(partner => partner && partner.id)
    .map(partner => {
      const partnerBookings = bookings.value.filter(b => b && b.partnerId === partner.id)
      const earnings = partnerBookings.reduce((sum, booking) => {
        const total = getBookingTotal(booking)
        return sum + (typeof total === 'number' ? total : 0)
      }, 0)
      return {
        ...partner,
        earnings: earnings || 0
      }
    })
    .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
    .slice(0, 5)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getUnitName = (unitId: string) => {
  if (!Array.isArray(units) || !unitId) return 'Unknown Unit'
  const unit = units.find(u => u && u.id === unitId)
  return unit?.name || 'Unknown Unit'
}

const loadData = async () => {
  try {
    const [apiBookings, apiExpenses] = await Promise.all([
      getBookings(),
      getExpenses()
    ])
    bookings.value = Array.isArray(apiBookings) ? apiBookings : []
    expenses.value = Array.isArray(apiExpenses) ? apiExpenses : []
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    bookings.value = []
    expenses.value = []
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
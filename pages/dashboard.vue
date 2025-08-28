<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Accounting Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">{{ getCurrentDate() }} - Financial overview and accounting management</p>
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
      
      <!-- Filters (collapsible) -->
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
          <p class="text-xs text-gray-500 mt-1">MetroBNB + Partners</p>
        </div>
        
        <div class="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <UIcon name="i-heroicons-building-office-2" class="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">MetroBNB Share</p>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">₱{{ metroBNBRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">Commission + Fees</p>
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
          <p class="text-xs text-gray-500 mt-1">After expenses</p>
        </div>
      </div>
    </UCard>

    <!-- Partner Financial Summary & Outstanding Invoices -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Partner Earnings -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Partner Earnings</h3>
            <UButton to="/partners" variant="ghost" size="sm">View All</UButton>
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="partner in revenueByPartner.slice(0, 5)" :key="partner.label" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-600 dark:text-blue-400 font-semibold">
                  {{ partner.label.charAt(0) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ partner.label }}</p>
                <p class="text-sm text-gray-500">{{ partner.sharePercentage }}% share</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600 dark:text-green-400">₱{{ partner.value.toLocaleString() }}</p>
              <p class="text-xs text-gray-500">Partner revenue</p>
            </div>
          </div>
          <div v-if="!revenueByPartner.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No partner data for selected period
          </div>
        </div>
      </UCard>

      <!-- Outstanding Amounts -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Outstanding Amounts</h3>
            <UBadge color="red" variant="subtle" v-if="totalOutstanding > 0">
              ₱{{ totalOutstanding.toLocaleString() }}
            </UBadge>
          </div>
        </template>
        <div class="space-y-4">
          <div v-for="partner in revenueByPartner.slice(0, 5)" :key="partner.label" 
               class="flex items-center justify-between p-3 rounded-lg"
               :class="partner.invoiceDue > 0 ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20'">
            <div class="flex items-center">
              <UIcon :name="partner.invoiceDue > 0 ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-check-circle'" 
                     :class="partner.invoiceDue > 0 ? 'text-red-500' : 'text-green-500'" 
                     class="h-5 w-5 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ partner.label }}</p>
                <p class="text-sm text-gray-500">
                  {{ partner.invoiceDue > 0 ? 'Amount due' : 'Settled' }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold" :class="partner.invoiceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                {{ partner.invoiceDue > 0 ? '₱' + partner.invoiceDue.toLocaleString() : '✓ Paid' }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Expense Breakdown & Recent Transactions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Expense Categories -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Expense Breakdown</h3>
            <UButton to="/expenses" variant="ghost" size="sm">View All</UButton>
          </div>
        </template>
        <div class="space-y-3">
          <div v-for="expense in expenseBreakdown" :key="expense.label" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <span class="font-medium text-gray-900 dark:text-white">{{ expense.label }}</span>
            </div>
            <span class="font-semibold text-red-600 dark:text-red-400">₱{{ expense.value.toLocaleString() }}</span>
          </div>
          <div v-if="!expenseBreakdown.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No expenses recorded for selected period
          </div>
        </div>
      </UCard>

      <!-- Recent Financial Activity -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Recent Activity</h3>
        </template>
        <div class="space-y-3">
          <div v-for="booking in recentBookings.slice(0, 5)" :key="booking.id" 
               class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center">
              <UIcon name="i-heroicons-calendar-days" class="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ booking.guest_name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(booking.booking_date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600 dark:text-green-400">₱{{ parseFloat(booking.total_amount).toLocaleString() }}</p>
              <p class="text-xs text-gray-500">{{ booking.unit_name }}</p>
            </div>
          </div>
          <div v-if="!recentBookings.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent bookings
          </div>
        </div>
      </UCard>
    </div>

    <!-- Accounting Quick Actions -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Accounting Actions</h3>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <UButton to="/partners" color="primary" block>
          <UIcon name="i-heroicons-document-text" class="mr-2" />
          Generate Invoices
        </UButton>
        <UButton to="/expenses/create" color="red" block>
          <UIcon name="i-heroicons-receipt-percent" class="mr-2" />
          Record Expense
        </UButton>
        <UButton to="/accounting/bookings" color="green" block>
          <UIcon name="i-heroicons-banknotes" class="mr-2" />
          Track Payments
        </UButton>
        <UButton to="/journal-entries" color="purple" block>
          <UIcon name="i-heroicons-document-plus" class="mr-2" />
          Journal Entries
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getDashboardMetrics } = useApi()

const dashboardData = ref(null)
const showFilters = ref(false)

// Get current month and year
const now = new Date()
const currentYear = now.getFullYear().toString()
const currentMonth = (now.getMonth() + 1).toString()

// Filters
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

const recentBookings = computed(() => dashboardData.value?.recent_bookings || [])

const revenueByPartner = computed(() => {
  return (dashboardData.value?.revenue_by_partner || []).map(partner => ({
    label: partner.partner_name,
    value: parseFloat(partner.revenue),
    sharePercentage: partner.metrobnb_share_percentage,
    metrobnbShare: parseFloat(partner.metrobnb_share_computed),
    invoiceDue: parseFloat(partner.actual_invoice)
  }))
})

const expenseBreakdown = computed(() => {
  return (dashboardData.value?.expense_breakdown || []).map(expense => ({
    label: expense.type,
    value: parseFloat(expense.amount)
  }))
})

const totalOutstanding = computed(() => {
  return revenueByPartner.value.reduce((sum, partner) => sum + partner.invoiceDue, 0)
})

// Helper functions
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCurrentMonth = () => {
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return monthName
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

// Filter options
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
    console.error('Failed to load dashboard data:', error)
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
    console.error('Failed to load data:', error)
  }
})
</script>
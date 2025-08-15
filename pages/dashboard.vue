<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back! Here's your business overview.</p>
    </div>

    <!-- Filters -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Filters</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <UFormGroup label="Year">
          <USelect v-model="filters.year" :options="yearOptions" placeholder="All years" @change="applyFilters" />
        </UFormGroup>
        <UFormGroup label="Month">
          <USelect v-model="filters.month" :options="monthOptions" placeholder="All months" @change="applyFilters" />
        </UFormGroup>
        <UFormGroup label="Partner">
          <USelect v-model="filters.partner_id" :options="partnerOptions" placeholder="All partners" @change="applyFilters" />
        </UFormGroup>
        <UFormGroup label="Start Date">
          <UInput v-model="filters.start_date" type="date" @change="applyFilters" />
        </UFormGroup>
        <UFormGroup label="End Date">
          <UInput v-model="filters.end_date" type="date" @change="applyFilters" />
        </UFormGroup>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton variant="ghost" @click="clearFilters">Clear All</UButton>
        <UButton color="primary" @click="applyFilters">Apply Filters</UButton>
      </div>
    </UCard>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">MetroBNB Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ metroBNBRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-plus-circle" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Partner Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ partnerRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">MetroBNB Expenses</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ metroBNBExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
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
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
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
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ dashboardData?.partner_count || 0 }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Quick Actions</h3>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <UButton to="/bookings/create" color="primary" block>
          <UIcon name="i-heroicons-plus" class="mr-2" />
          New Booking
        </UButton>
        <UButton to="/expenses/create" color="green" block>
          <UIcon name="i-heroicons-minus" class="mr-2" />
          Add Expense
        </UButton>
        <UButton to="/partners" color="blue" block>
          <UIcon name="i-heroicons-document-text" class="mr-2" />
          Generate Invoice
        </UButton>
        <UButton to="/partners" color="purple" block>
          <UIcon name="i-heroicons-users" class="mr-2" />
          Manage Partners
        </UButton>
      </div>
    </UCard>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue by Partner -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Revenue by Partner</h3>
        </template>
        <div class="space-y-3">
          <div v-for="item in revenueByPartner" :key="item.label" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.label }}</span>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ item.sharePercentage }}%</span>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">Partner Revenue:</span>
                <span class="text-xs font-medium text-green-600 dark:text-green-400">₱{{ item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">MetroBNB Share:</span>
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">₱{{ item.metrobnbShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-600">
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Invoice Due:</span>
                <span class="text-xs font-bold text-red-600 dark:text-red-400">₱{{ item.invoiceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
      
      <!-- Expense Breakdown -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Expense Breakdown</h3>
        </template>
        <div class="space-y-2">
          <div v-for="item in expenseBreakdown" :key="item.label" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</span>
            <span class="font-semibold">₱{{ item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
        </div>
      </UCard>
    </div>
    
    <!-- Monthly Trend -->
    <UCard class="mb-8">
      <template #header>
        <h3 class="text-lg font-semibold">Monthly Revenue Trend</h3>
      </template>
      <div class="space-y-2">
        <div v-for="item in monthlyTrend" :key="item.label" class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</span>
          <span class="font-semibold">₱{{ item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        </div>
      </div>
    </UCard>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <p class="font-medium text-gray-900 dark:text-white">{{ booking.guest_name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking.unit_name }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(booking.booking_date) }}</p>
            </div>
            <div class="text-right">
              <span class="font-semibold text-green-600 dark:text-green-400">
                ₱{{ parseFloat(booking.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
              <div v-if="booking.addons?.length" class="text-xs text-gray-500 dark:text-gray-400">
                + {{ booking.addons.length }} add-on{{ booking.addons.length > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
          
          <div v-if="!recentBookings.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No bookings yet. <NuxtLink to="/bookings/create" class="text-blue-600 hover:underline">Add your first booking</NuxtLink>
          </div>
        </div>
      </UCard>

      <!-- Recent Expenses -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Recent Expenses</h3>
            <UButton to="/expenses" variant="ghost" size="sm">View All</UButton>
          </div>
        </template>
        
        <div class="space-y-3">
          <div 
            v-for="expense in recentExpenses" 
            :key="expense.id"
            class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ expense.type }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ expense.unit_name }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(expense.date) }}</p>
            </div>
            <div class="text-right">
              <span class="font-semibold text-red-600 dark:text-red-400">
                -₱{{ parseFloat(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
              <div class="text-xs" :class="expense.paid ? 'text-green-500' : 'text-red-500'">
                {{ expense.paid ? 'Paid' : 'Unpaid' }}
              </div>
            </div>
          </div>
          
          <div v-if="!recentExpenses.length" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No expenses yet. <NuxtLink to="/expenses/create" class="text-blue-600 hover:underline">Add your first expense</NuxtLink>
          </div>
        </div>
      </UCard>

      <!-- Top Partners -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Top Partners</h3>
            <UButton to="/partners" variant="ghost" size="sm">View All</UButton>
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
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getDashboardMetrics } = useApi()

// Dashboard metrics from analytics API
const dashboardData = ref(null)

// Get current month and year
const now = new Date()
const currentYear = now.getFullYear().toString()
const currentMonth = (now.getMonth() + 1).toString()

// Filters
const filters = reactive({
  year: currentYear,
  month: currentMonth,
  partner_id: '',
  start_date: '',
  end_date: ''
})



const metroBNBRevenue = computed(() => {
  return parseFloat(dashboardData.value?.metrobnb_revenue || '0')
})

const partnerRevenue = computed(() => {
  return parseFloat(dashboardData.value?.partner_revenue || '0')
})

const metroBNBExpenses = computed(() => {
  return parseFloat(dashboardData.value?.metrobnb_expenses || '0')
})

const netProfit = computed(() => {
  return parseFloat(dashboardData.value?.net_profit || '0')
})

const recentBookings = computed(() => {
  return dashboardData.value?.recent_bookings || []
})

const recentExpenses = computed(() => {
  return dashboardData.value?.recent_expenses || []
})

const topPartners = computed(() => {
  return (dashboardData.value?.revenue_by_partner || []).slice(0, 5).map(partner => ({
    id: partner.partner_id,
    name: partner.partner_name,
    earnings: parseFloat(partner.revenue)
  }))
})

// Chart data computeds
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

const monthlyTrend = computed(() => {
  return (dashboardData.value?.monthly_trend || []).map(trend => ({
    label: trend.month,
    value: parseFloat(trend.metrobnb_revenue)
  }))
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getUnitName = (unitId: string) => {
  if (!Array.isArray(units.value) || !unitId) return 'Unknown Unit'
  const unit = units.value.find(u => u && u.id === unitId)
  return unit?.name || 'Unknown Unit'
}

const getPartnerSharePercentage = (partnerId: string) => {
  if (!Array.isArray(partners.value) || !partnerId) return 20
  const partner = partners.value.find(p => p && p.id === partnerId)
  return partner?.share_percentage || 20
}

const loadData = async () => {
  try {
    let startDate = filters.start_date
    let endDate = filters.end_date
    
    // Convert year/month to start_date and end_date
    if (filters.year || filters.month) {
      const year = filters.year || new Date().getFullYear()
      const month = filters.month || ''
      
      if (month) {
        // Specific month
        const monthNum = parseInt(month)
        startDate = `${year}-${monthNum.toString().padStart(2, '0')}-01`
        const lastDay = new Date(year, monthNum, 0).getDate()
        endDate = `${year}-${monthNum.toString().padStart(2, '0')}-${lastDay}`
      } else {
        // Entire year
        startDate = `${year}-01-01`
        endDate = `${year}-12-31`
      }
    }
    
    const filterParams = {
      ...(filters.partner_id && { partner_id: filters.partner_id }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate })
    }
    
    const response = await getDashboardMetrics(filterParams)
    dashboardData.value = response
    console.log('Dashboard loaded:', dashboardData.value)
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    dashboardData.value = null
  }
}

// Filter options
const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  
  // Generate last 5 years and next 2 years
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push({ label: i.toString(), value: i.toString() })
  }
  
  return [{ label: 'All Years', value: '' }, ...years.reverse()]
})

const monthOptions = computed(() => {
  const months = [
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
  ]
  
  return [{ label: 'All Months', value: '' }, ...months]
})

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return [{ label: 'All Partners', value: '' }]
  return [
    { label: 'All Partners', value: '' },
    ...partners.value.map(p => ({ label: p.name, value: p.id }))
  ]
})

const applyFilters = () => {
  loadData()
}

const clearFilters = () => {
  filters.year = ''
  filters.month = ''
  filters.partner_id = ''
  filters.start_date = ''
  filters.end_date = ''
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
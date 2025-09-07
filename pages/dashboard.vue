<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back, {{ user?.name || 'Partner' }}</p>
    </div>

    <!-- Partner Dashboard -->
    <div v-if="isPartner">
      <!-- Welcome Message -->
      <UCard class="mb-6">
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-heart" class="h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {{ user?.name }}!</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
            Thank you for being a pioneering partner who believes in us. This web app is made for you and will have more features soon!
          </p>
          <div class="inline-flex items-center px-3 py-1 bg-metrobnb-50 dark:bg-metrobnb-900/20 text-metrobnb-700 dark:text-metrobnb-300 rounded-full text-sm font-medium">
            <UIcon name="i-heroicons-star" class="h-4 w-4 mr-1" />
            Pioneering Partner
          </div>
        </div>
      </UCard>

      <!-- Latest Invoice Highlight -->
      <UCard v-if="latestInvoice" class="mb-6">
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-metrobnb-600 dark:text-metrobnb-400 mr-2" />
            <h3 class="text-lg font-semibold">Your Latest Invoice</h3>
          </div>
        </template>
        <div class="bg-gradient-to-r from-metrobnb-50 to-metrobnb-100 dark:from-metrobnb-900/20 dark:to-metrobnb-800/20 rounded-lg p-4">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ latestInvoice.invoice_number }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ latestInvoice.period }}</p>
            </div>
            <UBadge :color="getInvoiceStatusColor(latestInvoice.status)" size="sm">
              {{ getInvoiceStatusText(latestInvoice.status) }}
            </UBadge>
          </div>
          <div class="flex justify-between items-center">
            <div v-if="parseFloat(latestInvoice.total_amount || 0) > 0">
              <p class="text-sm text-gray-600 dark:text-gray-400">Amount</p>
              <p class="text-xl font-bold text-metrobnb-600 dark:text-metrobnb-400">
                ₱{{ parseFloat(latestInvoice.total_amount).toLocaleString() }}
              </p>
            </div>
            <UButton :to="`/invoices/${latestInvoice.id}`" color="primary" :class="parseFloat(latestInvoice.total_amount || 0) === 0 ? 'ml-auto' : ''">
              <UIcon name="i-heroicons-eye" class="mr-2" />
              Check it out
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- No Invoice State -->
      <UCard v-else class="mb-6">
        <div class="text-center py-8">
          <UIcon name="i-heroicons-document-plus" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Your invoices will appear here once they're generated</p>
          <UButton to="/invoices" color="primary" variant="outline">
            View Invoices
          </UButton>
        </div>
      </UCard>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UCard class="p-4 hover:shadow-md transition-shadow cursor-pointer" @click="$router.push('/invoices')">
          <div class="flex items-center">
            <div class="p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg">
              <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400" />
            </div>
            <div class="ml-4">
              <h4 class="font-medium text-gray-900 dark:text-white">All Invoices</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">View your invoice history</p>
            </div>
          </div>
        </UCard>
        
        <UCard class="p-4 hover:shadow-md transition-shadow cursor-pointer" @click="$router.push('/expenses')">
          <div class="flex items-center">
            <div class="p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg">
              <UIcon name="i-heroicons-receipt-percent" class="h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300" />
            </div>
            <div class="ml-4">
              <h4 class="font-medium text-gray-900 dark:text-white">View Expenses</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">See your expense history</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Admin/Staff Dashboard -->
    <div v-else>
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Admin Dashboard</h3>
        </template>
        <p>Admin dashboard content coming soon...</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { getBookings, getExpenses, getInvoices } = useApi()
const { extractData } = useApiResponse()

const isPartner = computed(() => user.value?.role === 'partner')

const pendingAmount = ref(0)
const paidThisMonth = ref(0)
const totalInvoices = ref(0)
const recentInvoices = ref([])
const latestInvoice = ref(null)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getInvoiceStatusColor = (status: string) => {
  const colors = {
    draft: 'gray',
    finalized: 'yellow',
    sent: 'blue',
    paid: 'primary'
  }
  return colors[status] || 'gray'
}

const getInvoiceStatusText = (status: string) => {
  const texts = {
    draft: 'Draft',
    finalized: 'Finalized',
    sent: 'Sent',
    paid: 'Paid'
  }
  return texts[status] || status
}

const loadPartnerData = async () => {
  if (!isPartner.value) return
  
  try {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    // Load invoices
    const invoicesResult = await getInvoices({ limit: 10 })
    const invoices = extractData(invoicesResult) || []
    recentInvoices.value = invoices
    totalInvoices.value = invoices.length
    latestInvoice.value = invoices[0] || null
    
    // Calculate pending amount (unpaid invoices)
    pendingAmount.value = invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0)
    
    // Calculate paid this month
    paidThisMonth.value = invoices
      .filter(invoice => {
        if (invoice.status !== 'paid' || !invoice.paid_at) return false
        const paidDate = new Date(invoice.paid_at)
        return paidDate.getMonth() + 1 === currentMonth && paidDate.getFullYear() === currentYear
      })
      .reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0)
    
  } catch (error) {
    // Handle error silently for dashboard
  }
}

onMounted(() => {
  if (isPartner.value) {
    loadPartnerData()
  }
})
</script>
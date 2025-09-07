<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back, {{ user?.name || 'Partner' }}</p>
    </div>

    <!-- Partner Dashboard -->
    <div v-if="isPartner">
      <!-- Invoice Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <UCard class="p-4">
          <div class="flex items-center">
            <div class="p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg">
              <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-metrobnb-600 dark:text-metrobnb-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Amount</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">₱{{ pendingAmount.toLocaleString() }}</p>
            </div>
          </div>
        </UCard>
        
        <UCard class="p-4">
          <div class="flex items-center">
            <div class="p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg">
              <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-metrobnb-700 dark:text-metrobnb-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Paid This Month</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">₱{{ paidThisMonth.toLocaleString() }}</p>
            </div>
          </div>
        </UCard>
        
        <UCard class="p-4">
          <div class="flex items-center">
            <div class="p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg">
              <UIcon name="i-heroicons-clock" class="h-6 w-6 text-metrobnb-800 dark:text-metrobnb-200" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ totalInvoices }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <UCard class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold">Invoice Actions</h3>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UButton to="/invoices" color="primary" block>
            <UIcon name="i-heroicons-document-text" class="mr-2" />
            View All Invoices
          </UButton>
          <UButton v-if="latestInvoice" :to="`/invoices/${latestInvoice.id}`" color="primary" variant="outline" block>
            <UIcon name="i-heroicons-eye" class="mr-2" />
            View Latest Invoice
          </UButton>
        </div>
      </UCard>

      <!-- Invoice Activity -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Recent Invoices</h3>
            <UButton to="/invoices" variant="ghost" size="sm">
              View All
            </UButton>
          </div>
        </template>
        <div v-if="recentInvoices.length" class="space-y-3">
          <div v-for="invoice in recentInvoices.slice(0, 5)" :key="invoice.id" class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ invoice.invoice_number }}</p>
              <p class="text-sm text-gray-500">{{ invoice.period }} • {{ formatDate(invoice.generated_at) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-metrobnb-600 dark:text-metrobnb-400">₱{{ parseFloat(invoice.total_amount || 0).toLocaleString() }}</p>
              <UBadge :color="getInvoiceStatusColor(invoice.status)" size="xs">{{ getInvoiceStatusText(invoice.status) }}</UBadge>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-500">
          No invoices yet
        </div>
      </UCard>
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
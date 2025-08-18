<template>
  <div class="space-y-3 sm:space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex justify-between items-start gap-3">
        <div class="min-w-0 flex-1">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Invoices</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Manage partner invoices and settlements</p>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
      <UCard class="p-3 sm:p-4">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-2 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ invoices?.length || 0 }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-3 sm:p-4">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <UIcon name="i-heroicons-clock" class="h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div class="ml-2 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ pendingCount }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-check-circle" class="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-2 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Paid</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ paidCount }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Invoices List -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">All Invoices</h3>
        </div>
      </template>
      
      <!-- Filters -->
      <div class="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <USelect 
          v-model="filterStatus" 
          :options="statusOptions"
          class="flex-1 sm:w-40"
          size="sm"
        />
        <USelect 
          v-model="filterPartner" 
          :options="partnerOptions"
          class="flex-1 sm:w-48"
          size="sm"
        />
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="text-gray-500">Loading invoices...</div>
      </div>
      
      <div v-else>
        <!-- Mobile card layout -->
        <div v-if="filteredInvoices.length" class="sm:hidden space-y-3">
          <UCard v-for="invoice in filteredInvoices" :key="invoice.id" class="p-4">
            <div class="space-y-3">
              <div class="flex justify-between items-start">
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ invoice.invoice_number }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ invoice.partner_name }}</p>
                </div>
                <UDropdown :items="getInvoiceActions(invoice)">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="xs" />
                </UDropdown>
              </div>
              
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Period:</span>
                  <p class="font-medium">{{ invoice.period }}</p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Amount:</span>
                  <p class="font-medium text-red-600 dark:text-red-400">₱{{ parseFloat(invoice.summary?.net_due || 0).toLocaleString('en-US', { minimumFractionDigits: 0 }) }}</p>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Status:</span>
                  <UBadge :color="getStatusColor(invoice.status)" size="xs" class="ml-1">
                    {{ invoice.status }}
                  </UBadge>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">Generated:</span>
                  <p class="font-medium">{{ formatDate(invoice.generated_at) }}</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
        
        <!-- Desktop table layout -->
        <div v-if="filteredInvoices.length" class="hidden sm:block">
          <UTable :rows="filteredInvoices" :columns="invoiceColumns">
            <template #invoice_number-data="{ row }">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ row.invoice_number }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ row.partner_name }}</div>
              </div>
            </template>
            
            <template #period-data="{ row }">
              {{ row.period }}
            </template>
            
            <template #amount-data="{ row }">
              <span class="font-semibold text-red-600 dark:text-red-400">
                ₱{{ parseFloat(row.summary?.net_due || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </span>
            </template>
            
            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)" size="xs">
                {{ row.status }}
              </UBadge>
            </template>
            
            <template #generated_at-data="{ row }">
              {{ formatDate(row.generated_at) }}
            </template>
            
            <template #actions-data="{ row }">
              <UDropdown :items="getInvoiceActions(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
              </UDropdown>
            </template>
          </UTable>
        </div>
        
        <div v-else class="text-center py-12">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Generate your first invoice from the partners page</p>
          <UButton to="/partners" color="primary">Go to Partners</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { getInvoices, settleInvoice, deleteInvoice, cancelInvoice, regenerateInvoice } = useApi()
const { partners, loadPartners } = useDataManager()

const invoices = ref([])
const isLoading = ref(false)
const filterStatus = ref('all')
const filterPartner = ref('all')

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' }
]

const partnerOptions = computed(() => {
  const options = [{ label: 'All Partners', value: 'all' }]
  if (Array.isArray(partners.value)) {
    options.push(...partners.value.map(p => ({ label: p.name, value: p.id })))
  }
  return options
})

const invoiceColumns = [
  { key: 'invoice_number', label: 'Invoice / Partner' },
  { key: 'period', label: 'Period' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'generated_at', label: 'Generated' },
  { key: 'actions', label: '' }
]

const filteredInvoices = computed(() => {
  let filtered = invoices.value || []
  
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(invoice => invoice.status === filterStatus.value)
  }
  
  if (filterPartner.value !== 'all') {
    filtered = filtered.filter(invoice => invoice.partner_id === filterPartner.value)
  }
  
  return filtered
})

const pendingCount = computed(() => 
  invoices.value?.filter(invoice => invoice.status === 'pending').length || 0
)

const paidCount = computed(() => 
  invoices.value?.filter(invoice => invoice.status === 'paid').length || 0
)

const getStatusColor = (status: string) => {
  const colors = {
    'pending': 'orange',
    'paid': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'gray'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getInvoiceActions = (invoice: any) => {
  const actions = [
    [{
      label: 'View Invoice',
      icon: 'i-heroicons-eye',
      click: () => viewInvoice(invoice)
    }]
  ]
  
  if (invoice.status === 'pending') {
    actions.push([
      {
        label: 'Mark as Paid',
        icon: 'i-heroicons-check-circle',
        click: () => markAsPaid(invoice)
      },
      {
        label: 'Regenerate',
        icon: 'i-heroicons-arrow-path',
        click: () => regenerateInvoiceAction(invoice)
      }
    ])
    actions.push([
      {
        label: 'Cancel',
        icon: 'i-heroicons-x-circle',
        click: () => cancelInvoiceAction(invoice)
      },
      {
        label: 'Delete',
        icon: 'i-heroicons-trash',
        click: () => deleteInvoiceAction(invoice)
      }
    ])
  }
  
  return actions
}

const viewInvoice = (invoice: any) => {
  navigateTo(`/invoices/${invoice.id}`)
}

const markAsPaid = async (invoice: any) => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    await settleInvoice(invoice.id, new Date().toISOString().split('T')[0])
    await loadInvoices()
    notifySuccess('Invoice marked as paid successfully')
  } catch (error) {
    notifyError('Failed to mark invoice as paid')
  }
}

const regenerateInvoiceAction = async (invoice: any) => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    const result = await regenerateInvoice(invoice.id)
    await loadInvoices()
    notifySuccess(`Invoice regenerated: ${result.data.invoice_number}`)
  } catch (error) {
    notifyError('Failed to regenerate invoice')
  }
}

const cancelInvoiceAction = async (invoice: any) => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    await cancelInvoice(invoice.id)
    await loadInvoices()
    notifySuccess('Invoice cancelled successfully')
  } catch (error) {
    notifyError('Failed to cancel invoice')
  }
}

const deleteInvoiceAction = async (invoice: any) => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    await deleteInvoice(invoice.id)
    await loadInvoices()
    notifySuccess('Invoice deleted successfully')
  } catch (error) {
    notifyError('Failed to delete invoice')
  }
}

const loadInvoices = async () => {
  try {
    isLoading.value = true
    invoices.value = await getInvoices()
  } catch (error) {
    console.error('Failed to load invoices:', error)
    invoices.value = []
    
    const { notifyError } = useNotify()
    notifyError('Failed to load invoices')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadInvoices()
  ])
})
</script>
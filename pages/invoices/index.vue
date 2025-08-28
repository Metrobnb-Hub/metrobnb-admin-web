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
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold">Invoices</h3>
            <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button 
                @click="switchToActive"
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  !showArchive ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Active
              </button>
              <button 
                @click="switchToArchive"
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  showArchive ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Archive {{ archivedCount > 0 ? `(${archivedCount})` : '' }}
              </button>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Filters -->
      <div class="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <USelect 
          v-model="filterStatus" 
          :options="statusOptions"
          class="flex-1 sm:w-40"
          size="sm"
          @change="onFilterChange"
        />
        <USelect 
          v-model="filterPartner" 
          :options="partnerOptions"
          class="flex-1 sm:w-48"
          size="sm"
          @change="onFilterChange"
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
                  <p class="font-medium text-red-600 dark:text-red-400">₱{{ parseFloat(invoice.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
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
                ₱{{ parseFloat(row.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
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
        
        <!-- Pagination -->
        <div v-if="filteredInvoices.length && totalPages > 1" class="flex justify-center mt-6">
          <UPagination 
            v-model="currentPage" 
            :page-count="totalPages" 
            :total="totalItems"
            :per-page="itemsPerPage"
            @update:model-value="onPageChange"
          />
        </div>
        
        <div v-else-if="!filteredInvoices.length && !isLoading" class="text-center py-12">
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

const invoices = ref<any[]>([])
const isLoading = ref(false)
const filterStatus = ref('all')
const filterPartner = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const showArchive = ref(false)
const archivedCount = ref(0)

const statusOptions = computed(() => {
  if (showArchive.value) {
    return [
      { label: 'All Cancelled', value: 'all' }
    ]
  }
  return [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' }
  ]
})

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
  return Array.isArray(invoices.value) ? invoices.value : []
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const pendingCount = computed(() => 
  Array.isArray(invoices.value) ? invoices.value.filter(invoice => invoice.status === 'pending').length : 0
)

const paidCount = computed(() => 
  Array.isArray(invoices.value) ? invoices.value.filter(invoice => invoice.status === 'paid').length : 0
)

const getStatusColor = (status: string) => {
  const colors = {
    'pending': 'orange',
    'paid': 'green',
    'cancelled': 'gray'
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
        click: () => deleteInvoiceAction(invoice) // Now cancels instead of deletes
      }
    ])
  }
  
  // No actions for cancelled invoices in archive (read-only)
  
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
  
  const confirmed = confirm(`Cancel Invoice ${invoice.invoice_number}?\n\nThis will:\n• Mark the invoice as cancelled\n• Move it to the archive\n• Preserve audit trail\n\nThis action can be undone by regenerating the invoice.`)
  
  if (!confirmed) return
  
  try {
    await deleteInvoice(invoice.id)
    
    if (showArchive.value) {
      // If viewing archive, refresh archive list
      await loadInvoices()
    } else {
      // If viewing active, remove from active list and refresh counts
      await Promise.all([
        loadInvoices(),
        loadArchivedCount()
      ])
    }
    
    notifySuccess('Invoice cancelled and moved to archive')
  } catch (error) {
    notifyError('Failed to cancel invoice')
  }
}

const loadInvoices = async () => {
  try {
    isLoading.value = true
    
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...(filterStatus.value !== 'all' && { status: filterStatus.value }),
      ...(filterPartner.value !== 'all' && { partner_id: filterPartner.value })
    }
    
    // Use archive endpoint if viewing archive
    const result = showArchive.value 
      ? await getArchivedInvoices(params.partner_id)
      : await getInvoices(params.partner_id, params.status)
    
    // Handle both paginated and non-paginated responses
    if (result.items) {
      invoices.value = result.items
      totalItems.value = result.pagination?.total_items || result.items.length
    } else {
      invoices.value = Array.isArray(result) ? result : []
      totalItems.value = invoices.value.length
    }
  } catch (error) {
    console.error('Failed to load invoices:', error)
    invoices.value = []
    totalItems.value = 0
    
    const { notifyError } = useNotify()
    notifyError('Failed to load invoices')
  } finally {
    isLoading.value = false
  }
}

const loadArchivedCount = async () => {
  try {
    const result = await getArchivedInvoices()
    archivedCount.value = result.items?.length || (Array.isArray(result) ? result.length : 0)
  } catch (error) {
    console.error('Failed to load archived count:', error)
    archivedCount.value = 0
  }
}

const switchToActive = () => {
  showArchive.value = false
  filterStatus.value = 'all'
  currentPage.value = 1
  loadInvoices()
}

const switchToArchive = () => {
  showArchive.value = true
  filterStatus.value = 'all'
  currentPage.value = 1
  loadInvoices()
}

const onPageChange = (page: number) => {
  currentPage.value = page
  loadInvoices()
}

const onFilterChange = () => {
  currentPage.value = 1
  loadInvoices()
}

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadInvoices(),
    loadArchivedCount()
  ])
})
</script>
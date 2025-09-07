<template>
  <div v-if="isLoading" class="flex justify-center py-12">
    <div class="text-gray-500">Loading invoice...</div>
  </div>
  
  <div v-else-if="error" class="max-w-4xl mx-auto">
    <UCard>
      <div class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Invoice Not Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <UButton to="/invoices" color="primary">Back to Invoices</UButton>
      </div>
    </UCard>
  </div>
  
  <div v-else-if="invoiceData">
    <!-- Invoice Status & Actions -->
    <div class="max-w-4xl mx-auto mb-6">
      <UCard>
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-3">
            <UButton to="/invoices" variant="ghost" size="sm">
              <UIcon name="i-heroicons-arrow-left" class="mr-1" />
              Back to Invoices
            </UButton>
            <UBadge :color="getStatusColor(invoiceData.status)" size="lg">
              {{ getStatusText(invoiceData.status || 'draft') }}
            </UBadge>
          </div>
          
          <!-- Workflow Actions -->
          <div class="flex space-x-2">
            <UButton 
              v-for="action in availableActions" 
              :key="action.action"
              @click="handleAction(action)"
              :loading="loading"
              :color="action.color"
              size="sm"
            >
              <UIcon :name="action.icon" class="mr-1" />
              {{ action.label }}
            </UButton>
          </div>
        </div>
        
        <!-- Invoice Summary -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 class="font-semibold mb-3">Invoice Summary</h3>
          
          <!-- Draft Invoice Notice -->
          <div v-if="invoiceData.status === 'draft'" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <div class="flex items-center">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <p class="text-sm text-yellow-700 dark:text-yellow-300">
                This is a draft invoice. Use "Refresh Data" to calculate the latest amounts from bookings and expenses.
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Invoice Number:</span>
              <div class="font-medium">{{ invoiceData.invoice_number }}</div>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Partner:</span>
              <div class="font-medium">{{ invoiceData.partnerName }}</div>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Period:</span>
              <div class="font-medium">{{ invoiceData.period }}</div>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Net Due:</span>
              <div class="font-bold text-lg" :class="invoiceData.summary?.net_due > 0 ? 'text-red-600 dark:text-red-400' : 'text-metrobnb-600 dark:text-metrobnb-400'">
                ₱{{ formatAmount(invoiceData.summary?.net_due || 0) }}
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
    
    <PartnerInvoice :invoice="invoiceData" />
    
    <!-- Settlement Modal -->
    <UModal v-model="showSettleModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Mark Invoice as Paid</h3>
        </template>
        
        <div class="space-y-4">
          <UFormGroup label="Payment Date" name="paidDate">
            <UInput v-model="paidDate" type="date" :max="today" required />
          </UFormGroup>
          
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="showSettleModal = false">Cancel</UButton>
            <UButton @click="confirmSettle" :loading="loading" color="primary">
              Confirm Payment
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getInvoiceById, refreshInvoice, approveInvoice, finalizeInvoice, sendInvoice: sendInvoiceAPI, settleInvoice } = useApi()
const { notifyError, notifySuccess } = useNotify()
const { getInvoiceActions, getStatusText, getStatusColor, validateTransition } = useInvoiceWorkflow()

const invoiceData = ref(null)
const isLoading = ref(true)
const loading = ref(false)
const error = ref('')
const showSettleModal = ref(false)
const paidDate = ref(new Date().toISOString().split('T')[0])
const today = new Date().toISOString().split('T')[0]

const availableActions = computed(() => {
  return invoiceData.value ? getInvoiceActions(invoiceData.value) : []
})

const loadInvoice = async () => {
  try {
    isLoading.value = true
    const response = await getInvoiceById(route.params.id as string)
    const invoice = response.data // Extract data from API response
    
    
    // Convert to format expected by PartnerInvoice component
    invoiceData.value = {
      id: invoice.id,
      status: invoice.status || 'draft',
      invoice_number: invoice.invoice_number || 'Draft Invoice',
      partnerName: invoice.partner_name || 'Unknown Partner',
      period: invoice.period || 'Unknown Period',
      sharePercentage: parseFloat(invoice.share_percentage) || 0,
      summary: {
        total_gross_earnings: parseFloat(invoice.summary?.total_gross_earnings || 0),
        metrobnb_share: parseFloat(invoice.summary?.metrobnb_share || 0),
        total_expenses: parseFloat(invoice.summary?.total_expenses || 0),
        total_received_by_metrobnb: parseFloat(invoice.summary?.total_received_by_metrobnb || 0),
        net_journal_entries: parseFloat(invoice.summary?.net_journal_entries || 0),
        net_due: parseFloat(invoice.summary?.net_due || 0)
      },
      bookings: invoice.bookings?.length ? invoice.bookings.map(booking => ({
        date: booking.date || '',
        endDate: booking.end_date || '',
        guestName: booking.guest_name || 'Unknown Guest',
        unitName: booking.unit_name || 'Unknown Unit',
        source: booking.booking_source_name || 'Unknown Source',
        baseAmount: parseFloat(booking.base_amount) || 0,
        addons: parseFloat(booking.addons_total) || 0,
        total: parseFloat(booking.total_amount) || 0,
        paymentReceivedBy: booking.payment_received_by || 'partner',
        actualAmountReceived: parseFloat(booking.total_amount) || 0,
        bookingStatus: booking.booking_status || 'confirmed'
      })) : [],
      expenses: invoice.expenses?.length ? invoice.expenses.map(expense => ({
        date: expense.date || '',
        unitName: expense.unit_name || 'Unknown Unit',
        type: expense.type || 'other',
        notes: expense.notes || '',
        amount: parseFloat(expense.amount) || 0
      })) : [],
      journalEntries: invoice.journal_entries?.map(entry => ({
        date: entry.date || '',
        type: entry.type || 'debit',
        description: entry.description || '',
        reference: entry.reference || '',
        notes: entry.notes || '',
        amount: parseFloat(entry.amount) || 0
      })) || []
    }
    
  } catch (err) {
    error.value = 'Failed to load invoice details'
    notifyError('Failed to load invoice')
  } finally {
    isLoading.value = false
  }
}

const handleAction = async (action: any) => {
  // Validate action
  const validation = validateTransition(invoiceData.value, action.action)
  if (!validation.valid) {
    notifyError(validation.error || 'Invalid action')
    return
  }
  
  // Show confirmation if required
  if (action.requiresConfirmation) {
    const confirmed = confirm(action.confirmationMessage || `Are you sure you want to ${action.label.toLowerCase()}?`)
    if (!confirmed) return
  }
  
  // Handle special cases
  if (action.action === 'settle') {
    showSettleModal.value = true
    return
  }
  
  // Execute action
  loading.value = true
  try {
    switch (action.action) {
      case 'refresh':
        await refreshInvoice(route.params.id as string)
        notifySuccess('Invoice data refreshed successfully')
        break
      case 'approve':
        await approveInvoice(route.params.id as string)
        notifySuccess('Invoice approved successfully')
        break
      case 'finalize':
        await finalizeInvoice(route.params.id as string)
        notifySuccess('Invoice finalized successfully')
        break
      case 'send':
        await sendInvoiceAPI(route.params.id as string)
        notifySuccess('Invoice marked as sent')
        break
      default:
        notifyError('Unknown action')
        return
    }
    
    await loadInvoice()
  } catch (err: any) {
    const errorMessage = err.message || `Failed to ${action.label.toLowerCase()}`
    notifyError(errorMessage)
  } finally {
    loading.value = false
  }
}

const formatAmount = (amount: number) => {
  return parseFloat(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}



const confirmSettle = async () => {
  loading.value = true
  try {
    await settleInvoice(route.params.id as string, paidDate.value)
    await loadInvoice()
    showSettleModal.value = false
    notifySuccess('Invoice marked as paid successfully')
  } catch (err) {
    notifyError('Failed to mark invoice as paid')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadInvoice()
})
</script>
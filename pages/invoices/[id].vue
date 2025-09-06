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
              {{ getStatusText(invoiceData.status || 'draft', isPartnerUser) }}
            </UBadge>
          </div>
          
          <!-- Workflow Actions -->
          <div class="flex space-x-2">
            <!-- Draft Actions -->
            <template v-if="invoiceData.status === 'draft'">
              <UButton @click="refreshDraft" :loading="loading" variant="outline" size="sm">
                <UIcon name="i-heroicons-arrow-path" class="mr-1" />
                Refresh Data
              </UButton>
              <UButton @click="finalizeDraft" :loading="loading" color="blue" size="sm">
                <UIcon name="i-heroicons-lock-closed" class="mr-1" />
                Finalize
              </UButton>
            </template>
            
            <!-- Finalized Actions -->
            <template v-if="invoiceData.status === 'finalized'">
              <UButton @click="sendInvoice" :loading="loading" color="purple" size="sm">
                <UIcon name="i-heroicons-paper-airplane" class="mr-1" />
                Send Invoice
              </UButton>
            </template>
            
            <!-- Sent Actions -->
            <template v-if="invoiceData.status === 'sent'">
              <UButton @click="showSettleModal = true" :loading="loading" color="green" size="sm">
                <UIcon name="i-heroicons-check-circle" class="mr-1" />
                Mark as Paid
              </UButton>
            </template>
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
              <div class="font-bold text-lg" :class="invoiceData.summary?.net_due > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
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
            <UButton @click="confirmSettle" :loading="loading" color="green">
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
const { getInvoiceById, refreshInvoice, finalizeInvoice, sendInvoice: sendInvoiceAPI, settleInvoice } = useApi()
const { notifyError, notifySuccess } = useNotify()
const { user } = useAuth()

const isPartnerUser = computed(() => user.value?.role === 'partner')

const invoiceData = ref(null)
const isLoading = ref(true)
const loading = ref(false)
const error = ref('')
const showSettleModal = ref(false)
const paidDate = ref(new Date().toISOString().split('T')[0])
const today = new Date().toISOString().split('T')[0]

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

const getStatusColor = (status: string) => {
  const colors = {
    'draft': 'gray',
    'finalized': 'blue', 
    'sent': 'orange',
    'paid': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'gray'
}

const getStatusText = (status: string, isPartnerView = false) => {
  if (isPartnerView) {
    // Partner's perspective - action-oriented
    const partnerStatusMap = {
      'draft': 'Being Prepared',
      'finalized': 'Almost Ready',
      'sent': 'For Your Review',
      'paid': 'All Done ✓',
      'cancelled': 'Cancelled'
    }
    return partnerStatusMap[status] || status
  } else {
    // Admin's perspective
    const adminStatusMap = {
      'draft': 'Draft',
      'finalized': 'Finalized',
      'sent': 'Sent',
      'paid': 'Paid',
      'cancelled': 'Cancelled'
    }
    return adminStatusMap[status] || status
  }
}

const formatAmount = (amount: number) => {
  return parseFloat(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const refreshDraft = async () => {
  loading.value = true
  try {
    await refreshInvoice(route.params.id as string)
    await loadInvoice()
    notifySuccess('Invoice data refreshed successfully')
  } catch (err) {
    notifyError('Failed to refresh invoice')
  } finally {
    loading.value = false
  }
}

const finalizeDraft = async () => {
  const confirmed = confirm('Finalize this invoice? This will lock the invoice and prevent further edits.')
  if (!confirmed) return
  
  loading.value = true
  try {
    await finalizeInvoice(route.params.id as string)
    await loadInvoice()
    notifySuccess('Invoice finalized successfully')
  } catch (err) {
    notifyError('Failed to finalize invoice')
  } finally {
    loading.value = false
  }
}

const sendInvoice = async () => {
  loading.value = true
  try {
    await sendInvoiceAPI(route.params.id as string)
    await loadInvoice()
    notifySuccess('Invoice marked as sent')
  } catch (err) {
    notifyError('Failed to send invoice')
  } finally {
    loading.value = false
  }
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
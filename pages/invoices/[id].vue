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
    <PartnerInvoice :invoice="invoiceData" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getInvoiceById } = useApi()
const { notifyError } = useNotify()

const invoiceData = ref(null)
const isLoading = ref(true)
const error = ref('')

const loadInvoice = async () => {
  try {
    isLoading.value = true
    const invoice = await getInvoiceById(route.params.id as string)
    
    // Convert to format expected by PartnerInvoice component
    invoiceData.value = {
      partnerName: invoice.partner_name,
      period: invoice.period,
      sharePercentage: invoice.share_percentage,
      bookings: invoice.bookings?.map(booking => ({
        date: booking.date,
        endDate: booking.end_date,
        guestName: booking.guest_name,
        unitName: booking.unit_name,
        source: booking.booking_source_name,
        baseAmount: parseFloat(booking.base_amount),
        addons: parseFloat(booking.addons_total),
        total: parseFloat(booking.total_amount),
        paymentReceivedBy: booking.payment_received_by,
        actualAmountReceived: parseFloat(booking.total_amount),
        bookingStatus: booking.booking_status
      })) || [],
      expenses: invoice.expenses?.map(expense => ({
        date: expense.date,
        unitName: expense.unit_name,
        type: expense.type,
        notes: expense.notes,
        amount: parseFloat(expense.amount)
      })) || [],
      journalEntries: invoice.journal_entries?.map(entry => ({
        date: entry.date,
        type: entry.type,
        description: entry.description,
        reference: entry.reference,
        amount: parseFloat(entry.amount)
      })) || []
    }
  } catch (err) {
    error.value = 'Failed to load invoice details'
    notifyError('Failed to load invoice')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadInvoice()
})
</script>
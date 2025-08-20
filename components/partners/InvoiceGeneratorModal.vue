<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Generate Invoice</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect 
              v-model="state.partnerId" 
              :options="partnerOptions" 
              :loading="isLoading"
              placeholder="Select partner"
            />
          </UFormGroup>
          
          <UFormGroup label="Unit" name="unitId">
            <USelect 
              v-model="state.unitId" 
              :options="availableUnits" 
              :disabled="!state.partnerId || isLoading"
              :loading="isLoading"
              placeholder="All units (optional)"
            />
          </UFormGroup>
          
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Year" name="year" required>
              <USelect v-model="state.year" :options="yearOptions" />
            </UFormGroup>
            
            <UFormGroup label="Month" name="month" required>
              <USelect v-model="state.month" :options="monthOptions" />
            </UFormGroup>
          </div>
          
          <UFormGroup label="Custom Date Range" name="useCustomDates">
            <UToggle v-model="state.useCustomDates" />
            <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">
              {{ state.useCustomDates ? 'Using custom date range' : 'Using month/year selection' }}
            </span>
          </UFormGroup>
          
          <div v-if="state.useCustomDates" class="grid grid-cols-2 gap-4">
            <UFormGroup label="Start Date" name="startDate">
              <UInput v-model="state.startDate" type="date" />
            </UFormGroup>
            
            <UFormGroup label="End Date" name="endDate">
              <UInput v-model="state.endDate" type="date" />
            </UFormGroup>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="isGenerating">
            Generate Invoice
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface Props {
  modelValue: boolean
  preselectedPartnerId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const schema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  unitId: z.string().optional(),
  year: z.string().min(1, 'Year is required'),
  month: z.string().min(1, 'Month is required'),
  useCustomDates: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
}).refine((data) => {
  if (data.useCustomDates) {
    return data.startDate && data.endDate && new Date(data.startDate) <= new Date(data.endDate)
  }
  return true
}, {
  message: "End date must be after start date when using custom dates",
  path: ["endDate"]
})

// Get current month and year
const now = new Date()
const currentYear = now.getFullYear().toString()
const currentMonth = (now.getMonth() + 1).toString()

const state = reactive({
  partnerId: '',
  unitId: '',
  year: currentYear,
  month: currentMonth,
  useCustomDates: false,
  startDate: '',
  endDate: ''
})

const isGenerating = ref(false)

const { partners, units, loadPartners, loadUnits, isLoading: dataLoading } = useDataManager()
const { generateInvoice } = useApi()

const bookingSources = ref([])

const isLoading = computed(() => dataLoading.partners || dataLoading.units)

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partnerId || !Array.isArray(units.value)) return []
  return units.value
    .filter(unit => unit && unit.partner_id === state.partnerId)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push({ label: i.toString(), value: i.toString() })
  }
  
  return years.reverse()
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
  
  return months
})

watch(() => state.partnerId, () => {
  state.unitId = ''
})

// Load data when modal opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    await Promise.all([
      loadPartners(),
      loadUnits()
    ])
  }
}, { immediate: true })

watch(() => props.preselectedPartnerId, (partnerId) => {
  if (partnerId) {
    state.partnerId = partnerId
  }
}, { immediate: true })

const onSubmit = async () => {
  try {
    isGenerating.value = true
    
    // Determine date range based on toggle
    let startDate, endDate
    if (state.useCustomDates) {
      startDate = state.startDate
      endDate = state.endDate
    } else {
      // Use year/month to create date range
      const year = parseInt(state.year)
      const month = parseInt(state.month)
      
      // Format dates manually to avoid timezone issues
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
    }
    
    // Single API call - backend handles everything
    const invoice = await generateInvoice(state.partnerId, startDate, endDate)
    
    // Convert backend response to frontend format for compatibility
    const invoiceData = {
      partnerName: invoice.partner_name,
      period: invoice.period,
      sharePercentage: invoice.share_percentage,
      bookings: invoice.bookings.map(booking => ({
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
      })),
      expenses: invoice.expenses.map(expense => ({
        date: expense.date,
        unitName: expense.unit_name,
        type: expense.type,
        notes: expense.notes,
        amount: parseFloat(expense.amount)
      })),
      journalEntries: invoice.journal_entries.map(entry => ({
        date: entry.date,
        type: entry.type,
        description: entry.description,
        reference: entry.reference,
        amount: parseFloat(entry.amount)
      }))
    }
    
    await navigateTo(`/invoices/${invoice.id}`)
    isOpen.value = false
    
  } catch (error) {
    const { notifyError } = useNotify()
    notifyError('Failed to generate invoice')
  } finally {
    isGenerating.value = false
  }
}
</script>
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
const { getBookings, getExpenses, getBookingSources, getJournalEntries } = useApi()

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
    const [, , sources] = await Promise.all([
      loadPartners(),
      loadUnits(),
      getBookingSources()
    ])
    bookingSources.value = sources
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
    
    const partner = partners.value.find(p => p.id === state.partnerId)
    if (!partner) throw new Error('Partner not found')
    
    // Determine date range based on toggle
    let startDate, endDate
    if (state.useCustomDates) {
      startDate = state.startDate
      endDate = state.endDate
    } else {
      // Use year/month to create date range
      const year = parseInt(state.year)
      const month = parseInt(state.month)
      
      // Create dates in local timezone to avoid timezone shifts
      const firstDay = new Date(year, month - 1, 1)     // First day of selected month
      const lastDay = new Date(year, month, 0)          // Last day of selected month
      
      // Format dates manually to avoid timezone issues
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
    }
    
    // Build query parameters for API filtering
    const bookingFilters = {
      partner_id: state.partnerId,
      ...(state.unitId && { unit_id: state.unitId }),
      start_date: startDate,
      end_date: endDate,
      // Include all booking statuses for transparency
      invoiced: false, // Only uninvoiced bookings for invoices
      limit: 100 // API maximum
    }
    
    const expenseFilters = {
      partner_id: state.partnerId,
      ...(state.unitId && { unit_id: state.unitId }),
      start_date: startDate,
      end_date: endDate,
      billable: true, // Only billable expenses for invoices
      paid: false, // Only unpaid expenses for invoices
      limit: 100 // API maximum
    }
    
    // Fetch all pages of data
    const fetchAllBookings = async () => {
      let allBookings = []
      let page = 1
      let hasMore = true
      
      while (hasMore) {
        const response = await getBookings({ ...bookingFilters, page })
        const data = Array.isArray(response) ? response : response.data
        const pagination = response.pagination
        
        allBookings = [...allBookings, ...data]
        hasMore = pagination?.has_next || false
        page++
      }
      
      return allBookings
    }
    
    const fetchAllExpenses = async () => {
      let allExpenses = []
      let page = 1
      let hasMore = true
      
      while (hasMore) {
        const response = await getExpenses({ ...expenseFilters, page })
        const data = Array.isArray(response) ? response : response.data
        const pagination = response.pagination
        
        allExpenses = [...allExpenses, ...data]
        hasMore = pagination?.has_next || false
        page++
      }
      
      return allExpenses
    }
    
    // Fetch journal entries
    const journalEntriesResponse = await getJournalEntries({
      partner_id: state.partnerId,
      start_date: startDate,
      end_date: endDate
    })
    
    const journalEntries = journalEntriesResponse?.data || []
    
    const [bookings, expenses] = await Promise.all([
      fetchAllBookings(),
      fetchAllExpenses()
    ])
    
    // Debug logging
    console.log('Invoice Generation Debug (Check-out Date Filtering):', {
      partnerId: state.partnerId,
      unitId: state.unitId,
      invoicePeriod: `${startDate} to ${endDate}`,
      useCustomDates: state.useCustomDates,
      yearMonth: state.useCustomDates ? null : `${state.year}-${state.month}`,
      bookingsFound: bookings.length,
      expensesFound: expenses.length,
      journalEntriesFound: journalEntries.length,
      filteringBy: 'endDate (check-out)',
      sampleBooking: bookings[0] || null,
      sampleJournalEntry: journalEntries[0] || null,
      bookingFilters,
      expenseFilters
    })
    
    const startMonth = new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const endMonth = new Date(endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const period = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
    
    const invoiceData = {
      partnerName: partner.name,
      period,
      sharePercentage: partner.share_percentage || 20,
      bookings: bookings.filter(booking => {
        // Filter by check-out date (Airbnb approach)
        const checkOutDate = new Date(booking.end_date)
        const invoiceStartDate = new Date(startDate)
        const invoiceEndDate = new Date(endDate)
        return checkOutDate >= invoiceStartDate && checkOutDate <= invoiceEndDate
      }).map(booking => {
        // Handle both string and number formats for amounts
        const baseAmount = typeof booking.base_amount === 'string' 
          ? parseFloat(booking.base_amount) 
          : (booking.base_amount || 0)
        
        const addonsTotal = Array.isArray(booking.addons) 
          ? booking.addons.reduce((sum, addon) => sum + (addon.amount || 0), 0)
          : 0
        
        const amountPaid = typeof booking.amount_paid === 'string'
          ? parseFloat(booking.amount_paid)
          : (booking.amount_paid || 0)
        
        return {
          date: booking.start_date,
          endDate: booking.end_date,
          guestName: booking.guest_name,
          unitName: units.value.find(u => u.id === booking.unit_id)?.name || 'Unknown Unit',
          source: booking.booking_source?.name || bookingSources.value.find(s => s.id === booking.booking_source_id)?.name || 'Direct',
          baseAmount,
          addons: addonsTotal,
          total: baseAmount + addonsTotal,
          paymentReceivedBy: booking.payment_received_by,
          actualAmountReceived: amountPaid,
          bookingStatus: booking.booking_status || 'confirmed'
        }
      }),
      expenses: expenses.filter(expense => {
        // Additional client-side date validation
        const expenseDate = new Date(expense.date)
        const invoiceStartDate = new Date(startDate)
        const invoiceEndDate = new Date(endDate)
        return expenseDate >= invoiceStartDate && expenseDate <= invoiceEndDate
      }).map(expense => {
        const amount = typeof expense.amount === 'string'
          ? parseFloat(expense.amount)
          : (expense.amount || 0)
        
        return {
          date: expense.date,
          unitName: units.value.find(u => u.id === expense.unit_id)?.name || 'Unknown Unit',
          type: expense.type,
          notes: expense.notes || '',
          amount
        }
      }),
      journalEntries: journalEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        const invoiceStartDate = new Date(startDate)
        const invoiceEndDate = new Date(endDate)
        return entryDate >= invoiceStartDate && entryDate <= invoiceEndDate
      }).map(entry => {
        const amount = typeof entry.amount === 'string'
          ? parseFloat(entry.amount)
          : (entry.amount || 0)
        
        return {
          date: entry.date,
          type: entry.type,
          description: entry.description,
          reference: entry.reference,
          notes: entry.notes,
          amount
        }
      })
    }
    

    
    console.log('Final invoice data:', {
      journalEntriesCount: invoiceData.journalEntries.length,
      journalEntries: invoiceData.journalEntries
    })
    
    localStorage.setItem('current-invoice', JSON.stringify(invoiceData))
    await navigateTo('/invoice')
    isOpen.value = false
    
  } catch (error) {
    const { notifyError } = useNotify()
    notifyError('Failed to generate invoice')
  } finally {
    isGenerating.value = false
  }
}
</script>
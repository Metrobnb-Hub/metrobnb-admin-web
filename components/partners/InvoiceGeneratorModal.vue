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
            <UFormGroup label="Start Date" name="startDate" required>
              <UInput v-model="state.startDate" type="date" />
            </UFormGroup>
            
            <UFormGroup label="End Date" name="endDate" required>
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
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required')
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"]
})

const state = reactive({
  partnerId: '',
  unitId: '',
  startDate: '',
  endDate: ''
})

const isGenerating = ref(false)

const { partners, units, loadPartners, loadUnits, isLoading: dataLoading } = useDataManager()
const { getBookings, getExpenses } = useApi()

const isLoading = computed(() => dataLoading.partners || dataLoading.units)

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partnerId || !Array.isArray(units.value)) return []
  return units.value
    .filter(unit => unit && (unit.partnerId || unit.partner_id) === state.partnerId)
    .map(unit => ({ label: unit.name, value: unit.id }))
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
    
    const partner = partners.value.find(p => p.id === state.partnerId)
    if (!partner) throw new Error('Partner not found')
    
    const filters = {
      partner_id: state.partnerId,
      unit_id: state.unitId || undefined
    }
    
    const bookingsResponse = await getBookings(filters)
    const expensesResponse = await getExpenses(filters)
    
    // Extract data from API response wrapper
    const allBookings = Array.isArray(bookingsResponse) ? bookingsResponse : 
                       (bookingsResponse?.data?.items || bookingsResponse?.data || [])
    const allExpenses = Array.isArray(expensesResponse) ? expensesResponse : 
                       (expensesResponse?.data?.items || expensesResponse?.data || [])
    

    
    const bookings = allBookings.filter(booking => {
      // Filter by partner
      const matchesPartner = booking.partnerId === state.partnerId
      
      // Filter by unit (if specified)
      const matchesUnit = !state.unitId || booking.unitId === state.unitId
      
      // Filter by date range
      const bookingDate = new Date(booking.startDate)
      const startDate = new Date(state.startDate)
      const endDate = new Date(state.endDate)
      const matchesDate = bookingDate >= startDate && bookingDate <= endDate
      

      
      return matchesPartner && matchesUnit && matchesDate
    })
    
    const expenses = allExpenses.filter(expense => {
      // Filter by partner
      const matchesPartner = expense.partnerId === state.partnerId
      
      // Filter by unit (if specified)
      const matchesUnit = !state.unitId || expense.unitId === state.unitId
      
      // Filter by date range
      const expenseDate = new Date(expense.date)
      const startDate = new Date(state.startDate)
      const endDate = new Date(state.endDate)
      const matchesDate = expenseDate >= startDate && expenseDate <= endDate
      
      // Only include billable expenses
      const isBillable = expense.billable === true
      

      
      return matchesPartner && matchesUnit && matchesDate && isBillable
    })
    
    const startMonth = new Date(state.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const endMonth = new Date(state.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const period = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
    
    const invoiceData = {
      partnerName: partner.name,
      period,
      sharePercentage: partner.sharePercentage || partner.share_percentage || 20,
      bookings: bookings.map(booking => {
        const baseAmount = parseFloat(booking.baseAmount)
        const addonsTotal = Array.isArray(booking.addons) 
          ? booking.addons.reduce((sum, addon) => sum + addon.amount, 0)
          : 0
        
        return {
          date: booking.startDate,
          guestName: booking.guestName,
          unitName: units.value.find(u => u.id === booking.unitId)?.name || 'Unknown Unit',
          source: 'Direct',
          baseAmount,
          addons: addonsTotal,
          total: baseAmount + addonsTotal,
          paymentReceivedBy: booking.paymentReceivedBy,
          actualAmountReceived: parseFloat(booking.amountPaid)
        }
      }),
      expenses: expenses.map(expense => ({
        date: expense.date,
        unitName: units.value.find(u => u.id === expense.unitId)?.name || 'Unknown Unit',
        type: expense.type,
        notes: expense.notes || '',
        amount: parseFloat(expense.amount)
      }))
    }
    

    
    localStorage.setItem('current-invoice', JSON.stringify(invoiceData))
    await navigateTo('/invoice')
    isOpen.value = false
    
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to generate invoice',
      color: 'red'
    })
  } finally {
    isGenerating.value = false
  }
}
</script>
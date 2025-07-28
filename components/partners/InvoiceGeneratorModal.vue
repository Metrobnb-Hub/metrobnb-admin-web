<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Generate Invoice</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect v-model="state.partnerId" :options="partnerOptions" />
          </UFormGroup>
          
          <UFormGroup label="Unit" name="unitId">
            <USelect 
              v-model="state.unitId" 
              :options="availableUnits" 
              :disabled="!state.partnerId"
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

const { partners } = usePartnerStore()
const { units } = useUnitStore()
const { getBookings, getExpenses } = useMockApi()

const partnerOptions = computed(() => 
  partners.map(p => ({ label: p.name, value: p.id }))
)

const availableUnits = computed(() => {
  if (!state.partnerId) return []
  return units
    .filter(unit => unit.partnerId === state.partnerId)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

watch(() => state.partnerId, () => {
  state.unitId = ''
})

watch(() => props.preselectedPartnerId, (partnerId) => {
  if (partnerId) {
    state.partnerId = partnerId
  }
}, { immediate: true })

const onSubmit = async () => {
  try {
    isGenerating.value = true
    
    const partner = partners.find(p => p.id === state.partnerId)
    if (!partner) throw new Error('Partner not found')
    
    const filters = {
      partnerId: state.partnerId,
      unitId: state.unitId || undefined
    }
    
    const allBookings = await getBookings(filters)
    const allExpenses = await getExpenses(filters)
    
    const bookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      return bookingDate >= new Date(state.startDate) && bookingDate <= new Date(state.endDate)
    })
    
    const expenses = allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= new Date(state.startDate) && expenseDate <= new Date(state.endDate)
    })
    
    const startMonth = new Date(state.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const endMonth = new Date(state.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const period = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
    
    const invoiceData = {
      partnerName: partner.name,
      period,
      sharePercentage: partner.sharePercentage,
      bookings: bookings.map(booking => ({
        date: booking.date,
        guestName: booking.guestName,
        unitName: units.find(u => u.id === booking.unitId)?.name || 'Unknown Unit',
        source: 'Direct',
        baseAmount: booking.baseAmount,
        addons: booking.addons.reduce((sum, addon) => sum + addon.amount, 0),
        total: booking.baseAmount + booking.addons.reduce((sum, addon) => sum + addon.amount, 0),
        paymentReceivedBy: 'metrobnb' as const,
        actualAmountReceived: booking.amountPaid
      })),
      expenses: expenses.map(expense => ({
        date: expense.date,
        unitName: units.find(u => u.id === expense.unitId)?.name || 'Unknown Unit',
        type: expense.type,
        notes: expense.notes,
        amount: expense.amount
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
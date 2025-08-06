<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-full max-w-2xl' }">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Quick Invoice Generator (Mock Data)</h3>
      </template>
      
      <UForm :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect v-model="state.partnerId" :options="mockPartnerOptions" />
          </UFormGroup>
          
          <UFormGroup label="Unit" name="unitId">
            <USelect 
              v-model="state.unitId" 
              :options="availableMockUnits" 
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
            Generate Mock Invoice
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
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

const state = reactive({
  partnerId: '',
  unitId: '',
  startDate: '2024-12-01',
  endDate: '2024-12-31'
})

const isGenerating = ref(false)

// Mock data
const mockPartners = [
  { id: 'partner-1', name: 'Casa Aurea Properties', sharePercentage: 15 },
  { id: 'partner-2', name: 'Azure Bahamas Resort', sharePercentage: 20 },
  { id: 'partner-3', name: 'Metro Condos Inc', sharePercentage: 35 }
]

const mockUnits = [
  { id: 'unit-1', name: 'Casa Aurea – Azure Bahamas 945', partnerId: 'partner-1' },
  { id: 'unit-2', name: 'Azure Resort Villa 12', partnerId: 'partner-2' },
  { id: 'unit-3', name: 'Metro Tower Unit 2501', partnerId: 'partner-3' },
  { id: 'unit-4', name: 'Metro Tower Unit 1205', partnerId: 'partner-3' }
]

const mockBookings = [
  {
    id: 'booking-1',
    guestName: 'John Smith',
    date: '2024-12-15',
    baseAmount: 5000,
    addons: [{ type: 'early_checkin', amount: 300 }],
    unitId: 'unit-1',
    partnerId: 'partner-1',
    paymentReceivedBy: 'metrobnb',
    amountPaid: 5300
  },
  {
    id: 'booking-2',
    guestName: 'Maria Garcia',
    date: '2024-12-18',
    baseAmount: 6000,
    addons: [{ type: 'late_checkout', amount: 300 }],
    unitId: 'unit-2',
    partnerId: 'partner-2',
    paymentReceivedBy: 'partner',
    amountPaid: 6300
  },
  {
    id: 'booking-3',
    guestName: 'Robert Wilson',
    date: '2024-12-22',
    baseAmount: 4500,
    addons: [{ type: 'parking', amount: 200 }],
    unitId: 'unit-1',
    partnerId: 'partner-1',
    paymentReceivedBy: 'partner',
    amountPaid: 4700
  },
  {
    id: 'booking-4',
    guestName: 'Jennifer Lee',
    date: '2024-12-25',
    baseAmount: 4500,
    addons: [{ type: 'late_checkout', amount: 300 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'metrobnb',
    amountPaid: 4800
  },
  {
    id: 'booking-5',
    guestName: 'Michael Chen',
    date: '2024-12-08',
    baseAmount: 3200,
    addons: [{ type: 'early_checkin', amount: 300 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'partner',
    amountPaid: 3500
  },
  {
    id: 'booking-6',
    guestName: 'Sarah Martinez',
    date: '2024-12-12',
    baseAmount: 2800,
    addons: [],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'partner',
    amountPaid: 2800
  },
  {
    id: 'booking-7',
    guestName: 'David Kim',
    date: '2024-12-28',
    baseAmount: 3000,
    addons: [{ type: 'parking', amount: 200 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'metrobnb',
    amountPaid: 3200
  },
  {
    id: 'booking-8',
    guestName: 'Lisa Wang',
    date: '2024-12-05',
    baseAmount: 5500,
    addons: [{ type: 'early_checkin', amount: 300 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'partner',
    amountPaid: 5800
  },
  {
    id: 'booking-9',
    guestName: 'Carlos Rodriguez',
    date: '2024-12-15',
    baseAmount: 4200,
    addons: [{ type: 'late_checkout', amount: 300 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'metrobnb',
    amountPaid: 4500
  },
  {
    id: 'booking-10',
    guestName: 'Emma Thompson',
    date: '2024-12-20',
    baseAmount: 6800,
    addons: [],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'partner',
    amountPaid: 6800
  },
  {
    id: 'booking-11',
    guestName: 'Ahmed Hassan',
    date: '2024-12-03',
    baseAmount: 2300,
    addons: [{ type: 'parking', amount: 200 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'metrobnb',
    amountPaid: 2500
  },
  {
    id: 'booking-12',
    guestName: 'Sophie Miller',
    date: '2024-12-30',
    baseAmount: 7200,
    addons: [{ type: 'early_checkin', amount: 300 }, { type: 'parking', amount: 200 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentReceivedBy: 'partner',
    amountPaid: 7700
  }
]

const mockExpenses = [
  {
    id: 'expense-1',
    partnerId: 'partner-1',
    unitId: 'unit-1',
    date: '2024-12-10',
    type: 'cleaning',
    amount: 800,
    notes: 'Deep cleaning after checkout'
  },
  {
    id: 'expense-2',
    partnerId: 'partner-2',
    unitId: 'unit-2',
    date: '2024-12-12',
    type: 'utilities',
    amount: 1200,
    notes: 'Electricity and water bill'
  },
  {
    id: 'expense-3',
    partnerId: 'partner-1',
    unitId: 'unit-1',
    date: '2024-12-20',
    type: 'repair',
    amount: 1500,
    notes: 'Fixed air conditioning'
  },
  {
    id: 'expense-4',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-12-05',
    type: 'repair',
    amount: 2500,
    notes: 'Fixed plumbing leak in bathroom'
  },
  {
    id: 'expense-5',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-12-11',
    type: 'repair',
    amount: 1800,
    notes: 'Replaced broken air conditioning unit'
  },
  {
    id: 'expense-6',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-12-18',
    type: 'repair',
    amount: 950,
    notes: 'Fixed electrical outlet and lighting'
  },
  {
    id: 'expense-7',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-12-03',
    type: 'utilities',
    amount: 1200,
    notes: 'WiFi upgrade and monthly internet bill'
  }
]

const mockPartnerOptions = computed(() => 
  mockPartners.map(p => ({ label: p.name, value: p.id }))
)

const availableMockUnits = computed(() => {
  if (!state.partnerId) return []
  return mockUnits
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
    
    const partner = mockPartners.find(p => p.id === state.partnerId)
    if (!partner) throw new Error('Partner not found')
    
    console.log('Form state:', state)
    console.log('Selected partner:', partner)
    
    // Filter mock data by date range and partner
    const filteredBookings = mockBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      const startDate = new Date(state.startDate)
      const endDate = new Date(state.endDate)
      const matchesPartner = booking.partnerId === state.partnerId
      const matchesUnit = !state.unitId || booking.unitId === state.unitId
      const inDateRange = bookingDate >= startDate && bookingDate <= endDate
      
      console.log('Booking filter:', {
        booking: booking.guestName,
        bookingDate: booking.date,
        partnerId: booking.partnerId,
        selectedPartnerId: state.partnerId,
        matchesPartner,
        matchesUnit,
        inDateRange
      })
      
      return matchesPartner && matchesUnit && inDateRange
    })
    
    const filteredExpenses = mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      const startDate = new Date(state.startDate)
      const endDate = new Date(state.endDate)
      const matchesPartner = expense.partnerId === state.partnerId
      const matchesUnit = !state.unitId || expense.unitId === state.unitId
      const inDateRange = expenseDate >= startDate && expenseDate <= endDate
      
      console.log('Expense filter:', {
        expense: expense.type,
        expenseDate: expense.date,
        partnerId: expense.partnerId,
        selectedPartnerId: state.partnerId,
        matchesPartner,
        matchesUnit,
        inDateRange
      })
      
      return matchesPartner && matchesUnit && inDateRange
    })
    
    console.log('Filtered results:', { filteredBookings, filteredExpenses })
    
    const startMonth = new Date(state.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const endMonth = new Date(state.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const period = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
    
    const invoiceData = {
      partnerName: partner.name,
      period,
      sharePercentage: partner.sharePercentage,
      bookings: filteredBookings.map(booking => ({
        date: booking.date,
        guestName: booking.guestName,
        unitName: mockUnits.find(u => u.id === booking.unitId)?.name || 'Unknown Unit',
        source: 'Mock Data',
        baseAmount: booking.baseAmount,
        addons: booking.addons.reduce((sum, addon) => sum + addon.amount, 0),
        total: booking.baseAmount + booking.addons.reduce((sum, addon) => sum + addon.amount, 0),
        paymentReceivedBy: booking.paymentReceivedBy as 'metrobnb' | 'partner',
        actualAmountReceived: booking.amountPaid
      })),
      expenses: filteredExpenses.map(expense => ({
        date: expense.date,
        unitName: mockUnits.find(u => u.id === expense.unitId)?.name || 'Unknown Unit',
        type: expense.type,
        notes: expense.notes,
        amount: expense.amount
      }))
    }
    
    localStorage.setItem('current-invoice', JSON.stringify(invoiceData))
    await navigateTo('/invoice-demo')
    isOpen.value = false
    
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to generate mock invoice',
      color: 'red'
    })
  } finally {
    isGenerating.value = false
  }
}
</script>
<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mock API Demo</h1>
      <p class="text-gray-600 dark:text-gray-400">Testing mock data and API functions</p>
    </div>

    <!-- Filters -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Filters</h3>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="Partner">
          <USelect 
            v-model="selectedPartnerId" 
            :options="partnerOptions" 
            placeholder="All Partners"
            @change="loadData"
          />
        </UFormGroup>
        
        <UFormGroup label="Unit">
          <USelect 
            v-model="selectedUnitId" 
            :options="unitOptions" 
            placeholder="All Units"
            :disabled="!selectedPartnerId"
            @change="loadData"
          />
        </UFormGroup>
        
        <UFormGroup label="Month">
          <UInput 
            v-model="selectedMonth" 
            type="month" 
            @input="loadData"
          />
        </UFormGroup>
      </div>
    </UCard>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">₱{{ totalRevenue.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">₱{{ totalExpenses.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Bookings</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ bookings.length }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <UIcon name="i-heroicons-chart-bar" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">₱{{ (totalRevenue - totalExpenses).toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Data Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bookings -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Bookings ({{ bookings.length }})</h3>
        </template>
        
        <div class="space-y-3">
          <div 
            v-for="booking in bookings" 
            :key="booking.id"
            class="p-3 border rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{ booking.guestName }}</p>
                <p class="text-sm text-gray-500">{{ getUnitName(booking.unitId) }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(booking.date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">₱{{ getBookingTotal(booking).toFixed(2) }}</p>
                <span 
                  class="inline-flex px-2 py-1 text-xs rounded-full"
                  :class="getPaymentStatusClass(booking.paymentStatus)"
                >
                  {{ booking.paymentStatus.replace('_', ' ') }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="!bookings.length" class="text-center py-4 text-gray-500">
            No bookings found
          </div>
        </div>
      </UCard>

      <!-- Expenses -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Expenses ({{ expenses.length }})</h3>
        </template>
        
        <div class="space-y-3">
          <div 
            v-for="expense in expenses" 
            :key="expense.id"
            class="p-3 border rounded-lg"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">{{ getExpenseTypeLabel(expense.type) }}</p>
                <p class="text-sm text-gray-500">{{ getUnitName(expense.unitId) }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(expense.date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-red-600">₱{{ expense.amount.toFixed(2) }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="!expenses.length" class="text-center py-4 text-gray-500">
            No expenses found
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Partner, Unit, Booking, Expense } from '~/types/api'

const { 
  getPartners, 
  getUnits, 
  getUnitsByPartner, 
  getBookings, 
  getExpenses, 
  getBookingTotal 
} = useMockApi()

const partners = ref<Partner[]>([])
const units = ref<Unit[]>([])
const bookings = ref<Booking[]>([])
const expenses = ref<Expense[]>([])

const selectedPartnerId = ref('')
const selectedUnitId = ref('')
const selectedMonth = ref('')

const partnerOptions = computed(() => [
  { label: 'All Partners', value: '' },
  ...partners.value.map(p => ({ label: p.name, value: p.id }))
])

const unitOptions = computed(() => {
  if (!selectedPartnerId.value) return []
  const partnerUnits = units.value.filter(u => u.partnerId === selectedPartnerId.value)
  return [
    { label: 'All Units', value: '' },
    ...partnerUnits.map(u => ({ label: u.name, value: u.id }))
  ]
})

const totalRevenue = computed(() => 
  bookings.value
    .filter(b => b.bookingStatus !== 'refunded')
    .reduce((sum, booking) => sum + getBookingTotal(booking), 0)
)

const totalExpenses = computed(() => 
  expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
)

const getUnitName = (unitId: string) => {
  return units.value.find(u => u.id === unitId)?.name || 'Unknown Unit'
}

const getExpenseTypeLabel = (type: string) => {
  const labels = {
    cleaning: 'Cleaning',
    laundry: 'Laundry',
    utilities: 'Utilities',
    repair: 'Repair',
    misc: 'Miscellaneous'
  }
  return labels[type as keyof typeof labels] || type
}

const getPaymentStatusClass = (status: string) => {
  const classes = {
    unpaid: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    fully_paid: 'bg-green-100 text-green-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const loadData = async () => {
  const filters = {
    partnerId: selectedPartnerId.value || undefined,
    unitId: selectedUnitId.value || undefined,
    month: selectedMonth.value || undefined
  }
  
  bookings.value = await getBookings(filters)
  expenses.value = await getExpenses(filters)
}

watch(() => selectedPartnerId.value, async () => {
  selectedUnitId.value = ''
  if (selectedPartnerId.value) {
    units.value = await getUnitsByPartner(selectedPartnerId.value)
  } else {
    units.value = await getUnits()
  }
})

onMounted(async () => {
  partners.value = await getPartners()
  units.value = await getUnits()
  await loadData()
})
</script>
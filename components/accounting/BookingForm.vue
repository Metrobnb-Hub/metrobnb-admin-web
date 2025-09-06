<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <div class="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
      <UFormGroup label="Guest Name" name="guestName">
        <UInput v-model="state.guestName" />
      </UFormGroup>
      
      <UFormGroup label="Booking Date" name="bookingDate">
        <UInput v-model="state.bookingDate" type="date" />
      </UFormGroup>
      
      <UFormGroup label="Check-in Date" name="startDate">
        <UInput v-model="state.startDate" type="date" />
      </UFormGroup>
      
      <UFormGroup label="Check-out Date" name="endDate">
        <UInput v-model="state.endDate" type="date" />
      </UFormGroup>
      
      <UFormGroup label="Base Amount" name="amount">
        <UInput v-model="state.amount" type="number" step="0.01" />
      </UFormGroup>
      
      <UFormGroup label="Payment Method" name="paymentMethod">
        <USelect v-model="state.paymentMethod" :options="paymentMethodOptions" />
      </UFormGroup>
      
      <UFormGroup label="Partner" name="partner">
        <USelect v-model="state.partner" :options="partnerOptions" />
      </UFormGroup>
      
      <UFormGroup label="Unit" name="unitId">
        <USelect 
          v-model="state.unitId" 
          :options="availableUnits" 
          :disabled="!state.partner"
          placeholder="Select a partner first"
        />
      </UFormGroup>
      
      <UFormGroup label="Booking Status" name="bookingStatus">
        <USelect v-model="state.bookingStatus" :options="bookingStatusOptions" />
      </UFormGroup>
      
      <UFormGroup label="Payment Status" name="paymentStatus">
        <USelect v-model="state.paymentStatus" :options="paymentStatusOptions" />
      </UFormGroup>
      
      <UFormGroup label="Amount Paid" name="amountPaid">
        <UInput v-model="state.amountPaid" type="number" step="0.01" />
      </UFormGroup>
      
      <UFormGroup label="Payment Received By" name="paymentReceivedBy">
        <UToggle 
          v-model="isMetroBNBPayment" 
          :ui="{ active: 'bg-blue-500 dark:bg-blue-400' }"
        />
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
          {{ isMetroBNBPayment ? 'MetroBNB' : 'Partner' }}
        </span>
      </UFormGroup>
      
      <UFormGroup label="Booking Source" name="bookingSourceId">
        <USelect v-model="state.bookingSourceId" :options="bookingSourceOptions" />
      </UFormGroup>
      
      <UFormGroup label="Notes" name="notes" class="sm:col-span-2">
        <UTextarea 
          v-model="state.notes" 
          placeholder="Additional notes (max 100 characters)" 
          :maxlength="100"
          :rows="2"
        />
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ state.notes.length }}/100 characters
        </div>
      </UFormGroup>
    </div>
    
    <!-- Add-ons Section -->
    <div class="mt-6">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Add-ons</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div 
          v-for="addon in availableAddons" 
          :key="addon.type"
          class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <UCheckbox 
            :model-value="isAddonSelected(addon.type)"
            @update:model-value="toggleAddon(addon)"
          />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ addon.label }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">₱{{ addon.amount }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Total Display -->
    <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">Base Amount:</span>
        <span class="text-sm">₱{{ Number(state.amount || 0).toFixed(2) }}</span>
      </div>
      <div v-if="selectedAddonsTotal > 0" class="flex justify-between items-center mt-1">
        <span class="text-sm text-gray-600 dark:text-gray-400">Add-ons:</span>
        <span class="text-sm">₱{{ selectedAddonsTotal.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between items-center mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
        <span class="font-medium text-gray-900 dark:text-white">Total Amount:</span>
        <span class="font-bold text-lg text-blue-600 dark:text-blue-400">₱{{ totalAmount.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between items-center mt-1">
        <span class="text-sm text-gray-600 dark:text-gray-400">Amount Paid:</span>
        <span class="text-sm">₱{{ Number(state.amountPaid || 0).toFixed(2) }}</span>
      </div>
      <div class="flex justify-between items-center mt-1 pt-1 border-t border-blue-200 dark:border-blue-800">
        <span class="font-medium text-gray-900 dark:text-white">Remaining Balance:</span>
        <span class="font-bold" :class="remainingBalance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
          ₱{{ remainingBalance.toFixed(2) }}
        </span>
      </div>
    </div>
    
    <div class="flex justify-end mt-6">
      <UButton type="submit" color="primary">Save Booking</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface AddOnConfig {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  label: string
  amount: number
}

const availableAddons: AddOnConfig[] = [
  { type: 'early_checkin', label: 'Early Check-In', amount: 300 },
  { type: 'late_checkout', label: 'Late Check-Out', amount: 300 },
  { type: 'parking', label: 'Parking Fee', amount: 200 }
]

const bookingStatusOptions = [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Refunded', value: 'refunded' }
]

const paymentStatusOptions = [
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Partial', value: 'partial' },
  { label: 'Fully Paid', value: 'fully_paid' }
]

const schema = z.object({
  guestName: z.string().min(1, 'Guest name is required'),
  bookingDate: z.string().min(1, 'Booking date is required'),
  startDate: z.string().min(1, 'Check-in date is required'),
  endDate: z.string().min(1, 'Check-out date is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  partner: z.string().min(1, 'Partner is required'),
  unitId: z.string().min(1, 'Unit is required'),
  bookingStatus: z.string().min(1, 'Booking status is required'),
  paymentStatus: z.string().min(1, 'Payment status is required'),
  amountPaid: z.coerce.number().min(0, 'Amount paid must be 0 or greater'),
  paymentReceivedBy: z.enum(['partner', 'metrobnb']),
  bookingSourceId: z.string().min(1, 'Booking source is required'),
  notes: z.string().max(100, 'Notes must be 100 characters or less').optional()
})

const state = reactive({
  guestName: '',
  bookingDate: '',
  startDate: '',
  endDate: '',
  amount: 0,
  paymentMethod: '',
  partner: '',
  unitId: '',
  addons: [] as { type: string; amount: number }[],
  bookingStatus: 'confirmed',
  paymentStatus: 'unpaid',
  amountPaid: 0,
  paymentReceivedBy: 'partner' as 'partner' | 'metrobnb',
  bookingSourceId: '',
  notes: ''
})

const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { getBookingSources, getPaymentMethods } = useApi()

const bookingSources = ref([])
const paymentMethods = ref([])

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value) || partners.value.length === 0) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partner || !Array.isArray(units.value) || units.value.length === 0) return []
  return units.value
    .filter(unit => unit && (unit.partnerId || unit.partner_id) === state.partner)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

const paymentMethodOptions = computed(() => {
  if (!Array.isArray(paymentMethods.value)) return []
  return paymentMethods.value
    .filter(method => method.is_active)
    .map(method => ({ label: method.name, value: method.id }))
})

const bookingSourceOptions = computed(() => {
  if (!Array.isArray(bookingSources.value)) return []
  return bookingSources.value
    .filter(source => source.is_active)
    .map(source => ({
      label: `${source.name}${source.commission_rate ? ` (${source.commission_rate}%)` : ''}`,
      value: source.id
    }))
})

const emit = defineEmits<{
  submit: [booking: typeof state]
}>()

const isAddonSelected = (type: string) => {
  return state.addons.some(addon => addon.type === type)
}

const toggleAddon = (addonConfig: AddOnConfig) => {
  const index = state.addons.findIndex(addon => addon.type === addonConfig.type)
  if (index >= 0) {
    state.addons.splice(index, 1)
  } else {
    state.addons.push({ type: addonConfig.type, amount: addonConfig.amount })
  }
}

const selectedAddonsTotal = computed(() => 
  state.addons.reduce((sum, addon) => sum + addon.amount, 0)
)

const totalAmount = computed(() => 
  Number(state.amount || 0) + selectedAddonsTotal.value
)

const remainingBalance = computed(() => 
  totalAmount.value - Number(state.amountPaid || 0)
)

const isMetroBNBPayment = computed({
  get: () => state.paymentReceivedBy === 'metrobnb',
  set: (value) => {
    state.paymentReceivedBy = value ? 'metrobnb' : 'partner'
  }
})

// Reset unit selection when partner changes
watch(() => state.partner, () => {
  state.unitId = ''
})

const onSubmit = () => {
  emit('submit', { ...state })
  Object.assign(state, { 
    guestName: '', 
    bookingDate: '', 
    startDate: '', 
    endDate: '', 
    amount: 0, 
    paymentMethod: '', 
    partner: '',
    unitId: '',
    addons: [],
    bookingStatus: 'confirmed',
    paymentStatus: 'unpaid',
    amountPaid: 0,
    paymentReceivedBy: 'partner',
    bookingSourceId: '',
    notes: ''
  })
}

onMounted(async () => {
  try {
    const [, , sources, methods] = await Promise.all([
      loadPartners(),
      loadUnits(),
      getBookingSources(),
      getPaymentMethods()
    ])
    bookingSources.value = sources || []
    paymentMethods.value = methods || []
  } catch (error) {
    bookingSources.value = []
    paymentMethods.value = []
  }
})
</script>
<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Edit Booking</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          <UFormGroup label="Guest Name" name="guestName">
            <UInput v-model="state.guestName" />
          </UFormGroup>
          
          <UFormGroup label="Date" name="date">
            <UInput v-model="state.date" type="date" />
          </UFormGroup>
          
          <UFormGroup label="Base Amount" name="amount">
            <UInput v-model="state.amount" type="number" step="0.01" />
          </UFormGroup>
          
          <UFormGroup label="Payment Method" name="paymentMethod">
            <USelect v-model="state.paymentMethod" :options="paymentMethods" />
          </UFormGroup>
          
          <UFormGroup label="Partner" name="partner">
            <USelect v-model="state.partner" :options="partners" />
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
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary">Update Booking</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface AddOnConfig {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  label: string
  amount: number
}

interface Props {
  booking: any
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'updated': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { partners: storePartners, units: storeUnits, updateBooking } = useAccountingStore()

const availableAddons: AddOnConfig[] = [
  { type: 'early_checkin', label: 'Early Check-In', amount: 300 },
  { type: 'late_checkout', label: 'Late Check-Out', amount: 300 },
  { type: 'parking', label: 'Parking Fee', amount: 200 }
]

const schema = z.object({
  guestName: z.string().min(1, 'Guest name is required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  partner: z.string().min(1, 'Partner is required'),
  unitId: z.string().min(1, 'Unit is required'),
  bookingStatus: z.string().min(1, 'Booking status is required'),
  paymentStatus: z.string().min(1, 'Payment status is required'),
  amountPaid: z.coerce.number().min(0, 'Amount paid must be 0 or greater')
})

const state = reactive({
  guestName: '',
  date: '',
  amount: 0,
  paymentMethod: '',
  partner: '',
  unitId: '',
  addons: [] as { type: string; amount: number }[],
  bookingStatus: 'confirmed',
  paymentStatus: 'unpaid',
  amountPaid: 0
})

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

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Credit Card', value: 'credit' },
  { label: 'Bank Transfer', value: 'transfer' },
  { label: 'PayPal', value: 'paypal' }
]

const partners = computed(() => 
  storePartners.map(p => ({ label: p.name, value: p.id }))
)

const availableUnits = computed(() => {
  if (!state.partner) return []
  return storeUnits
    .filter(unit => unit.partnerId === state.partner)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

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

const onSubmit = () => {
  const updatedBooking = {
    ...props.booking,
    ...state
  }
  
  updateBooking(props.booking.id, updatedBooking)
  
  const toast = useToast()
  toast.add({
    title: 'Booking updated',
    description: `Payment for ${state.guestName} has been updated`,
    color: 'green'
  })
  
  emit('updated')
  isOpen.value = false
}

// Reset unit selection when partner changes
watch(() => state.partner, () => {
  state.unitId = ''
})

watch(() => props.booking, (booking) => {
  if (booking) {
    Object.assign(state, {
      guestName: booking.guestName,
      date: booking.date,
      amount: booking.amount,
      paymentMethod: booking.paymentMethod,
      partner: booking.partner,
      unitId: booking.unitId || '',
      addons: booking.addons || [],
      bookingStatus: booking.bookingStatus || 'confirmed',
      paymentStatus: booking.paymentStatus || 'unpaid',
      amountPaid: booking.amountPaid || 0
    })
  }
}, { immediate: true })
</script>
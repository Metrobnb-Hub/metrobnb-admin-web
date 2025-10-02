<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Edit Booking</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-6">
          <!-- Guest & Booking Information -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <UIcon name="i-heroicons-user" class="mr-2 h-4 w-4" />
              Guest & Booking Details
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="Guest Name" name="guestName">
                <UInput v-model="state.guestName" name="guestName" />
              </UFormGroup>
              
              <UFormGroup label="Booking Date" name="bookingDate">
                <DateInput v-model="state.bookingDate" />
              </UFormGroup>
              
              <UFormGroup label="Check-in Date" name="startDate">
                <DateInput v-model="state.startDate" />
              </UFormGroup>
              
              <UFormGroup label="Check-out Date" name="endDate">
                <DateInput v-model="state.endDate" />
              </UFormGroup>
            </div>
          </div>
          
          <!-- Property Information -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <UIcon name="i-heroicons-building-office" class="mr-2 h-4 w-4" />
              Property & Source
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="Partner" name="partner">
                <USelect v-model="state.partner" :options="partnerOptions" name="partner" />
              </UFormGroup>
              
              <UFormGroup label="Unit" name="unitId">
                <USelect 
                  v-model="state.unitId" 
                  :options="availableUnits" 
                  :disabled="!state.partner"
                  placeholder="Select a partner first"
                  name="unitId"
                />
              </UFormGroup>
              
              <UFormGroup label="Booking Source" name="bookingSource">
                <USelect v-model="state.bookingSource" :options="bookingSourceOptions" name="bookingSource" />
              </UFormGroup>
              
              <UFormGroup label="Booking Status" name="bookingStatus">
                <USelect v-model="state.bookingStatus" :options="bookingStatusOptions" name="bookingStatus" />
              </UFormGroup>
            </div>
          </div>
          
          <!-- Payment Information -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <UIcon name="i-heroicons-credit-card" class="mr-2 h-4 w-4" />
              Payment Details
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="Base Amount" name="amount">
                <UInput v-model="state.amount" type="number" step="0.01" name="amount" />
              </UFormGroup>
              
              <UFormGroup label="Amount Paid" name="amountPaid">
                <UInput v-model="state.amountPaid" type="number" step="0.01" name="amountPaid" />
              </UFormGroup>
              
              <UFormGroup label="Payment Method" name="paymentMethod">
                <USelect v-model="state.paymentMethod" :options="paymentMethodOptions" name="paymentMethod" />
              </UFormGroup>
              
              <UFormGroup label="Payment Status" name="paymentStatus">
                <USelect v-model="state.paymentStatus" :options="paymentStatusOptions" name="paymentStatus" />
              </UFormGroup>
              
              <UFormGroup label="Payment Received By" name="paymentReceivedBy">
                <USelect v-model="state.paymentReceivedBy" :options="paymentReceivedByOptions" name="paymentReceivedBy" />
              </UFormGroup>
              
              <UFormGroup label="Payout Date" name="payoutDate">
                <DateInput v-model="state.payoutDate" />
              </UFormGroup>
            </div>
          </div>
          
          <!-- Administrative -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <UIcon name="i-heroicons-document-text" class="mr-2 h-4 w-4" />
              Administrative
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="Invoice Status" name="invoiced">
                <USelect v-model="state.invoiced" :options="invoiceStatusOptions" name="invoiced" />
              </UFormGroup>
              
              <UFormGroup label="Notes" name="notes">
                <UTextarea 
                  v-model="state.notes" 
                  placeholder="Additional notes (max 100 characters)" 
                  :maxlength="100"
                  :rows="2"
                  name="notes"
                />
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ state.notes.length }}/100 characters
                </div>
              </UFormGroup>
            </div>
          </div>
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
          <UButton color="gray" variant="ghost" @click="isOpen = false" :disabled="loading">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="loading">Update Booking</UButton>
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

const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { updateBooking, getBookingSources, getPaymentMethods } = useApi()

const loading = ref(false)
const paymentMethods = ref([])
const bookingSources = ref([])

// Load data when modal opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadBookingSources(),
      loadPaymentMethods()
    ])
  }
})

const loadBookingSources = async () => {
  try {
    const { $api } = useNuxtApp()
    const result = await $api('/api/booking-sources')
    bookingSources.value = result.data || []
  } catch (error) {
    bookingSources.value = []
  }
}

const loadPaymentMethods = async () => {
  try {
    const { $api } = useNuxtApp()
    const result = await $api('/api/payment-methods')
    paymentMethods.value = result.data || []
  } catch (error) {
    paymentMethods.value = []
  }
}

const availableAddons: AddOnConfig[] = [
  { type: 'early_checkin', label: 'Early Check-In', amount: 300 },
  { type: 'late_checkout', label: 'Late Check-Out', amount: 300 },
  { type: 'parking', label: 'Parking Fee', amount: 200 }
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
  bookingSource: z.string().min(1, 'Booking source is required'),
  bookingStatus: z.string().min(1, 'Booking status is required'),
  paymentStatus: z.string().min(1, 'Payment status is required'),
  amountPaid: z.coerce.number().min(0, 'Amount paid must be 0 or greater'),
  payoutDate: z.string().optional(),
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
  bookingSource: '',
  addons: [] as { type: string; amount: number }[],
  bookingStatus: 'confirmed',
  paymentStatus: 'unpaid',
  amountPaid: 0,
  paymentReceivedBy: 'partner',
  payoutDate: '',
  invoiced: false,
  notes: ''
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
    .map(source => ({ label: source.name, value: source.id }))
})

const paymentReceivedByOptions = [
  { label: 'Partner', value: 'partner' },
  { label: 'MetroBNB', value: 'metrobnb' }
]

const invoiceStatusOptions = [
  { label: 'Not Invoiced', value: false },
  { label: 'Invoiced', value: true }
]



const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partner || !Array.isArray(units.value)) return []
  return units.value
    .filter(unit => unit && (unit.partner_id || unit.partnerId) === state.partner)
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

const onSubmit = async () => {
  const { notifySuccess, notifyError } = useNotify()
  
  loading.value = true
  try {
    const updatedData = {
      guest_name: state.guestName,
      booking_date: state.bookingDate,
      start_date: state.startDate,
      end_date: state.endDate,
      base_amount: state.amount,
      payment_method_id: state.paymentMethod,
      partner_id: state.partner,
      unit_id: state.unitId,
      booking_source_id: state.bookingSource,
      addons: state.addons,
      booking_status: state.bookingStatus,
      payment_status: state.paymentStatus,
      amount_paid: state.amountPaid,
      payment_received_by: state.paymentReceivedBy,
      payout_date: state.payoutDate || null,
      invoiced: state.invoiced,
      notes: state.notes
    }
    
    await updateBooking(props.booking.id, updatedData)
    
    notifySuccess(`Booking for ${state.guestName} has been updated`)
    
    emit('updated')
    isOpen.value = false
  } catch (error) {
    notifyError('Failed to update booking')
  } finally {
    loading.value = false
  }
}



// Reset unit selection when partner changes (but not during initialization)
const isInitializing = ref(false)

watch(() => state.partner, (newPartnerId, oldPartnerId) => {
  // Only reset unitId if this is a user change, not initialization
  if (oldPartnerId && !isInitializing.value) {
    state.unitId = ''
  }
})

watch(() => props.booking, (booking) => {
  if (booking) {
    isInitializing.value = true
    
    Object.assign(state, {
      guestName: booking.guest_name || '',
      bookingDate: booking.booking_date || '',
      startDate: booking.start_date || '',
      endDate: booking.end_date || '',
      amount: parseFloat(booking.base_amount) || 0,
      paymentMethod: booking.payment_method_id || booking.payment_method?.id || '',
      partner: booking.partner_id || '',
      unitId: booking.unit_id || '',
      bookingSource: booking.booking_source_id || '',
      addons: Array.isArray(booking.addons) ? booking.addons : [],
      bookingStatus: booking.booking_status || 'confirmed',
      paymentStatus: booking.payment_status || 'unpaid',
      amountPaid: parseFloat(booking.amount_paid) || 0,
      paymentReceivedBy: booking.payment_received_by || 'partner',
      payoutDate: booking.payout_date || '',
      invoiced: booking.invoiced || false,
      notes: booking.notes || ''
    })
    
    // Allow partner/unit relationship to settle
    nextTick(() => {
      isInitializing.value = false
    })
    
  }
}, { immediate: true })
</script>
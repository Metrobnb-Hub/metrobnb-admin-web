<template>
  <!-- Mobile card layout -->
  <div class="sm:hidden space-y-3">
    <UCard v-for="booking in bookings" :key="booking.id" class="p-4">
      <div class="space-y-3">
        <div class="flex justify-between items-start">
          <div class="min-w-0 flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ booking.guest_name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDateRange(booking.start_date, booking.end_date) }}</p>
          </div>
          <UDropdown :items="getActions(booking)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="xs" />
          </UDropdown>
        </div>
        
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Partner:</span>
            <p class="font-medium truncate">{{ getPartnerName(booking.partner_id) }}</p>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Unit:</span>
            <p class="font-medium truncate">{{ getUnitName(booking.unit_id) }}</p>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Amount:</span>
            <p class="font-medium">₱{{ (getBookingTotal(booking) || 0).toLocaleString('en-US', { minimumFractionDigits: 0 }) }}</p>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Status:</span>
            <UBadge :color="getBookingStatusColor(booking.booking_status)" size="xs">
              {{ getBookingStatusLabel(booking.booking_status) }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  
  <!-- Desktop table layout -->
  <div class="hidden sm:block overflow-x-auto">
    <UTable :rows="bookings" :columns="columns" class="min-w-full">
      <template #actions-data="{ row }">
        <UDropdown :items="getActions(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
        </UDropdown>
      </template>
      <template #amount-data="{ row }">
        <div>
          <div class="font-medium">₱{{ (getBookingTotal(row) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          <div v-if="(row.addons || []).length" class="text-xs text-gray-500 dark:text-gray-400">
            Base: ₱{{ (parseFloat(row.base_amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} + Add-ons: ₱{{ (getAddonsTotal(row) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
        </div>
      </template>
      <template #addons-data="{ row }">
        <div v-if="row.addons?.length" class="space-y-1">
          <div 
            v-for="addon in row.addons" 
            :key="addon.type"
            class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
          >
            {{ getAddonLabel(addon.type) }}
          </div>
        </div>
        <span v-else class="text-gray-400 text-sm">None</span>
      </template>

      <template #status-data="{ row }">
        <div class="space-y-1">
          <div>
            <span 
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="getBookingStatusClass(row.booking_status)"
            >
              {{ getBookingStatusLabel(row.booking_status) }}
            </span>
          </div>
          <div>
            <span 
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="row.invoiced ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
            >
              {{ row.invoiced ? 'Invoiced' : 'Not Invoiced' }}
            </span>
          </div>
        </div>
      </template>
      <template #payment-data="{ row }">
        <div class="space-y-1">
          <div>
            <span 
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="getPaymentStatusClass(row.payment_status)"
            >
              {{ getPaymentStatusLabel(row.payment_status) }}
            </span>
          </div>
          <div>
            <span 
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="row.payment_received_by === 'metrobnb' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'"
            >
              {{ row.payment_received_by === 'metrobnb' ? 'MetroBNB' : 'Partner' }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ row.payment_method?.name || 'N/A' }}
          </div>
        </div>
      </template>
      <template #guest-data="{ row }">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ row.guest_name }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <div>Stay: {{ formatDateRange(row.start_date, row.end_date) }}</div>
            <div class="text-xs">Booked: {{ formatDate(row.booking_date) }}</div>
          </div>
        </div>
      </template>
      <template #location-data="{ row }">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ getPartnerName(row.partner_id) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ getUnitName(row.unit_id) }}
          </div>
        </div>
      </template>

    </UTable>
  </div>
</template>

<script setup lang="ts">
interface AddOn {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  amount: number
}

type BookingStatus = 'confirmed' | 'canceled' | 'refunded'
type PaymentStatus = 'unpaid' | 'partial' | 'fully_paid'

interface Booking {
  id: string
  guestName: string
  bookingDate: string
  baseAmount: string  // API returns as string
  paymentMethod: any
  partnerId: string
  unitId?: string
  addons?: AddOn[]
  bookingStatus?: BookingStatus
  paymentStatus?: PaymentStatus
  amountPaid?: string  // API returns as string
}

const props = defineProps<{
  bookings: Booking[]
  partners?: any[]
  units?: any[]
}>()

// Use props if provided, otherwise fallback to data manager
const { units: dataUnits, partners: dataPartners } = useGlobalCache()

const units = computed(() => props.units || dataUnits.value || [])
const partners = computed(() => props.partners || dataPartners.value || [])

// Debug first booking to see field names
watch(() => props.bookings, (bookings) => {
  if (bookings && bookings.length > 0) {
    console.log('First booking structure:', bookings[0])
    console.log('Partner ID from booking:', bookings[0].partnerId || bookings[0].partner_id)
    console.log('Unit ID from booking:', bookings[0].unitId || bookings[0].unit_id)
  }
}, { immediate: true })

const emit = defineEmits<{
  edit: [booking: Booking]
  delete: [id: string]
}>()

const columns = [
  { key: 'guest', label: 'Guest & Stay Dates' },
  { key: 'location', label: 'Partner & Unit' },
  { key: 'amount', label: 'Total Amount' },
  { key: 'status', label: 'Status' },
  { key: 'payment', label: 'Payment Info' },
  { key: 'actions', label: '' }
]

const getAddonsTotal = (booking: Booking) => {
  if (!booking || !Array.isArray(booking.addons)) return 0
  return booking.addons.reduce((sum, addon) => {
    return sum + (typeof addon?.amount === 'number' ? addon.amount : 0)
  }, 0)
}

const getBookingTotal = (booking: any) => {
  if (!booking) return 0
  const baseAmount = parseFloat(booking.base_amount) || 0
  const addonsTotal = getAddonsTotal(booking)
  return baseAmount + addonsTotal
}

const getAddonLabel = (type: string) => {
  const labels = {
    early_checkin: 'Early Check-In',
    late_checkout: 'Late Check-Out',
    parking: 'Parking'
  }
  return labels[type as keyof typeof labels] || type
}

const getBookingStatusLabel = (status?: string) => {
  const labels = {
    confirmed: 'Confirmed',
    canceled: 'Canceled',
    refunded: 'Refunded'
  }
  return labels[status as keyof typeof labels] || 'Confirmed'
}

const getPaymentStatusLabel = (status?: string) => {
  const labels = {
    unpaid: 'Unpaid',
    partial: 'Partial',
    fully_paid: 'Fully Paid'
  }
  return labels[status as keyof typeof labels] || 'Unpaid'
}

const getBookingStatusClass = (status?: string) => {
  const classes = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status as keyof typeof classes] || classes.confirmed
}

const getBookingStatusColor = (status?: string) => {
  const colors = {
    confirmed: 'green',
    canceled: 'red', 
    refunded: 'orange'
  }
  return colors[status as keyof typeof colors] || 'green'
}

const getPaymentStatusClass = (status?: string) => {
  const classes = {
    unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    fully_paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status as keyof typeof classes] || classes.unpaid
}

const getUnitName = (unitId?: string) => {
  if (!unitId || !Array.isArray(units.value)) return 'N/A'
  const unit = units.value.find(u => u && u.id === unitId)
  return unit?.name || 'Unknown Unit'
}

const getPartnerName = (partnerId?: string) => {
  if (!partnerId || !Array.isArray(partners.value)) return 'N/A'
  const partner = partners.value.find(p => p && p.id === partnerId)
  return partner?.name || 'Unknown Partner'
}

// Helper to get field value with fallback for snake_case/camelCase
const getFieldValue = (row: any, camelField: string, snakeField: string) => {
  return row[camelField] || row[snakeField]
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  })
}

const formatDateRange = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 'N/A'
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  
  const endFormatted = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  
  return `${startFormatted} - ${endFormatted}`
}

const getActions = (row: Booking) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: () => emit('edit', row)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => emit('delete', row.id)
  }]
]
</script>
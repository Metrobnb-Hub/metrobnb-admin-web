<template>
  <div class="overflow-x-auto">
    <UTable :rows="bookings" :columns="columns" class="min-w-full">
      <template #actions-data="{ row }">
        <UDropdown :items="getActions(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
        </UDropdown>
      </template>
      <template #amount-data="{ row }">
        <div>
          <div class="font-medium">₱{{ (getBookingTotal(row) || 0).toFixed(2) }}</div>
          <div v-if="row.addons?.length" class="text-xs text-gray-500 dark:text-gray-400">
            Base: ₱{{ (row.amount || 0).toFixed(2) }} + Add-ons: ₱{{ (getAddonsTotal(row) || 0).toFixed(2) }}
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
      <template #bookingStatus-data="{ row }">
        <span 
          class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
          :class="getBookingStatusClass(row.bookingStatus)"
        >
          {{ getBookingStatusLabel(row.bookingStatus) }}
        </span>
      </template>
      <template #paymentStatus-data="{ row }">
        <span 
          class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
          :class="getPaymentStatusClass(row.paymentStatus)"
        >
          {{ getPaymentStatusLabel(row.paymentStatus) }}
        </span>
      </template>
      <template #unitId-data="{ row }">
        <span class="text-sm text-gray-900 dark:text-white">
          {{ getUnitName(row.unitId) }}
        </span>
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
  date: string
  amount: number
  paymentMethod: string
  partner: string
  unitId?: string
  addons?: AddOn[]
  bookingStatus?: BookingStatus
  paymentStatus?: PaymentStatus
  amountPaid?: number
}

defineProps<{
  bookings: Booking[]
}>()

const { units } = useUnitStore()

const emit = defineEmits<{
  edit: [booking: Booking]
  delete: [id: string]
}>()

const columns = [
  { key: 'guestName', label: 'Guest' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Total Amount' },
  { key: 'unitId', label: 'Unit' },
  { key: 'addons', label: 'Add-ons' },
  { key: 'bookingStatus', label: 'Booking Status' },
  { key: 'paymentStatus', label: 'Payment Status' },
  { key: 'paymentMethod', label: 'Payment' },
  { key: 'partner', label: 'Partner' },
  { key: 'actions', label: '' }
]

const getAddonsTotal = (booking: Booking) => {
  if (!booking || !Array.isArray(booking.addons)) return 0
  return booking.addons.reduce((sum, addon) => {
    return sum + (typeof addon?.amount === 'number' ? addon.amount : 0)
  }, 0)
}

const getBookingTotal = (booking: Booking) => {
  if (!booking) return 0
  const baseAmount = typeof booking.amount === 'number' ? booking.amount : 0
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

const getPaymentStatusClass = (status?: string) => {
  const classes = {
    unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    fully_paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status as keyof typeof classes] || classes.unpaid
}

const getUnitName = (unitId?: string) => {
  if (!unitId || !Array.isArray(units)) return 'N/A'
  const unit = units.find(u => u && u.id === unitId)
  return unit?.name || 'Unknown Unit'
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
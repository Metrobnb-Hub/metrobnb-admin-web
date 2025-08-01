<template>
  <div class="space-y-6">
    <!-- Form Section -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Add Booking Payment</h3>
      </template>
      <AccountingBookingForm @submit="handleSubmit" />
    </UCard>

    <!-- Table Section -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Recent Bookings</h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total: ${{ totalEarnings.toFixed(2) }}
          </div>
        </div>
      </template>
      <AccountingBookingTable 
        :bookings="bookings" 
        @edit="handleEdit" 
        @delete="handleDelete" 
      />
    </UCard>

    <!-- Edit Modal -->
    <AccountingEditBookingModal 
      v-model="showEditModal" 
      :booking="selectedBooking" 
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
const { handleSubmit } = useBookingForm()
const { bookings, totalEarnings, deleteBooking, loadFromStorage } = useAccountingStore()
const { loadFromStorage: loadPartners } = usePartnerStore()
const { loadFromStorage: loadUnits } = useUnitStore()

const showEditModal = ref(false)
const selectedBooking = ref(null)

const handleEdit = (booking: any) => {
  selectedBooking.value = booking
  showEditModal.value = true
}

const handleDelete = (id: string) => {
  deleteBooking(id)
  
  const toast = useToast()
  toast.add({
    title: 'Booking deleted',
    description: 'Payment record has been removed',
    color: 'orange'
  })
}

const handleUpdated = () => {
  selectedBooking.value = null
}

onMounted(async () => {
  try {
    await Promise.all([
      loadFromStorage(),
      loadPartners(),
      loadUnits()
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>
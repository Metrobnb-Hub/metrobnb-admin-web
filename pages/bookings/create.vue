<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Booking</h1>
        <p class="text-gray-600 dark:text-gray-400">Create a new booking payment record</p>
      </div>
      <UButton to="/accounting/bookings" color="gray" variant="outline">
        <UIcon name="i-heroicons-arrow-left" class="mr-2" />
        Back to Bookings
      </UButton>
    </div>

    <!-- Form Section -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Booking Details</h3>
      </template>
      <AccountingBookingForm @submit="handleFormSubmit" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { handleSubmit } = useBookingForm()
const router = useRouter()

const handleFormSubmit = async (data: any) => {
  try {
    await handleSubmit(data)
    
    const toast = useToast()
    toast.add({
      title: 'Booking created',
      description: 'Booking has been added successfully',
      color: 'green'
    })
    
    router.push('/accounting/bookings')
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to create booking',
      color: 'red'
    })
  }
}
</script>
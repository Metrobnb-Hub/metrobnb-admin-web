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
      <AccountingBookingForm :loading="loading" @submit="handleFormSubmit" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { handleSubmit } = useBookingForm()
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()
const loading = ref(false)

const handleFormSubmit = async (data: any) => {
  loading.value = true
  try {
    await handleSubmit(data)
    
    notifySuccess('Booking created successfully!', 5000)
    
    setTimeout(() => {
      router.push('/accounting/bookings')
    }, 1500)
  } catch (error) {
    console.error('Create booking error:', error)
    notifyError('Failed to create booking. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
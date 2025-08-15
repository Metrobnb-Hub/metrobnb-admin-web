<template>
  <div v-if="props.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <UCard v-for="i in 4" :key="i" class="animate-pulse">
      <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </UCard>
  </div>
  
  <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Total Bookings -->
    <UCard>
      <div class="flex items-center">
        <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <UIcon name="i-heroicons-calendar-days" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="ml-4">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_bookings }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
        </div>
      </div>
    </UCard>
    
    <!-- Total Amount -->
    <UCard>
      <div class="flex items-center">
        <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
          <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div class="ml-4">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            ₱{{ parseFloat(stats.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
        </div>
      </div>
    </UCard>
    
    <!-- MetroBNB Payments -->
    <UCard>
      <div class="flex items-center">
        <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <UIcon name="i-heroicons-building-office" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div class="ml-4">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            ₱{{ parseFloat(stats.by_payment_receiver.metrobnb.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">MetroBNB Received</p>
        </div>
      </div>
    </UCard>
    
    <!-- Partner Payments -->
    <UCard>
      <div class="flex items-center">
        <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <UIcon name="i-heroicons-users" class="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <div class="ml-4">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            ₱{{ parseFloat(stats.by_payment_receiver.partner.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Partner Received</p>
        </div>
      </div>
    </UCard>
  </div>
  
  <div v-else class="mb-6">
    <UCard>
      <div class="text-center py-4 text-gray-500">
        No statistics available
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface BookingStats {
  total_bookings: number
  total_amount: string
  by_source: Array<{
    source_name: string
    count: number
    amount: string
  }>
  by_payment_receiver: {
    metrobnb: {
      count: number
      amount: string
    }
    partner: {
      count: number
      amount: string
    }
  }
}

const props = defineProps<{
  summary?: BookingStats | null
  loading?: boolean
}>()

const stats = computed(() => props.summary)
</script>
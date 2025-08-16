<template>
  <template v-if="props.loading">
    <UCard v-for="i in 4" :key="i" class="animate-pulse">
      <div class="h-12 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </UCard>
  </template>
  
  <template v-else-if="stats">
    <!-- Total Bookings -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <UIcon name="i-heroicons-calendar-days" class="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ stats.total_bookings }}</p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bookings</p>
        </div>
      </div>
    </UCard>
    
    <!-- Total Amount -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
          <UIcon name="i-heroicons-currency-dollar" class="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            ₱{{ parseFloat(stats.total_amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Amount</p>
        </div>
      </div>
    </UCard>
    
    <!-- MetroBNB Payments -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <UIcon name="i-heroicons-building-office" class="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            ₱{{ parseFloat(stats.by_payment_receiver.metrobnb.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">MetroBNB</p>
        </div>
      </div>
    </UCard>
    
    <!-- Partner Payments -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <UIcon name="i-heroicons-users" class="h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            ₱{{ parseFloat(stats.by_payment_receiver.partner.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
          </p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Partners</p>
        </div>
      </div>
    </UCard>
  </template>
  
  <template v-else>
    <UCard class="col-span-2 sm:col-span-4">
      <div class="text-center py-4 text-gray-500">
        No statistics available
      </div>
    </UCard>
  </template>
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
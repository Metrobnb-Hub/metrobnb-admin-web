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
        <div class="p-2 sm:p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg">
          <UIcon name="i-heroicons-calendar-days" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-600 dark:text-metrobnb-400" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ stats.total_bookings }}</p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
        </div>
      </div>
    </UCard>
    
    <!-- This Month -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg">
          <UIcon name="i-heroicons-calendar" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-700 dark:text-metrobnb-300" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ thisMonthBookings }}</p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">This Month</p>
        </div>
      </div>
    </UCard>
    
    <!-- This Year -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg">
          <UIcon name="i-heroicons-chart-bar" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-800 dark:text-metrobnb-200" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ thisYearBookings }}</p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">This Year</p>
        </div>
      </div>
    </UCard>
    
    <!-- Most Active Month -->
    <UCard class="p-3 sm:p-4">
      <div class="flex items-center">
        <div class="p-2 sm:p-3 bg-metrobnb-400 dark:bg-metrobnb-600 rounded-lg">
          <UIcon name="i-heroicons-fire" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-900 dark:text-metrobnb-100" />
        </div>
        <div class="ml-2 sm:ml-4 min-w-0 flex-1">
          <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ mostActiveMonth.count }}</p>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ mostActiveMonth.name }}</p>
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
  by_month: Record<string, number>
  by_year: Record<string, number>
}

const props = defineProps<{
  summary?: BookingStats | null
  loading?: boolean
}>()

const stats = computed(() => props.summary)

const thisMonthBookings = computed(() => {
  if (!stats.value?.by_month) return 0
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  return stats.value.by_month[currentMonth] || 0
})

const thisYearBookings = computed(() => {
  if (!stats.value?.by_year) return 0
  const currentYear = new Date().getFullYear().toString()
  return stats.value.by_year[currentYear] || 0
})

const mostActiveMonth = computed(() => {
  if (!stats.value?.by_month) return { count: 0, name: 'No data' }
  
  const months = stats.value.by_month
  const maxEntry = Object.entries(months).reduce((max, [month, count]) => 
    count > max[1] ? [month, count] : max, ['', 0]
  )
  
  if (maxEntry[1] === 0) return { count: 0, name: 'No data' }
  
  const monthName = new Date(maxEntry[0] + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return { count: maxEntry[1], name: monthName }
})
</script>
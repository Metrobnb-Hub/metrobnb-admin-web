<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-users" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Partners</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ partners.length }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-currency-dollar" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalEarnings.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <UIcon name="i-heroicons-chart-bar" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg per Partner</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              ${{ partners.length ? (totalEarnings / partners.length).toFixed(2) : '0.00' }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Partners List -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Partners & Earnings</h3>
      </template>
      
      <div class="space-y-4">
        <div 
          v-for="partner in sortedPartners" 
          :key="partner.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-400 font-semibold">
                {{ partner.name.charAt(0) }}
              </span>
            </div>
            <div class="ml-4">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ partner.name }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ getPartnerBookingCount(partner.id) }} bookings
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900 dark:text-white">
              ${{ partner.earnings.toFixed(2) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ ((partner.earnings / totalEarnings) * 100 || 0).toFixed(1) }}%
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { totalEarnings, bookings, getPartnerEarnings, loadFromStorage } = useAccountingStore()
const { partners, loadFromStorage: loadPartners } = usePartnerStore()

const sortedPartners = computed(() => {
  if (!partners || partners.length === 0) return []
  return [...partners]
    .filter(partner => partner && partner.id)
    .map(partner => ({
      ...partner,
      earnings: getPartnerEarnings(partner.id) || 0
    }))
    .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
})

const getPartnerBookingCount = (partnerId: string) => {
  if (!bookings || !partnerId) return 0
  return bookings.filter(booking => booking && booking.partner === partnerId).length
}

onMounted(async () => {
  await loadFromStorage()
  await loadPartners()
})
</script>
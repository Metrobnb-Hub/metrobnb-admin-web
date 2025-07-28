<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Data Management</h3>
      </template>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Refresh Mock Data</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This will clear all localStorage data and reload fresh mock data from the API.
          </p>
          <UButton @click="refreshData" :loading="isRefreshing" color="primary">
            Refresh All Data
          </UButton>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Current Data Status</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Partners:</span>
              <span class="ml-2 font-medium">{{ partners.length }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Units:</span>
              <span class="ml-2 font-medium">{{ units.length }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Bookings:</span>
              <span class="ml-2 font-medium">{{ bookings.length }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Expenses:</span>
              <span class="ml-2 font-medium">{{ expenses.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, loadFromStorage: loadPartners } = usePartnerStore()
const { units, loadFromStorage: loadUnits } = useUnitStore()
const { getBookings, getExpenses } = useMockApi()

const bookings = ref([])
const expenses = ref([])
const isRefreshing = ref(false)

const refreshData = async () => {
  try {
    isRefreshing.value = true
    
    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('metrobnb-partners')
      localStorage.removeItem('metrobnb-units')
      localStorage.removeItem('metrobnb-bookings')
      localStorage.removeItem('metrobnb-expenses')
      localStorage.removeItem('metrobnb-partner-earnings')
      localStorage.removeItem('current-invoice')
    }
    
    // Reload fresh data
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadBookingsData(),
      loadExpensesData()
    ])
    
    const toast = useToast()
    toast.add({
      title: 'Data refreshed',
      description: 'All data has been reloaded from mock API',
      color: 'green'
    })
    
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to refresh data',
      color: 'red'
    })
  } finally {
    isRefreshing.value = false
  }
}

const loadBookingsData = async () => {
  bookings.value = await getBookings()
}

const loadExpensesData = async () => {
  expenses.value = await getExpenses()
}

onMounted(async () => {
  await loadPartners()
  await loadUnits()
  await loadBookingsData()
  await loadExpensesData()
})
</script>
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Partners</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your business partners</p>
      </div>
      <div class="flex space-x-3">
        <UButton @click="showInvoiceModal = true" color="gray" variant="outline">
          <UIcon name="i-heroicons-document-text" class="mr-2" />
          Generate Invoice
        </UButton>
        <UButton to="/partners/create" color="primary">Add Partner</UButton>
      </div>
    </div>

    <div v-if="partners.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard 
        v-for="partner in partners" 
        :key="partner.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/partners/${partner.id}`)"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ partner.name }}</h3>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ partner.sharePercentage }}%
            </span>
          </div>
          
          <div v-if="partner.email" class="text-sm text-gray-600 dark:text-gray-400">
            {{ partner.email }}
          </div>
          
          <div v-if="partner.services && partner.services.length" class="flex flex-wrap gap-1">
            <span 
              v-for="service in partner.services.slice(0, 2)" 
              :key="service.id"
              class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
            >
              {{ service.name }}
            </span>
            <span 
              v-if="partner.services.length > 2"
              class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
            >
              +{{ partner.services.length - 2 }}
            </span>
          </div>
          
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{{ getUnitCount(partner.id) }} units</span>
            <span>{{ formatDate(partner.createdAt) }}</span>
          </div>
        </div>
      </UCard>
    </div>
    
    <UCard v-else>
      <div class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No partners yet</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first partner</p>
        <UButton to="/partners/create" color="primary">Add Partner</UButton>
      </div>
    </UCard>

    <!-- Invoice Generator Modal -->
    <PartnersInvoiceGeneratorModal v-model="showInvoiceModal" />
  </div>
</template>

<script setup lang="ts">
const { partners, loadFromStorage: loadPartners } = usePartnerStore()
const { getUnitsByPartnerSync, loadFromStorage: loadUnits } = useUnitStore()

const showInvoiceModal = ref(false)

const getUnitCount = (partnerId: string) => {
  if (!partnerId) return 0
  const units = getUnitsByPartnerSync(partnerId)
  return units ? units.length : 0
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      loadPartners(),
      loadUnits()
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>
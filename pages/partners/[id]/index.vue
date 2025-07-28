<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="text-gray-500 dark:text-gray-400">Loading...</div>
    </div>
    
    <div v-else-if="partner" class="space-y-6">
      <!-- Partner Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ partner.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">Partner Profile</p>
        </div>
        <div class="flex space-x-3">
          <UButton color="gray" variant="ghost" to="/partners">Back to Partners</UButton>
          <UButton @click="showInvoiceModal = true" color="gray" variant="outline">
            <UIcon name="i-heroicons-document-text" class="mr-2" />
            Generate Invoice
          </UButton>
          <UButton :to="`/partners/${partnerId}/add-unit`" color="primary">Add Unit</UButton>
        </div>
      </div>

      <!-- Partner Details -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Partner Information</h3>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
            <p class="text-gray-900 dark:text-white">{{ partner.name }}</p>
          </div>
          
          <div v-if="partner.email">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
            <p class="text-gray-900 dark:text-white">{{ partner.email }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Share Percentage</label>
            <p class="text-gray-900 dark:text-white">{{ partner.sharePercentage }}%</p>
          </div>
          
          <div v-if="partner.services.length">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Services</label>
            <div class="flex flex-wrap gap-2 mt-1">
              <span 
                v-for="service in partner.services" 
                :key="service"
                class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
              >
                {{ service }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Units Section -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Units ({{ units.length }})</h3>
            <UButton :to="`/partners/${partnerId}/add-unit`" size="sm" color="primary">Add Unit</UButton>
          </div>
        </template>
        
        <div v-if="units.length" class="space-y-4">
          <div 
            v-for="unit in units" 
            :key="unit.id"
            class="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ unit.name }}</h4>
                <p v-if="unit.location" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  📍 {{ unit.location }}
                </p>
                <p v-if="unit.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ unit.notes }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Added {{ formatDate(unit.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400 mb-4">No units added yet</p>
          <UButton :to="`/partners/${partnerId}/add-unit`" color="primary">Add First Unit</UButton>
        </div>
      </UCard>
    </div>
    
    <UCard v-else-if="!isLoading">
      <div class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Partner not found</p>
        <UButton to="/partners" class="mt-4">Back to Partners</UButton>
      </div>
    </UCard>

    <!-- Invoice Generator Modal -->
    <PartnersInvoiceGeneratorModal 
      v-model="showInvoiceModal" 
      :preselected-partner-id="partnerId"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const partnerId = route.params.id as string

const { getPartnerByIdSync, loadFromStorage: loadPartners } = usePartnerStore()
const { getUnitsByPartnerId, loadFromStorage: loadUnits } = useUnitStore()

const isLoading = ref(true)
const showInvoiceModal = ref(false)
const partner = computed(() => {
  if (isLoading.value) return null
  return getPartnerByIdSync(partnerId)
})
const units = computed(() => {
  if (isLoading.value) return []
  return getUnitsByPartnerId(partnerId)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const loadData = async () => {
  isLoading.value = true
  await loadPartners()
  await loadUnits()
  isLoading.value = false
}

onMounted(() => {
  loadData()
})
</script>
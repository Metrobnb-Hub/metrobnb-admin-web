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

    <!-- Search and Sort -->
    <UCard v-if="partners.length">
      <div class="flex gap-4 mb-6">
        <UInput 
          v-model="searchQuery" 
          placeholder="Search partners..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
        />
        <USelect 
          v-model="sortBy" 
          :options="sortOptions"
          class="w-48"
        />
      </div>
    </UCard>

    <div v-if="filteredPartners.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard 
        v-for="partner in filteredPartners" 
        :key="partner.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/partners/${partner.id}`)"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ partner.name }}</h3>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ partner.share_percentage || partner.sharePercentage || 'N/A' }}%
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
            <span>{{ formatDate(partner.created_at || partner.createdAt) }}</span>
          </div>
        </div>
      </UCard>
    </div>
    
    <UCard v-else-if="!partners.length">
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
const { partners, units, loadPartners, loadUnits } = useDataManager()

const showInvoiceModal = ref(false)
const searchQuery = ref('')
const sortBy = ref('name_asc')

const sortOptions = [
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  { label: 'Share % High-Low', value: 'share_desc' },
  { label: 'Share % Low-High', value: 'share_asc' },
  { label: 'Newest First', value: 'created_desc' },
  { label: 'Oldest First', value: 'created_asc' }
]

const getUnitCount = (partnerId: string) => {
  if (!partnerId) return 0
  const units = getUnitsByPartnerSync(partnerId)
  return units ? units.length : 0
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

const filteredPartners = computed(() => {
  if (!Array.isArray(partners.value)) return []
  
  let filtered = partners.value.filter(partner => {
    const searchLower = searchQuery.value.toLowerCase()
    const name = partner.name?.toLowerCase() || ''
    const email = partner.email?.toLowerCase() || ''
    const services = partner.services?.map(s => s.name?.toLowerCase()).join(' ') || ''
    
    return name.includes(searchLower) || 
           email.includes(searchLower) || 
           services.includes(searchLower)
  })
  
  // Sort
  const [field, order] = sortBy.value.split('_')
  filtered.sort((a, b) => {
    let aVal, bVal
    
    switch (field) {
      case 'name':
        aVal = a.name || ''
        bVal = b.name || ''
        break
      case 'share':
        aVal = a.share_percentage || a.sharePercentage || 0
        bVal = b.share_percentage || b.sharePercentage || 0
        break
      case 'created':
        aVal = new Date(a.created_at || a.createdAt || 0)
        bVal = new Date(b.created_at || b.createdAt || 0)
        break
      default:
        return 0
    }
    
    if (field === 'share' || field === 'created') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const comparison = aVal.localeCompare(bVal)
    return order === 'asc' ? comparison : -comparison
  })
  
  return filtered
})

const getUnitsByPartnerSync = (partnerId: string) => {
  if (!Array.isArray(units.value)) return []
  return units.value.filter(unit => (unit.partnerId || unit.partner_id) === partnerId)
}

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits()
  ])
})
</script>
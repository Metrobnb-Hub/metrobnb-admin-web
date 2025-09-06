<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Unit Management</h1>
      <UButton
        v-if="canCreateUnits"
        @click="showCreateModal = true"
        color="primary"
      >
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Add Unit
      </UButton>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Units</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ summary.total_units }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Units</h3>
        <p class="text-2xl font-bold text-green-600">{{ summary.active_units }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Occupancy Rate</h3>
        <p class="text-2xl font-bold text-blue-600">{{ summary.occupancy_rate }}%</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Revenue/Unit</h3>
        <p class="text-2xl font-bold text-purple-600">${{ formatCurrency(summary.avg_revenue_per_unit) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div class="flex gap-4">
        <UInput
          v-model="filters.search"
          placeholder="Search units..."
          @input="debouncedSearch"
        />
        
        <USelect
          v-model="filters.partner_id"
          :options="partnerOptions"
          placeholder="All Partners"
          @change="applyFilters"
        />
        
        <USelect
          v-model="filters.status"
          :options="statusOptions"
          placeholder="All Statuses"
          @change="applyFilters"
        />
      </div>
    </div>

    <!-- Units Grid -->
    <div v-if="loading" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto mb-2" />
      Loading units...
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="unit in units"
        :key="unit.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      >
        <!-- Unit Image Placeholder -->
        <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <UIcon name="i-heroicons-photo" class="h-12 w-12 text-gray-400" />
        </div>
        
        <!-- Unit Details -->
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ unit.name }}</h3>
            <span 
              :class="getStatusClass(unit.status)"
              class="px-2 py-1 rounded-full text-xs font-medium capitalize"
            >
              {{ unit.status || 'active' }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">{{ unit.city || unit.location }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ unit.type || 'Property' }}</p>
          
          <div class="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div>🛏️ {{ unit.bedrooms || 0 }} bed</div>
            <div>🚿 {{ unit.bathrooms || 0 }} bath</div>
            <div>👥 {{ unit.capacity || 2 }} guests</div>
          </div>
          
          <div class="flex justify-between items-center mb-3">
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              ${{ unit.base_price || 0 }}/night
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ getPartnerName(unit.partner_id) }}
            </span>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2">
            <UButton
              @click="viewUnit(unit.id)"
              color="primary"
              variant="solid"
              size="sm"
              class="flex-1"
            >
              View Details
            </UButton>
            <UButton
              v-if="canEditUnit(unit)"
              @click="editUnit(unit)"
              color="gray"
              variant="solid"
              size="sm"
            >
              Edit
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && units.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-building-office-2" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No units found</h3>
      <p class="text-gray-500 dark:text-gray-400">Get started by creating your first unit.</p>
    </div>

    <!-- Create/Edit Unit Modal -->
    <UModal v-model="showCreateModal">
      <UnitForm
        :unit="editingUnit"
        @close="closeModal"
        @saved="handleUnitSaved"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'
import type { Unit } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { getUnits, getPartners } = useApi()
const { extractData } = useApiResponse()

const loading = ref(false)
const showCreateModal = ref(false)
const editingUnit = ref<Unit | null>(null)

const units = ref<Unit[]>([])
const partners = ref([])
const summary = ref({
  total_units: 0,
  active_units: 0,
  occupancy_rate: 0,
  avg_revenue_per_unit: 0
})

const filters = ref({
  search: '',
  partner_id: '',
  status: ''
})

const canCreateUnits = computed(() => {
  return user.value?.role === 'admin' || user.value?.role === 'manager'
})

const partnerOptions = computed(() => {
  return partners.value.map(partner => ({
    label: partner.name,
    value: partner.id
  }))
})

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Maintenance', value: 'maintenance' }
]

const canEditUnit = (unit: Unit) => {
  if (!user.value) return false
  
  if (['admin', 'manager'].includes(user.value.role)) {
    return true
  }
  
  return user.value.accessible_partners?.includes(unit.partner_id) || false
}

const getPartnerName = (partnerId: string) => {
  const partner = partners.value.find(p => p.id === partnerId)
  return partner?.name || 'Unknown Partner'
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || classes.active
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const applyFilters = () => {
  loadUnits()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const loadUnits = async () => {
  loading.value = true
  try {
    const response = await getUnits()
    units.value = extractData(response)
    
    // Calculate summary
    summary.value = {
      total_units: units.value.length,
      active_units: units.value.filter(u => u.status === 'active' || !u.status).length,
      occupancy_rate: 75, // Mock data
      avg_revenue_per_unit: 1200 // Mock data
    }
  } catch (error) {
    units.value = []
  } finally {
    loading.value = false
  }
}

const loadPartners = async () => {
  try {
    const response = await getPartners()
    partners.value = extractData(response)
  } catch (error) {
    partners.value = []
  }
}

const viewUnit = (unitId: string) => {
  navigateTo(`/admin/units/${unitId}`)
}

const editUnit = (unit: Unit) => {
  editingUnit.value = unit
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingUnit.value = null
}

const handleUnitSaved = () => {
  closeModal()
  loadUnits()
}

// Load data on mount
onMounted(() => {
  loadUnits()
  loadPartners()
})
</script>
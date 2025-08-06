<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Units Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage property units and their details</p>
      </div>
      <UButton @click="showCreateModal = true" color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Add Unit
      </UButton>
    </div>

    <!-- Units Table -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Units ({{ filteredUnits.length }})</h3>
        </div>
      </template>
      
      <!-- Search and Sort -->
      <div class="mb-4 flex gap-4">
        <UInput 
          v-model="searchQuery" 
          placeholder="Search units..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
        />
        <USelect 
          v-model="sortBy" 
          :options="sortOptions"
          class="w-48"
        />
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="text-gray-500">Loading units...</div>
      </div>

      <UTable v-else :rows="filteredUnits" :columns="columns" class="min-w-full">
        <template #partner-data="{ row }">
          <span class="text-sm text-gray-900 dark:text-white">
            {{ getPartnerName(row.partnerId || row.partner_id) }}
          </span>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="getActions(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Create/Edit Modal -->
    <UModal v-model="showCreateModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">{{ editingUnit ? 'Edit Unit' : 'Create Unit' }}</h3>
        </template>
        
        <UForm :schema="schema" :state="formState" @submit="onSubmit">
          <div class="space-y-4">
            <UFormGroup label="Unit Name" name="name" required>
              <UInput v-model="formState.name" placeholder="Enter unit name" />
            </UFormGroup>
            
            <UFormGroup label="Partner" name="partnerId" required>
              <USelect v-model="formState.partnerId" :options="partnerOptions" placeholder="Select partner" />
            </UFormGroup>
            
            <UFormGroup label="Location" name="location">
              <UTextarea v-model="formState.location" placeholder="Enter unit location" />
            </UFormGroup>
            
            <UFormGroup label="Notes" name="notes">
              <UTextarea v-model="formState.notes" placeholder="Additional notes" />
            </UFormGroup>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <UButton color="gray" variant="ghost" @click="closeModal">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="isSubmitting">
              {{ editingUnit ? 'Update' : 'Create' }} Unit
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const { partners, units, loadPartners, loadUnits, refreshData, isLoading: dataLoading } = useDataManager()
const { createUnit, updateUnit, deleteUnit } = useApi()

const isLoading = computed(() => dataLoading.partners || dataLoading.units)
const isSubmitting = ref(false)
const showCreateModal = ref(false)
const editingUnit = ref(null)
const searchQuery = ref('')
const sortBy = ref('name_asc')

const sortOptions = [
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  { label: 'Partner A-Z', value: 'partner_asc' },
  { label: 'Partner Z-A', value: 'partner_desc' },
  { label: 'Newest First', value: 'created_desc' },
  { label: 'Oldest First', value: 'created_asc' }
]

const schema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  partnerId: z.string().min(1, 'Partner is required'),
  location: z.string().optional(),
  notes: z.string().optional()
})

const formState = reactive({
  name: '',
  partnerId: '',
  location: '',
  notes: ''
})

const columns = [
  { key: 'name', label: 'Unit Name' },
  { key: 'partner', label: 'Partner' },
  { key: 'location', label: 'Location' },
  { key: 'notes', label: 'Notes' },
  { key: 'actions', label: '' }
]

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const getPartnerName = (partnerId: string) => {
  if (!Array.isArray(partners.value)) return 'Unknown Partner'
  const partner = partners.value.find(p => p.id === partnerId)
  return partner?.name || 'Unknown Partner'
}

const filteredUnits = computed(() => {
  if (!Array.isArray(units.value)) return []
  
  let filtered = units.value.filter(unit => {
    const searchLower = searchQuery.value.toLowerCase()
    const unitName = unit.name?.toLowerCase() || ''
    const partnerName = getPartnerName(unit.partnerId || unit.partner_id).toLowerCase()
    const location = unit.location?.toLowerCase() || ''
    
    return unitName.includes(searchLower) || 
           partnerName.includes(searchLower) || 
           location.includes(searchLower)
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
      case 'partner':
        aVal = getPartnerName(a.partnerId || a.partner_id)
        bVal = getPartnerName(b.partnerId || b.partner_id)
        break
      case 'created':
        aVal = new Date(a.createdAt || a.created_at || 0)
        bVal = new Date(b.createdAt || b.created_at || 0)
        break
      default:
        return 0
    }
    
    if (field === 'created') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const comparison = aVal.localeCompare(bVal)
    return order === 'asc' ? comparison : -comparison
  })
  
  return filtered
})

const getActions = (unit: any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: () => editUnit(unit)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => deleteUnitConfirm(unit)
  }]
]

const editUnit = (unit: any) => {
  editingUnit.value = unit
  formState.name = unit.name
  formState.partnerId = unit.partnerId || unit.partner_id
  formState.location = unit.location || ''
  formState.notes = unit.notes || ''
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingUnit.value = null
  Object.assign(formState, {
    name: '',
    partnerId: '',
    location: '',
    notes: ''
  })
}

const onSubmit = async () => {
  try {
    isSubmitting.value = true
    
    if (editingUnit.value) {
      await updateUnit(editingUnit.value.id, formState)
      useToast().add({
        title: 'Unit updated',
        description: `${formState.name} has been updated successfully`,
        color: 'green'
      })
    } else {
      await createUnit(formState)
      useToast().add({
        title: 'Unit created',
        description: `${formState.name} has been created successfully`,
        color: 'green'
      })
    }
    
    await refreshData('units')
    closeModal()
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to save unit',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

const deleteUnitConfirm = async (unit: any) => {
  if (confirm(`Are you sure you want to delete "${unit.name}"?`)) {
    try {
      await deleteUnit(unit.id)
      await refreshData('units')
      useToast().add({
        title: 'Unit deleted',
        description: `${unit.name} has been deleted`,
        color: 'orange'
      })
    } catch (error) {
      useToast().add({
        title: 'Error',
        description: 'Failed to delete unit',
        color: 'red'
      })
    }
  }
}

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits()
  ])
})
</script>
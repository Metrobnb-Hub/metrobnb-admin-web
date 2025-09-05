<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Booking Sources</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage booking sources and commission rates</p>
      </div>
      <UButton @click="showCreateModal = true" color="primary">Add Source</UButton>
    </div>

    <!-- Sources Table -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">All Sources</h3>
      </template>
      
      <UTable :rows="sources" :columns="columns">
        <template #commission_rate-data="{ row }">
          <span class="font-medium">{{ row.commission_rate }}%</span>
        </template>
        
        <template #is_active-data="{ row }">
          <UBadge :color="row.is_active ? 'green' : 'red'" variant="subtle">
            {{ row.is_active ? 'Active' : 'Inactive' }}
          </UBadge>
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
          <h3 class="text-lg font-semibold">{{ editingSource ? 'Edit' : 'Add' }} Booking Source</h3>
        </template>
        
        <UForm :schema="schema" :state="formState" @submit="onSubmit">
          <div class="space-y-4">
            <UFormGroup label="Name" name="name" required>
              <UInput v-model="formState.name" placeholder="e.g., Instagram Ads" />
            </UFormGroup>
            
            <UFormGroup label="Commission Rate (%)" name="commissionRate">
              <UInput v-model="formState.commissionRate" type="number" step="0.1" min="0" max="100" />
            </UFormGroup>
            
            <UFormGroup label="Status" name="isActive">
              <UToggle v-model="formState.isActive" />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {{ formState.isActive ? 'Active' : 'Inactive' }}
              </span>
            </UFormGroup>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <UButton color="gray" variant="ghost" @click="closeModal">Cancel</UButton>
            <UButton type="submit" color="primary">
              {{ editingSource ? 'Update' : 'Create' }} Source
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const { getBookingSources, createBookingSource, updateBookingSource } = useApi()
const { extractData } = useApiResponse()

const sources = ref([])
const showCreateModal = ref(false)
const editingSource = ref(null)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  commissionRate: z.coerce.number().min(0).max(100).optional(),
  isActive: z.boolean()
})

const formState = reactive({
  name: '',
  commissionRate: 0,
  isActive: true
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'commission_rate', label: 'Commission Rate' },
  { key: 'is_active', label: 'Status' },
  { key: 'actions', label: '' }
]

const getActions = (row: any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: () => editSource(row)
  }],
  [{
    label: row.is_active ? 'Deactivate' : 'Activate',
    icon: row.is_active ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle',
    click: () => toggleStatus(row)
  }]
]

const editSource = (source: any) => {
  editingSource.value = source
  Object.assign(formState, {
    name: source.name,
    commissionRate: source.commissionRate || 0,
    isActive: source.isActive
  })
  showCreateModal.value = true
}

const toggleStatus = async (source: any) => {
  try {
    await updateBookingSource(source.id, { is_active: !source.is_active })
    await loadSources()
    
    const toast = useToast()
    toast.add({
      title: 'Status updated',
      description: `${source.name} is now ${!source.is_active ? 'active' : 'inactive'}`,
      color: 'green'
    })
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to update booking source status',
      color: 'red'
    })
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingSource.value = null
  Object.assign(formState, {
    name: '',
    commissionRate: 0,
    isActive: true
  })
}

const onSubmit = async () => {
  try {
    if (editingSource.value) {
      const updated = await updateBookingSource(editingSource.value.id, formState)
      Object.assign(editingSource.value, updated)
    } else {
      const newSource = await createBookingSource(formState)
      sources.value.push(newSource)
    }
    
    const toast = useToast()
    toast.add({
      title: editingSource.value ? 'Source updated' : 'Source created',
      description: `${formState.name} has been ${editingSource.value ? 'updated' : 'created'} successfully`,
      color: 'green'
    })
    
    closeModal()
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: `Failed to ${editingSource.value ? 'update' : 'create'} booking source`,
      color: 'red'
    })
  }
}

const loadSources = async () => {
  const result = await getBookingSources()
  sources.value = extractData(result)
}

onMounted(async () => {
  await loadSources()
})
</script>
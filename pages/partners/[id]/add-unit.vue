<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Unit</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Add a new unit for <span class="font-medium">{{ partner?.name }}</span>
      </p>
    </div>

    <UCard v-if="partner">
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partner">
            <UInput :model-value="partner.name" disabled />
          </UFormGroup>
          
          <UFormGroup label="Unit Name" name="name" required>
            <UInput 
              v-model="state.name" 
              placeholder="e.g., Casa Aurea – Azure Bahamas 945" 
            />
          </UFormGroup>
          
          <UFormGroup label="Location" name="location">
            <UInput v-model="state.location" placeholder="Enter location (optional)" />
          </UFormGroup>
          
          <UFormGroup label="Notes" name="notes">
            <UTextarea v-model="state.notes" placeholder="Additional notes (optional)" />
          </UFormGroup>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="$router.push(`/partners/${partnerId}`)">
            Skip & View Profile
          </UButton>
          <UButton type="submit" color="primary">Add Unit</UButton>
        </div>
      </UForm>
    </UCard>
    
    <UCard v-else>
      <div class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Partner not found</p>
        <UButton to="/partners" class="mt-4">Back to Partners</UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const route = useRoute()
const partnerId = route.params.id as string

const { getPartnerByIdSync, loadFromStorage: loadPartners } = usePartnerStore()
const { addUnit } = useUnitStore()

const schema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  location: z.string().optional(),
  notes: z.string().optional()
})

const state = reactive({
  name: '',
  location: '',
  notes: ''
})

const partner = computed(() => getPartnerByIdSync(partnerId))

const onSubmit = async () => {
  try {
    await addUnit({
      name: state.name,
      location: state.location || undefined,
      notes: state.notes || undefined,
      partnerId
    })
    
    const toast = useToast()
    toast.add({
      title: 'Unit added',
      description: `${state.name} has been added successfully`,
      color: 'green'
    })
    
    await navigateTo(`/partners/${partnerId}`)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to add unit',
      color: 'red'
    })
  }
}

onMounted(() => {
  loadPartners()
})
</script>
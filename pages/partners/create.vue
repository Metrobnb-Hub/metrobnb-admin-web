<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Partner</h1>
      <p class="text-gray-600 dark:text-gray-400">Create a new partner profile</p>
    </div>

    <UCard>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner Name" name="name" required>
            <UInput v-model="state.name" placeholder="Enter partner name" />
          </UFormGroup>
          
          <UFormGroup label="Email/Contact" name="email">
            <UInput v-model="state.email" type="email" placeholder="partner@example.com" />
          </UFormGroup>
          
          <UFormGroup label="MetroBNB Share Percentage" name="sharePercentage" required>
            <UInput v-model="state.sharePercentage" type="number" min="0" max="100" step="0.1" />
          </UFormGroup>
          
          <UFormGroup label="Services Availed" name="services">
            <div class="space-y-2">
              <div v-for="service in availableServices" :key="service" class="flex items-center space-x-2">
                <UCheckbox 
                  :model-value="state.services.includes(service)"
                  @update:model-value="toggleService(service)"
                />
                <span class="text-sm">{{ service }}</span>
              </div>
            </div>
          </UFormGroup>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="$router.push('/partners')">Cancel</UButton>
          <UButton type="submit" color="primary">Create Partner</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Partner name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  sharePercentage: z.coerce.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100 or less'),
  services: z.array(z.string()).optional()
})

const state = reactive({
  name: '',
  email: '',
  sharePercentage: 0,
  services: [] as string[]
})

const availableServices = [
  'Cleaning',
  'Full Management',
  'Maintenance',
  'Guest Communication',
  'Marketing'
]

const { addPartner } = usePartnerStore()

const toggleService = (service: string) => {
  const index = state.services.indexOf(service)
  if (index >= 0) {
    state.services.splice(index, 1)
  } else {
    state.services.push(service)
  }
}

const onSubmit = async () => {
  try {
    const partnerId = addPartner({
      name: state.name,
      email: state.email || undefined,
      sharePercentage: state.sharePercentage,
      services: state.services
    })
    
    const toast = useToast()
    toast.add({
      title: 'Partner created',
      description: `${state.name} has been added successfully`,
      color: 'green'
    })
    
    await navigateTo(`/partners/${partnerId}/add-unit`)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to create partner',
      color: 'red'
    })
  }
}
</script>
<template>
  <div class="space-y-6">
    <!-- Partner Form -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Add Partner</h3>
      </template>
      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <UFormGroup label="Partner Name" name="name">
          <UInput v-model="form.name" placeholder="e.g., Casa Aurea Properties" />
        </UFormGroup>
        
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" type="email" placeholder="contact@partner.com" />
        </UFormGroup>
        
        <UFormGroup label="Share Percentage" name="sharePercentage">
          <UInput v-model="form.sharePercentage" type="number" min="0" max="100" placeholder="15" />
        </UFormGroup>
        
        <UFormGroup label="Services" name="services">
          <div class="space-y-2">
            <div v-for="service in services" :key="service.id" class="flex items-center">
              <UCheckbox 
                :id="service.id"
                v-model="selectedServices" 
                :value="service.id"
                :label="service.name"
              />
              <span class="ml-2 text-sm text-gray-600">{{ service.description }}</span>
            </div>
          </div>
        </UFormGroup>
        
        <UButton type="submit" :loading="loading">Add Partner</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, loadPartners } = useGlobalCache()
const { createPartner } = useApi()
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()

const services = ref([])

const loading = ref(false)
const selectedServices = ref<string[]>([])
const form = ref({
  name: '',
  email: '',
  sharePercentage: 0
})

const handleSubmit = async () => {
  if (!form.value.name || !form.value.sharePercentage) {
    notifyError('Please fill in all required fields')
    return
  }

  loading.value = true
  try {
    await createPartner({
      name: form.value.name,
      email: form.value.email,
      sharePercentage: form.value.sharePercentage,
      serviceIds: selectedServices.value
    })
    
    notifySuccess('Partner added successfully')
    router.push('/partners')
  } catch (error) {
    notifyError('Failed to add partner')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadPartners()
    // Load services from API when available
    services.value = [
      { id: '1', name: 'Property Management', description: 'Full property management services' },
      { id: '2', name: 'Cleaning', description: 'Professional cleaning services' },
      { id: '3', name: 'Maintenance', description: 'Property maintenance and repairs' }
    ]
  } catch (error) {
  }
})
</script>
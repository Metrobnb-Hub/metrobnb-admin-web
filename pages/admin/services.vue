<template>
  <div class="space-y-6">
    <!-- Add Service Form -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Add Service</h3>
      </template>
      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <UFormGroup label="Service Name" name="name">
          <UInput v-model="form.name" placeholder="e.g., All In Host Hero" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="form.description" placeholder="Service description" />
        </UFormGroup>
        <UButton type="submit" :loading="loading">Add Service</UButton>
      </UForm>
    </UCard>

    <!-- Services List -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Services</h3>
      </template>
      <div class="space-y-3">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="flex justify-between items-center p-4 border rounded-lg"
        >
          <div>
            <h4 class="font-medium">{{ service.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.description }}</p>
          </div>
          <div class="flex space-x-2">
            <UButton variant="ghost" size="sm" @click="editService(service)">Edit</UButton>
            <UButton variant="ghost" size="sm" color="red" @click="deleteService(service.id)">Delete</UButton>
          </div>
        </div>
        <div v-if="!services.length" class="text-center py-8 text-gray-500">
          No services yet. Add your first service above.
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/types/api'

// Add role-based access control
definePageMeta({
  middleware: ['auth', 'role']
})

const { getServices, createService, updateService, deleteService: apiDeleteService } = useApi()
const { extractData } = useApiResponse()
const toast = useToast()

const services = ref<Service[]>([])
const loading = ref(false)
const form = ref({
  name: '',
  description: ''
})

const loadServices = async () => {
  try {
    const result = await getServices()
    services.value = extractData(result)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load services',
      color: 'red'
    })
  }
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) return
  
  loading.value = true
  try {
    const newService = await createService({
      name: form.value.name,
      description: form.value.description
    })
    services.value.push(newService)
    form.value = { name: '', description: '' }
    toast.add({
      title: 'Success',
      description: 'Service added successfully'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to add service',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const editService = (service: Service) => {
  // TODO: Implement edit modal
  console.log('Edit service:', service)
}

const deleteService = async (id: string) => {
  try {
    await apiDeleteService(id)
    services.value = services.value.filter(s => s.id !== id)
    toast.add({
      title: 'Success',
      description: 'Service deleted successfully'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete service',
      color: 'red'
    })
  }
}

onMounted(() => {
  loadServices()
})
</script>
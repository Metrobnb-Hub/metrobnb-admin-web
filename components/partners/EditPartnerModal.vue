<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Edit Partner</h3>
      </template>
      
      <UForm :state="form" @submit="updatePartner" :validate="validate">
        <div class="space-y-4">
          <UFormGroup label="Partner Name" required>
            <UInput v-model="form.name" placeholder="Enter partner name" />
          </UFormGroup>
          
          <UFormGroup label="Email">
            <UInput v-model="form.email" type="email" placeholder="partner@example.com" />
          </UFormGroup>
          
          <UFormGroup label="Organization Share %" required>
            <UInput v-model.number="form.org_share_percentage" type="number" min="0" max="100" />
          </UFormGroup>
          
          <UFormGroup label="Phone">
            <UInput v-model="form.phone" placeholder="+1234567890" />
          </UFormGroup>
          
          <UFormGroup label="Services">
            <USelectMenu 
              v-if="serviceOptions.length > 0"
              v-model="form.service_ids" 
              :options="serviceOptions"
              multiple
              placeholder="Select services"
              by="value"
            >
              <template #label>
                <span v-if="selectedServiceNames.length === 0">Select services</span>
                <span v-else>{{ selectedServiceNames.join(', ') }}</span>
              </template>
            </USelectMenu>
            <div v-else class="text-sm text-gray-500">Loading services...</div>
          </UFormGroup>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="close" :disabled="isUpdating">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="isUpdating" :disabled="isUpdating">
            Update Partner
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  partner: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'updated'])

const { notifySuccess, notifyError } = useNotify()
const isUpdating = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = reactive({
  name: '',
  email: '',
  org_share_percentage: 0,
  phone: '',
  service_ids: []
})

// Load services
const services = ref([])
const serviceOptions = computed(() => {
  const options = services.value?.map(s => ({ label: s.name, value: s.id })) || []
  console.log('Service options:', options)
  return options
})

// Computed to get selected service names
const selectedServiceNames = computed(() => {
  if (!form.service_ids.length || !services.value.length) return []
  return form.service_ids.map(id => {
    const service = services.value.find(s => s.id === id)
    return service ? service.name : id
  })
})

// Single watcher for both modal opening and partner data
watch([() => props.modelValue, () => props.partner], async ([isOpen, partner]) => {
  if (isOpen) {
    // Load services first
    if (services.value.length === 0) {
      await loadServices()
    }
    
    // Then fill form data
    if (partner) {
      form.name = partner.name || ''
      form.email = partner.email || ''
      form.org_share_percentage = partner.org_share_percentage || 0
      form.phone = partner.phone || ''
      
      // Extract service IDs from partner.services array
      let serviceIds = []
      if (Array.isArray(partner.services)) {
        // API returns services as array of objects with id
        serviceIds = partner.services.map(s => s.id)
      } else if (Array.isArray(partner.service_ids)) {
        // Fallback to service_ids if available
        serviceIds = partner.service_ids
      }
      
      console.log('Partner services:', partner.services)
      console.log('Extracted service IDs:', serviceIds)
      console.log('Available services:', services.value)
      
      form.service_ids = serviceIds
      console.log('Form service_ids set to:', form.service_ids)
    }
  }
})

const loadServices = async () => {
  try {
    const { getServices } = useApi()
    services.value = await getServices()
    console.log('Services loaded:', services.value)
  } catch (error) {
    console.error('Failed to load services:', error)
    services.value = []
  }
}

const validate = (state: any) => {
  const errors = []
  if (!state.name || state.name.length < 1) {
    errors.push({ path: 'name', message: 'Name is required' })
  }
  if (state.org_share_percentage < 0 || state.org_share_percentage > 100) {
    errors.push({ path: 'org_share_percentage', message: 'Share percentage must be between 0-100' })
  }
  return errors
}

const updatePartner = async () => {
  if (isUpdating.value) return
  
  try {
    isUpdating.value = true
    
    // Check user permissions first
    const { user, hasPermission } = useAuth()
    
    if (!hasPermission('partners:write')) {
      notifyError('You need "partners:write" permission to edit partners. Contact your administrator.')
      return
    }
    
    const { updatePartner: apiUpdatePartner } = useApi()
    const payload = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      org_share_percentage: form.org_share_percentage,
      service_ids: form.service_ids.map(s => typeof s === 'string' ? s : s.value)
    }
    
    await apiUpdatePartner(props.partner.id, payload)
    
    notifySuccess('Partner updated successfully')
    emit('updated')
    close()
  } catch (error) {
    console.error('Update error:', error)
    
    // Handle specific permission errors gracefully
    if (error.status === 401 || error.statusCode === 401) {
      notifyError('Permission denied: You do not have rights to edit partners')
    } else if (error.status === 403 || error.statusCode === 403) {
      notifyError('Access forbidden: Contact administrator for partners:write permission')
    } else if (error.message?.includes('permission') || error.message?.includes('Permission')) {
      notifyError('Insufficient permissions to edit partners')
    } else {
      notifyError(`Update failed: ${error.message || 'Please try again or contact support'}`)
    }
    
    // Don't close modal on permission errors - let user see the error
  } finally {
    isUpdating.value = false
  }
}

const close = () => {
  isOpen.value = false
}
</script>

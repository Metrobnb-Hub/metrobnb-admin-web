<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">Typed API Example</h3>
    
    <!-- Partners List -->
    <div class="mb-6">
      <h4 class="font-medium mb-2">Partners (Type-Safe)</h4>
      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else class="space-y-2">
        <div 
          v-for="partner in partners" 
          :key="partner.id"
          class="p-3 border rounded flex justify-between items-center"
        >
          <div>
            <span class="font-medium">{{ partner.name }}</span>
            <span class="text-sm text-gray-500 ml-2">{{ partner.share_percentage }}%</span>
          </div>
          <UBadge>{{ partner.partner_code }}</UBadge>
        </div>
      </div>
    </div>

    <!-- Create Partner Form -->
    <div class="border-t pt-4">
      <h4 class="font-medium mb-2">Create Partner</h4>
      <UForm :state="newPartner" @submit="createPartner" class="space-y-3">
        <UFormGroup label="Name" name="name">
          <UInput v-model="newPartner.name" placeholder="Partner name" />
        </UFormGroup>
        
        <UFormGroup label="Email" name="email">
          <UInput v-model="newPartner.email" type="email" placeholder="partner@example.com" />
        </UFormGroup>
        
        <UFormGroup label="Share Percentage" name="share_percentage">
          <UInput v-model.number="newPartner.share_percentage" type="number" min="0" max="100" />
        </UFormGroup>
        
        <UButton type="submit" :loading="creating">
          Create Partner
        </UButton>
      </UForm>
    </div>

    <!-- API Response Debug -->
    <div class="mt-6 p-4 bg-gray-50 rounded">
      <h4 class="font-medium mb-2">Last API Response</h4>
      <pre class="text-xs text-gray-600 overflow-auto">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartnerResponse, PartnerCreate } from '~/types/generated-api'

// Typed API client
const api = useTypedApi()

// Reactive state with proper typing
const partners = ref<PartnerResponse[]>([])
const loading = ref(false)
const creating = ref(false)
const error = ref<string | null>(null)
const lastResponse = ref<any>(null)

// Form state with proper typing
const newPartner = ref<PartnerCreate>({
  name: '',
  email: '',
  share_percentage: 50
})

// Load partners with full type safety
const loadPartners = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getPartners()
    lastResponse.value = response
    
    if (response.success) {
      // Handle both array and paginated responses
      if (Array.isArray(response.data)) {
        partners.value = response.data
      } else if (response.data?.items) {
        partners.value = response.data.items
      } else {
        partners.value = []
      }
    } else {
      error.value = response.error?.message || 'Failed to load partners'
    }
  } catch (err: any) {
    error.value = err.message
    lastResponse.value = { error: err.message }
  } finally {
    loading.value = false
  }
}

// Create partner with type safety
const createPartner = async () => {
  if (!newPartner.value.name || !newPartner.value.share_percentage) {
    error.value = 'Name and share percentage are required'
    return
  }
  
  creating.value = true
  error.value = null
  
  try {
    const response = await api.createPartner(newPartner.value)
    lastResponse.value = response
    
    if (response.success && response.data) {
      // Add new partner to list with full type safety
      partners.value.push(response.data)
      
      // Reset form
      newPartner.value = {
        name: '',
        email: '',
        share_percentage: 50
      }
      
      // Show success message
      const toast = useToast()
      toast.add({
        title: 'Success',
        description: `Partner "${response.data.name}" created successfully`,
        color: 'green'
      })
    } else {
      error.value = response.error?.message || 'Failed to create partner'
    }
  } catch (err: any) {
    error.value = err.message
    lastResponse.value = { error: err.message }
  } finally {
    creating.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadPartners()
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Invite New User</h2>
      </template>
      
      <form @submit.prevent="handleInvite" class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" type="email" required />
        </UFormGroup>
        
        <UFormGroup label="Name" name="name">
          <UInput v-model="form.name" required />
        </UFormGroup>
        
        <UFormGroup label="Role" name="role">
          <USelect v-model="form.role" :options="roleOptions" value-attribute="value" option-attribute="label" required />
        </UFormGroup>
        
        <UFormGroup v-if="form.role === 'staff'" label="Accessible Partners" name="partner_ids">
          <USelectMenu v-model="form.partner_ids" :options="partnerOptions" multiple />
        </UFormGroup>
        
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        
        <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-3">
          <p class="text-green-600 text-sm">{{ success }}</p>
          <p v-if="tempPassword" class="text-green-700 font-mono text-xs mt-2">
            Temporary Password: {{ tempPassword }}
          </p>
        </div>
        
        <div class="flex gap-3">
          <UButton 
            type="submit" 
            :loading="loading" 
            :disabled="!form.email || !form.name || !form.role"
            color="primary"
          >
            Send Invitation
          </UButton>
          <UButton to="/users" variant="ghost">
            Cancel
          </UButton>
        </div>
        
        <!-- Debug info -->
        <div class="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p>Form data: {{ JSON.stringify(form, null, 2) }}</p>
          <p>Button disabled: {{ !form.email || !form.name || !form.role }}</p>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { inviteUser } = useAuth()

// Make partners loading optional to prevent blocking
let partners = ref([])
try {
  const { data } = await useGlobalCache('partners')
  partners = data
} catch (error) {
  console.log('Failed to load partners:', error)
}

const form = ref({
  email: '',
  name: '',
  role: 'staff',
  partner_ids: []
})

const error = ref('')
const success = ref('')
const tempPassword = ref('')
const loading = ref(false)

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Staff', value: 'staff' },
  { label: 'Partner', value: 'partner' }
]

const partnerOptions = computed(() => 
  partners.value?.map(p => ({ label: p.name, value: p.id })) || []
)

const handleInvite = async () => {
  error.value = ''
  success.value = ''
  tempPassword.value = ''
  loading.value = true
  
  console.log('🔐 Inviting user with data:', form.value)
  
  try {
    const response = await inviteUser(form.value)
    console.log('🔐 Invite response:', response)
    
    if (response.success) {
      success.value = `Invitation sent to ${form.value.email}`
      tempPassword.value = response.data.temporary_password
      
      // Reset form
      form.value = {
        email: '',
        name: '',
        role: 'staff',
        partner_ids: []
      }
    } else {
      error.value = response.error?.message || 'Failed to send invitation'
    }
  } catch (err: any) {
    console.error('🔐 Invite error:', err)
    error.value = err.message || 'Failed to send invitation'
  } finally {
    loading.value = false
  }
}
</script>
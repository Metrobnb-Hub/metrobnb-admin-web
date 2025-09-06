<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <!-- Profile Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-user" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user?.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">
            {{ user?.role }}
          </span>
        </div>
      </div>
    </div>

    <!-- Profile Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profile Information</h2>
      
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
            <UInput
              v-model="profileForm.name"
              type="text"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <UInput
              v-model="userEmail"
              type="email"
              disabled
              class="bg-gray-50"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
            <UInput
              v-model="userRole"
              type="text"
              disabled
              class="bg-gray-50 capitalize"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Organization</label>
            <UInput
              v-model="organizationName"
              type="text"
              disabled
              class="bg-gray-50"
            />
          </div>
        </div>
        
        <!-- Accessible Partners (if applicable) -->
        <div v-if="user?.accessible_partners?.length">
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Accessible Partners</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="partnerId in user.accessible_partners"
              :key="partnerId"
              class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
            >
              Partner {{ partnerId.substring(0, 8) }}...
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Contact admin to modify partner access</p>
        </div>
        
        <div class="flex justify-end">
          <UButton
            type="submit"
            :loading="updatingProfile"
            color="primary"
          >
            {{ updatingProfile ? 'Updating...' : 'Update Profile' }}
          </UButton>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h2>
      
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Password</label>
          <UInput
            v-model="passwordForm.current_password"
            type="password"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
          <UInput
            v-model="passwordForm.new_password"
            type="password"
            required
            minlength="8"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirm New Password</label>
          <UInput
            v-model="passwordForm.confirm_password"
            type="password"
            required
          />
        </div>
        
        <div class="flex justify-end">
          <UButton
            type="submit"
            :disabled="changingPassword || !passwordsMatch"
            :loading="changingPassword"
            color="red"
          >
            {{ changingPassword ? 'Changing...' : 'Change Password' }}
          </UButton>
        </div>
      </form>
    </div>

    <!-- Account Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account Information</h2>
      
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium text-gray-500 dark:text-gray-400">User ID:</span>
          <p class="font-mono text-gray-900 dark:text-gray-100">{{ user?.id }}</p>
        </div>
        <div>
          <span class="font-medium text-gray-500 dark:text-gray-400">Organization ID:</span>
          <p class="font-mono text-gray-900 dark:text-gray-100">{{ user?.organization_id }}</p>
        </div>
        <div>
          <span class="font-medium text-gray-500 dark:text-gray-400">Permissions:</span>
          <p class="text-gray-900 dark:text-gray-100">{{ user?.permissions?.join(', ') || 'None' }}</p>
        </div>
        <div>
          <span class="font-medium text-gray-500 dark:text-gray-400">Plan:</span>
          <p class="capitalize text-gray-900 dark:text-gray-100">{{ organization?.plan || 'Unknown' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, organization } = useAuth()



const updatingProfile = ref(false)
const changingPassword = ref(false)

const profileForm = ref({
  name: user.value?.name || ''
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const passwordsMatch = computed(() => {
  return passwordForm.value.new_password === passwordForm.value.confirm_password
})

// Computed properties for form fields
const userEmail = computed(() => user.value?.email || '')
const userRole = computed(() => user.value?.role || '')
const organizationName = computed(() => organization.value?.name || '')

// Initialize form with current user data
watch(user, (newUser) => {
  if (newUser) {
    profileForm.value.name = newUser.name
  }
}, { immediate: true })

const updateProfile = async () => {
  updatingProfile.value = true
  
  try {
    // TODO: Implement profile update API call
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    // TODO: Add toast notification
    alert('Profile updated successfully')
  } catch (error) {
    alert('Failed to update profile')
  } finally {
    updatingProfile.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordsMatch.value) {
    alert('Passwords do not match')
    return
  }
  
  changingPassword.value = true
  
  try {
    const { changePassword } = useAuth()
    await changePassword(passwordForm.value)
    
    alert('Password changed successfully')
    // Clear form
    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  } catch (error) {
    alert('Failed to change password')
  } finally {
    changingPassword.value = false
  }
}
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-metrobnb-50 via-white to-metrobnb-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-key" class="h-8 w-8 text-metrobnb-600 dark:text-metrobnb-400" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Password Change Required
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Please change your temporary password to continue
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
          <form @submit.prevent="handlePasswordChange" class="space-y-5">
            <UInput
              v-model="form.currentPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Current temporary password"
              size="lg"
              required
            >
              <template #trailing>
                <button
                  type="button"
                  @click.stop="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 p-2 pointer-events-auto cursor-pointer z-10 relative"
                >
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </template>
            </UInput>
            
            <UInput
              v-model="form.newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="New password"
              size="lg"
              required
            >
              <template #trailing>
                <button
                  type="button"
                  @click.stop="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 p-2 pointer-events-auto cursor-pointer z-10 relative"
                >
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </template>
            </UInput>
            
            <UInput
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
              size="lg"
              required
            >
              <template #trailing>
                <button
                  type="button"
                  @click.stop="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 p-2 pointer-events-auto cursor-pointer z-10 relative"
                >
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </template>
            </UInput>
            
            <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
            </div>
            
            <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p class="text-green-600 dark:text-green-400 text-sm">{{ success }}</p>
            </div>
            
            <UButton type="submit" :loading="loading" color="primary" size="lg" block>
              {{ loading ? 'Changing Password...' : 'Change Password' }}
            </UButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { changePassword, login } = useAuth()
const router = useRouter()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)
const showPassword = ref(false)

// Get email from cookie for fresh login
const userCookie = useCookie('user_data')
const userEmail = computed(() => userCookie.value?.email || '')

const handlePasswordChange = async () => {
  error.value = ''
  success.value = ''
  
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (form.value.newPassword.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  loading.value = true
  
  try {
    // Change password
    await changePassword({
      current_password: form.value.currentPassword,
      new_password: form.value.newPassword
    })
    
    success.value = 'Password changed successfully! Logging you in...'
    
    // Fresh login required after password change
    setTimeout(async () => {
      try {
        await login({ 
          email: userEmail.value, 
          password: form.value.newPassword 
        })
        router.push('/dashboard')
      } catch (loginErr) {
        router.push('/login')
      }
    }, 1500)
    
  } catch (err: any) {
    error.value = err.message || 'Failed to change password'
  } finally {
    loading.value = false
  }
}
</script>
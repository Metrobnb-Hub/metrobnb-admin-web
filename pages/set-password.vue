<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-key" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ route.query.temp_login ? 'Welcome! Set Your Password' : 'Set Your Password' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ route.query.temp_login 
              ? 'Complete your account setup by creating a secure password' 
              : 'Create a secure password for your MetroBNB account' 
            }}
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
          <form @submit.prevent="handleSetPassword" class="space-y-5">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Your email address"
              size="lg"
              required
              :disabled="!!route.query.email || !!route.query.temp_login"
            />
            
            <UInput
              v-if="route.query.temp_login"
              v-model="form.currentPassword"
              type="password"
              placeholder="Temporary password from invitation"
              size="lg"
              required
            />
            
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create new password"
              size="lg"
              required
            >
              <template #trailing>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 p-2"
                >
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </template>
            </UInput>
            
            <UInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm new password"
              size="lg"
              required
            />
            
            <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
            </div>
            
            <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p class="text-green-600 dark:text-green-400 text-sm">{{ success }}</p>
            </div>
            
            <UButton type="submit" :loading="loading" color="primary" size="lg" block>
              {{ loading ? 'Setting Password...' : 'Set Password' }}
            </UButton>
          </form>
          
          <div v-if="!route.query.temp_login" class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Already have a password?
              <NuxtLink to="/login" class="font-semibold text-blue-600 hover:text-blue-500 ml-1">
                Sign in
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { setInitialPassword } = useAuth()
const route = useRoute()
const router = useRouter()

const form = ref({
  email: (route.query.email as string) || '',
  currentPassword: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleSetPassword = async () => {
  error.value = ''
  success.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  loading.value = true
  
  try {
    await setInitialPassword(form.value.email, form.value.currentPassword, form.value.password)
    
    if (route.query.temp_login) {
      success.value = 'Password set successfully! Logging you in...'
      
      // Auto-login after password setup
      setTimeout(async () => {
        try {
          const { login } = useAuth()
          await login({ email: form.value.email, password: form.value.password })
          router.push('/dashboard')
        } catch (loginErr) {
          router.push('/login')
        }
      }, 1500)
    } else {
      success.value = 'Password set successfully! You can now login with your new password.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to set password'
  } finally {
    loading.value = false
  }
}
</script>
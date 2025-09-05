<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-envelope" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Enter your email to receive password reset instructions
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
          <form @submit.prevent="handleResetPassword" class="space-y-5">
            <UInput
              v-model="email"
              type="email"
              placeholder="Your email address"
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
              {{ loading ? 'Sending...' : 'Send Reset Email' }}
            </UButton>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Remember your password?
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

const { resetPassword } = useAuth()

const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleResetPassword = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  
  try {
    await resetPassword(email.value)
    success.value = 'Password reset email sent! Check your inbox for instructions.'
  } catch (err: any) {
    error.value = err.message || 'Failed to send reset email'
  } finally {
    loading.value = false
  }
}
</script>
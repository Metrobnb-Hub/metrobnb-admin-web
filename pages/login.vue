<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Mobile-First Design -->
    <div class="min-h-screen flex flex-col lg:flex-row">
      <!-- Mobile Header / Desktop Left Side -->
      <div class="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <!-- Mobile: Compact header -->
        <div class="lg:hidden p-6 text-center text-white">
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-home-modern" class="h-8 w-8" />
          </div>
          <h1 class="text-3xl font-bold mb-2">MetroBNB</h1>
          <p class="text-blue-100 mb-4">Property Management Made Simple</p>
          
          <div class="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-xs font-semibold">BETA TESTING</span>
          </div>
        </div>
        
        <!-- Desktop: Full branding -->
        <div class="hidden lg:flex lg:h-full lg:items-center lg:justify-center lg:p-12">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative z-10 text-white max-w-md">
            <div class="mb-8">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <UIcon name="i-heroicons-home-modern" class="h-8 w-8" />
              </div>
              <h1 class="text-4xl font-bold mb-4">MetroBNB</h1>
              <p class="text-xl text-blue-100">Property Management Made Simple</p>
            </div>
            
            <div class="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 mb-6">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm font-semibold">BETA TESTING</span>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-white rounded-full"></div>
                <span class="text-blue-100">Manage multiple properties effortlessly</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-white rounded-full"></div>
                <span class="text-blue-100">Track bookings and expenses in real-time</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-white rounded-full"></div>
                <span class="text-blue-100">Generate invoices automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Form Section -->
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div class="w-full max-w-md">
          <!-- Desktop-only header -->
          <div class="hidden lg:block text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>
          
          <!-- Mobile: Simple header -->
          <div class="lg:hidden text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Sign in to continue
            </p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
            <form @submit.prevent="handleLogin" class="space-y-5">
              <div class="space-y-4">
                <UInput
                  v-model="credentials.email"
                  type="email"
                  placeholder="Email address"
                  size="lg"
                  required
                  class="w-full"
                />
                
                <UInput
                  v-model="credentials.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  size="lg"
                  required
                  class="w-full"
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
              </div>
              
              <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
              </div>
              
              <UButton type="submit" :loading="loading" color="primary" size="lg" block class="font-semibold">
                {{ loading ? 'Signing in...' : 'Sign in' }}
              </UButton>
            </form>
            
            <!-- Test Credentials Helper (Dev Mode Only) -->
            <div v-if="config.public.devMode" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Test Credentials (Dev Mode):</p>
              <div class="space-y-1 text-xs">
                <button @click="fillCredentials('admin')" class="block w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded">
                  <strong>Admin:</strong> {{ config.public.testCredentials.admin.email }} / {{ config.public.testCredentials.admin.password }}
                </button>
                <button @click="fillCredentials('staff')" class="block w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded">
                  <strong>Staff:</strong> {{ config.public.testCredentials.staff.email }} / {{ config.public.testCredentials.staff.password }}
                </button>
                <button @click="fillCredentials('partner')" class="block w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-1 rounded">
                  <strong>Partner:</strong> {{ config.public.testCredentials.partner.email }} / {{ config.public.testCredentials.partner.password }}
                </button>
              </div>
            </div>
            
            <div class="mt-6 text-center">
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                New to MetroBNB?
                <NuxtLink to="/register" class="font-semibold text-blue-600 hover:text-blue-500 ml-1">
                  Create account
                </NuxtLink>
              </p>
            </div>
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

const { login, loading } = useAuth()
const { handleError, handleSuccess } = useErrorHandler()
const router = useRouter()
const config = useRuntimeConfig()

const credentials = ref({
  email: config.public.devMode ? config.public.testCredentials.admin.email : '',
  password: config.public.devMode ? config.public.testCredentials.admin.password : ''
})

const error = ref('')
const showPassword = ref(false)

const fillCredentials = (role: string) => {
  const testCreds = config.public.testCredentials[role as keyof typeof config.public.testCredentials]
  if (testCreds) {
    credentials.value = { email: testCreds.email, password: testCreds.password }
  }
}

const handleLogin = async () => {
  error.value = ''
  
  try {
    await login(credentials.value)
    handleSuccess('login')
    await router.push('/dashboard')
  } catch (err: any) {
    error.value = handleError(err)
  }
}
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="min-h-screen flex flex-col lg:flex-row">
      <!-- Mobile Header / Desktop Left Side -->
      <div class="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <!-- Mobile: Compact header with progress -->
        <div class="lg:hidden p-4 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-home-modern" class="h-5 w-5" />
              </div>
              <div>
                <h1 class="text-xl font-bold">MetroBNB</h1>
                <div class="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 inline-flex items-center space-x-1">
                  <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-xs font-semibold">BETA</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-blue-100 mb-1">Step {{ currentStep }} of 3</div>
              <div class="flex space-x-1">
                <div v-for="i in 3" :key="i" :class="[
                  'w-6 h-1 rounded-full transition-all',
                  currentStep >= i ? 'bg-white' : 'bg-white/30'
                ]"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Desktop: Full branding -->
        <div class="hidden lg:flex lg:h-full lg:flex-col lg:justify-between lg:p-12">
          <div class="absolute inset-0 bg-black/10"></div>
        
        <!-- Header -->
        <div class="relative z-10 text-white">
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-home-modern" class="h-8 w-8" />
          </div>
          <h1 class="text-4xl font-bold mb-2">MetroBNB</h1>
          <p class="text-blue-100">Join thousands of property managers</p>
        </div>
        
        <!-- Progress Steps -->
        <div class="relative z-10 text-white">
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                currentStep >= 1 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
              ]">
                {{ currentStep > 1 ? '✓' : '1' }}
              </div>
              <div>
                <p class="font-semibold">Tell us about yourself</p>
                <p class="text-blue-100 text-sm">Basic information</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                currentStep >= 2 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
              ]">
                {{ currentStep > 2 ? '✓' : '2' }}
              </div>
              <div>
                <p class="font-semibold">Your business type</p>
                <p class="text-blue-100 text-sm">How do you manage properties?</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                currentStep >= 3 ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
              ]">
                {{ currentStep > 3 ? '✓' : '3' }}
              </div>
              <div>
                <p class="font-semibold">Choose your plan</p>
                <p class="text-blue-100 text-sm">Select what works for you</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Beta Badge & Footer -->
        <div class="relative z-10 text-white">
          <div class="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 mb-4">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-semibold">BETA TESTING</span>
          </div>
          <div class="text-white/80 text-sm">
            <p>"MetroBNB helped us scale from 5 to 50 properties seamlessly."</p>
            <p class="mt-2 font-semibold">- Maria Santos, Property Manager</p>
          </div>
        </div>
        </div>
      </div>
      
      <!-- Form Section -->
      <div class="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div class="w-full max-w-md">
          
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 1">
              <div class="text-center mb-6">
                <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Let's get started
                </h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                  Tell us a bit about yourself
                </p>
              </div>
              
              <div class="space-y-4">
                <UInput
                  v-model="formData.name"
                  placeholder="Your full name"
                  size="lg"
                  required
                />
                <UInput
                  v-model="formData.email"
                  type="email"
                  placeholder="Email address"
                  size="lg"
                  required
                />
                <UInput
                  v-model="formData.password"
                  type="password"
                  placeholder="Create a password"
                  size="lg"
                  required
                />
              </div>
              
              <UButton @click="nextStep" :disabled="!canProceedStep1" color="primary" size="lg" block class="mt-6">
                Continue
              </UButton>
            </div>
            
            <!-- Step 2: Business Type -->
            <div v-if="currentStep === 2">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  How do you manage properties?
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  This helps us customize your experience
                </p>
              </div>
              
              <div class="space-y-3">
                <div 
                  v-for="type in businessTypes" 
                  :key="type.value"
                  @click="formData.business_type = type.value"
                  :class="[
                    'p-4 border-2 rounded-xl cursor-pointer transition-all',
                    formData.business_type === type.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-start space-x-3">
                    <UIcon :name="type.icon" class="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ type.title }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ type.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <UInput
                v-model="formData.organization_name"
                placeholder="Company/Organization name"
                size="lg"
                class="mt-4"
                required
              />
              
              <div class="flex space-x-3 mt-6">
                <UButton @click="prevStep" variant="outline" size="lg" class="flex-1">
                  Back
                </UButton>
                <UButton @click="nextStep" :disabled="!canProceedStep2" color="primary" size="lg" class="flex-1">
                  Continue
                </UButton>
              </div>
            </div>
            
            <!-- Step 3: Plan Selection -->
            <div v-if="currentStep === 3">
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Choose your plan
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                  You can always upgrade later
                </p>
              </div>
              
              <div class="space-y-3">
                <div 
                  v-for="plan in plans" 
                  :key="plan.value"
                  @click="formData.plan = plan.value"
                  :class="[
                    'p-4 border-2 rounded-xl cursor-pointer transition-all',
                    formData.plan === plan.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  ]"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ plan.title }}</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ plan.description }}</p>
                      <div class="text-xs text-gray-500">
                        <span v-for="feature in plan.features" :key="feature" class="block">• {{ feature }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-gray-900 dark:text-white">{{ plan.price }}</div>
                      <div class="text-xs text-gray-500">{{ plan.billing }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4">
                <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
              </div>
              
              <div class="flex space-x-3 mt-6">
                <UButton @click="prevStep" variant="outline" size="lg" class="flex-1">
                  Back
                </UButton>
                <UButton @click="handleRegister" :loading="loading" color="primary" size="lg" class="flex-1">
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </UButton>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-6">
            <p class="text-gray-600 dark:text-gray-400">
              Already have an account?
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

const { register, loading } = useAuth()
const { notifySuccess, notifyError } = useNotify()

const currentStep = ref(1)
const formData = ref({
  email: '',
  password: '',
  name: '',
  organization_name: '',
  business_type: '',
  plan: 'starter' as 'starter' | 'pro' | 'enterprise'
})

const error = ref('')

const businessTypes = [
  {
    value: 'property_manager',
    title: 'Property Management Company',
    description: 'I manage multiple properties for different owners',
    icon: 'i-heroicons-building-office-2'
  },
  {
    value: 'individual_owner',
    title: 'Individual Property Owner',
    description: 'I own and manage my own properties',
    icon: 'i-heroicons-home-modern'
  },
  {
    value: 'partner_network',
    title: 'Partner Network',
    description: 'I work with partners who manage units for me',
    icon: 'i-heroicons-users'
  }
]

const plans = [
  {
    value: 'starter',
    title: 'Starter',
    description: 'Perfect for getting started',
    price: 'Free',
    billing: 'Forever',
    features: ['Up to 5 units', 'Basic reporting', 'Email support']
  },
  {
    value: 'pro',
    title: 'Professional',
    description: 'For growing businesses',
    price: '₱1,499',
    billing: 'per month',
    features: ['Up to 25 units', 'Advanced analytics', 'Priority support', 'Team collaboration']
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    description: 'For large operations',
    price: '₱4,999',
    billing: 'per month',
    features: ['Unlimited units', 'Custom integrations', 'Dedicated support', 'White-label options']
  }
]

const canProceedStep1 = computed(() => {
  return formData.value.name && formData.value.email && formData.value.password
})

const canProceedStep2 = computed(() => {
  return formData.value.business_type && formData.value.organization_name
})

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleRegister = async () => {
  error.value = ''
  
  try {
    await register(formData.value)
    notifySuccess('Account created successfully!')
    await navigateTo('/dashboard')
  } catch (err: any) {
    error.value = err.message
    notifyError(err.message)
  }
}
</script>
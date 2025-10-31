<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">OpenAPI Integration Test</h1>
    
    <!-- Connection Status -->
    <UCard class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold">API Connection Status</h2>
      </template>
      
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <div :class="[
            'w-3 h-3 rounded-full mr-2',
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          ]"></div>
          <span class="capitalize">{{ connectionStatus }}</span>
        </div>
        
        <div class="flex items-center">
          <div :class="[
            'w-3 h-3 rounded-full mr-2',
            authStatus === 'authenticated' ? 'bg-green-500' : 'bg-red-500'
          ]"></div>
          <span>{{ authStatus === 'authenticated' ? 'Authenticated' : 'Not Authenticated' }}</span>
        </div>
        
        <UButton @click="testConnection" :loading="testing" size="sm">
          Test Connection
        </UButton>
        
        <UButton @click="testLogin" :loading="loggingIn" size="sm" color="blue" v-if="authStatus === 'unauthenticated'">
          Test Login
        </UButton>
      </div>
      
      <div v-if="authStatus === 'unauthenticated'" class="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded">
        ⚠️ You need to login first to test the API endpoints. Click "Test Login" or go to the login page.
      </div>
      
      <div v-if="connectionError" class="mt-4 p-3 bg-red-50 text-red-700 rounded">
        {{ connectionError }}
      </div>
    </UCard>

    <!-- API Methods Test -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Partners Test -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Partners API</h3>
        </template>
        
        <div class="space-y-4">
          <UButton @click="testPartners" :loading="loadingPartners" block>
            Load Partners
          </UButton>
          
          <div v-if="partners.length > 0" class="space-y-2">
            <div 
              v-for="partner in partners.slice(0, 3)" 
              :key="partner.id"
              class="p-2 bg-gray-50 rounded text-sm"
            >
              <div class="font-medium">{{ partner.name }}</div>
              <div class="text-gray-600">{{ partner.share_percentage }}% • {{ partner.partner_code }}</div>
            </div>
            <div v-if="partners.length > 3" class="text-sm text-gray-500">
              ...and {{ partners.length - 3 }} more
            </div>
          </div>
          
          <div v-else-if="!loadingPartners" class="text-gray-500 text-sm">
            No partners loaded yet
          </div>
        </div>
      </UCard>

      <!-- Units Test -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Units API</h3>
        </template>
        
        <div class="space-y-4">
          <UButton @click="testUnits" :loading="loadingUnits" block>
            Load Units
          </UButton>
          
          <div v-if="units.length > 0" class="space-y-2">
            <div 
              v-for="unit in units.slice(0, 3)" 
              :key="unit.id"
              class="p-2 bg-gray-50 rounded text-sm"
            >
              <div class="font-medium">{{ unit.name }}</div>
              <div class="text-gray-600">{{ unit.type || 'No type' }} • {{ unit.city || 'No city' }}</div>
            </div>
            <div v-if="units.length > 3" class="text-sm text-gray-500">
              ...and {{ units.length - 3 }} more
            </div>
          </div>
          
          <div v-else-if="!loadingUnits" class="text-gray-500 text-sm">
            No units loaded yet
          </div>
        </div>
      </UCard>

      <!-- Bookings Test -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Bookings API</h3>
        </template>
        
        <div class="space-y-4">
          <UButton @click="testBookings" :loading="loadingBookings" block>
            Load Bookings
          </UButton>
          
          <div v-if="bookings.length > 0" class="space-y-2">
            <div 
              v-for="booking in bookings.slice(0, 3)" 
              :key="booking.id"
              class="p-2 bg-gray-50 rounded text-sm"
            >
              <div class="font-medium">{{ booking.guest_name }}</div>
              <div class="text-gray-600">{{ booking.start_date }} • ₱{{ booking.base_amount }}</div>
            </div>
            <div v-if="bookings.length > 3" class="text-sm text-gray-500">
              ...and {{ bookings.length - 3 }} more
            </div>
          </div>
          
          <div v-else-if="!loadingBookings" class="text-gray-500 text-sm">
            No bookings loaded yet
          </div>
        </div>
      </UCard>

      <!-- Services Test -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Services API</h3>
        </template>
        
        <div class="space-y-4">
          <UButton @click="testServices" :loading="loadingServices" block>
            Load Services
          </UButton>
          
          <div v-if="services.length > 0" class="space-y-2">
            <div 
              v-for="service in services" 
              :key="service.id"
              class="p-2 bg-gray-50 rounded text-sm"
            >
              <div class="font-medium">{{ service.name }}</div>
              <div class="text-gray-600">{{ service.description || 'No description' }}</div>
            </div>
          </div>
          
          <div v-else-if="!loadingServices" class="text-gray-500 text-sm">
            No services loaded yet
          </div>
        </div>
      </UCard>
    </div>

    <!-- Raw Response Debug -->
    <UCard class="mt-6">
      <template #header>
        <h3 class="text-lg font-semibold">Last API Response (Debug)</h3>
      </template>
      
      <pre class="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-64">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { 
  PartnerResponse, 
  UnitResponse, 
  BookingResponse, 
  ServiceResponse 
} from '~/types/generated-api'

// Page metadata
definePageMeta({
  title: 'API Test',
  layout: 'default'
})

// Typed API client
const api = useTypedApi()

// Reactive state
const connectionStatus = ref<'connecting' | 'connected' | 'error'>('connecting')
const authStatus = ref<'authenticated' | 'unauthenticated'>('unauthenticated')
const connectionError = ref<string | null>(null)
const testing = ref(false)
const loggingIn = ref(false)
const lastResponse = ref<any>(null)

// Data state
const partners = ref<PartnerResponse[]>([])
const units = ref<UnitResponse[]>([])
const bookings = ref<BookingResponse[]>([])
const services = ref<ServiceResponse[]>([])

// Loading states
const loadingPartners = ref(false)
const loadingUnits = ref(false)
const loadingBookings = ref(false)
const loadingServices = ref(false)

// Test connection to API
const testConnection = async () => {
  testing.value = true
  connectionError.value = null
  
  try {
    // Check auth status
    const tokenCookie = useCookie('auth_token')
    authStatus.value = tokenCookie.value ? 'authenticated' : 'unauthenticated'
    
    // Try to fetch OpenAPI spec as a simple connectivity test
    const response = await fetch('http://localhost:8000/openapi.json')
    
    if (response.ok) {
      connectionStatus.value = 'connected'
      const spec = await response.json()
      lastResponse.value = { 
        connection: 'success', 
        api_title: spec.info?.title,
        api_version: spec.info?.version,
        auth_token: tokenCookie.value ? 'present' : 'missing'
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error: any) {
    connectionStatus.value = 'error'
    connectionError.value = error.message
    lastResponse.value = { connection: 'error', error: error.message }
  } finally {
    testing.value = false
  }
}

// Test Partners API
const testPartners = async () => {
  loadingPartners.value = true
  
  try {
    const response = await api.getPartners({ limit: 10 })
    lastResponse.value = response
    
    if (response.success) {
      if (Array.isArray(response.data)) {
        partners.value = response.data
      } else if (response.data?.items) {
        partners.value = response.data.items
      }
    }
  } catch (error: any) {
    lastResponse.value = { error: error.message }
    const toast = useToast()
    toast.add({
      title: 'Partners API Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loadingPartners.value = false
  }
}

// Test Units API
const testUnits = async () => {
  loadingUnits.value = true
  
  try {
    const response = await api.getUnits({ limit: 10 })
    lastResponse.value = response
    
    if (response.success) {
      if (Array.isArray(response.data)) {
        units.value = response.data
      } else if (response.data?.items) {
        units.value = response.data.items
      }
    }
  } catch (error: any) {
    lastResponse.value = { error: error.message }
    const toast = useToast()
    toast.add({
      title: 'Units API Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loadingUnits.value = false
  }
}

// Test Bookings API
const testBookings = async () => {
  loadingBookings.value = true
  
  try {
    const response = await api.getBookings({ limit: 10 })
    lastResponse.value = response
    
    if (response.success) {
      if (Array.isArray(response.data)) {
        bookings.value = response.data
      } else if (response.data?.items) {
        bookings.value = response.data.items
      }
    }
  } catch (error: any) {
    lastResponse.value = { error: error.message }
    const toast = useToast()
    toast.add({
      title: 'Bookings API Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loadingBookings.value = false
  }
}

// Test Services API
const testServices = async () => {
  loadingServices.value = true
  
  try {
    const response = await api.getServices()
    lastResponse.value = response
    
    if (response.success) {
      services.value = response.data || []
    }
  } catch (error: any) {
    lastResponse.value = { error: error.message }
    const toast = useToast()
    toast.add({
      title: 'Services API Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loadingServices.value = false
  }
}

// Test login with demo credentials
const testLogin = async () => {
  loggingIn.value = true
  
  try {
    const response = await api.login({
      email: 'admin@metrobnb.com', // Replace with your test email
      password: 'password123'       // Replace with your test password
    })
    
    lastResponse.value = response
    
    if (response.success) {
      authStatus.value = 'authenticated'
      const toast = useToast()
      toast.add({
        title: 'Login Success',
        description: 'You can now test the API endpoints',
        color: 'green'
      })
    } else {
      const toast = useToast()
      toast.add({
        title: 'Login Failed',
        description: response.error?.message || 'Invalid credentials',
        color: 'red'
      })
    }
  } catch (error: any) {
    lastResponse.value = { error: error.message }
    const toast = useToast()
    toast.add({
      title: 'Login Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loggingIn.value = false
  }
}

// Test connection on mount
onMounted(() => {
  testConnection()
})
</script>

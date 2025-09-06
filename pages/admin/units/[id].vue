<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <div v-if="loading" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto mb-2" />
      Loading unit details...
    </div>
    
    <div v-else-if="unit">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ unit.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">{{ unit.city || unit.location }}</p>
        </div>
        
        <div class="flex items-center gap-4">
          <span 
            :class="getStatusClass(unit.status)"
            class="px-3 py-1 rounded-full text-sm font-medium capitalize"
          >
            {{ unit.status || 'active' }}
          </span>
          
          <UButton
            v-if="canEdit"
            @click="editUnit"
            color="primary"
          >
            <UIcon name="i-heroicons-pencil" class="mr-2" />
            Edit Unit
          </UButton>
        </div>
      </div>

      <!-- Unit Image Placeholder -->
      <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div class="text-center">
          <UIcon name="i-heroicons-photo" class="h-16 w-16 text-gray-400 mx-auto mb-2" />
          <p class="text-gray-500 dark:text-gray-400">Unit Photo</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                <p class="text-gray-900 dark:text-white capitalize">{{ unit.type || 'Not specified' }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</label>
                <p class="text-gray-900 dark:text-white">{{ unit.capacity || 2 }} guests</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Partner</label>
                <p class="text-gray-900 dark:text-white">{{ unit.partner?.name || 'Unknown' }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Building</label>
                <p class="text-gray-900 dark:text-white">{{ unit.building || 'Not specified' }}</p>
              </div>
            </div>
            
            <div v-if="unit.description" class="mt-4">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
              <p class="text-gray-900 dark:text-white">{{ unit.description }}</p>
            </div>
          </div>

          <!-- Property Details -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Property Details</h2>
            
            <div class="grid grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl mb-2">🛏️</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ unit.bedrooms || 0 }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl mb-2">🛌</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ unit.beds || 0 }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Beds</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl mb-2">🚿</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ unit.bathrooms || 0 }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="unit.amenities?.length" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Amenities</h2>
            
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in unit.amenities"
                :key="amenity"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm capitalize"
              >
                {{ amenity }}
              </span>
            </div>
          </div>

          <!-- House Rules -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">House Rules</h2>
            
            <div class="grid grid-cols-3 gap-4">
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="unit.pets_allowed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="unit.pets_allowed ? 'text-green-500' : 'text-red-500'"
                />
                <span class="text-gray-900 dark:text-white">Pets {{ unit.pets_allowed ? 'Allowed' : 'Not Allowed' }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="unit.smoking_allowed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="unit.smoking_allowed ? 'text-green-500' : 'text-red-500'"
                />
                <span class="text-gray-900 dark:text-white">Smoking {{ unit.smoking_allowed ? 'Allowed' : 'Not Allowed' }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="unit.parties_allowed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="unit.parties_allowed ? 'text-green-500' : 'text-red-500'"
                />
                <span class="text-gray-900 dark:text-white">Parties {{ unit.parties_allowed ? 'Allowed' : 'Not Allowed' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Pricing -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pricing</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Base Price</span>
                <span class="font-semibold text-gray-900 dark:text-white">${{ unit.base_price || 0 }}/night</span>
              </div>
              
              <div v-if="unit.extra_guest_fee" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Extra Guest Fee</span>
                <span class="font-semibold text-gray-900 dark:text-white">${{ unit.extra_guest_fee }}/guest</span>
              </div>
              
              <div v-if="unit.cleaning_fee" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Cleaning Fee</span>
                <span class="font-semibold text-gray-900 dark:text-white">${{ unit.cleaning_fee }}</span>
              </div>
            </div>
          </div>

          <!-- Check-in/Check-out -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Check-in/Check-out</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Check-in</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ unit.check_in_time || '15:00' }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Check-out</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ unit.check_out_time || '11:00' }}</span>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location</h2>
            
            <div class="space-y-2">
              <div v-if="unit.location">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                <p class="text-gray-900 dark:text-white">{{ unit.location }}</p>
              </div>
              
              <div v-if="unit.city">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">City</label>
                <p class="text-gray-900 dark:text-white">{{ unit.city }}</p>
              </div>
              
              <div v-if="unit.landmarks?.length">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nearby Landmarks</label>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="landmark in unit.landmarks"
                    :key="landmark"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                  >
                    {{ landmark }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Airbnb Integration -->
          <div v-if="unit.airbnb_url || unit.airbnb_rating" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Airbnb</h2>
            
            <div class="space-y-3">
              <div v-if="unit.airbnb_rating" class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Rating</span>
                <span class="font-semibold text-gray-900 dark:text-white">⭐ {{ unit.airbnb_rating }}/5</span>
              </div>
              
              <div v-if="unit.airbnb_url">
                <UButton
                  :to="unit.airbnb_url"
                  external
                  target="_blank"
                  color="red"
                  variant="outline"
                  size="sm"
                  block
                >
                  View on Airbnb
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Unit not found</h3>
      <p class="text-gray-500 dark:text-gray-400">The unit you're looking for doesn't exist or you don't have access to it.</p>
    </div>

    <!-- Edit Modal -->
    <UModal v-model="showEditModal">
      <UnitForm
        :unit="unit"
        @close="showEditModal = false"
        @saved="handleUnitSaved"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { user } = useAuth()
const { getUnits } = useApi()

const loading = ref(true)
const unit = ref<Unit | null>(null)
const showEditModal = ref(false)

const canEdit = computed(() => {
  if (!user.value || !unit.value) return false
  
  if (['admin', 'manager'].includes(user.value.role)) {
    return true
  }
  
  return user.value.accessible_partners?.includes(unit.value.partner_id) || false
})

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || classes.active
}

const loadUnit = async () => {
  loading.value = true
  try {
    const units = await getUnits()
    const unitArray = Array.isArray(units) ? units : []
    unit.value = unitArray.find(u => u.id === route.params.id) || null
  } catch (error) {
    unit.value = null
  } finally {
    loading.value = false
  }
}

const editUnit = () => {
  showEditModal.value = true
}

const handleUnitSaved = () => {
  showEditModal.value = false
  loadUnit()
}

// Load unit on mount
onMounted(() => {
  loadUnit()
})
</script>
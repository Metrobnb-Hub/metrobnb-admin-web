<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
      {{ isEdit ? 'Edit Unit' : 'Create New Unit' }}
    </h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h4>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unit Name</label>
            <UInput
              v-model="form.name"
              type="text"
              required
              placeholder="e.g., Downtown Loft A"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Partner</label>
            <USelect
              v-model="form.partner_id"
              :options="partnerOptions"
              placeholder="Select Partner"
              required
              :disabled="!canChangePartner"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
            <USelect
              v-model="form.type"
              :options="typeOptions"
              placeholder="Select Type"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
            <USelect
              v-model="form.status"
              :options="statusOptions"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Capacity</label>
            <UInput
              v-model.number="form.capacity"
              type="number"
              min="1"
              placeholder="2"
            />
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <UTextarea
            v-model="form.description"
            rows="3"
            placeholder="Describe the unit's features and amenities..."
          />
        </div>
      </div>

      <!-- Location -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Location</h4>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>
            <UInput
              v-model="form.location"
              type="text"
              placeholder="Street address"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">City</label>
              <UInput
                v-model="form.city"
                type="text"
                placeholder="City"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Building</label>
              <UInput
                v-model="form.building"
                type="text"
                placeholder="Building name"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Landmarks</label>
            <UInput
              v-model="landmarksText"
              type="text"
              placeholder="Mall of Asia, Airport (comma separated)"
            />
          </div>
        </div>
      </div>

      <!-- Property Details -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Property Details</h4>
        
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bedrooms</label>
            <UInput
              v-model.number="form.bedrooms"
              type="number"
              min="0"
              placeholder="1"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Beds</label>
            <UInput
              v-model.number="form.beds"
              type="number"
              min="0"
              placeholder="1"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bathrooms</label>
            <UInput
              v-model.number="form.bathrooms"
              type="number"
              min="0"
              step="0.5"
              placeholder="1"
            />
          </div>
        </div>
      </div>

      <!-- Pricing -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Pricing</h4>
        
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Base Price (per night)</label>
            <UInput
              v-model.number="form.base_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="100.00"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Extra Guest Fee</label>
            <UInput
              v-model.number="form.extra_guest_fee"
              type="number"
              min="0"
              step="0.01"
              placeholder="25.00"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cleaning Fee</label>
            <UInput
              v-model.number="form.cleaning_fee"
              type="number"
              min="0"
              step="0.01"
              placeholder="50.00"
            />
          </div>
        </div>
      </div>

      <!-- Amenities & Features -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Amenities & Features</h4>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amenities</label>
            <UInput
              v-model="amenitiesText"
              type="text"
              placeholder="wifi, parking, pool, gym (comma separated)"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Special Features</label>
            <UTextarea
              v-model="form.special_features"
              rows="2"
              placeholder="Balcony with city view, Smart TV, etc."
            />
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="flex items-center space-x-2">
              <UCheckbox v-model="form.pets_allowed" />
              <label class="text-sm text-gray-700 dark:text-gray-300">Pets Allowed</label>
            </div>
            
            <div class="flex items-center space-x-2">
              <UCheckbox v-model="form.smoking_allowed" />
              <label class="text-sm text-gray-700 dark:text-gray-300">Smoking Allowed</label>
            </div>
            
            <div class="flex items-center space-x-2">
              <UCheckbox v-model="form.parties_allowed" />
              <label class="text-sm text-gray-700 dark:text-gray-300">Parties Allowed</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Check-in/Check-out -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Check-in/Check-out</h4>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Check-in Time</label>
            <UInput
              v-model="form.check_in_time"
              type="time"
              placeholder="15:00"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Check-out Time</label>
            <UInput
              v-model="form.check_out_time"
              type="time"
              placeholder="11:00"
            />
          </div>
        </div>
      </div>

      <!-- Airbnb Integration -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Airbnb Integration</h4>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Airbnb URL</label>
            <UInput
              v-model="form.airbnb_url"
              type="url"
              placeholder="https://airbnb.com/rooms/..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Airbnb Rating</label>
            <UInput
              v-model.number="form.airbnb_rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="4.8"
            />
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 class="text-md font-semibold mb-4 text-gray-900 dark:text-white">Additional Notes</h4>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Remarks</label>
            <UTextarea
              v-model="form.remarks"
              rows="3"
              placeholder="Any additional notes or special instructions..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Legacy Notes</label>
            <UTextarea
              v-model="form.notes"
              rows="2"
              placeholder="Legacy notes field..."
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-4">
        <UButton
          type="button"
          @click="$emit('close')"
          variant="ghost"
        >
          Cancel
        </UButton>
        
        <UButton
          type="submit"
          :loading="saving"
          color="primary"
        >
          {{ saving ? 'Saving...' : (isEdit ? 'Update Unit' : 'Create Unit') }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '~/types/api'

const props = defineProps<{
  unit?: Unit | null
  preselectedPartner?: string
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { user } = useAuth()
const { getPartners, createUnit, updateUnit } = useApi()

const isEdit = computed(() => !!props.unit)
const saving = ref(false)
const partners = ref([])

const form = ref({
  name: '',
  partner_id: '',
  type: '',
  description: '',
  capacity: 2,
  city: '',
  building: '',
  landmarks: [] as string[],
  base_price: 0,
  extra_guest_fee: 0,
  cleaning_fee: 0,
  amenities: [] as string[],
  special_features: '',
  check_in_time: '15:00',
  check_out_time: '11:00',
  pets_allowed: false,
  smoking_allowed: false,
  parties_allowed: false,
  remarks: '',
  status: 'active',
  airbnb_url: '',
  airbnb_rating: 0,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  location: '',
  notes: ''
})

// Text representations for arrays
const landmarksText = ref('')
const amenitiesText = ref('')

// Initialize form with unit data if editing
if (props.unit) {
  Object.assign(form.value, props.unit)
  landmarksText.value = props.unit.landmarks?.join(', ') || ''
  amenitiesText.value = props.unit.amenities?.join(', ') || ''
}

// Set preselected partner if provided
if (props.preselectedPartner) {
  form.value.partner_id = props.preselectedPartner
}

const partnerOptions = computed(() => {
  return partners.value.map(partner => ({
    label: partner.name,
    value: partner.id
  }))
})

const typeOptions = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Condo', value: 'condo' },
  { label: 'Studio', value: 'studio' },
  { label: 'Loft', value: 'loft' }
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Maintenance', value: 'maintenance' }
]

const canChangePartner = computed(() => {
  // If preselected partner, don't allow change unless admin/manager
  if (props.preselectedPartner && !isEdit.value) {
    return ['admin', 'manager'].includes(user.value?.role || '')
  }
  return !isEdit.value || ['admin', 'manager'].includes(user.value?.role || '')
})

// Watch text fields and convert to arrays
watch(landmarksText, (value) => {
  form.value.landmarks = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
})

watch(amenitiesText, (value) => {
  form.value.amenities = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
})

const loadPartners = async () => {
  try {
    const response = await getPartners()
    partners.value = Array.isArray(response) ? response : []
  } catch (error) {
    partners.value = []
  }
}

const handleSubmit = async () => {
  saving.value = true
  
  try {
    let response
    
    if (isEdit.value && props.unit) {
      response = await updateUnit(props.unit.id, form.value)
    } else {
      response = await createUnit(form.value)
    }
    
    if (response) {
      emit('saved')
    }
  } catch (error) {
    alert('Failed to save unit')
  } finally {
    saving.value = false
  }
}

// Load partners on mount
onMounted(() => {
  loadPartners()
})
</script>
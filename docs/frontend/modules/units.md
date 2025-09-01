# Units Module

> **Property Unit Management with RBAC Filtering**

## 🔐 RBAC Data Filtering

Units are filtered based on user role and `accessible_partners`:

- **Admin/Manager**: See ALL units in organization (6 units across all partners)
- **Staff**: See only units from assigned partners in `accessible_partners`
- **Partner**: See only units from their own partner

## 📋 Unit Endpoints

### GET /api/units
**Get paginated units list (RBAC filtered)**

**Query Parameters:**
```typescript
{
  page?: number        // Default: 1
  limit?: number       // Default: 10
  search?: string      // Search by name, address
  sort_by?: string     // name, address, partner_name, created_at
  sort_order?: 'asc' | 'desc'  // Default: asc
  partner_id?: string  // Filter by specific partner
  status?: string      // active, inactive, maintenance
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    items: Unit[]
    total: number
    page: number
    limit: number
    pages: number
    summary: {
      total_units: number
      active_units: number
      occupancy_rate: number
      avg_revenue_per_unit: number
    }
  }
}
```

**RBAC Examples:**
```bash
# Admin sees all 6 units across all partners
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8000/api/units"

# Staff sees only units from assigned partners
curl -H "Authorization: Bearer <staff_token>" \
  "http://localhost:8000/api/units?partner_id=assigned-partner-id"

# Partner sees only their own units
curl -H "Authorization: Bearer <partner_token>" \
  "http://localhost:8000/api/units"
```

### GET /api/units/{id}
**Get single unit (RBAC filtered)**

**Response:**
```typescript
{
  success: boolean
  data: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zip_code: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    base_rate: number
    cleaning_fee: number
    status: 'active' | 'inactive' | 'maintenance'
    partner_id: string
    organization_id: string
    partner: {
      id: string
      name: string
      email: string
    }
    amenities?: string[]
    description?: string
    photos?: string[]
    created_at: string
    updated_at: string
  }
}
```

### POST /api/units
**Create new unit (RBAC filtered)**

**Request:**
```typescript
{
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  base_rate: number
  cleaning_fee?: number
  partner_id: string      // Must be in accessible_partners
  status?: string
  amenities?: string[]
  description?: string
}
```

**RBAC Requirements:**
- `partner_id` must be in user's `accessible_partners` (or user is admin/manager)
- Automatically assigns to user's organization

### PATCH /api/units/{id}
**Update unit (RBAC filtered)**

**Request:**
```typescript
{
  name?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  bedrooms?: number
  bathrooms?: number
  max_guests?: number
  base_rate?: number
  cleaning_fee?: number
  status?: string
  amenities?: string[]
  description?: string
}
```

**RBAC Behavior:**
- Can only update units from accessible partners
- Cannot change `partner_id` to inaccessible partner

### DELETE /api/units/{id}
**Delete unit (Admin/Manager only)**

**RBAC Requirements:**
- Role: `admin` or `manager`
- Can only delete units from accessible partners

## 🔧 Frontend Implementation

### Units Store
```typescript
// stores/units.ts
import { defineStore } from 'pinia'

interface Unit {
  id: string
  name: string
  address: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  base_rate: number
  status: string
  partner_id: string
  partner: { id: string; name: string }
}

interface UnitSummary {
  total_units: number
  active_units: number
  occupancy_rate: number
  avg_revenue_per_unit: number
}

export const useUnitsStore = defineStore('units', () => {
  const units = ref<Unit[]>([])
  const summary = ref<UnitSummary | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })

  const fetchUnits = async (params = {}) => {
    loading.value = true
    const { $api } = useNuxtApp()
    
    try {
      const response = await $api('/api/units', {
        query: params
      })
      
      if (response.success) {
        units.value = response.data.items
        summary.value = response.data.summary
        pagination.value = {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          pages: response.data.pages
        }
      }
    } finally {
      loading.value = false
    }
  }

  const createUnit = async (unitData: Partial<Unit>) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/units', {
      method: 'POST',
      body: unitData
    })
    
    if (response.success) {
      await fetchUnits() // Refresh list
    }
    
    return response
  }

  const updateUnit = async (id: string, unitData: Partial<Unit>) => {
    const { $api } = useNuxtApp()
    
    const response = await $api(`/api/units/${id}`, {
      method: 'PATCH',
      body: unitData
    })
    
    if (response.success) {
      await fetchUnits() // Refresh list
    }
    
    return response
  }

  return {
    units,
    summary,
    loading,
    pagination,
    fetchUnits,
    createUnit,
    updateUnit
  }
})
```

### Units Dashboard Component
```vue
<!-- components/UnitsDashboard.vue -->
<template>
  <div>
    <!-- Summary Cards -->
    <div v-if="summary" class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Total Units</h3>
        <p class="text-2xl font-bold">{{ summary.total_units }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Active Units</h3>
        <p class="text-2xl font-bold">{{ summary.active_units }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Occupancy Rate</h3>
        <p class="text-2xl font-bold">{{ summary.occupancy_rate }}%</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Avg Revenue/Unit</h3>
        <p class="text-2xl font-bold">${{ formatCurrency(summary.avg_revenue_per_unit) }}</p>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center">
        <div class="flex gap-4">
          <input
            v-model="filters.search"
            placeholder="Search units..."
            class="border rounded px-3 py-2"
            @input="debouncedSearch"
          />
          
          <select v-model="filters.partner_id" @change="applyFilters">
            <option value="">All Partners</option>
            <option 
              v-for="partner in availablePartners" 
              :key="partner.id" 
              :value="partner.id"
            >
              {{ partner.name }}
            </option>
          </select>
          
          <select v-model="filters.status" @change="applyFilters">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <button
          v-if="canCreate"
          @click="createNewUnit"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Add Unit
        </button>
      </div>
    </div>

    <!-- Units Grid -->
    <div v-if="loading" class="text-center py-8">
      Loading units...
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="unit in units"
        :key="unit.id"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <!-- Unit Image Placeholder -->
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-500">📷 Unit Photo</span>
        </div>
        
        <!-- Unit Details -->
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">{{ unit.name }}</h3>
            <span 
              :class="getStatusClass(unit.status)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ unit.status }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-2">{{ unit.address }}</p>
          <p class="text-gray-600 text-sm mb-3">{{ unit.city }}, {{ unit.state }}</p>
          
          <div class="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
            <div>🛏️ {{ unit.bedrooms }} bed</div>
            <div>🚿 {{ unit.bathrooms }} bath</div>
            <div>👥 {{ unit.max_guests }} guests</div>
          </div>
          
          <div class="flex justify-between items-center mb-3">
            <span class="text-lg font-bold">${{ unit.base_rate }}/night</span>
            <span class="text-sm text-gray-500">{{ unit.partner.name }}</span>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="viewUnit(unit.id)"
              class="flex-1 bg-blue-600 text-white py-2 rounded font-medium"
            >
              View Details
            </button>
            <button
              v-if="canEdit(unit)"
              @click="editUnit(unit.id)"
              class="px-4 bg-gray-200 text-gray-700 py-2 rounded font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="mt-6 flex justify-center">
      <div class="flex gap-2">
        <button
          :disabled="pagination.page <= 1"
          @click="changePage(pagination.page - 1)"
          class="px-3 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <span class="px-3 py-2">
          Page {{ pagination.page }} of {{ pagination.pages }}
        </span>
        
        <button
          :disabled="pagination.page >= pagination.pages"
          @click="changePage(pagination.page + 1)"
          class="px-3 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

const unitsStore = useUnitsStore()
const authStore = useAuthStore()
const partnersStore = usePartnersStore()

const { units, summary, loading, pagination } = storeToRefs(unitsStore)

const filters = ref({
  search: '',
  partner_id: '',
  status: ''
})

// Get available partners based on RBAC
const availablePartners = computed(() => {
  const user = authStore.user
  if (!user) return []
  
  if (['admin', 'manager'].includes(user.role)) {
    return partnersStore.partners
  }
  
  return partnersStore.partners.filter(partner => 
    user.accessible_partners?.includes(partner.id)
  )
})

const canCreate = computed(() => {
  return ['admin', 'manager'].includes(authStore.user?.role)
})

const canEdit = (unit) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(unit.partner_id)
}

const applyFilters = () => {
  pagination.value.page = 1
  fetchUnits()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const fetchUnits = () => {
  unitsStore.fetchUnits({
    page: pagination.value.page,
    limit: pagination.value.limit,
    ...filters.value
  })
}

const changePage = (page) => {
  pagination.value.page = page
  fetchUnits()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const viewUnit = (id) => {
  navigateTo(`/units/${id}`)
}

const editUnit = (id) => {
  navigateTo(`/units/${id}/edit`)
}

const createNewUnit = () => {
  navigateTo('/units/new')
}

// Load data on mount
onMounted(() => {
  fetchUnits()
  partnersStore.fetchPartners()
})
</script>
```

### Unit Form Component
```vue
<!-- components/UnitForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Basic Information -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Basic Information</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Unit Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border rounded-lg p-2"
            placeholder="e.g., Downtown Loft A"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Partner</label>
          <select
            v-model="form.partner_id"
            required
            class="w-full border rounded-lg p-2"
            :disabled="!canChangePartner"
          >
            <option value="">Select Partner</option>
            <option
              v-for="partner in availablePartners"
              :key="partner.id"
              :value="partner.id"
            >
              {{ partner.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Address -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Address</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Street Address</label>
          <input
            v-model="form.address"
            type="text"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">City</label>
            <input
              v-model="form.city"
              type="text"
              required
              class="w-full border rounded-lg p-2"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">State</label>
            <input
              v-model="form.state"
              type="text"
              required
              class="w-full border rounded-lg p-2"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              v-model="form.zip_code"
              type="text"
              required
              class="w-full border rounded-lg p-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Property Details -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Property Details</h3>
      
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Bedrooms</label>
          <input
            v-model.number="form.bedrooms"
            type="number"
            min="0"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Bathrooms</label>
          <input
            v-model.number="form.bathrooms"
            type="number"
            min="0"
            step="0.5"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Max Guests</label>
          <input
            v-model.number="form.max_guests"
            type="number"
            min="1"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full border rounded-lg p-2"
          placeholder="Describe the unit's features and amenities..."
        />
      </div>
    </div>

    <!-- Pricing -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Pricing</h3>
      
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Base Rate (per night)</label>
          <input
            v-model.number="form.base_rate"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Cleaning Fee</label>
          <input
            v-model.number="form.cleaning_fee"
            type="number"
            min="0"
            step="0.01"
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select
            v-model="form.status"
            class="w-full border rounded-lg p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-4">
      <button
        type="button"
        @click="$router.back()"
        class="px-6 py-2 border border-gray-300 rounded-lg font-medium"
      >
        Cancel
      </button>
      
      <button
        type="submit"
        :disabled="saving"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
      >
        <span v-if="saving">Saving...</span>
        <span v-else>{{ isEdit ? 'Update Unit' : 'Create Unit' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  unit: {
    type: Object,
    default: null
  }
})

const unitsStore = useUnitsStore()
const partnersStore = usePartnersStore()
const authStore = useAuthStore()

const isEdit = computed(() => !!props.unit)
const saving = ref(false)

const form = ref({
  name: '',
  partner_id: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  bedrooms: 1,
  bathrooms: 1,
  max_guests: 2,
  base_rate: 0,
  cleaning_fee: 0,
  status: 'active',
  description: ''
})

// Initialize form with unit data if editing
if (props.unit) {
  Object.assign(form.value, props.unit)
}

// Get available partners based on RBAC
const availablePartners = computed(() => {
  const user = authStore.user
  if (!user) return []
  
  if (['admin', 'manager'].includes(user.role)) {
    return partnersStore.partners
  }
  
  return partnersStore.partners.filter(partner => 
    user.accessible_partners?.includes(partner.id)
  )
})

// Check if user can change partner (only on create or if admin/manager)
const canChangePartner = computed(() => {
  return !isEdit.value || ['admin', 'manager'].includes(authStore.user?.role)
})

const handleSubmit = async () => {
  saving.value = true
  
  try {
    let response
    
    if (isEdit.value) {
      response = await unitsStore.updateUnit(props.unit.id, form.value)
    } else {
      response = await unitsStore.createUnit(form.value)
    }
    
    if (response.success) {
      navigateTo('/units')
    }
  } catch (error) {
    console.error('Error saving unit:', error)
  } finally {
    saving.value = false
  }
}

// Load partners on mount
onMounted(() => {
  partnersStore.fetchPartners()
})
</script>
```

## 🔒 RBAC Implementation Notes

### Data Filtering
- Units filtered by organization and accessible partners
- Partner dropdown shows only accessible partners
- Cannot assign units to inaccessible partners

### Permission Checks
```typescript
// Check if user can manage specific unit
const canManageUnit = (unit) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(unit.partner_id)
}

// Validate partner access before creating unit
const validatePartnerAccess = (partnerId) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(partnerId)
}
```

### Summary Statistics
- Unit summaries automatically filtered by RBAC
- Occupancy rates calculated for accessible units only
- Revenue metrics based on accessible partner data
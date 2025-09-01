# Partners Module

> **Partner Management with RBAC Filtering**

## 🔐 RBAC Data Filtering

Partners are filtered based on user role and `accessible_partners`:

- **Admin/Manager**: See ALL partners in organization
- **Staff**: See only assigned partners from `accessible_partners` array
- **Partner**: See only their own partner data

## 📋 Partner Endpoints

### GET /api/partners
**Get paginated partners list (RBAC filtered)**

**Query Parameters:**
```typescript
{
  page?: number        // Default: 1
  limit?: number       // Default: 10
  search?: string      // Search by name or email
  sort_by?: string     // Sort field (name, email, created_at)
  sort_order?: 'asc' | 'desc'  // Default: asc
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    items: Partner[]
    total: number
    page: number
    limit: number
    pages: number
  }
}
```

**RBAC Examples:**
```bash
# Admin sees all 6 partners
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8000/api/partners"

# Staff sees only 2 assigned partners
curl -H "Authorization: Bearer <staff_token>" \
  "http://localhost:8000/api/partners"

# Partner sees only their own data (1 partner)
curl -H "Authorization: Bearer <partner_token>" \
  "http://localhost:8000/api/partners"
```

### GET /api/partners/{id}
**Get single partner (RBAC filtered)**

**Response:**
```typescript
{
  success: boolean
  data: {
    id: string
    name: string
    email: string
    phone?: string
    revenue_share_percentage: number
    organization_id: string
    created_at: string
    updated_at: string
  }
}
```

**RBAC Behavior:**
- Returns 404 if partner not in user's `accessible_partners`
- Admin/Manager can access any partner in organization

### POST /api/partners
**Create new partner (Admin/Manager only)**

**Request:**
```typescript
{
  name: string
  email: string
  phone?: string
  revenue_share_percentage: number
}
```

**RBAC Requirements:**
- Role: `admin` or `manager`
- Automatically assigns to user's organization

### PATCH /api/partners/{id}
**Update partner (RBAC filtered)**

**Request:**
```typescript
{
  name?: string
  email?: string
  phone?: string
  revenue_share_percentage?: number
}
```

**RBAC Behavior:**
- Can only update partners in `accessible_partners`
- Admin/Manager can update any partner in organization

### DELETE /api/partners/{id}
**Delete partner (Admin only)**

**Response:**
```typescript
{
  success: boolean
  data: {}
  message: string
}
```

**RBAC Requirements:**
- Role: `admin` only
- Can only delete partners in organization
- Returns 404 if partner not found or not accessible

**Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8000/api/partners/123e4567-e89b-12d3-a456-426614174000"
```

## 🔧 Frontend Implementation

### Partners Store
```typescript
// stores/partners.ts
import { defineStore } from 'pinia'

interface Partner {
  id: string
  name: string
  email: string
  phone?: string
  revenue_share_percentage: number
  organization_id: string
  created_at: string
  updated_at: string
}

export const usePartnersStore = defineStore('partners', () => {
  const partners = ref<Partner[]>([])
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })

  const fetchPartners = async (params = {}) => {
    loading.value = true
    const { $api } = useNuxtApp()
    
    try {
      const response = await $api('/api/partners', {
        query: params
      })
      
      if (response.success) {
        partners.value = response.data.items
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

  const createPartner = async (partnerData: Partial<Partner>) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/partners', {
      method: 'POST',
      body: partnerData
    })
    
    if (response.success) {
      await fetchPartners() // Refresh list
    }
    
    return response
  }

  return {
    partners,
    loading,
    pagination,
    fetchPartners,
    createPartner
  }
})
```

### Partners List Component
```vue
<!-- components/PartnersList.vue -->
<template>
  <div>
    <!-- Search and filters -->
    <div class="mb-4 flex gap-4">
      <input
        v-model="searchQuery"
        placeholder="Search partners..."
        class="border rounded px-3 py-2"
        @input="debouncedSearch"
      />
      
      <select v-model="sortBy" @change="fetchPartners">
        <option value="name">Sort by Name</option>
        <option value="email">Sort by Email</option>
        <option value="created_at">Sort by Date</option>
      </select>
    </div>

    <!-- Partners table -->
    <div v-if="loading" class="text-center py-4">
      Loading partners...
    </div>
    
    <table v-else class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-50">
          <th class="border p-2 text-left">Name</th>
          <th class="border p-2 text-left">Email</th>
          <th class="border p-2 text-left">Revenue Share</th>
          <th class="border p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="partner in partners" :key="partner.id">
          <td class="border p-2">{{ partner.name }}</td>
          <td class="border p-2">{{ partner.email }}</td>
          <td class="border p-2">{{ partner.revenue_share_percentage }}%</td>
          <td class="border p-2">
            <button 
              @click="viewPartner(partner.id)"
              class="text-blue-600 hover:underline mr-2"
            >
              View
            </button>
            <button 
              v-if="canEdit"
              @click="editPartner(partner.id)"
              class="text-green-600 hover:underline"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <div>
        Showing {{ partners.length }} of {{ pagination.total }} partners
      </div>
      
      <div class="flex gap-2">
        <button
          :disabled="pagination.page <= 1"
          @click="changePage(pagination.page - 1)"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <span class="px-3 py-1">
          Page {{ pagination.page }} of {{ pagination.pages }}
        </span>
        
        <button
          :disabled="pagination.page >= pagination.pages"
          @click="changePage(pagination.page + 1)"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

const partnersStore = usePartnersStore()
const authStore = useAuthStore()

const { partners, loading, pagination } = storeToRefs(partnersStore)

const searchQuery = ref('')
const sortBy = ref('name')

// Check if user can edit partners
const canEdit = computed(() => {
  return ['admin', 'manager'].includes(authStore.user?.role)
})

const fetchPartners = () => {
  partnersStore.fetchPartners({
    page: pagination.value.page,
    limit: pagination.value.limit,
    search: searchQuery.value,
    sort_by: sortBy.value
  })
}

const debouncedSearch = debounce(() => {
  pagination.value.page = 1 // Reset to first page
  fetchPartners()
}, 300)

const changePage = (page) => {
  pagination.value.page = page
  fetchPartners()
}

const viewPartner = (id) => {
  navigateTo(`/partners/${id}`)
}

const editPartner = (id) => {
  navigateTo(`/partners/${id}/edit`)
}

// Load partners on mount
onMounted(() => {
  fetchPartners()
})
</script>
```

## 🔒 RBAC Implementation Notes

### Data Filtering
- All partner queries automatically filtered by organization
- Additional filtering by `accessible_partners` for staff/partner roles
- No client-side filtering needed - server handles all RBAC

### Permission Checks
```typescript
// Check if user can create partners
const canCreate = computed(() => {
  return ['admin', 'manager'].includes(user.value?.role)
})

// Check if user can edit specific partner
const canEdit = (partnerId: string) => {
  const role = user.value?.role
  const accessiblePartners = user.value?.accessible_partners || []
  
  return role === 'admin' || 
         role === 'manager' || 
         accessiblePartners.includes(partnerId)
}
```

### Error Handling
```typescript
// Handle RBAC errors
const handleApiError = (error) => {
  if (error.status === 403) {
    // User doesn't have permission
    showError('You don\'t have permission to access this partner')
  } else if (error.status === 404) {
    // Partner not found or not accessible
    showError('Partner not found or not accessible')
  }
}
```
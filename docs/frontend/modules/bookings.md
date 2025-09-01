# Bookings Module

> **Booking Management with RBAC Filtering**

## 🔐 RBAC Data Filtering

Bookings are filtered based on user role and `accessible_partners`:

- **Admin/Manager**: See ALL bookings in organization (146+ bookings)
- **Staff**: See only bookings from assigned partners in `accessible_partners`
- **Partner**: See only bookings from their own partner

## 📋 Booking Endpoints

### GET /api/bookings
**Get paginated bookings list (RBAC filtered)**

**Query Parameters:**
```typescript
{
  page?: number        // Default: 1
  limit?: number       // Default: 10
  search?: string      // Search by guest name, confirmation code
  sort_by?: string     // booking_date, check_in, check_out, total_amount
  sort_order?: 'asc' | 'desc'  // Default: desc
  partner_id?: string  // Filter by specific partner
  unit_id?: string     // Filter by specific unit
  status?: string      // confirmed, cancelled, completed
  date_from?: string   // Filter by booking date range
  date_to?: string
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    items: Booking[]
    total: number
    page: number
    limit: number
    pages: number
    summary: {
      total_bookings: number
      total_revenue: number
      avg_booking_value: number
      occupancy_rate: number
    }
  }
}
```

**RBAC Examples:**
```bash
# Admin sees all 146+ bookings across 6 units
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8000/api/bookings?page=1&limit=10"

# Staff sees only bookings from assigned partners
curl -H "Authorization: Bearer <staff_token>" \
  "http://localhost:8000/api/bookings?search=angela"

# Partner sees only their own bookings
curl -H "Authorization: Bearer <partner_token>" \
  "http://localhost:8000/api/bookings?sort_by=booking_date"
```

### GET /api/bookings/{id}
**Get single booking (RBAC filtered)**

**Response:**
```typescript
{
  success: boolean
  data: {
    id: string
    confirmation_code: string
    guest_name: string
    guest_email: string
    guest_phone?: string
    check_in: string
    check_out: string
    nights: number
    guests: number
    total_amount: number
    booking_date: string
    status: 'confirmed' | 'cancelled' | 'completed'
    partner_id: string
    unit_id: string
    source_id: string
    organization_id: string
    partner: {
      id: string
      name: string
    }
    unit: {
      id: string
      name: string
      address: string
    }
    source: {
      id: string
      name: string
    }
    created_at: string
    updated_at: string
  }
}
```

### POST /api/bookings
**Create new booking (RBAC filtered)**

**Request:**
```typescript
{
  confirmation_code: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  check_in: string        // YYYY-MM-DD
  check_out: string       // YYYY-MM-DD
  guests: number
  total_amount: number
  partner_id: string      // Must be in accessible_partners
  unit_id: string         // Must belong to accessible partner
  source_id: string
  status?: string
}
```

**RBAC Requirements:**
- `partner_id` must be in user's `accessible_partners` (or user is admin/manager)
- `unit_id` must belong to an accessible partner

### PATCH /api/bookings/{id}
**Update booking (RBAC filtered)**

**Request:**
```typescript
{
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  check_in?: string
  check_out?: string
  guests?: number
  total_amount?: number
  status?: string
}
```

**RBAC Behavior:**
- Can only update bookings from accessible partners
- Cannot change `partner_id` or `unit_id` to inaccessible partners

### DELETE /api/bookings/{id}
**Delete booking (Admin/Manager only)**

**Response:**
```typescript
{
  success: boolean
  data: {}
  message: string
}
```

**RBAC Requirements:**
- Role: `admin` or `manager`
- Can only delete bookings from accessible partners
- Returns 404 if booking not found or not accessible

**Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8000/api/bookings/123e4567-e89b-12d3-a456-426614174000"
```

## 🔧 Frontend Implementation

### Bookings Store
```typescript
// stores/bookings.ts
import { defineStore } from 'pinia'

interface Booking {
  id: string
  confirmation_code: string
  guest_name: string
  guest_email: string
  check_in: string
  check_out: string
  nights: number
  guests: number
  total_amount: number
  status: string
  partner: { id: string; name: string }
  unit: { id: string; name: string }
}

interface BookingSummary {
  total_bookings: number
  total_revenue: number
  avg_booking_value: number
  occupancy_rate: number
}

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([])
  const summary = ref<BookingSummary | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })

  const fetchBookings = async (params = {}) => {
    loading.value = true
    const { $api } = useNuxtApp()
    
    try {
      const response = await $api('/api/bookings', {
        query: params
      })
      
      if (response.success) {
        bookings.value = response.data.items
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

  const createBooking = async (bookingData: Partial<Booking>) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/bookings', {
      method: 'POST',
      body: bookingData
    })
    
    if (response.success) {
      await fetchBookings() // Refresh list
    }
    
    return response
  }

  return {
    bookings,
    summary,
    loading,
    pagination,
    fetchBookings,
    createBooking
  }
})
```

### Bookings Dashboard Component
```vue
<!-- components/BookingsDashboard.vue -->
<template>
  <div>
    <!-- Summary Cards -->
    <div v-if="summary" class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Total Bookings</h3>
        <p class="text-2xl font-bold">{{ summary.total_bookings }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Total Revenue</h3>
        <p class="text-2xl font-bold">${{ formatCurrency(summary.total_revenue) }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Avg Booking Value</h3>
        <p class="text-2xl font-bold">${{ formatCurrency(summary.avg_booking_value) }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">Occupancy Rate</h3>
        <p class="text-2xl font-bold">{{ summary.occupancy_rate }}%</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          placeholder="Search bookings..."
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
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select v-model="filters.sort_by" @change="applyFilters">
          <option value="booking_date">Sort by Booking Date</option>
          <option value="check_in">Sort by Check-in</option>
          <option value="total_amount">Sort by Amount</option>
        </select>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-lg shadow">
      <div v-if="loading" class="text-center py-8">
        Loading bookings...
      </div>
      
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Guest</th>
            <th class="px-4 py-3 text-left">Dates</th>
            <th class="px-4 py-3 text-left">Unit</th>
            <th class="px-4 py-3 text-left">Partner</th>
            <th class="px-4 py-3 text-left">Amount</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="booking in bookings" :key="booking.id">
            <td class="px-4 py-3">
              <div>
                <div class="font-medium">{{ booking.guest_name }}</div>
                <div class="text-sm text-gray-500">{{ booking.confirmation_code }}</div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm">
                {{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }}
                <div class="text-gray-500">{{ booking.nights }} nights</div>
              </div>
            </td>
            <td class="px-4 py-3">{{ booking.unit.name }}</td>
            <td class="px-4 py-3">{{ booking.partner.name }}</td>
            <td class="px-4 py-3">${{ formatCurrency(booking.total_amount) }}</td>
            <td class="px-4 py-3">
              <span 
                :class="getStatusClass(booking.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ booking.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button 
                @click="viewBooking(booking.id)"
                class="text-blue-600 hover:underline mr-2"
              >
                View
              </button>
              <button 
                v-if="canEdit(booking)"
                @click="editBooking(booking.id)"
                class="text-green-600 hover:underline"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t flex justify-between items-center">
        <div class="text-sm text-gray-500">
          Showing {{ bookings.length }} of {{ pagination.total }} bookings
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
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

const bookingsStore = useBookingsStore()
const authStore = useAuthStore()
const partnersStore = usePartnersStore()

const { bookings, summary, loading, pagination } = storeToRefs(bookingsStore)

const filters = ref({
  search: '',
  partner_id: '',
  status: '',
  sort_by: 'booking_date'
})

// Get available partners based on RBAC
const availablePartners = computed(() => {
  const user = authStore.user
  if (!user) return []
  
  // Admin/Manager see all partners
  if (['admin', 'manager'].includes(user.role)) {
    return partnersStore.partners
  }
  
  // Staff/Partner see only accessible partners
  return partnersStore.partners.filter(partner => 
    user.accessible_partners?.includes(partner.id)
  )
})

const canEdit = (booking) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(booking.partner.id)
}

const applyFilters = () => {
  pagination.value.page = 1
  fetchBookings()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const fetchBookings = () => {
  bookingsStore.fetchBookings({
    page: pagination.value.page,
    limit: pagination.value.limit,
    ...filters.value
  })
}

const changePage = (page) => {
  pagination.value.page = page
  fetchBookings()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Load data on mount
onMounted(() => {
  fetchBookings()
  partnersStore.fetchPartners() // Load partners for filter
})
</script>
```

## 🔒 RBAC Implementation Notes

### Automatic Filtering
- All booking queries filtered by organization and `accessible_partners`
- No manual filtering needed in frontend
- Server handles all RBAC logic

### Partner/Unit Validation
```typescript
// Validate partner access before creating booking
const validatePartnerAccess = (partnerId: string) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(partnerId)
}

// Create booking with validation
const createBooking = async (bookingData) => {
  if (!validatePartnerAccess(bookingData.partner_id)) {
    throw new Error('You don\'t have access to this partner')
  }
  
  return bookingsStore.createBooking(bookingData)
}
```

### Data Summary
- Summary statistics automatically filtered by RBAC
- Admin sees organization-wide metrics
- Staff/Partner see metrics for accessible partners only
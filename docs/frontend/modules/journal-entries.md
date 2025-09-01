# Journal Entries Module

> **Financial Journal Management with RBAC Filtering**

## 🔐 RBAC Data Filtering

Journal entries are filtered based on user role and `accessible_partners`:

- **Admin/Manager**: See ALL journal entries in organization
- **Staff**: See only entries from assigned partners in `accessible_partners`
- **Partner**: See only entries from their own partner

## 📋 Journal Entry Endpoints

### GET /api/journal-entries
**Get paginated journal entries list (RBAC filtered)**

**Query Parameters:**
```typescript
{
  page?: number        // Default: 1
  limit?: number       // Default: 10
  partner_id?: string  // Filter by specific partner
  type?: 'credit' | 'debit'  // Filter by entry type
  status?: 'pending' | 'settled'  // Filter by status
  start_date?: string  // YYYY-MM-DD
  end_date?: string    // YYYY-MM-DD
  sort_by?: string     // date, amount, created_at
  sort_order?: 'asc' | 'desc'  // Default: desc
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    items: JournalEntry[]
    pagination: {
      current_page: number
      total_pages: number
      total_items: number
      per_page: number
      has_next: boolean
      has_prev: boolean
    }
  }
}
```

### GET /api/journal-entries/{id}
**Get single journal entry (RBAC filtered)**

**Response:**
```typescript
{
  success: boolean
  data: {
    id: string
    partner_id: string
    organization_id: string
    date: string                    // YYYY-MM-DD
    type: 'credit' | 'debit'
    amount: number
    description: string
    reference?: string
    notes?: string
    status: 'pending' | 'settled'
    settled_date?: string           // YYYY-MM-DD
    invoice_id?: string
    created_by?: string
    created_at: string
    updated_at: string
  }
}
```

### POST /api/journal-entries
**Create new journal entry (RBAC filtered)**

**Request:**
```typescript
{
  partner_id: string              // Must be in accessible_partners
  date: string                    // YYYY-MM-DD
  type: 'credit' | 'debit'
  amount: number                  // Must be > 0
  description: string             // Max 255 chars
  reference?: string              // Max 100 chars
  notes?: string
  created_by?: string             // Max 50 chars
}
```

**RBAC Requirements:**
- `partner_id` must be in user's `accessible_partners` (or user is admin/manager)
- Automatically assigns to user's organization

### PUT /api/journal-entries/{id}
**Update journal entry (RBAC filtered)**

**Request:**
```typescript
{
  partner_id?: string
  date?: string
  type?: 'credit' | 'debit'
  amount?: number
  description?: string
  reference?: string
  notes?: string
}
```

**RBAC Behavior:**
- Can only update entries from accessible partners
- Cannot change `partner_id` to inaccessible partner

### PATCH /api/journal-entries/{id}/settle
**Mark journal entry as settled**

**Request:**
```typescript
{
  settled_date: string            // YYYY-MM-DD
  notes?: string
}
```

**Response:**
```typescript
{
  success: boolean
  data: JournalEntry              // Updated entry with status: 'settled'
  message: string
}
```

### DELETE /api/journal-entries/{id}
**Delete journal entry (Admin/Manager only)**

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
- Can only delete entries from accessible partners

## 🔧 Frontend Implementation

### Journal Entries Store
```typescript
// stores/journalEntries.ts
import { defineStore } from 'pinia'

interface JournalEntry {
  id: string
  partner_id: string
  date: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  reference?: string
  notes?: string
  status: 'pending' | 'settled'
  settled_date?: string
  created_at: string
  updated_at: string
}

export const useJournalEntriesStore = defineStore('journalEntries', () => {
  const entries = ref<JournalEntry[]>([])
  const loading = ref(false)
  const pagination = ref({
    current_page: 1,
    total_pages: 0,
    total_items: 0,
    per_page: 10,
    has_next: false,
    has_prev: false
  })

  const fetchEntries = async (params = {}) => {
    loading.value = true
    const { $api } = useNuxtApp()
    
    try {
      const response = await $api('/api/journal-entries', {
        query: params
      })
      
      if (response.success) {
        entries.value = response.data.items
        pagination.value = response.data.pagination
      }
    } finally {
      loading.value = false
    }
  }

  const createEntry = async (entryData: Partial<JournalEntry>) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/journal-entries', {
      method: 'POST',
      body: entryData
    })
    
    if (response.success) {
      await fetchEntries() // Refresh list
    }
    
    return response
  }

  const settleEntry = async (id: string, settleData: { settled_date: string; notes?: string }) => {
    const { $api } = useNuxtApp()
    
    const response = await $api(`/api/journal-entries/${id}/settle`, {
      method: 'PATCH',
      body: settleData
    })
    
    if (response.success) {
      await fetchEntries() // Refresh list
    }
    
    return response
  }

  return {
    entries,
    loading,
    pagination,
    fetchEntries,
    createEntry,
    settleEntry
  }
})
```

### Journal Entries Dashboard
```vue
<!-- components/JournalEntriesDashboard.vue -->
<template>
  <div>
    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-5 gap-4">
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
        
        <select v-model="filters.type" @change="applyFilters">
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        
        <select v-model="filters.status" @change="applyFilters">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="settled">Settled</option>
        </select>
        
        <input
          v-model="filters.start_date"
          type="date"
          class="border rounded px-3 py-2"
          @change="applyFilters"
        />
        
        <input
          v-model="filters.end_date"
          type="date"
          class="border rounded px-3 py-2"
          @change="applyFilters"
        />
      </div>
    </div>

    <!-- Entries Table -->
    <div class="bg-white rounded-lg shadow">
      <div v-if="loading" class="text-center py-8">
        Loading journal entries...
      </div>
      
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Date</th>
            <th class="px-4 py-3 text-left">Partner</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-left">Description</th>
            <th class="px-4 py-3 text-left">Amount</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="entry in entries" :key="entry.id">
            <td class="px-4 py-3">{{ formatDate(entry.date) }}</td>
            <td class="px-4 py-3">{{ getPartnerName(entry.partner_id) }}</td>
            <td class="px-4 py-3">
              <span 
                :class="entry.type === 'credit' ? 'text-green-600' : 'text-red-600'"
                class="font-medium"
              >
                {{ entry.type.toUpperCase() }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div>{{ entry.description }}</div>
              <div v-if="entry.reference" class="text-sm text-gray-500">
                Ref: {{ entry.reference }}
              </div>
            </td>
            <td class="px-4 py-3 font-medium">
              ${{ formatCurrency(entry.amount) }}
            </td>
            <td class="px-4 py-3">
              <span 
                :class="getStatusClass(entry.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ entry.status }}
              </span>
              <div v-if="entry.settled_date" class="text-xs text-gray-500 mt-1">
                Settled: {{ formatDate(entry.settled_date) }}
              </div>
            </td>
            <td class="px-4 py-3">
              <button 
                @click="viewEntry(entry.id)"
                class="text-blue-600 hover:underline mr-2"
              >
                View
              </button>
              <button 
                v-if="canSettle(entry)"
                @click="settleEntry(entry)"
                class="text-green-600 hover:underline mr-2"
              >
                Settle
              </button>
              <button 
                v-if="canEdit(entry)"
                @click="editEntry(entry.id)"
                class="text-orange-600 hover:underline"
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
          Showing {{ entries.length }} of {{ pagination.total_items }} entries
        </div>
        
        <div class="flex gap-2">
          <button
            :disabled="!pagination.has_prev"
            @click="changePage(pagination.current_page - 1)"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span class="px-3 py-1">
            Page {{ pagination.current_page }} of {{ pagination.total_pages }}
          </span>
          
          <button
            :disabled="!pagination.has_next"
            @click="changePage(pagination.current_page + 1)"
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
const journalEntriesStore = useJournalEntriesStore()
const authStore = useAuthStore()
const partnersStore = usePartnersStore()

const { entries, loading, pagination } = storeToRefs(journalEntriesStore)

const filters = ref({
  partner_id: '',
  type: '',
  status: '',
  start_date: '',
  end_date: ''
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

const canSettle = (entry) => {
  return entry.status === 'pending' && canEdit(entry)
}

const canEdit = (entry) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(entry.partner_id)
}

const applyFilters = () => {
  pagination.value.current_page = 1
  fetchEntries()
}

const fetchEntries = () => {
  journalEntriesStore.fetchEntries({
    page: pagination.value.current_page,
    limit: pagination.value.per_page,
    ...filters.value
  })
}

const changePage = (page) => {
  pagination.value.current_page = page
  fetchEntries()
}

const getPartnerName = (partnerId) => {
  const partner = partnersStore.partners.find(p => p.id === partnerId)
  return partner?.name || 'Unknown Partner'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  return status === 'settled' 
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
}

const settleEntry = async (entry) => {
  const settled_date = new Date().toISOString().split('T')[0]
  await journalEntriesStore.settleEntry(entry.id, { settled_date })
}

// Load data on mount
onMounted(() => {
  fetchEntries()
  partnersStore.fetchPartners()
})
</script>
```

## 🔒 RBAC Implementation Notes

### Automatic Filtering
- All journal entry queries filtered by organization and `accessible_partners`
- Partner dropdown shows only accessible partners
- Cannot create entries for inaccessible partners

### Permission Checks
```typescript
// Check if user can manage specific entry
const canManageEntry = (entry) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(entry.partner_id)
}

// Validate partner access before creating entry
const validatePartnerAccess = (partnerId) => {
  const user = authStore.user
  if (!user) return false
  
  return ['admin', 'manager'].includes(user.role) ||
         user.accessible_partners?.includes(partnerId)
}
```

### Business Logic
- **Credit entries**: Money owed TO partner (partner revenue)
- **Debit entries**: Money owed BY partner (partner expenses)
- **Pending status**: Entry created but not yet settled
- **Settled status**: Entry has been paid/resolved
# Users Module

> **User Profile Management with RBAC System**

## 🔐 RBAC User Management

User management follows the multi-tenant SaaS architecture:

- **Admin**: Manage all users in organization, assign partner access
- **Manager**: Manage staff users, view partner users
- **Staff**: View own profile only
- **Partner**: View own profile only

## 📋 User Endpoints

### GET /api/users/profile
**Get current user profile**

**Response:**
```typescript
{
  success: boolean
  data: {
    id: string
    email: string
    name: string
    role: 'admin' | 'manager' | 'staff' | 'partner'
    organization_id: string
    accessible_partners: string[]
    permissions: string[]
    preferences?: object
    avatar_url?: string
    timezone: string
    last_login?: string
    created_at: string
    updated_at: string
  }
}
```

### PATCH /api/users/profile
**Update current user profile**

**Request:**
```typescript
{
  name?: string
  preferences?: object
  avatar_url?: string
  timezone?: string
}
```

**Note:** Users cannot change their own role, email, or accessible_partners

### POST /api/users/change-password
**Change user password**

**Request:**
```typescript
{
  current_password: string
  new_password: string
  confirm_password: string
}
```

**Response:**
```typescript
{
  success: boolean
  message: string
}
```

### GET /api/users
**Get organization users (Admin/Manager only)**

**Query Parameters:**
```typescript
{
  page?: number        // Default: 1
  limit?: number       // Default: 10
  search?: string      // Search by name or email
  role?: string        // Filter by role
  sort_by?: string     // name, email, role, created_at
  sort_order?: 'asc' | 'desc'
}
```

**Response:**
```typescript
{
  success: boolean
  data: {
    items: User[]
    total: number
    page: number
    limit: number
    pages: number
  }
}
```

**RBAC Filtering:**
- **Admin**: See all users in organization
- **Manager**: See staff and partner users (not other admins/managers)

### POST /api/users
**Create new user (Admin only)**

**Request:**
```typescript
{
  email: string
  name: string
  role: 'manager' | 'staff' | 'partner'
  accessible_partners?: string[]  // For staff/partner roles
  temporary_password?: string     // Optional, generates random if not provided
}
```

**RBAC Requirements:**
- Role: `admin` only
- Cannot create other admin users
- `accessible_partners` validated against organization partners

### PATCH /api/users/{id}
**Update user (Admin/Manager only)**

**Request:**
```typescript
{
  name?: string
  role?: string
  accessible_partners?: string[]
  preferences?: object
  timezone?: string
}
```

**RBAC Behavior:**
- **Admin**: Can update any user in organization
- **Manager**: Can update staff/partner users only
- Cannot change user's organization or email

### DELETE /api/users/{id}
**Delete user (Admin only)**

**RBAC Requirements:**
- Role: `admin` only
- Cannot delete other admin users
- Cannot delete own account

## 🔧 Frontend Implementation

### Users Store
```typescript
// stores/users.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: string
  organization_id: string
  accessible_partners: string[]
  permissions: string[]
  last_login?: string
  created_at: string
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })

  const fetchProfile = async () => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/users/profile')
    if (response.success) {
      currentUser.value = response.data
    }
    return response
  }

  const updateProfile = async (profileData) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/users/profile', {
      method: 'PATCH',
      body: profileData
    })
    
    if (response.success) {
      currentUser.value = { ...currentUser.value, ...profileData }
    }
    
    return response
  }

  const changePassword = async (passwordData) => {
    const { $api } = useNuxtApp()
    
    return await $api('/api/users/change-password', {
      method: 'POST',
      body: passwordData
    })
  }

  const fetchUsers = async (params = {}) => {
    loading.value = true
    const { $api } = useNuxtApp()
    
    try {
      const response = await $api('/api/users', {
        query: params
      })
      
      if (response.success) {
        users.value = response.data.items
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

  const createUser = async (userData) => {
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/users', {
      method: 'POST',
      body: userData
    })
    
    if (response.success) {
      await fetchUsers() // Refresh list
    }
    
    return response
  }

  const updateUser = async (id: string, userData) => {
    const { $api } = useNuxtApp()
    
    const response = await $api(`/api/users/${id}`, {
      method: 'PATCH',
      body: userData
    })
    
    if (response.success) {
      await fetchUsers() // Refresh list
    }
    
    return response
  }

  return {
    users,
    currentUser,
    loading,
    pagination,
    fetchProfile,
    updateProfile,
    changePassword,
    fetchUsers,
    createUser,
    updateUser
  }
})
```

### Profile Settings Component
```vue
<!-- components/ProfileSettings.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <!-- Profile Information -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Profile Information</h2>
      
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input
              v-model="profileForm.name"
              type="text"
              required
              class="w-full border rounded-lg p-2"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              :value="currentUser?.email"
              type="email"
              disabled
              class="w-full border rounded-lg p-2 bg-gray-50"
            />
            <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Role</label>
            <input
              :value="currentUser?.role"
              type="text"
              disabled
              class="w-full border rounded-lg p-2 bg-gray-50 capitalize"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Timezone</label>
            <select
              v-model="profileForm.timezone"
              class="w-full border rounded-lg p-2"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
        
        <!-- Accessible Partners (Read-only) -->
        <div v-if="currentUser?.accessible_partners?.length">
          <label class="block text-sm font-medium mb-1">Accessible Partners</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="partnerId in currentUser.accessible_partners"
              :key="partnerId"
              class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
            >
              {{ getPartnerName(partnerId) }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Contact admin to modify partner access</p>
        </div>
        
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="updatingProfile"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            <span v-if="updatingProfile">Updating...</span>
            <span v-else>Update Profile</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Change Password</h2>
      
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Current Password</label>
          <input
            v-model="passwordForm.current_password"
            type="password"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input
            v-model="passwordForm.new_password"
            type="password"
            required
            minlength="8"
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Confirm New Password</label>
          <input
            v-model="passwordForm.confirm_password"
            type="password"
            required
            class="w-full border rounded-lg p-2"
          />
        </div>
        
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="changingPassword || !passwordsMatch"
            class="bg-red-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            <span v-if="changingPassword">Changing...</span>
            <span v-else>Change Password</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const usersStore = useUsersStore()
const partnersStore = usePartnersStore()

const { currentUser } = storeToRefs(usersStore)

const updatingProfile = ref(false)
const changingPassword = ref(false)

const profileForm = ref({
  name: '',
  timezone: 'UTC'
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const passwordsMatch = computed(() => {
  return passwordForm.value.new_password === passwordForm.value.confirm_password
})

// Initialize form with current user data
watch(currentUser, (user) => {
  if (user) {
    profileForm.value.name = user.name
    profileForm.value.timezone = user.timezone || 'UTC'
  }
}, { immediate: true })

const getPartnerName = (partnerId) => {
  const partner = partnersStore.partners.find(p => p.id === partnerId)
  return partner?.name || partnerId
}

const updateProfile = async () => {
  updatingProfile.value = true
  
  try {
    const response = await usersStore.updateProfile(profileForm.value)
    if (response.success) {
      // Show success message
      alert('Profile updated successfully')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile')
  } finally {
    updatingProfile.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordsMatch.value) {
    alert('Passwords do not match')
    return
  }
  
  changingPassword.value = true
  
  try {
    const response = await usersStore.changePassword(passwordForm.value)
    if (response.success) {
      alert('Password changed successfully')
      // Clear form
      passwordForm.value = {
        current_password: '',
        new_password: '',
        confirm_password: ''
      }
    }
  } catch (error) {
    console.error('Error changing password:', error)
    alert('Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

// Load data on mount
onMounted(() => {
  usersStore.fetchProfile()
  partnersStore.fetchPartners()
})
</script>
```

### User Management Component (Admin/Manager)
```vue
<!-- components/UserManagement.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Management</h1>
      <button
        v-if="canCreateUsers"
        @click="showCreateModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
      >
        + Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex gap-4">
        <input
          v-model="filters.search"
          placeholder="Search users..."
          class="border rounded px-3 py-2"
          @input="debouncedSearch"
        />
        
        <select v-model="filters.role" @change="applyFilters">
          <option value="">All Roles</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
          <option value="partner">Partner</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">User</th>
            <th class="px-4 py-3 text-left">Role</th>
            <th class="px-4 py-3 text-left">Partner Access</th>
            <th class="px-4 py-3 text-left">Last Login</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in users" :key="user.id">
            <td class="px-4 py-3">
              <div>
                <div class="font-medium">{{ user.name }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span 
                :class="getRoleClass(user.role)"
                class="px-2 py-1 rounded-full text-xs font-medium capitalize"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div v-if="user.accessible_partners?.length" class="flex flex-wrap gap-1">
                <span
                  v-for="partnerId in user.accessible_partners.slice(0, 2)"
                  :key="partnerId"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {{ getPartnerName(partnerId) }}
                </span>
                <span
                  v-if="user.accessible_partners.length > 2"
                  class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  +{{ user.accessible_partners.length - 2 }} more
                </span>
              </div>
              <span v-else class="text-gray-500 text-sm">All partners</span>
            </td>
            <td class="px-4 py-3 text-sm">
              {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
            </td>
            <td class="px-4 py-3">
              <button
                v-if="canEditUser(user)"
                @click="editUser(user)"
                class="text-blue-600 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                v-if="canDeleteUser(user)"
                @click="deleteUser(user)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t flex justify-between items-center">
        <div class="text-sm text-gray-500">
          Showing {{ users.length }} of {{ pagination.total }} users
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

    <!-- Create/Edit User Modal -->
    <UserFormModal
      v-if="showCreateModal || editingUser"
      :user="editingUser"
      @close="closeModal"
      @saved="handleUserSaved"
    />
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'

const usersStore = useUsersStore()
const authStore = useAuthStore()
const partnersStore = usePartnersStore()

const { users, loading, pagination } = storeToRefs(usersStore)

const showCreateModal = ref(false)
const editingUser = ref(null)

const filters = ref({
  search: '',
  role: ''
})

const canCreateUsers = computed(() => {
  return authStore.user?.role === 'admin'
})

const canEditUser = (user) => {
  const currentUser = authStore.user
  if (!currentUser) return false
  
  // Admin can edit anyone except other admins
  if (currentUser.role === 'admin') {
    return user.role !== 'admin' || user.id === currentUser.id
  }
  
  // Manager can edit staff and partners
  if (currentUser.role === 'manager') {
    return ['staff', 'partner'].includes(user.role)
  }
  
  return false
}

const canDeleteUser = (user) => {
  const currentUser = authStore.user
  return currentUser?.role === 'admin' && 
         user.role !== 'admin' && 
         user.id !== currentUser.id
}

const getPartnerName = (partnerId) => {
  const partner = partnersStore.partners.find(p => p.id === partnerId)
  return partner?.name || 'Unknown'
}

const getRoleClass = (role) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    staff: 'bg-green-100 text-green-800',
    partner: 'bg-yellow-100 text-yellow-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const applyFilters = () => {
  pagination.value.page = 1
  fetchUsers()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const fetchUsers = () => {
  usersStore.fetchUsers({
    page: pagination.value.page,
    limit: pagination.value.limit,
    ...filters.value
  })
}

const changePage = (page) => {
  pagination.value.page = page
  fetchUsers()
}

const editUser = (user) => {
  editingUser.value = user
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    // Implement delete functionality
    console.log('Delete user:', user.id)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
}

const handleUserSaved = () => {
  closeModal()
  fetchUsers()
}

// Load data on mount
onMounted(() => {
  fetchUsers()
  partnersStore.fetchPartners()
})
</script>
```

## 🔒 RBAC Implementation Notes

### User Role Hierarchy
```typescript
const roleHierarchy = {
  admin: ['manager', 'staff', 'partner'],
  manager: ['staff', 'partner'],
  staff: [],
  partner: []
}

// Check if user can manage another user
const canManageUser = (currentUserRole: string, targetUserRole: string) => {
  return roleHierarchy[currentUserRole]?.includes(targetUserRole) || false
}
```

### Partner Access Management
- Only admins can modify `accessible_partners`
- Staff/Partner users see read-only partner access
- Partner access validated against organization partners

### Security Considerations
- Users cannot elevate their own role
- Email changes require separate verification flow
- Password changes require current password
- Admin cannot delete other admin accounts
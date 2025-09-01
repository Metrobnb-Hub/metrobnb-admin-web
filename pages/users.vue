<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">User Management</h1>
      <UButton
        v-if="canCreateUsers"
        @click="showCreateModal = true"
        color="primary"
      >
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Add User
      </UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div class="flex gap-4">
        <UInput
          v-model="filters.search"
          placeholder="Search users..."
          @input="debouncedSearch"
        />
        
        <USelect
          v-model="filters.role"
          :options="roleOptions"
          placeholder="All Roles"
          @change="applyFilters"
        />
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto mb-2" />
        Loading users...
      </div>
      
      <table v-else class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Partner Access</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in mockUsers" :key="user.id">
            <td class="px-4 py-3">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  <UIcon name="i-heroicons-user" class="h-4 w-4" />
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                </div>
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
                  Partner {{ partnerId.substring(0, 6) }}
                </span>
                <span
                  v-if="user.accessible_partners.length > 2"
                  class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  +{{ user.accessible_partners.length - 2 }} more
                </span>
              </div>
              <span v-else class="text-gray-500 dark:text-gray-400 text-sm">All partners</span>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex space-x-2">
                <UButton
                  v-if="canEditUser(user)"
                  @click="editUser(user)"
                  size="xs"
                  variant="ghost"
                >
                  Edit
                </UButton>
                <UButton
                  v-if="canDeleteUser(user)"
                  @click="deleteUser(user)"
                  size="xs"
                  color="red"
                  variant="ghost"
                >
                  Delete
                </UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && mockUsers.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        No users found
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <UModal v-model="showCreateModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {{ editingUser ? 'Edit User' : 'Create New User' }}
        </h3>
        
        <form @submit.prevent="handleUserSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
            <UInput
              v-model="userForm.name"
              type="text"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <UInput
              v-model="userForm.email"
              type="email"
              required
              :disabled="!!editingUser"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
            <USelect
              v-model="userForm.role"
              :options="roleOptions"
              required
            />
          </div>
          
          <div v-if="userForm.role === 'staff' || userForm.role === 'partner'">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Partner Access</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Select which partners this user can access</p>
            <!-- TODO: Add partner selection -->
            <UInput
              v-model="userForm.partner_access"
              placeholder="Partner IDs (comma separated)"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <UButton
              @click="closeModal"
              variant="ghost"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              :loading="saving"
              color="primary"
            >
              {{ saving ? 'Saving...' : (editingUser ? 'Update' : 'Create') }}
            </UButton>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'

definePageMeta({
  middleware: 'auth'
})

const { user: currentUser } = useAuth()

const loading = ref(false)
const showCreateModal = ref(false)
const editingUser = ref(null)
const saving = ref(false)

const filters = ref({
  search: '',
  role: ''
})

const userForm = ref({
  name: '',
  email: '',
  role: '',
  partner_access: ''
})

const roleOptions = [
  { label: 'Manager', value: 'manager' },
  { label: 'Staff', value: 'staff' },
  { label: 'Partner', value: 'partner' }
]

// Mock users data
const mockUsers = ref([
  {
    id: '1',
    name: 'Tony Nini',
    email: 'tonynini1998@gmail.com',
    role: 'admin',
    accessible_partners: [],
    permissions: ['admin']
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@metrobnb.test',
    role: 'staff',
    accessible_partners: ['partner-1', 'partner-2'],
    permissions: ['staff']
  },
  {
    id: '3',
    name: 'Hiroaki Partner',
    email: 'hiroaki@partner.test',
    role: 'partner',
    accessible_partners: ['partner-3'],
    permissions: ['partner']
  }
])

const canCreateUsers = computed(() => {
  return currentUser.value?.role === 'admin'
})

const canEditUser = (user) => {
  const role = currentUser.value?.role
  if (!role) return false
  
  // Admin can edit anyone except other admins
  if (role === 'admin') {
    return user.role !== 'admin' || user.id === currentUser.value?.id
  }
  
  // Manager can edit staff and partners
  if (role === 'manager') {
    return ['staff', 'partner'].includes(user.role)
  }
  
  return false
}

const canDeleteUser = (user) => {
  const role = currentUser.value?.role
  return role === 'admin' && 
         user.role !== 'admin' && 
         user.id !== currentUser.value?.id
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

const applyFilters = () => {
  // TODO: Implement filtering logic
  console.log('Apply filters:', filters.value)
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    partner_access: user.accessible_partners?.join(', ') || ''
  }
  showCreateModal.value = true
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    // TODO: Implement delete API call
    console.log('Delete user:', user.id)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: '',
    partner_access: ''
  }
}

const handleUserSubmit = async () => {
  saving.value = true
  
  try {
    // TODO: Implement create/update API call
    console.log('Save user:', userForm.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    closeModal()
    // TODO: Refresh users list
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    saving.value = false
  }
}
</script>
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
          <tr v-for="user in users" :key="user.id">
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
                  v-for="partner in user.accessible_partners.slice(0, 2)"
                  :key="partner.id"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {{ partner.name }}
                </span>
                <span
                  v-if="user.accessible_partners.length > 2"
                  class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  +{{ user.accessible_partners.length - 2 }} more
                </span>
              </div>
              <span v-else class="text-gray-500 dark:text-gray-400 text-sm">{{ user.partner_access_summary || 'All partners' }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </td>
            <td class="px-4 py-3">
              <UDropdown :items="getUserActions(user)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
              </UDropdown>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!loading && users.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        No users found
      </div>
    </div>

    <!-- Password Regenerated Modal -->
    <UModal v-model="showPasswordModal">
      <div class="p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
            <UIcon name="i-heroicons-key" class="h-6 w-6 text-orange-600" />
          </div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Password Regenerated Successfully!
          </h3>
          
          <div v-if="regeneratedPasswordData" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Email</label>
                <div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2">
                  <span class="font-mono text-sm">{{ regeneratedPasswordData.email }}</span>
                  <UButton @click="copyToClipboard(regeneratedPasswordData.email)" size="xs" variant="ghost">
                    <UIcon name="i-heroicons-clipboard" />
                  </UButton>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Temporary Password</label>
                <div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2">
                  <span class="font-mono text-sm font-bold text-red-600">{{ regeneratedPasswordData.temporaryPassword }}</span>
                  <UButton @click="copyToClipboard(regeneratedPasswordData.temporaryPassword)" size="xs" variant="ghost">
                    <UIcon name="i-heroicons-clipboard" />
                  </UButton>
                </div>
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <div class="flex items-start">
                <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                <div class="text-sm text-yellow-700 dark:text-yellow-300">
                  <p class="font-medium mb-1">Important:</p>
                  <p>The user must change their password on next login.</p>
                  <p class="mt-2">Please share this temporary password securely with the user.</p>
                </div>
              </div>
            </div>
          </div>
          
          <UButton @click="showPasswordModal = false" color="primary">
            Got it
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Success Modal -->
    <UModal v-model="showSuccessModal">
      <div class="p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <UIcon name="i-heroicons-check" class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            User Created Successfully!
          </h3>
          
          <div v-if="createdUserData" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2">
                  <span class="font-mono text-sm">{{ createdUserData.email }}</span>
                  <UButton @click="copyToClipboard(createdUserData.email)" size="xs" variant="ghost">
                    <UIcon name="i-heroicons-clipboard" />
                  </UButton>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temporary Password</label>
                <div class="flex items-center justify-between bg-white dark:bg-gray-700 border rounded px-3 py-2">
                  <span class="font-mono text-sm font-bold text-red-600">{{ createdUserData.temporaryPassword }}</span>
                  <UButton @click="copyToClipboard(createdUserData.temporaryPassword)" size="xs" variant="ghost">
                    <UIcon name="i-heroicons-clipboard" />
                  </UButton>
                </div>
              </div>
            </div>
            
            <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <div class="flex items-start">
                <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                <div class="text-sm text-yellow-700 dark:text-yellow-300">
                  <p class="font-medium mb-1">Important:</p>
                  <p>{{ createdUserData.message }}</p>
                  <p class="mt-2">Please share these credentials securely with the new user.</p>
                </div>
              </div>
            </div>
          </div>
          
          <UButton @click="showSuccessModal = false" color="primary">
            Got it
          </UButton>
        </div>
      </div>
    </UModal>

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
            
            <div class="space-y-2">
              <div v-for="partner in partners" :key="partner.id" class="flex items-center">
                <UCheckbox
                  :id="`partner-${partner.id}`"
                  v-model="selectedPartners"
                  :value="partner.id"
                  class="mr-3"
                />
                <label 
                  :for="`partner-${partner.id}`" 
                  class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >
                  {{ partner.name }}
                  <span class="text-xs text-gray-500 ml-2">({{ partner.email || 'No email' }})</span>
                </label>
              </div>
              
              <div v-if="partners.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                No partners available. Create partners first.
              </div>
            </div>
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
const { getPartners, getUserList, createUser, regeneratePassword, deleteUser } = useApi()
const { extractData } = useApiResponse()

const loading = ref(false)
const showCreateModal = ref(false)
const showSuccessModal = ref(false)
const showPasswordModal = ref(false)
const editingUser = ref(null)
const saving = ref(false)
const createdUserData = ref(null)
const regeneratedPasswordData = ref(null)

const filters = ref({
  search: '',
  role: ''
})

const userForm = ref({
  name: '',
  email: '',
  role: ''
})

const selectedPartners = ref([])
const partners = ref([])

const roleOptions = [
  { label: 'Manager', value: 'manager' },
  { label: 'Staff', value: 'staff' },
  { label: 'Partner', value: 'partner' }
]

const users = ref([])

const canCreateUsers = computed(() => {
  const role = currentUser.value?.role
  return ['admin', 'owner'].includes(role)
})

const canEditUser = (user) => {
  const role = currentUser.value?.role
  if (!role) return false
  
  // Owner/Admin can edit anyone except other owners/admins (unless it's themselves)
  if (['owner', 'admin'].includes(role)) {
    return !['owner', 'admin'].includes(user.role) || user.id === currentUser.value?.id
  }
  
  // Manager can edit staff and partners
  if (role === 'manager') {
    return ['staff', 'partner'].includes(user.role)
  }
  
  return false
}

const canDeleteUser = (user) => {
  const role = currentUser.value?.role
  return ['owner', 'admin'].includes(role) && 
         !['owner', 'admin'].includes(user.role) && 
         user.id !== currentUser.value?.id
}

const canRegeneratePassword = (user) => {
  const role = currentUser.value?.role
  return ['owner', 'admin'].includes(role) && user.id !== currentUser.value?.id
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
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

// Load partners when modal opens
watch(showCreateModal, async (isOpen) => {
  if (isOpen) {
    await loadPartners()
  }
})

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUsers()
  ])
})

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role
  }
  selectedPartners.value = user.accessible_partners || []
  showCreateModal.value = true
}

const regeneratePasswordAction = async (user) => {
  if (confirm(`Regenerate password for ${user.name}?\n\nThis will create a new temporary password that the user must change on next login.`)) {
    try {
      const response = await regeneratePassword(user.id)
      if (response.success) {
        regeneratedPasswordData.value = {
          email: response.data.email,
          temporaryPassword: response.data.temporary_password
        }
        showPasswordModal.value = true
        const { notifySuccess } = useNotify()
        notifySuccess(`Password regenerated for ${user.name}`)
      } else {
        throw new Error(response.message || 'Failed to regenerate password')
      }
    } catch (error) {
      const { notifyError } = useNotify()
      const errorMessage = error.message?.includes('admin/owner') 
        ? 'Only admin/owner can regenerate passwords'
        : `Failed to regenerate password: ${error.message || 'Unknown error'}`
      notifyError(errorMessage)
    }
  }
}

const deleteUserAction = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    try {
      const response = await deleteUser(user.id)
      if (response.success) {
        const { notifySuccess } = useNotify()
        notifySuccess(`User ${user.name} deleted successfully`)
        await loadUsers()
      } else {
        throw new Error(response.message || 'Failed to delete user')
      }
    } catch (error) {
      const { notifyError } = useNotify()
      const errorMessage = error.message?.includes('admin/owner') 
        ? 'Only admin/owner can delete users'
        : `Failed to delete user: ${error.message || 'Unknown error'}`
      notifyError(errorMessage)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: ''
  }
  selectedPartners.value = []
}

const loadPartners = async () => {
  try {
    const result = await getPartners()
    partners.value = extractData(result)
  } catch (error) {
    partners.value = []
    const { notifyError } = useNotify()
    notifyError(`Failed to load partners: ${error.message || 'Unknown error'}`)
  }
}

const loadUsers = async () => {
  try {
    loading.value = true
    const result = await getUserList()
    users.value = extractData(result)
  } catch (error) {
    users.value = []
    const { notifyError } = useNotify()
    notifyError(`Failed to load users: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
}

const getPartnerName = (partnerId: string) => {
  const partner = partners.value.find(p => p.id === partnerId)
  return partner?.name || `Partner ${partnerId.substring(0, 6)}`
}

const getUserActions = (user) => {
  const actions = []
  
  if (canEditUser(user)) {
    actions.push([{
      label: 'Edit User',
      icon: 'i-heroicons-pencil-square',
      click: () => editUser(user)
    }])
  }
  
  if (canRegeneratePassword(user)) {
    actions.push([{
      label: 'Reset Password',
      icon: 'i-heroicons-key',
      click: () => regeneratePasswordAction(user)
    }])
  }
  
  if (canDeleteUser(user)) {
    actions.push([{
      label: 'Delete User',
      icon: 'i-heroicons-trash',
      click: () => deleteUserAction(user)
    }])
  }
  
  return actions
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    const { notifySuccess } = useNotify()
    notifySuccess('Copied to clipboard!')
  } catch (error) {
    const { notifyError } = useNotify()
    notifyError('Failed to copy to clipboard')
  }
}

const handleUserSubmit = async () => {
  saving.value = true
  
  try {
    const userData = {
      name: userForm.value.name,
      email: userForm.value.email,
      role: userForm.value.role,
      partner_ids: selectedPartners.value
    }
    
    if (editingUser.value) {
      // TODO: Implement user update when API is available
      throw new Error('User update not implemented yet')
    } else {
      const response = await createUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        accessible_partners: selectedPartners.value
      })
      
      if (response.success) {
        const { notifySuccess } = useNotify()
        notifySuccess(`User ${response.data.name} created successfully!`)
        
        closeModal()
        await loadUsers()
      } else {
        throw new Error(response.message || 'Failed to create user')
      }
    }
  } catch (error) {
    const { notifyError } = useNotify()
    
    // Handle specific error cases
    let errorMessage = 'Failed to save user'
    
    if (error.message.includes('User already exists') || error.message.includes('email_exists')) {
      errorMessage = `A user with email "${userForm.value.email}" already exists. Please use a different email address.`
    } else if (error.message.includes('422')) {
      errorMessage = 'Invalid user data. Please check all fields and try again.'
    } else if (error.message.includes('403') || error.message.includes('unauthorized')) {
      errorMessage = 'You do not have permission to create users.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    notifyError(errorMessage)
  } finally {
    saving.value = false
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 lg:hidden" @click="sidebarOpen = false">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
      <div class="flex h-16 items-center justify-between px-4">
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">MetroBNB</h1>
        <div class="flex items-center space-x-2">
          <UButton
            :icon="$colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="gray"
            variant="ghost"
            size="sm"
            @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'"
          />
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            size="sm"
            class="lg:hidden"
            @click="sidebarOpen = false"
          />
        </div>
      </div>
      <nav class="mt-6 px-3 space-y-6 flex-1 overflow-y-auto">
        <!-- User Profile Card -->
        <div v-if="user" class="mx-3 mb-6">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-user" class="h-6 w-6" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold truncate">{{ user.name }}</p>
                <p class="text-blue-100 text-sm truncate">{{ user.email }}</p>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm capitalize">
                {{ user.role }}
              </span>
              <NuxtLink to="/profile" class="text-white/80 hover:text-white transition-colors">
                <UIcon name="i-heroicons-cog-6-tooth" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div v-for="group in navigationGroups" :key="group.name">
          <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            {{ group.name }}
          </h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in group.items"
              :key="item.name"
              :to="item.href"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200"
              active-class="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-r-2 border-blue-500"
              @click="sidebarOpen = false"
            >
              <UIcon :name="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
              <span class="truncate">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Show all navigation if no groups match -->
        <div v-if="navigationGroups.length === 0 && user" class="px-3 py-2 bg-red-100 rounded text-xs">
          <p>No navigation groups match role: {{ user.role }}</p>
          <p>Available roles in navigation: admin, manager, staff, partner, owner</p>
        </div>
      </nav>
      
      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <UButton @click="handleLogout" variant="ghost" size="sm" block class="mb-3">
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-2" />
          Logout
        </UButton>
        <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
          MetroBNB v1.0.0
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b h-16 flex items-center justify-between px-4">
        <div class="flex items-center">
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            size="sm"
            class="lg:hidden mr-3"
            @click="sidebarOpen = true"
          />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-6">
        <AppBreadcrumbs />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const sidebarOpen = ref(false)
const { user, logout, initializeAuth } = useAuth()
const { notifySuccess } = useNotify()

const handleLogout = async () => {
  await logout()
  notifySuccess('Logged out successfully')
  await navigateTo('/login')
}

// Initialize auth on layout mount (no more getCurrentUser call)
onMounted(() => {
  initializeAuth()
})

const allNavigationGroups = [
  {
    name: 'Overview',
    roles: ['admin', 'manager', 'staff', 'partner', 'owner'], // Added 'owner'
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: 'i-heroicons-home', roles: ['admin', 'manager', 'staff', 'partner', 'owner'] },
    ]
  },
  {
    name: 'Analytics',
    roles: ['admin', 'manager', 'staff', 'owner'], // Added 'owner'
    items: [
      { name: 'Business Overview', href: '/analytics/overview', icon: 'i-heroicons-chart-bar', roles: ['admin', 'manager', 'owner'] },
      { name: 'Own Units', href: '/analytics/own-units', icon: 'i-heroicons-home-modern', roles: ['admin', 'manager', 'staff', 'owner'] },
      { name: 'Partners', href: '/analytics/partners', icon: 'i-heroicons-users', roles: ['admin', 'manager', 'owner'] },
    ]
  },
  {
    name: 'Operations',
    roles: ['admin', 'manager', 'staff', 'partner', 'owner'], // Added 'owner'
    items: [
      { name: 'Bookings', href: '/accounting/bookings', icon: 'i-heroicons-calendar-days', roles: ['admin', 'manager', 'staff', 'partner', 'owner'] },
      { name: 'Expenses', href: '/expenses', icon: 'i-heroicons-receipt-percent', roles: ['admin', 'manager', 'staff', 'partner', 'owner'] },
      { name: 'Journal Entries', href: '/journal-entries', icon: 'i-heroicons-document-plus', roles: ['admin', 'manager', 'owner'] },
      { name: 'Invoices', href: '/invoices', icon: 'i-heroicons-document-text', roles: ['admin', 'manager', 'staff', 'partner', 'owner'] },
      { name: 'Partners & Earnings', href: '/accounting/partners', icon: 'i-heroicons-chart-bar-square', roles: ['admin', 'manager', 'owner'] },
    ]
  },
  {
    name: 'Management',
    roles: ['admin', 'manager', 'owner'], // Added 'owner'
    items: [
      { name: 'Partners', href: '/partners', icon: 'i-heroicons-users', roles: ['admin', 'manager', 'owner'] },
      { name: 'Units', href: '/admin/units', icon: 'i-heroicons-building-office-2', roles: ['admin', 'manager', 'owner'] },
      { name: 'Services', href: '/admin/services', icon: 'i-heroicons-wrench-screwdriver', roles: ['admin', 'owner'] },
      { name: 'Booking Sources', href: '/admin/booking-sources', icon: 'i-heroicons-globe-alt', roles: ['admin', 'owner'] },
    ]
  },
  {
    name: 'Account',
    roles: ['admin', 'manager', 'staff', 'partner', 'owner'],
    items: [
      { name: 'Profile', href: '/profile', icon: 'i-heroicons-user-circle', roles: ['admin', 'manager', 'staff', 'partner', 'owner'] },
      { name: 'User Management', href: '/users', icon: 'i-heroicons-users', roles: ['admin', 'manager'] },
    ]
  },
  {
    name: 'Development',
    roles: ['admin', 'owner'], // Added 'owner'
    items: [
      { name: 'Mock Demo', href: '/mock-demo', icon: 'i-heroicons-beaker', roles: ['admin', 'owner'] },
      { name: 'Refresh Data', href: '/admin/refresh-data', icon: 'i-heroicons-arrow-path', roles: ['admin', 'owner'] },
    ]
  }
]

const navigationGroups = computed(() => {
  if (!user.value) return []
  
  console.log('🔍 Filtering navigation for user role:', user.value.role)
  
  const filtered = allNavigationGroups
    .filter(group => group.roles.includes(user.value!.role))
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(user.value!.role))
    }))
    .filter(group => group.items.length > 0)
    
  console.log('🔍 Filtered navigation groups:', filtered)
  return filtered
})

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    staff: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    partner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    owner: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const pageTitle = computed(() => {
  const path = route.path
  
  // Find the current page in navigation groups
  for (const group of navigationGroups.value) {
    for (const item of group.items) {
      if (path === item.href || (item.href !== '/' && path.startsWith(item.href))) {
        return item.name
      }
    }
  }
  
  // Fallback titles for specific paths
  if (path.includes('/create')) return 'Create New'
  if (path.includes('/edit')) return 'Edit'
  if (path === '/') return 'Welcome'
  
  return 'MetroBNB'
})
</script>
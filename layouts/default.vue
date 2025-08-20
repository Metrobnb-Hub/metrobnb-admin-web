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
      </nav>
      
      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
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
const route = useRoute()
const sidebarOpen = ref(false)

const navigationGroups = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: 'i-heroicons-home' },
    ]
  },
  {
    name: 'Operations',
    items: [
      { name: 'Bookings', href: '/accounting/bookings', icon: 'i-heroicons-calendar-days' },
      { name: 'Expenses', href: '/expenses', icon: 'i-heroicons-receipt-percent' },
      { name: 'Journal Entries', href: '/journal-entries', icon: 'i-heroicons-document-plus' },
      { name: 'Invoices', href: '/invoices', icon: 'i-heroicons-document-text' },
      { name: 'Partners & Earnings', href: '/accounting/partners', icon: 'i-heroicons-chart-bar-square' },
    ]
  },
  {
    name: 'Management',
    items: [
      { name: 'Partners', href: '/partners', icon: 'i-heroicons-users' },
      { name: 'Units', href: '/admin/units', icon: 'i-heroicons-building-office-2' },
      { name: 'Services', href: '/admin/services', icon: 'i-heroicons-wrench-screwdriver' },
      { name: 'Booking Sources', href: '/admin/booking-sources', icon: 'i-heroicons-globe-alt' },
    ]
  },
  {
    name: 'Development',
    items: [
      { name: 'Mock Demo', href: '/mock-demo', icon: 'i-heroicons-beaker' },
      { name: 'Refresh Data', href: '/admin/refresh-data', icon: 'i-heroicons-arrow-path' },
    ]
  }
]

const pageTitle = computed(() => {
  const path = route.path
  
  // Find the current page in navigation groups
  for (const group of navigationGroups) {
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
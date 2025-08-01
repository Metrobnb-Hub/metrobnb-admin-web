<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 lg:hidden" @click="sidebarOpen = false">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out',
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
      <nav class="mt-6 px-3">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mb-1 text-gray-700 dark:text-gray-200"
          active-class="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          @click="sidebarOpen = false"
        >
          <UIcon :name="item.icon" class="mr-3 h-5 w-5" />
          {{ item.name }}
        </NuxtLink>
      </nav>
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
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'i-heroicons-home' },
  { name: 'Bookings', href: '/accounting/bookings', icon: 'i-heroicons-document-text' },
  { name: 'Partners', href: '/partners', icon: 'i-heroicons-users' },
  { name: 'Expenses', href: '/expenses', icon: 'i-heroicons-minus-circle' },
  { name: 'Earnings', href: '/accounting/partners', icon: 'i-heroicons-chart-bar' },
  { name: 'Services', href: '/admin/services', icon: 'i-heroicons-cog-6-tooth' },
  { name: 'Booking Sources', href: '/admin/booking-sources', icon: 'i-heroicons-link' },
  { name: 'Refresh Data', href: '/admin/refresh-data', icon: 'i-heroicons-arrow-path' },
]

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path.includes('/accounting/bookings')) return 'Booking Payments'
  if (path.includes('/accounting/partners')) return 'Partners & Earnings'
  if (path.includes('/partners')) return 'Partners Management'
  if (path.includes('/expenses')) return 'Expense Management'
  return 'MetroBNB'
})
</script>
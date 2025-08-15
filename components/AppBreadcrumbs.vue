<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
    <NuxtLink 
      to="/dashboard" 
      class="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    >
      <UIcon name="i-heroicons-home" class="h-4 w-4" />
    </NuxtLink>
    
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
      <UIcon name="i-heroicons-chevron-right" class="h-4 w-4 text-gray-400" />
      
      <NuxtLink 
        v-if="index < breadcrumbs.length - 1"
        :to="crumb.path"
        class="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        {{ crumb.name }}
      </NuxtLink>
      
      <span 
        v-else
        class="font-medium text-gray-900 dark:text-white"
      >
        {{ crumb.name }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

interface Breadcrumb {
  name: string
  path: string
}

const breadcrumbs = computed((): Breadcrumb[] => {
  const path = route.path
  const crumbs: Breadcrumb[] = []
  
  // Define breadcrumb mappings
  const pathMappings: Record<string, Breadcrumb[]> = {
    '/dashboard': [
      { name: 'Dashboard', path: '/dashboard' }
    ],
    '/accounting/bookings': [
      { name: 'Accounting', path: '/accounting' },
      { name: 'Bookings', path: '/accounting/bookings' }
    ],
    '/accounting/partners': [
      { name: 'Accounting', path: '/accounting' },
      { name: 'Partners & Earnings', path: '/accounting/partners' }
    ],
    '/partners': [
      { name: 'Partners', path: '/partners' }
    ],
    '/partners/create': [
      { name: 'Partners', path: '/partners' },
      { name: 'Create Partner', path: '/partners/create' }
    ],
    '/expenses': [
      { name: 'Expenses', path: '/expenses' }
    ],
    '/expenses/create': [
      { name: 'Expenses', path: '/expenses' },
      { name: 'Add Expense', path: '/expenses/create' }
    ],
    '/admin/units': [
      { name: 'Admin', path: '/admin' },
      { name: 'Units', path: '/admin/units' }
    ],
    '/admin/services': [
      { name: 'Admin', path: '/admin' },
      { name: 'Services', path: '/admin/services' }
    ],
    '/admin/booking-sources': [
      { name: 'Admin', path: '/admin' },
      { name: 'Booking Sources', path: '/admin/booking-sources' }
    ]
  }
  
  // Check for exact match first
  if (pathMappings[path]) {
    return pathMappings[path]
  }
  
  // Handle dynamic routes (like /partners/[id])
  if (path.startsWith('/partners/') && path !== '/partners/create') {
    return [
      { name: 'Partners', path: '/partners' },
      { name: 'Partner Details', path: path }
    ]
  }
  
  // Fallback: generate breadcrumbs from path segments
  const segments = path.split('/').filter(Boolean)
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    crumbs.push({ name, path: currentPath })
  })
  
  return crumbs.length > 0 ? crumbs : [{ name: 'Home', path: '/' }]
})
</script>
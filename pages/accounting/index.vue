<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Accounting</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage bookings, partners, and financial records</p>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/accounting/bookings')">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-calendar-days" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bookings</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage booking payments and records</p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/accounting/partners')">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-users" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Partners</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Partner management and invoicing</p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/expenses')">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Track and manage expenses</p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/journal-entries')">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Journal Entries</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Adjustments and corrections</p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/dashboard')">
        <div class="flex items-center">
          <div class="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Financial overview and analytics</p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/partners')">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <UIcon name="i-heroicons-building-office" class="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Partner Management</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Add and manage partners</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this overview page
</script>
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage system settings and configurations</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Services -->
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Services</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage service offerings</p>
          </div>
          <UIcon name="i-heroicons-cog-6-tooth" class="h-8 w-8 text-blue-500" />
        </div>
        <div class="mt-4">
          <UButton to="/admin/services" block>Manage Services</UButton>
        </div>
      </UCard>

      <!-- Booking Sources -->
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Booking Sources</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Configure booking channels</p>
          </div>
          <UIcon name="i-heroicons-globe-alt" class="h-8 w-8 text-green-500" />
        </div>
        <div class="mt-4">
          <UButton to="/admin/booking-sources" block>Manage Sources</UButton>
        </div>
      </UCard>

      <!-- User Management -->
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Users</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage user accounts</p>
          </div>
          <UIcon name="i-heroicons-users" class="h-8 w-8 text-purple-500" />
        </div>
        <div class="mt-4">
          <UButton to="/users" block>Manage Users</UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})
</script>
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome to MetroBNB</p>
      <div v-if="user" class="mt-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">Logged in as: {{ user.name }} ({{ user.role }})</p>
      </div>
    </div>

    <!-- Simple test content -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Dashboard Test</h3>
      </template>
      <p>If you can see this, the dashboard is working!</p>

    </UCard>
  </div>
</template>

<script setup lang="ts">
// Temporarily remove middleware to test
// definePageMeta({
//   middleware: 'auth'
// })

const { user } = useAuth()

</script>
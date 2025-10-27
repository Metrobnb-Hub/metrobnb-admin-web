<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Environment Debug</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-lg font-semibold mb-4">Runtime Config</h2>
      
      <div class="space-y-2">
        <div class="flex justify-between border-b pb-2">
          <span class="font-medium">API Base URL:</span>
          <span class="font-mono text-blue-600">{{ config.public.apiBaseUrl }}</span>
        </div>
        
        <div class="flex justify-between border-b pb-2">
          <span class="font-medium">Dev Mode:</span>
          <span class="font-mono">{{ config.public.devMode }}</span>
        </div>
        
        <div class="flex justify-between border-b pb-2">
          <span class="font-medium">Is Development:</span>
          <span class="font-mono">{{ config.public.dev }}</span>
        </div>
        
        <div class="flex justify-between border-b pb-2">
          <span class="font-medium">NODE_ENV:</span>
          <span class="font-mono">{{ nodeEnv }}</span>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
        <h3 class="font-semibold mb-2">Test Credentials Available:</h3>
        <div class="text-sm space-y-1">
          <div>Admin Email: {{ config.public.testCredentials?.admin?.email || 'Not set' }}</div>
          <div>Staff Email: {{ config.public.testCredentials?.staff?.email || 'Not set' }}</div>
          <div>Partner Email: {{ config.public.testCredentials?.partner?.email || 'Not set' }}</div>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
        <h3 class="font-semibold mb-2">Which .env file is loaded?</h3>
        <p class="text-sm">
          <span v-if="config.public.apiBaseUrl === 'http://localhost:8000'" class="text-green-600 font-bold">
            ✅ .env.local is loaded (localhost:8000)
          </span>
          <span v-else-if="config.public.apiBaseUrl.includes('onrender.com')" class="text-orange-600 font-bold">
            ⚠️ .env is loaded (production API)
          </span>
          <span v-else class="text-gray-600">
            ❓ Unknown configuration
          </span>
        </p>
      </div>
    </div>
    
    <div class="mt-4">
      <UButton to="/" color="gray">Back to Home</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const nodeEnv = process.env.NODE_ENV || 'unknown'
</script>

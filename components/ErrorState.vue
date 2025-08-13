<template>
  <div class="text-center py-12">
    <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-red-500 mb-4" />
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ title }}</h3>
    <p class="text-gray-500 dark:text-gray-400 mb-6">{{ message }}</p>
    <div class="space-x-3">
      <UButton v-if="showRetry" @click="$emit('retry')" color="primary">
        <UIcon name="i-heroicons-arrow-path" class="mr-2" />
        Try Again
      </UButton>
      <UButton v-if="showHome" to="/dashboard" color="gray">
        <UIcon name="i-heroicons-home" class="mr-2" />
        Go Home
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  showRetry?: boolean
  showHome?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'We encountered an error while loading this page.',
  showRetry: true,
  showHome: true
})

defineEmits<{
  retry: []
}>()
</script>
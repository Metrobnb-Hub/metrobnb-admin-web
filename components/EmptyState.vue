<template>
  <div class="text-center py-12">
    <UIcon :name="icon" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ title }}</h3>
    <p class="text-gray-500 dark:text-gray-400 mb-6">{{ message }}</p>
    <UButton v-if="actionText && actionTo" :to="actionTo" color="primary">
      <UIcon :name="actionIcon" class="mr-2" />
      {{ actionText }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  message: string
  actionText?: string
  actionTo?: string
  actionIcon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'i-heroicons-inbox',
  actionIcon: 'i-heroicons-plus'
})
</script>
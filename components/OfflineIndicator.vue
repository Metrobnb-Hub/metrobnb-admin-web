<template>
  <div v-if="!isOnline" class="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white text-center py-2 text-sm">
    <UIcon name="i-heroicons-wifi-slash" class="inline mr-2" />
    You're offline. Some features may be limited.
  </div>
</template>

<script setup lang="ts">
const { isOnline } = usePWA()
</script>
<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications :ui="{ position: 'top-0 right-0' }" />
  </div>
</template>

<script setup lang="ts">
// Initialize preloader for SPA mode
// const { preloadEssentialData } = usePreloader()

// onMounted(async () => {
//   await preloadEssentialData()
// })
</script>
<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Initialize preloader for SPA mode
// const { preloadEssentialData } = usePreloader()

// onMounted(async () => {
//   await preloadEssentialData()
// })
</script>
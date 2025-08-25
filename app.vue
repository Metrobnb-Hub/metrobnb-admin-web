<template>
  <div>
    <NuxtLoadingIndicator />
    <OfflineIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PWAInstallBanner />
  </div>
</template>

<script setup lang="ts">
// Initialize preloader for SPA mode
const { preloadEssentialData } = usePreloader()

onMounted(async () => {
  await preloadEssentialData()
})
</script>
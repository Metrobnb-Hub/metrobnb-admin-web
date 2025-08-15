<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Preload essential data on app start
onMounted(async () => {
  const { preloadEssentialData } = usePreloader()
  preloadEssentialData()
})
</script>
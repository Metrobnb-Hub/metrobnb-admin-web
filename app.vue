<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <ConfirmModal ref="globalConfirmModal" />
  </div>
</template>

<style>
/* Force toast notifications to top-right on desktop, centered on mobile */
[role="region"] {
  position: fixed !important;
  top: 1rem !important;
  right: 1rem !important;
  bottom: auto !important;
  left: auto !important;
  z-index: 50 !important;
  justify-content: flex-start !important;
}

/* Mobile: center the toasts */
@media (max-width: 640px) {
  [role="region"] {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    width: calc(100vw - 2rem) !important;
    max-width: 24rem !important;
  }
}
</style>

<script setup lang="ts">
// Initialize preloader for SPA mode
// const { preloadEssentialData } = usePreloader()

// onMounted(async () => {
//   await preloadEssentialData()
// })

// Make confirm modal globally available
const globalConfirmModal = ref()
provide('confirmModal', globalConfirmModal)
</script>
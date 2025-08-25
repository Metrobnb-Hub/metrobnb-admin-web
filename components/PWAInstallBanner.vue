<template>
  <div v-if="isInstallable" class="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
    <UCard class="shadow-lg">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-device-phone-mobile" class="text-primary text-xl" />
        <div class="flex-1">
          <p class="text-sm font-medium">Install MetroBNB Admin</p>
          <p class="text-xs text-gray-500">Get app-like experience</p>
        </div>
        <div class="flex gap-2">
          <UButton size="xs" variant="ghost" @click="dismiss">
            Dismiss
          </UButton>
          <UButton size="xs" @click="install">
            Install
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { isInstallable: canInstall, installApp } = usePWA()
const showBanner = ref(true)

const install = async () => {
  const success = await installApp()
  if (success) {
    showBanner.value = false
  }
}

const dismiss = () => {
  showBanner.value = false
}

const isInstallable = computed(() => canInstall.value && showBanner.value)
</script>
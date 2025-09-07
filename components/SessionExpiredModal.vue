<template>
  <UModal v-model="isOpen" :prevent-close="true">
    <UCard>
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-500 mr-2" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Session Expired</h3>
        </div>
      </template>
      
      <div class="py-4">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Your session has expired for security reasons. Please log in again to continue using the application.
        </p>
        
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div class="flex items-start">
            <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              You will be redirected to the login page automatically.
            </p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <UButton @click="handleRelogin" color="primary">
            Go to Login
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  onRelogin?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Session Expired',
  message: 'Your session has expired. Please log in again to continue.'
})

const isOpen = ref(true)

const handleRelogin = () => {
  isOpen.value = false
  if (props.onRelogin) {
    props.onRelogin()
  } else {
    window.location.href = '/login'
  }
}

// Auto-redirect after 10 seconds
onMounted(() => {
  setTimeout(() => {
    if (isOpen.value) {
      handleRelogin()
    }
  }, 10000)
})
</script>
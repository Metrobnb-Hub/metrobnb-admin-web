<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon :name="icon" :class="iconClass" />
          <h3 class="text-lg font-semibold">{{ title }}</h3>
        </div>
      </template>

      <div class="space-y-3">
        <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">{{ message }}</p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton 
            variant="ghost" 
            @click="handleCancel"
            :disabled="loading"
          >
            {{ cancelText }}
          </UButton>
          <UButton 
            :color="confirmColor" 
            @click="handleConfirm"
            :loading="loading"
          >
            {{ confirmText }}
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
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  icon?: string
  iconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to continue?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'red',
  icon: 'i-heroicons-exclamation-triangle',
  iconClass: 'text-red-500'
})

const isOpen = ref(false)
const loading = ref(false)
const resolvePromise = ref<((value: boolean) => void) | null>(null)

function show(): Promise<boolean> {
  return new Promise((resolve) => {
    resolvePromise.value = resolve
    isOpen.value = true
  })
}

async function handleConfirm() {
  loading.value = true
  await nextTick()
  loading.value = false
  isOpen.value = false
  resolvePromise.value?.(true)
  resolvePromise.value = null
}

function handleCancel() {
  isOpen.value = false
  resolvePromise.value?.(false)
  resolvePromise.value = null
}

defineExpose({
  show
})
</script>

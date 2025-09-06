<template>
  <div v-if="invoiceData">
    <PartnerInvoice :invoice="invoiceData" />
  </div>
  <div v-else class="max-w-4xl mx-auto">
    <UCard>
      <div class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Invoice Data</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Please generate an invoice from the partners page</p>
        <UButton to="/partners" color="primary">Go to Partners</UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const invoiceData = ref(null)

onMounted(() => {
  const saved = localStorage.getItem('current-invoice')
  if (saved) {
    try {
      invoiceData.value = JSON.parse(saved)
    } catch (error) {
    }
  }
})
</script>
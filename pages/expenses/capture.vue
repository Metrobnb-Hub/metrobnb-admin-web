<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Capture Receipt</h1>
      <p class="text-gray-600 dark:text-gray-400">Take a photo of your receipt to create an expense</p>
    </div>

    <!-- Receipt Capture -->
    <UCard>
      <div class="text-center py-8">
        <div v-if="!uploading && !receiptUrl" class="space-y-4">
          <div class="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <UIcon name="i-heroicons-camera" class="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Take Receipt Photo</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Capture a clear photo of your receipt
            </p>
          </div>
          
          <div class="space-y-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="handleFileSelect"
            />
            <UButton @click="$refs.fileInput.click()" color="primary" size="lg">
              <UIcon name="i-heroicons-camera" class="mr-2" />
              Take Photo
            </UButton>
            <p class="text-xs text-gray-500">Or select from gallery</p>
          </div>
        </div>

        <div v-if="uploading" class="space-y-4">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p class="text-gray-600 dark:text-gray-400">Uploading receipt...</p>
        </div>

        <div v-if="receiptUrl && !uploading" class="space-y-4">
          <img :src="receiptUrl" alt="Receipt" class="max-w-full h-64 object-contain mx-auto rounded-lg border" />
          <div class="flex justify-center space-x-3">
            <UButton @click="retakePhoto" variant="outline">
              <UIcon name="i-heroicons-arrow-path" class="mr-2" />
              Retake
            </UButton>
            <UButton @click="processReceipt" color="primary">
              <UIcon name="i-heroicons-check" class="mr-2" />
              Continue
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Tips -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">📸 Photo Tips</h3>
      </template>
      <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <li class="flex items-center">
          <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-green-500 mr-2" />
          Ensure receipt is clearly visible and readable
        </li>
        <li class="flex items-center">
          <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-green-500 mr-2" />
          Use good lighting for best results
        </li>
        <li class="flex items-center">
          <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-green-500 mr-2" />
          Keep receipt flat and avoid shadows
        </li>
        <li class="flex items-center">
          <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-green-500 mr-2" />
          Include the entire receipt in the frame
        </li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { uploadFile, quickCaptureReceipt } = useApi()
const { notifySuccess, notifyError } = useNotify()

const uploading = ref(false)
const receiptUrl = ref('')
const receiptData = ref(null)

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const result = await uploadFile(file, 'receipts')
    receiptUrl.value = result.public_url
    receiptData.value = result
    notifySuccess('Receipt uploaded successfully')
  } catch (error) {
    console.error('Upload failed:', error)
    notifyError('Failed to upload receipt')
  } finally {
    uploading.value = false
  }
}

const retakePhoto = () => {
  receiptUrl.value = ''
  receiptData.value = null
}

const processReceipt = async () => {
  if (!receiptData.value) return

  try {
    const result = await quickCaptureReceipt({
      receipt_url: receiptData.value.public_url,
      receipt_public_id: receiptData.value.file_id,
      notes: 'Receipt captured via mobile'
    })

    if (result.id) {
      notifySuccess('Receipt processed! Complete the expense details.')
      await navigateTo(`/expenses/review/${result.id}`)
    }
  } catch (error) {
    console.error('Processing failed:', error)
    notifyError('Failed to process receipt')
  }
}
</script>
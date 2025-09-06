<template>
  <div class="space-y-6">
    <!-- Add Expense Form -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Add Expense</h3>
      </template>
      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Partner" name="partnerId">
            <USelect v-model="form.partnerId" :options="partnerOptions" placeholder="Select partner" />
          </UFormGroup>
          <UFormGroup label="Unit" name="unitId">
            <USelect v-model="form.unitId" :options="unitOptions" placeholder="Select unit" :disabled="!form.partnerId" />
          </UFormGroup>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Date" name="date">
            <UInput v-model="form.date" type="date" />
          </UFormGroup>
          <UFormGroup label="Type" name="type">
            <USelect v-model="form.type" :options="expenseTypes" placeholder="Select type" />
          </UFormGroup>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Amount" name="amount">
            <UInput v-model="form.amount" type="number" step="0.01" placeholder="0.00" />
          </UFormGroup>
          <UFormGroup label="Paid By" name="paidBy">
            <USelect v-model="form.paidBy" :options="paidByOptions" placeholder="Who paid?" />
          </UFormGroup>
        </div>
        
        <UFormGroup label="Billable" name="billable">
          <UToggle v-model="form.billable" />
          <span class="ml-2 text-sm text-gray-600">{{ form.billable ? 'Bill to partner' : 'MetroBNB absorbs' }}</span>
        </UFormGroup>
        
        <!-- Receipt Upload -->
        <UFormGroup label="Receipt" name="receipt">
          <!-- No file selected -->
          <div v-if="!selectedFile" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div class="text-center">
              <UIcon name="i-heroicons-photo" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div class="space-y-2">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <UButton @click="$refs.fileInput.click()" variant="outline">
                  <UIcon name="i-heroicons-camera" class="mr-2" />
                  Select Receipt
                </UButton>
                <p class="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          
          <!-- File selected -->
          <div v-else class="relative">
            <img :src="previewUrl" alt="Receipt Preview" class="w-full h-48 object-cover rounded-lg" />
            <div class="absolute top-2 right-2 flex gap-2">
              <UButton @click="removeReceipt" color="red" variant="solid" size="sm">
                <UIcon name="i-heroicons-x-mark" />
              </UButton>
            </div>
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {{ selectedFile.name }}
            </div>
          </div>
        </UFormGroup>
        
        <UFormGroup label="Notes" name="notes">
          <UTextarea v-model="form.notes" placeholder="Optional notes" />
        </UFormGroup>
        
        <UButton type="submit" :loading="loading">Add Expense</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { createExpense, uploadFile } = useApi()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const form = ref({
  partnerId: '',
  unitId: '',
  date: new Date().toISOString().split('T')[0],
  type: '',
  amount: 0,
  paidBy: 'metrobnb',
  billable: true,
  notes: ''
})

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const unitOptions = computed(() => {
  if (!form.value.partnerId || !Array.isArray(units.value)) return []
  return units.value
    .filter(u => u.partner_id === form.value.partnerId)
    .map(u => ({ label: u.name, value: u.id }))
})

const expenseTypes = [
  { label: 'Cleaning', value: 'Cleaning' },
  { label: 'Laundry', value: 'Laundry' },
  { label: 'Supplies', value: 'Supplies' },
  { label: 'Wifi', value: 'Wifi' },
  { label: 'Electricity', value: 'Electricity' },
  { label: 'Repair', value: 'Repair' },
  { label: 'Repairs', value: 'Repairs' },
  { label: 'Miscellaneous', value: 'Miscellaneous' }
]

const paidByOptions = [
  { label: 'MetroBNB', value: 'metrobnb' },
  { label: 'Partner', value: 'partner' },
  { label: 'Employee', value: 'employee' },
  { label: 'Owner', value: 'owner' }
]

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const removeReceipt = () => {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  // Reset file input
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const handleSubmit = async (event: any) => {
  event.preventDefault()
  const { notifySuccess, notifyError } = useNotify()
  
  if (!form.value.partnerId || !form.value.unitId || !form.value.type || !form.value.amount) {
    notifyError('Please fill in all required fields')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('partner_id', form.value.partnerId)
    formData.append('unit_id', form.value.unitId)
    formData.append('amount', form.value.amount.toString())
    formData.append('type', form.value.type)
    formData.append('date', form.value.date)
    
    if (selectedFile.value) {
      formData.append('receipt_file', selectedFile.value)
    }
    
    const { $api } = useNuxtApp()
    
    const response = await $api('/api/expenses', {
      method: 'POST',
      body: formData
    })
    
    notifySuccess('Expense added successfully')
    router.push('/expenses')
  } catch (error: any) {
    
    const errorMessage = error.data?.error?.message || error.message || 'Failed to add expense'
    notifyError(errorMessage)
  } finally {
    loading.value = false
  }
}

// Clear unit when partner changes
watch(() => form.value.partnerId, (newPartnerId, oldPartnerId) => {
  if (oldPartnerId && newPartnerId !== oldPartnerId) {
    form.value.unitId = ''
  }
})

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits()
  ])
})
</script>
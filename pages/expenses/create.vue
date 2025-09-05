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
          <div v-if="!form.receiptUrl" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div class="text-center">
              <UIcon name="i-heroicons-photo" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div class="space-y-2">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <UButton @click="$refs.fileInput.click()" variant="outline" :loading="uploading">
                  <UIcon name="i-heroicons-camera" class="mr-2" />
                  Upload Receipt
                </UButton>
                <p class="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          
          <div v-else class="relative">
            <img :src="form.receiptUrl" alt="Receipt" class="w-full h-48 object-cover rounded-lg" />
            <UButton 
              @click="removeReceipt" 
              color="red" 
              variant="solid" 
              size="sm"
              class="absolute top-2 right-2"
            >
              <UIcon name="i-heroicons-x-mark" />
            </UButton>
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
const uploading = ref(false)
const form = ref({
  partnerId: '',
  unitId: '',
  date: new Date().toISOString().split('T')[0],
  type: '',
  amount: 0,
  paidBy: 'metrobnb',
  billable: true,
  receiptUrl: '',
  receiptPublicId: '',
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

const handleFileUpload = async (event: Event) => {
  const { notifySuccess, notifyError } = useNotify()
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const result = await uploadFile(file, 'receipts')
    form.value.receiptUrl = result.public_url
    form.value.receiptPublicId = result.file_id
    notifySuccess('Receipt uploaded successfully')
  } catch (error) {
    console.error('Upload failed:', error)
    notifyError('Failed to upload receipt')
  } finally {
    uploading.value = false
  }
}

const removeReceipt = () => {
  form.value.receiptUrl = ''
  form.value.receiptPublicId = ''
}

const handleSubmit = async () => {
  const { notifySuccess, notifyError } = useNotify()
  
  if (!form.value.partnerId || !form.value.unitId || !form.value.type || !form.value.amount) {
    notifyError('Please fill in all required fields')
    return
  }

  loading.value = true
  try {
    await createExpense({
      partner_id: form.value.partnerId,
      unit_id: form.value.unitId,
      date: form.value.date,
      type: form.value.type as any,
      amount: Number(form.value.amount),
      paid_by: form.value.paidBy,
      billable: form.value.billable,
      receipt_url: form.value.receiptUrl || undefined,
      receipt_public_id: form.value.receiptPublicId || undefined,
      notes: form.value.notes
    })
    
    notifySuccess('Expense added successfully')
    router.push('/expenses')
  } catch (error) {
    notifyError('Failed to add expense')
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
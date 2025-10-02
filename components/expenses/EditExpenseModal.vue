<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Edit Expense</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect v-model="state.partnerId" :options="partnerOptions" />
          </UFormGroup>
          
          <UFormGroup label="Unit" name="unitId" required>
            <USelect 
              v-model="state.unitId" 
              :options="availableUnits" 
              :disabled="!state.partnerId"
            />
          </UFormGroup>
          
          <UFormGroup label="Date" name="date" required>
            <DateInput v-model="state.date" />
          </UFormGroup>
          
          <UFormGroup label="Expense Type" name="type" required>
            <USelect v-model="state.type" :options="expenseTypes" />
          </UFormGroup>
          
          <UFormGroup label="Amount" name="amount" required>
            <UInput v-model="state.amount" type="number" step="0.01" min="0" />
          </UFormGroup>
          
          <UFormGroup label="Billable" name="billable">
            <USelect v-model="state.billable" :options="billableOptions" />
          </UFormGroup>
          
          <UFormGroup label="Payment Status" name="paid">
            <USelect v-model="state.paid" :options="paidOptions" />
          </UFormGroup>
          
          <UFormGroup label="Payment Date" name="paidDate" v-if="state.paid === 'true'">
            <DateInput v-model="state.paidDate" />
          </UFormGroup>
          
          <!-- Receipt Preview/Upload -->
          <UFormGroup label="Receipt" name="receipt" class="md:col-span-2">
            <div v-if="state.receiptUrl || state.receiptFullUrl" class="space-y-3">
              <div class="relative inline-block">
                <img :src="state.receiptFullUrl || state.receiptUrl" alt="Receipt" class="w-32 h-32 object-cover rounded-lg border" />
                <UButton 
                  @click="removeReceipt" 
                  color="red" 
                  variant="solid" 
                  size="xs"
                  class="absolute -top-2 -right-2"
                >
                  <UIcon name="i-heroicons-x-mark" />
                </UButton>
              </div>
              <UButton @click="$refs.fileInput.click()" variant="outline" size="sm" :loading="uploading">
                <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                Replace Receipt
              </UButton>
            </div>
            
            <div v-else class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <div class="text-center">
                <UIcon name="i-heroicons-photo" class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <UButton @click="$refs.fileInput.click()" variant="outline" size="sm" :loading="uploading">
                  <UIcon name="i-heroicons-camera" class="mr-2" />
                  Upload Receipt
                </UButton>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </UFormGroup>
          
          <UFormGroup label="Paid By" name="paidBy" class="md:col-span-1">
            <USelect v-model="state.paidBy" :options="paidByOptions" />
          </UFormGroup>
          
          <UFormGroup label="Notes" name="notes" class="md:col-span-2">
            <UTextarea v-model="state.notes" placeholder="Additional details (optional)" />
          </UFormGroup>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="isOpen = false" :disabled="loading">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="loading">Update Expense</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface Props {
  expense: any
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'updated': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const schema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  unitId: z.string().min(1, 'Unit is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['Cleaning', 'Laundry', 'Supplies', 'Wifi', 'Electricity', 'Repair', 'Repairs', 'Miscellaneous']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional()
})

const state = reactive({
  partnerId: '',
  unitId: '',
  date: '',
  type: '' as 'Cleaning' | 'Laundry' | 'Supplies' | 'Wifi' | 'Electricity' | 'Repair' | 'Repairs' | 'Miscellaneous' | '',
  amount: 0,
  billable: 'true',
  paid: 'false',
  paidDate: '',
  paidBy: 'metrobnb',
  receiptUrl: '',
  receiptFullUrl: '',
  receiptPublicId: '',
  notes: ''
})

const uploading = ref(false)

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

const billableOptions = [
  { label: 'Billable', value: 'true' },
  { label: 'Non-billable', value: 'false' }
]

const paidOptions = [
  { label: 'Unpaid', value: 'false' },
  { label: 'Paid', value: 'true' }
]

const paidByOptions = [
  { label: 'MetroBNB', value: 'metrobnb' },
  { label: 'Partner', value: 'partner' },
  { label: 'Employee', value: 'employee' },
  { label: 'Owner', value: 'owner' }
]

const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { updateExpense, uploadFile } = useApi()

const loading = ref(false)

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partnerId || !Array.isArray(units.value)) {
    return []
  }
  
  const filtered = units.value.filter(unit => {
    const unitPartnerId = unit.partnerId || unit.partner_id
    const matches = unitPartnerId === state.partnerId
    return matches
  })
  
  return filtered.map(unit => ({ label: unit.name, value: unit.id }))
})

watch(() => state.partnerId, (newPartnerId, oldPartnerId) => {
  // Only clear unit if partner is manually changed, not during initial load
  if (oldPartnerId && newPartnerId !== oldPartnerId) {
    state.unitId = ''
  }
})

const handleFileUpload = async (event: Event) => {
  const { notifySuccess, notifyError } = useNotify()
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const result = await uploadFile(file, 'receipts')
    state.receiptUrl = result.public_url
    state.receiptPublicId = result.file_id
    notifySuccess('Receipt uploaded successfully')
  } catch (error) {
    notifyError('Failed to upload receipt')
  } finally {
    uploading.value = false
  }
}

const removeReceipt = () => {
  state.receiptUrl = ''
  state.receiptFullUrl = ''
  state.receiptPublicId = ''
}

const onSubmit = async () => {
  const { notifySuccess, notifyError } = useNotify()
  
  loading.value = true
  try {
    const updateData: any = {
      partner_id: state.partnerId,
      unit_id: state.unitId,
      date: state.date,
      type: state.type,
      amount: state.amount,
      paid_by: state.paidBy,
      billable: state.billable === 'true',
      paid: state.paid === 'true',
      receipt_url: state.receiptUrl || undefined,
      receipt_public_id: state.receiptPublicId || undefined,
      notes: state.notes
    }
    
    // Only include paidDate if marking as paid AND has a date
    if (state.paid === 'true' && state.paidDate) {
      updateData.paid_date = state.paidDate
    } else if (state.paid === 'false') {
      // Explicitly set to null when unpaid
      updateData.paid_date = null
    }
    
    await updateExpense(props.expense.id, updateData)
    
    notifySuccess('Expense updated successfully')
    
    emit('updated')
    isOpen.value = false
  } catch (error) {
    notifyError('Failed to update expense')
  } finally {
    loading.value = false
  }
}

watch(() => props.expense, (expense) => {
  if (expense) {
    const partnerId = expense.partnerId || expense.partner_id
    const unitId = expense.unitId || expense.unit_id
    
    
    Object.assign(state, {
      partnerId,
      unitId,
      date: expense.date,
      type: expense.type,
      amount: parseFloat(expense.amount) || 0,
      paidBy: expense.paid_by || 'metrobnb',
      billable: expense.billable ? 'true' : 'false',
      paid: expense.paid ? 'true' : 'false',
      paidDate: expense.paidDate || '',
      receiptUrl: expense.receipt_url || '',
      receiptFullUrl: expense.receipt_full_url || '',
      receiptPublicId: expense.receipt_public_id || '',
      notes: expense.notes || expense.note || ''
    })
    
  }
}, { immediate: true })

// Auto-set payment date when marking as paid
watch(() => state.paid, (newValue) => {
  if (newValue === 'true' && !state.paidDate) {
    state.paidDate = new Date().toISOString().split('T')[0]
  }
})

// Load data when modal opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    await Promise.all([
      loadPartners(),
      loadUnits()
    ])
  }
})
</script>
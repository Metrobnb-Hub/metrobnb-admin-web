<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Review Expense</h1>
        <p class="text-gray-600 dark:text-gray-400">Complete the expense details</p>
      </div>
      <UButton to="/expenses" variant="ghost">
        <UIcon name="i-heroicons-x-mark" class="mr-2" />
        Cancel
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-gray-500">Loading expense...</div>
    </div>

    <div v-else-if="expense" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Receipt Preview -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Receipt</h3>
        </template>
        <div v-if="expense.receipt_url" class="text-center">
          <img 
            :src="expense.receipt_url" 
            alt="Receipt"
            class="max-w-full h-96 object-contain mx-auto rounded-lg border"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No receipt image available
        </div>
      </UCard>

      <!-- Expense Form -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Expense Details</h3>
        </template>
        
        <form @submit.prevent="completeExpense" class="space-y-4">
          <UFormGroup label="Partner" required>
            <USelect 
              v-model="formData.partner_id" 
              :options="partnerOptions"
              placeholder="Select partner"
            />
          </UFormGroup>

          <UFormGroup label="Unit" required>
            <USelect 
              v-model="formData.unit_id" 
              :options="unitOptions"
              placeholder="Select unit"
            />
          </UFormGroup>

          <UFormGroup label="Amount" required>
            <UInput 
              v-model="formData.amount" 
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </UFormGroup>

          <UFormGroup label="Expense Type" required>
            <USelect 
              v-model="formData.type" 
              :options="expenseTypeOptions"
              placeholder="Select type"
            />
          </UFormGroup>

          <UFormGroup label="Paid By">
            <USelect 
              v-model="formData.paid_by" 
              :options="paidByOptions"
            />
          </UFormGroup>

          <UFormGroup label="Notes">
            <UTextarea 
              v-model="formData.notes" 
              placeholder="Additional notes..."
              rows="3"
            />
          </UFormGroup>

          <div class="flex justify-end space-x-3 pt-4">
            <UButton to="/expenses" variant="outline">
              Save as Draft
            </UButton>
            <UButton type="submit" color="primary" :loading="completing">
              Complete Expense
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getDraftExpenses, completeExpense: completeExpenseApi } = useApi()
const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { notifySuccess, notifyError } = useNotify()

const expenseId = route.params.id as string
const loading = ref(true)
const completing = ref(false)
const expense = ref(null)

const formData = reactive({
  partner_id: '',
  unit_id: '',
  amount: '',
  type: 'Miscellaneous',
  paid_by: 'metrobnb',
  notes: ''
})

const expenseTypeOptions = [
  { label: 'Supplies', value: 'Supplies' },
  { label: 'Wifi', value: 'Wifi' },
  { label: 'Electricity', value: 'Electricity' },
  { label: 'Repair', value: 'Repair' },
  { label: 'Repairs', value: 'Repairs' },
  { label: 'Laundry', value: 'Laundry' },
  { label: 'Cleaning', value: 'Cleaning' },
  { label: 'Miscellaneous', value: 'Miscellaneous' }
]

const paidByOptions = [
  { label: 'MetroBNB', value: 'metrobnb' },
  { label: 'Partner', value: 'partner' },
  { label: 'Employee', value: 'employee' },
  { label: 'Owner', value: 'owner' }
]

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const unitOptions = computed(() => {
  if (!Array.isArray(units.value)) return []
  return units.value.map(u => ({ label: u.name, value: u.id }))
})

const loadExpense = async () => {
  try {
    loading.value = true
    const result = await getDraftExpenses()
    const drafts = result.items || result.data || []
    expense.value = drafts.find(d => d.id === expenseId)
    
    if (!expense.value) {
      notifyError('Expense draft not found')
      await navigateTo('/expenses')
    }
  } catch (error) {
    console.error('Failed to load expense:', error)
    notifyError('Failed to load expense')
  } finally {
    loading.value = false
  }
}

const completeExpense = async () => {
  if (!formData.partner_id || !formData.unit_id || !formData.amount || !formData.type) {
    notifyError('Please fill in all required fields')
    return
  }

  try {
    completing.value = true
    await completeExpenseApi(expenseId, {
      partner_id: formData.partner_id,
      unit_id: formData.unit_id,
      amount: formData.amount,
      type: formData.type,
      paid_by: formData.paid_by
    })
    
    notifySuccess('Expense completed successfully')
    await navigateTo('/expenses')
  } catch (error) {
    console.error('Failed to complete expense:', error)
    notifyError('Failed to complete expense')
  } finally {
    completing.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits(),
    loadExpense()
  ])
})
</script>
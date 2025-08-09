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
          <UFormGroup label="Billable" name="billable">
            <UToggle v-model="form.billable" />
            <span class="ml-2 text-sm text-gray-600">{{ form.billable ? 'Bill to partner' : 'MetroBNB absorbs' }}</span>
          </UFormGroup>
        </div>
        
        <UFormGroup label="Notes" name="notes">
          <UTextarea v-model="form.notes" placeholder="Optional notes" />
        </UFormGroup>
        
        <UButton type="submit" :loading="loading">Add Expense</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { createExpense } = useApi()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const form = ref({
  partnerId: '',
  unitId: '',
  date: new Date().toISOString().split('T')[0],
  type: '',
  amount: 0,
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
    .filter(u => (u.partnerId || u.partner_id) === form.value.partnerId)
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

const handleSubmit = async () => {
  const { notifySuccess, notifyError } = useNotify()
  
  if (!form.value.partnerId || !form.value.unitId || !form.value.type || !form.value.amount) {
    notifyError('Please fill in all required fields')
    return
  }

  loading.value = true
  try {
    await createExpense({
      partnerId: form.value.partnerId,
      unitId: form.value.unitId,
      date: form.value.date,
      type: form.value.type as any,
      amount: Number(form.value.amount),
      billable: form.value.billable,
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
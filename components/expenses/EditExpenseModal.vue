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
            <UInput v-model="state.date" type="date" />
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
            <UInput v-model="state.paidDate" type="date" />
          </UFormGroup>
          
          <UFormGroup label="Notes" name="notes" class="md:col-span-2">
            <UTextarea v-model="state.notes" placeholder="Additional details (optional)" />
          </UFormGroup>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary">Update Expense</UButton>
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
  notes: ''
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

const billableOptions = [
  { label: 'Billable', value: 'true' },
  { label: 'Non-billable', value: 'false' }
]

const paidOptions = [
  { label: 'Unpaid', value: 'false' },
  { label: 'Paid', value: 'true' }
]

const { partners, units, loadPartners, loadUnits } = useDataManager()
const { updateExpense } = useApi()

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partnerId || !Array.isArray(units.value)) {
    console.log('No partnerId or units not loaded:', { partnerId: state.partnerId, unitsLoaded: Array.isArray(units.value) })
    return []
  }
  
  const filtered = units.value.filter(unit => {
    const unitPartnerId = unit.partnerId || unit.partner_id
    const matches = unitPartnerId === state.partnerId
    console.log('Unit filter check:', { unitName: unit.name, unitPartnerId, selectedPartnerId: state.partnerId, matches })
    return matches
  })
  
  console.log('Available units for partner:', filtered)
  return filtered.map(unit => ({ label: unit.name, value: unit.id }))
})

watch(() => state.partnerId, (newPartnerId, oldPartnerId) => {
  // Only clear unit if partner is manually changed, not during initial load
  if (oldPartnerId && newPartnerId !== oldPartnerId) {
    console.log('Partner changed manually, clearing unit')
    state.unitId = ''
  }
})

const onSubmit = async () => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    const updateData: any = {
      partner_id: state.partnerId,
      unit_id: state.unitId,
      date: state.date,
      type: state.type,
      amount: state.amount,
      billable: state.billable === 'true',
      paid: state.paid === 'true',
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
  }
}

watch(() => props.expense, (expense) => {
  if (expense) {
    console.log('Loading expense data:', expense)
    const partnerId = expense.partnerId || expense.partner_id
    const unitId = expense.unitId || expense.unit_id
    
    console.log('Extracted IDs:', { partnerId, unitId })
    
    Object.assign(state, {
      partnerId,
      unitId,
      date: expense.date,
      type: expense.type,
      amount: parseFloat(expense.amount) || 0,
      billable: expense.billable ? 'true' : 'false',
      paid: expense.paid ? 'true' : 'false',
      paidDate: expense.paidDate || '',
      notes: expense.notes || ''
    })
    
    console.log('State after assignment:', state)
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
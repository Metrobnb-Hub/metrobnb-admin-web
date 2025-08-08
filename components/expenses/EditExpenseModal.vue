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
  type: z.enum(['Cleaning', 'Laundry', 'Supplies', 'Wifi', 'Electricity', 'Repair', 'Repairs', 'Miscellaneous', 'Misc']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional()
})

const state = reactive({
  partnerId: '',
  unitId: '',
  date: '',
  type: '' as 'Cleaning' | 'Laundry' | 'Supplies' | 'Wifi' | 'Electricity' | 'Repair' | 'Repairs' | 'Miscellaneous' | 'Misc' | '',
  amount: 0,
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
  { label: 'Miscellaneous', value: 'Miscellaneous' },
  { label: 'Misc', value: 'Misc' }
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
  try {
    await updateExpense(props.expense.id, state)
    
    const toast = useToast()
    toast.add({
      title: 'Expense updated',
      description: 'Expense has been updated successfully',
      color: 'green'
    })
    
    emit('updated')
    isOpen.value = false
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to update expense',
      color: 'red'
    })
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
      notes: expense.notes || ''
    })
    
    console.log('State after assignment:', state)
  }
}, { immediate: true })

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
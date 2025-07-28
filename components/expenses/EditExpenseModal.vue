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
  type: z.enum(['cleaning', 'laundry', 'utilities', 'repair', 'misc']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional()
})

const state = reactive({
  partnerId: '',
  unitId: '',
  date: '',
  type: '' as 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc' | '',
  amount: 0,
  notes: ''
})

const expenseTypes = [
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Laundry', value: 'laundry' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Repair', value: 'repair' },
  { label: 'Miscellaneous', value: 'misc' }
]

const { partners } = usePartnerStore()
const { units } = useUnitStore()
const { updateExpense } = useExpenseStore()

const partnerOptions = computed(() => 
  partners.map(p => ({ label: p.name, value: p.id }))
)

const availableUnits = computed(() => {
  if (!state.partnerId) return []
  return units
    .filter(unit => unit.partnerId === state.partnerId)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

watch(() => state.partnerId, () => {
  state.unitId = ''
})

const onSubmit = () => {
  const updatedExpense = {
    ...props.expense,
    ...state
  }
  
  updateExpense(props.expense.id, updatedExpense)
  
  const toast = useToast()
  toast.add({
    title: 'Expense updated',
    description: 'Expense has been updated successfully',
    color: 'green'
  })
  
  emit('updated')
  isOpen.value = false
}

watch(() => props.expense, (expense) => {
  if (expense) {
    Object.assign(state, {
      partnerId: expense.partnerId,
      unitId: expense.unitId,
      date: expense.date,
      type: expense.type,
      amount: expense.amount,
      notes: expense.notes || ''
    })
  }
}, { immediate: true })
</script>
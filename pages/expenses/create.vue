<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Expense</h1>
      <p class="text-gray-600 dark:text-gray-400">Record expenses charged to partners</p>
    </div>

    <!-- Form Section -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Expense Details</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect 
              v-model="state.partnerId" 
              :options="partnerOptions" 
              placeholder="Select partner"
            />
          </UFormGroup>
          
          <UFormGroup label="Unit" name="unitId" required>
            <USelect 
              v-model="state.unitId" 
              :options="availableUnits" 
              :disabled="!state.partnerId"
              placeholder="Select partner first"
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
          <UButton color="gray" variant="ghost" @click="resetForm">Clear</UButton>
          <UButton type="submit" color="primary">Add Expense</UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Expenses List -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Recent Expenses</h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total: ₱{{ totalExpenses.toFixed(2) }}
          </div>
        </div>
      </template>
      
      <div v-if="expenses.length" class="space-y-3">
        <div 
          v-for="expense in recentExpenses" 
          :key="expense.id"
          class="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div class="absolute top-2 right-2">
            <UDropdown :items="getExpenseActions(expense)">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
            </UDropdown>
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ getPartnerName(expense.partnerId) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ getUnitName(expense.unitId) }}
              </span>
            </div>
            <div class="flex items-center space-x-4 mt-1">
              <span 
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="getExpenseTypeClass(expense.type)"
              >
                {{ getExpenseTypeLabel(expense.type) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(expense.date) }}
              </span>
            </div>
            <p v-if="expense.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ expense.notes }}
            </p>
          </div>
          <div class="text-right pr-8">
            <span class="font-semibold text-red-600 dark:text-red-400">
              ₱{{ expense.amount.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No expenses recorded yet</p>
      </div>
    </UCard>

    <!-- Edit Modal -->
    <ExpensesEditExpenseModal 
      v-model="showEditModal" 
      :expense="selectedExpense" 
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  unitId: z.string().min(1, 'Unit is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['cleaning', 'laundry', 'utilities', 'repair', 'misc'], {
    required_error: 'Expense type is required'
  }),
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

const { partners, loadFromStorage: loadPartners } = usePartnerStore()
const { units, loadFromStorage: loadUnits } = useUnitStore()
const { expenses, addExpense, updateExpense, deleteExpense, totalExpenses, loadFromStorage: loadExpenses } = useExpenseStore()

const showEditModal = ref(false)
const selectedExpense = ref(null)

const partnerOptions = computed(() => 
  partners.map(p => ({ label: p.name, value: p.id }))
)

const availableUnits = computed(() => {
  if (!state.partnerId) return []
  return units
    .filter(unit => unit.partnerId === state.partnerId)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

const recentExpenses = computed(() => 
  [...expenses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
)

// Reset unit when partner changes
watch(() => state.partnerId, () => {
  state.unitId = ''
})

const getPartnerName = (partnerId: string) => {
  return partners.find(p => p.id === partnerId)?.name || 'Unknown Partner'
}

const getUnitName = (unitId: string) => {
  return units.find(u => u.id === unitId)?.name || 'Unknown Unit'
}

const getExpenseTypeLabel = (type: string) => {
  const labels = {
    cleaning: 'Cleaning',
    laundry: 'Laundry',
    utilities: 'Utilities',
    repair: 'Repair',
    misc: 'Miscellaneous'
  }
  return labels[type as keyof typeof labels] || type
}

const getExpenseTypeClass = (type: string) => {
  const classes = {
    cleaning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    laundry: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    utilities: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    repair: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    misc: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[type as keyof typeof classes] || classes.misc
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getExpenseActions = (expense: any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: () => handleEdit(expense)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => handleDelete(expense.id)
  }]
]

const handleEdit = (expense: any) => {
  selectedExpense.value = expense
  showEditModal.value = true
}

const handleDelete = (id: string) => {
  deleteExpense(id)
  
  const toast = useToast()
  toast.add({
    title: 'Expense deleted',
    description: 'Expense has been removed',
    color: 'orange'
  })
}

const handleUpdated = () => {
  selectedExpense.value = null
}

const resetForm = () => {
  Object.assign(state, {
    partnerId: '',
    unitId: '',
    date: '',
    type: '',
    amount: 0,
    notes: ''
  })
}

const onSubmit = async () => {
  try {
    addExpense({
      partnerId: state.partnerId,
      unitId: state.unitId,
      date: state.date,
      type: state.type as any,
      amount: state.amount,
      notes: state.notes || undefined
    })
    
    const toast = useToast()
    toast.add({
      title: 'Expense added',
      description: `₱${state.amount.toFixed(2)} expense recorded successfully`,
      color: 'green'
    })
    
    resetForm()
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to add expense',
      color: 'red'
    })
  }
}

onMounted(async () => {
  await loadPartners()
  await loadUnits()
  await loadExpenses()
})
</script>
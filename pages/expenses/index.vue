<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage partner expenses and charges</p>
      </div>
      <UButton to="/expenses/create" color="primary">Add Expense</UButton>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalExpenses.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ expenses.length }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-calendar" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ thisMonthExpenses.toFixed(2) }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Expenses List -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">All Expenses</h3>
      </template>
      
      <div v-if="expenses.length" class="space-y-3">
        <div 
          v-for="expense in sortedExpenses" 
          :key="expense.id"
          class="relative flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
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
              <span 
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="expense.billable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
              >
                {{ expense.billable ? 'Billable' : 'Non-billable' }}
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
      
      <div v-else class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Start by recording your first expense</p>
        <UButton to="/expenses/create" color="primary">Add Expense</UButton>
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
const { partners, loadFromStorage: loadPartners } = usePartnerStore()
const { units, loadFromStorage: loadUnits } = useUnitStore()
const { expenses, totalExpenses, deleteExpense, loadFromStorage: loadExpenses } = useExpenseStore()

const showEditModal = ref(false)
const selectedExpense = ref(null)

const sortedExpenses = computed(() => 
  [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

const thisMonthExpenses = computed(() => {
  if (!Array.isArray(expenses) || expenses.length === 0) return 0
  
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return expenses
    .filter(expense => {
      if (!expense || !expense.date) return false
      try {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      } catch {
        return false
      }
    })
    .reduce((sum, expense) => sum + (typeof expense?.amount === 'number' ? expense.amount : 0), 0)
})

const getPartnerName = (partnerId: string) => {
  if (!partnerId || !Array.isArray(partners)) return 'Unknown Partner'
  const partner = partners.find(p => p && p.id === partnerId)
  return partner?.name || 'Unknown Partner'
}

const getUnitName = (unitId: string) => {
  if (!unitId || !Array.isArray(units)) return 'Unknown Unit'
  const unit = units.find(u => u && u.id === unitId)
  return unit?.name || 'Unknown Unit'
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

onMounted(async () => {
  try {
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadExpenses()
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  }
})
</script>
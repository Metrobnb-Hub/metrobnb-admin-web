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
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ expenses?.length || 0 }}</p>
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
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            All Expenses 
            <span v-if="pagination">({{ pagination.total_items }} total)</span>
            <span v-else>({{ expenses.length }})</span>
          </h3>
        </div>
      </template>
      
      <!-- Search and Filters -->
      <div class="mb-4 space-y-4">
        <div class="flex gap-4">
          <UInput 
            v-model="searchQuery" 
            placeholder="Search expenses..."
            icon="i-heroicons-magnifying-glass"
            class="flex-1"
          />
          <USelect 
            v-model="sortBy" 
            :options="sortOptions"
            class="w-48"
          />
          <USelect 
            v-model="filterType" 
            :options="typeFilterOptions"
            class="w-40"
          />
          <USelect 
            v-model="filterPaid" 
            :options="paidFilterOptions"
            class="w-40"
          />
        </div>
        
        <!-- Date Filters -->
        <div class="flex gap-4 items-center flex-wrap">
          <USelect 
            v-model="filterYear" 
            :options="yearOptions"
            placeholder="All years"
            class="w-32"
          />
          <USelect 
            v-model="filterMonth" 
            :options="monthOptions"
            placeholder="All months"
            class="w-36"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">or Custom Range:</span>
          <UInput 
            v-model="startDate" 
            type="date" 
            placeholder="Start date"
            class="w-40"
          />
          <span class="text-gray-400">to</span>
          <UInput 
            v-model="endDate" 
            type="date" 
            placeholder="End date"
            class="w-40"
          />
          <UButton 
            v-if="startDate || endDate || filterYear || filterMonth" 
            @click="clearDateFilters"
            color="gray" 
            variant="outline" 
            size="sm"
          >
            Clear Dates
          </UButton>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="text-gray-500">Loading expenses...</div>
      </div>
      
      <div v-else-if="expenses.length" class="space-y-3">
        <div 
          v-for="expense in expenses" 
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
                {{ getPartnerName(expense.partner_id) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ getUnitName(expense.unit_id) }}
              </span>
            </div>
            <div class="flex items-center space-x-4 mt-1">
              <span 
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="getExpenseTypeClass(expense.type)"
              >
                {{ expense.type }}
              </span>
              <span 
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="expense.billable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
              >
                {{ expense.billable ? 'Billable' : 'Non-billable' }}
              </span>
              <span 
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="expense.paid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
              >
                {{ expense.paid ? 'Paid' : 'Unpaid' }}
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
              ₱{{ parseFloat(expense.amount).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else-if="!isLoading" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Start by recording your first expense</p>
        <UButton to="/expenses/create" color="primary">Add Expense</UButton>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && pagination.total_pages > 1" class="flex justify-between items-center mt-6 pt-4 border-t">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} to 
          {{ Math.min(pagination.current_page * pagination.per_page, pagination.total_items) }} of 
          {{ pagination.total_items }} results
        </div>
        <div class="flex items-center space-x-2">
          <UButton 
            :disabled="!pagination.has_prev" 
            @click="goToPage(currentPage - 1)"
            color="gray" 
            variant="outline" 
            size="sm"
          >
            Previous
          </UButton>
          
          <div class="flex items-center space-x-1">
            <template v-for="page in getVisiblePages()" :key="page">
              <UButton 
                v-if="page !== '...'"
                :color="page === currentPage ? 'primary' : 'gray'"
                :variant="page === currentPage ? 'solid' : 'outline'"
                @click="goToPage(page)"
                size="sm"
                class="min-w-[2rem]"
              >
                {{ page }}
              </UButton>
              <span v-else class="px-2 text-gray-400">...</span>
            </template>
          </div>
          
          <UButton 
            :disabled="!pagination.has_next" 
            @click="goToPage(currentPage + 1)"
            color="gray" 
            variant="outline" 
            size="sm"
          >
            Next
          </UButton>
        </div>
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
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getExpenses, deleteExpense } = useApi()

const showEditModal = ref(false)
const selectedExpense = ref(null)
const searchQuery = ref('')
const sortBy = ref('date_desc')
const filterType = ref('all')
// Get current month and year
const now = new Date()
const currentYear = now.getFullYear().toString()
const currentMonth = (now.getMonth() + 1).toString()

const filterPaid = ref('all')
const filterYear = ref(currentYear)
const filterMonth = ref(currentMonth)
const startDate = ref('')
const endDate = ref('')
const expenses = ref([])
const pagination = ref(null)
const currentPage = ref(1)
const isLoading = ref(false)

const sortOptions = [
  { label: 'Date Newest', value: 'date_desc' },
  { label: 'Date Oldest', value: 'date_asc' },
  { label: 'Amount High-Low', value: 'amount_desc' },
  { label: 'Amount Low-High', value: 'amount_asc' },
  { label: 'Type A-Z', value: 'type_asc' },
  { label: 'Type Z-A', value: 'type_desc' }
]

const typeFilterOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Cleaning', value: 'Cleaning' },
  { label: 'Laundry', value: 'Laundry' },
  { label: 'Supplies', value: 'Supplies' },
  { label: 'Wifi', value: 'Wifi' },
  { label: 'Electricity', value: 'Electricity' },
  { label: 'Repair', value: 'Repair' },
  { label: 'Repairs', value: 'Repairs' },
  { label: 'Miscellaneous', value: 'Miscellaneous' }
]

const paidFilterOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Paid', value: 'true' },
  { label: 'Unpaid', value: 'false' }
]

const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push({ label: i.toString(), value: i.toString() })
  }
  
  return [{ label: 'All Years', value: '' }, ...years.reverse()]
})

const monthOptions = computed(() => {
  const months = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ]
  
  return [{ label: 'All Months', value: '' }, ...months]
})

const loadExpensesData = async () => {
  try {
    isLoading.value = true
    const [field, order] = sortBy.value.split('_')
    
    const filters: any = {
      sort_by: field,
      sort_order: order,
      page: currentPage.value,
      limit: 20
    }
    
    if (searchQuery.value && searchQuery.value.trim()) {
      filters.search = searchQuery.value.trim()
    }
    
    if (filterType.value && filterType.value !== 'all') {
      filters.type = filterType.value
    }
    
    if (filterPaid.value && filterPaid.value !== 'all') {
      filters.paid = filterPaid.value === 'true'
    }
    
    // Convert year/month to start_date and end_date
    let actualStartDate = startDate.value
    let actualEndDate = endDate.value
    
    if (filterYear.value || filterMonth.value) {
      const year = filterYear.value || new Date().getFullYear()
      const month = filterMonth.value || ''
      
      if (month) {
        const monthNum = parseInt(month)
        actualStartDate = `${year}-${monthNum.toString().padStart(2, '0')}-01`
        const lastDay = new Date(year, monthNum, 0).getDate()
        actualEndDate = `${year}-${monthNum.toString().padStart(2, '0')}-${lastDay}`
      } else {
        actualStartDate = `${year}-01-01`
        actualEndDate = `${year}-12-31`
      }
    }
    
    if (actualStartDate) {
      filters.start_date = actualStartDate
    }
    
    if (actualEndDate) {
      filters.end_date = actualEndDate
    }
    
    const result = await getExpenses(filters)
    
    if (result.data && result.pagination) {
      // Paginated response
      expenses.value = result.data
      pagination.value = result.pagination
    } else {
      // Non-paginated response (fallback)
      expenses.value = Array.isArray(result) ? result : result.data || []
      pagination.value = null
    }
  } catch (error) {
    console.error('Failed to load expenses:', error)
    expenses.value = []
    pagination.value = null
    
    const { notifyError } = useNotify()
    notifyError('Failed to load expenses')
  } finally {
    isLoading.value = false
  }
}

const thisMonthExpenses = computed(() => {
  if (!Array.isArray(expenses.value) || expenses.value.length === 0) return 0
  
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return expenses.value
    .filter(expense => {
      if (!expense || !expense.date) return false
      try {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      } catch {
        return false
      }
    })
    .reduce((sum, expense) => {
      const amount = parseFloat(expense.amount)
      return sum + amount
    }, 0)
})

const totalExpenses = computed(() => {
  if (!Array.isArray(expenses.value) || expenses.value.length === 0) return 0
  return expenses.value.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount)
    return sum + amount
  }, 0)
})

const getPartnerName = (partnerId: string) => {
  if (!partnerId || !Array.isArray(partners.value)) return 'Unknown Partner'
  const partner = partners.value.find(p => p && p.id === partnerId)
  return partner?.name || 'Unknown Partner'
}

const getUnitName = (unitId: string) => {
  if (!unitId || !Array.isArray(units.value)) return 'Unknown Unit'
  const unit = units.value.find(u => u && u.id === unitId)
  return unit?.name || 'Unknown Unit'
}

const getExpenseTypeClass = (type: string) => {
  const classes = {
    'Cleaning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Laundry': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Supplies': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Wifi': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Electricity': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Repair': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Repairs': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Miscellaneous': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'Misc': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getExpenseActions = (expense: any) => [
  [{
    label: expense.paid ? 'Mark Unpaid' : 'Mark Paid',
    icon: expense.paid ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle',
    click: () => togglePayment(expense)
  }],
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

const handleDelete = async (id: string) => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    await deleteExpense(id)
    await loadExpensesData()
    notifySuccess('Expense deleted successfully')
  } catch (error) {
    notifyError('Failed to delete expense')
  }
}

const togglePayment = async (expense: any) => {
  const { notifySuccess, notifyError } = useNotify()
  const { updateExpense } = useApi()
  
  try {
    const updateData = {
      paid: !expense.paid,
      paid_date: !expense.paid ? new Date().toISOString().split('T')[0] : null,
      billable: expense.billable,
      amount: expense.amount,
      type: expense.type,
      notes: expense.notes
    }
    
    await updateExpense(expense.id, updateData)
    await loadExpensesData()
    notifySuccess(`Expense marked as ${!expense.paid ? 'paid' : 'unpaid'}`)
  } catch (error) {
    notifyError('Failed to update payment status')
  }
}

const handleUpdated = () => {
  selectedExpense.value = null
  loadExpensesData()
}

// Pagination functions
const goToPage = (page: number) => {
  currentPage.value = page
  loadExpensesData()
}

const getVisiblePages = () => {
  if (!pagination.value) return []
  
  const total = pagination.value.total_pages
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first page, current page area, and last page with ellipsis
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
}

// Clear date filters function
const clearDateFilters = () => {
  filterYear.value = ''
  filterMonth.value = ''
  startDate.value = ''
  endDate.value = ''
}

// Watch for filter changes
watch([sortBy, filterType, filterPaid, filterYear, filterMonth, startDate, endDate], () => {
  currentPage.value = 1 // Reset to first page
  loadExpensesData()
})

// Watch search with debounce
let searchTimeout: NodeJS.Timeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page
    loadExpensesData()
  }, 300)
})

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits(),
    loadExpensesData()
  ])
})
</script>
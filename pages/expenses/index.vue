<template>
  <div class="space-y-3 sm:space-y-6">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex justify-between items-start gap-3">
        <div class="min-w-0 flex-1">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Expenses</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Manage partner expenses and charges</p>
        </div>
        <UButton v-if="!isPartner" to="/expenses/create" color="primary" size="xs" class="sm:size-sm">
          <UIcon name="i-heroicons-plus" class="sm:mr-1" />
          <span class="hidden sm:inline">Add Expense</span>
        </UButton>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
      <UCard class="p-3 sm:p-4">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 bg-metrobnb-100 dark:bg-metrobnb-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-600 dark:text-metrobnb-400" />
          </div>
          <div class="ml-2 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">₱{{ totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 }) }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-3 sm:p-4">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 bg-metrobnb-200 dark:bg-metrobnb-800 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-700 dark:text-metrobnb-300" />
          </div>
          <div class="ml-2 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Records</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{{ expenses?.length || 0 }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard class="p-3 sm:p-4 col-span-2 sm:col-span-1">
        <div class="flex items-center">
          <div class="p-2 sm:p-3 bg-metrobnb-300 dark:bg-metrobnb-700 rounded-lg">
            <UIcon name="i-heroicons-calendar" class="h-4 w-4 sm:h-6 sm:w-6 text-metrobnb-800 dark:text-metrobnb-200" />
          </div>
          <div class="ml-2 sm:ml-4 min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">₱{{ thisMonthExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 }) }}</p>
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
      <div class="mb-4 space-y-3">
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <UInput 
            v-model="searchQuery" 
            placeholder="Search expenses..."
            icon="i-heroicons-magnifying-glass"
            class="w-full sm:flex-1"
            size="sm"
            @input="handleSearchInput"
          />
          <div class="flex gap-2">
            <USelect 
              v-model="sortBy" 
              :options="sortOptions"
              class="flex-1 sm:w-auto"
              size="sm"
              @change="loadExpensesData"
            />
            <UButton 
              variant="outline" 
              size="sm"
              @click="showAdvancedFilters = !showAdvancedFilters"
            >
              <UIcon name="i-heroicons-funnel" class="sm:mr-1" />
              <span class="hidden sm:inline">Filters</span>
            </UButton>
            <UButton 
              v-if="selectedExpenses.length > 0"
              variant="outline" 
              size="sm"
              @click="showBulkActions = !showBulkActions"
            >
              <UIcon name="i-heroicons-squares-plus" class="sm:mr-1" />
              <span class="hidden sm:inline">Bulk ({{ selectedExpenses.length }})</span>
            </UButton>
          </div>
        </div>
        
        <!-- Bulk Actions -->
        <div v-if="showBulkActions && selectedExpenses.length > 0" class="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900">
          <div class="flex flex-wrap gap-2">
            <UButton size="sm" color="green" @click="bulkMarkPaid">
              <UIcon name="i-heroicons-check-circle" class="mr-1" />
              Mark Paid ({{ selectedExpenses.length }})
            </UButton>
            <UButton size="sm" color="red" @click="bulkMarkUnpaid">
              <UIcon name="i-heroicons-x-circle" class="mr-1" />
              Mark Unpaid ({{ selectedExpenses.length }})
            </UButton>
            <UButton size="sm" color="blue" @click="bulkMarkBillable">
              <UIcon name="i-heroicons-tag" class="mr-1" />
              Mark Billable ({{ selectedExpenses.length }})
            </UButton>
            <UButton size="sm" color="gray" @click="bulkMarkNonBillable">
              <UIcon name="i-heroicons-minus" class="mr-1" />
              Mark Non-Billable ({{ selectedExpenses.length }})
            </UButton>
            <UButton size="sm" color="red" variant="outline" @click="clearSelection">
              Clear Selection
            </UButton>
          </div>
        </div>
        
        <!-- Advanced Filters -->
        <div v-if="showAdvancedFilters" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UFormGroup label="Year">
              <USelect 
                v-model="filterYear" 
                :options="yearOptions"
                placeholder="All years"
              />
            </UFormGroup>
            
            <UFormGroup label="Month">
              <USelect 
                v-model="filterMonth" 
                :options="monthOptions"
                placeholder="All months"
              />
            </UFormGroup>
            
            <UFormGroup label="Partner">
              <USelect 
                v-model="filterPartner" 
                :options="partnerOptions"
                placeholder="Select partner"
              />
            </UFormGroup>
            
            <UFormGroup label="Unit">
              <USelect 
                v-model="filterUnit" 
                :options="unitOptions"
                placeholder="Select unit"
                :disabled="!filterPartner"
              />
            </UFormGroup>
            
            <UFormGroup label="Type">
              <USelect 
                v-model="filterType" 
                :options="typeFilterOptions"
                placeholder="Select type"
              />
            </UFormGroup>
            
            <UFormGroup label="Payment Status">
              <USelect 
                v-model="filterPaid" 
                :options="paidFilterOptions"
                placeholder="Select status"
              />
            </UFormGroup>
            
            <UFormGroup label="Billable">
              <USelect 
                v-model="filterBillable" 
                :options="billableFilterOptions"
                placeholder="Select billable"
              />
            </UFormGroup>
            
            <UFormGroup label="Start Date">
              <UInput 
                v-model="startDate" 
                type="date"
                placeholder="From date"
              />
            </UFormGroup>
            
            <UFormGroup label="End Date">
              <UInput 
                v-model="endDate" 
                type="date"
                placeholder="To date"
              />
            </UFormGroup>
          </div>
          
          <div class="flex justify-end gap-2 mt-4">
            <UButton variant="ghost" @click="clearFilters">
              Clear All
            </UButton>
            <UButton color="primary" @click="applyFilters">
              Apply Filters
            </UButton>
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="text-gray-500">Loading expenses...</div>
      </div>
      
      <div v-if="!isLoading">

        
        <!-- Mobile card layout -->
        <div v-if="expenses.length" class="sm:hidden space-y-3">
        <UCard v-for="expense in expenses" :key="expense.id" class="p-4">
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div class="flex items-start gap-3 min-w-0 flex-1">
                <UCheckbox 
                  :model-value="selectedExpenses.includes(expense.id)"
                  @update:model-value="toggleExpenseSelection(expense.id)"
                  class="mt-1"
                />
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ getPartnerName(expense) }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ getUnitName(expense) }}</p>
                </div>
              </div>
              <UDropdown :items="getExpenseActions(expense)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="xs" />
              </UDropdown>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Type:</span>
                <UBadge :color="getExpenseTypeColor(expense.type)" size="xs" class="ml-1">
                  {{ expense.type }}
                </UBadge>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Amount:</span>
                <p class="font-medium text-metrobnb-600 dark:text-metrobnb-400">₱{{ parseFloat(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 0 }) }}</p>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Status:</span>
                <UBadge :color="expense.paid ? 'green' : 'red'" size="xs" class="ml-1">
                  {{ expense.paid ? 'Paid' : 'Unpaid' }}
                </UBadge>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Billable:</span>
                <UBadge :color="expense.billable ? 'blue' : 'gray'" size="xs" class="ml-1">
                  {{ expense.billable ? 'Yes' : 'No' }}
                </UBadge>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Date:</span>
                <p class="font-medium">{{ formatDate(expense.date) }}</p>
              </div>
            </div>
            
            <p v-if="expense.notes" class="text-sm text-gray-600 dark:text-gray-400 truncate">
              {{ expense.notes }}
            </p>
          </div>
        </UCard>
      </div>
      
        <!-- Desktop table layout -->
        <div v-if="expenses.length" class="hidden sm:block">
          <UTable :rows="expenses" :columns="expenseColumns">
            <template #select-data="{ row }">
              <UCheckbox 
                :model-value="selectedExpenses.includes(row.id)"
                @update:model-value="toggleExpenseSelection(row.id)"
              />
            </template>
            
            <template #partner-data="{ row }">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ getPartnerName(row) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ getUnitName(row) }}</div>
              </div>
            </template>
            
            <template #type-data="{ row }">
              <UBadge :color="getExpenseTypeColor(row.type)" size="xs">
                {{ row.type }}
              </UBadge>
            </template>
            
            <template #amount-data="{ row }">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-metrobnb-600 dark:text-metrobnb-400">
                  ₱{{ parseFloat(row.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                </span>
                <UIcon v-if="row.receipt_url" name="i-heroicons-photo" class="h-4 w-4 text-gray-400" title="Has receipt" />
              </div>
            </template>
            
            <template #billable-data="{ row }">
              <UBadge :color="row.billable ? 'blue' : 'gray'" size="xs">
                {{ row.billable ? 'Yes' : 'No' }}
              </UBadge>
            </template>
            
            <template #paid-data="{ row }">
              <UBadge :color="row.paid ? 'green' : 'red'" size="xs">
                {{ row.paid ? 'Paid' : 'Unpaid' }}
              </UBadge>
            </template>
            
            <template #date-data="{ row }">
              {{ formatDate(row.date) }}
            </template>
            
            <template #actions-data="{ row }">
              <UDropdown :items="getExpenseActions(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
              </UDropdown>
            </template>
          </UTable>
        </div>
      
        <div v-else class="text-center py-12">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Start by recording your first expense</p>
          <div class="flex space-x-3">
          <UButton to="/expenses/capture" color="primary" variant="outline">
            <UIcon name="i-heroicons-camera" class="mr-2" />
            Capture Receipt
          </UButton>
          <UButton to="/expenses/create" color="primary">Add Expense</UButton>
        </div>
        </div>
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
const { user } = useAuth()
const { getExpenses, deleteExpense } = useApi()
const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { extractData, extractPagination } = useApiResponse()

const isPartner = computed(() => user.value?.role === 'partner')

const showEditModal = ref(false)
const selectedExpense = ref(null)
const selectedExpenses = ref([])
const showBulkActions = ref(false)
const searchQuery = ref('')
const sortBy = ref('date_desc')
const showAdvancedFilters = ref(false)
const filterType = ref('')
const filterPaid = ref('')
const filterBillable = ref('')
const filterPartner = ref('')
const filterUnit = ref('')
const filterYear = ref('')
const filterMonth = ref('')
const startDate = ref('')
const endDate = ref('')
const expenses = ref([])
const pagination = ref(null)
const currentPage = ref(1)
const totalItems = ref(0)
const isLoading = ref(false)

const sortOptions = [
  { label: 'Date Newest', value: 'date_desc' },
  { label: 'Date Oldest', value: 'date_asc' },
  { label: 'Amount High-Low', value: 'amount_desc' },
  { label: 'Amount Low-High', value: 'amount_asc' },
  { label: 'Type A-Z', value: 'type_asc' },
  { label: 'Type Z-A', value: 'type_desc' }
]

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return [{ label: 'All Partners', value: '' }, ...partners.value.map(p => ({ label: p.name, value: p.id }))]
})

const unitOptions = computed(() => {
  if (!Array.isArray(units.value)) return []
  const filteredUnits = filterPartner.value 
    ? units.value.filter(u => u.partner_id === filterPartner.value)
    : units.value
  return [{ label: 'All Units', value: '' }, ...filteredUnits.map(u => ({ label: u.name, value: u.id }))]
})

const typeFilterOptions = [
  { label: 'All Types', value: '' },
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
  { label: 'All Status', value: '' },
  { label: 'Paid', value: 'true' },
  { label: 'Unpaid', value: 'false' }
]

const billableFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Billable', value: 'true' },
  { label: 'Non-Billable', value: 'false' }
]

const expenseColumns = [
  { key: 'select', label: '' },
  { key: 'partner', label: 'Partner / Unit' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'billable', label: 'Billable' },
  { key: 'paid', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'actions', label: '' }
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
    
    if (filterPartner.value) {
      filters.partner_id = filterPartner.value
    }
    
    if (filterUnit.value) {
      filters.unit_id = filterUnit.value
    }
    
    if (filterType.value) {
      filters.type = filterType.value
    }
    
    if (filterPaid.value) {
      filters.paid = filterPaid.value === 'true'
    }
    
    if (filterBillable.value) {
      filters.billable = filterBillable.value === 'true'
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
    
    // Use standard response handler
    expenses.value = extractData(result)
    pagination.value = extractPagination(result)
    totalItems.value = pagination.value?.total_items || expenses.value.length
    
  } catch (error) {
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

const getPartnerName = (expense: any) => {
  // First check if expense has partner object directly
  if (expense?.partner?.name) {
    return expense.partner.name
  }
  
  // Then check by partner_id in partners array
  if (expense?.partner_id && Array.isArray(partners.value)) {
    const partner = partners.value.find(p => p && p.id === expense.partner_id)
    if (partner?.name) {
      return partner.name
    }
  }
  
  return 'Unknown Partner'
}

const getUnitName = (expense: any) => {
  // First check if expense has unit object directly
  if (expense?.unit?.name) {
    return expense.unit.name
  }
  
  // Then check by unit_id in units array
  if (expense?.unit_id && Array.isArray(units.value)) {
    const unit = units.value.find(u => u && u.id === expense.unit_id)
    if (unit?.name) {
      return unit.name
    }
  }
  
  return 'No Unit'
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

const getExpenseTypeColor = (type: string) => {
  const colors = {
    'Cleaning': 'blue',
    'Laundry': 'purple',
    'Supplies': 'green',
    'Wifi': 'indigo',
    'Electricity': 'yellow',
    'Repair': 'red',
    'Repairs': 'red',
    'Miscellaneous': 'gray',
    'Misc': 'gray'
  }
  return colors[type as keyof typeof colors] || 'gray'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: '2-digit' 
  })
}

const getExpenseActions = (expense: any) => {
  const actions = []
  
  if (expense.receipt_url) {
    actions.push([{
      label: 'View Receipt',
      icon: 'i-heroicons-photo',
      click: () => viewReceipt(expense)
    }])
  }
  
  if (!isPartner.value) {
    actions.push([{
      label: expense.paid ? 'Mark Unpaid' : 'Mark Paid',
      icon: expense.paid ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle',
      click: () => togglePayment(expense)
    }])
    
    actions.push([{
      label: 'Edit',
      icon: 'i-heroicons-pencil-square',
      click: () => handleEdit(expense)
    }])
    
    actions.push([{
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => handleDelete(expense.id)
    }])
  }
  
  return actions
}

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

const viewReceipt = (expense: any) => {
  if (expense.receipt_full_url) {
    window.open(expense.receipt_full_url, '_blank')
  }
}

const handleUpdated = () => {
  selectedExpense.value = null
  loadExpensesData()
}

// Bulk Actions
const toggleExpenseSelection = (expenseId: string) => {
  const index = selectedExpenses.value.indexOf(expenseId)
  if (index > -1) {
    selectedExpenses.value.splice(index, 1)
  } else {
    selectedExpenses.value.push(expenseId)
  }
}

const clearSelection = () => {
  selectedExpenses.value = []
  showBulkActions.value = false
}

const bulkMarkPaid = async () => {
  const { notifySuccess, notifyError } = useNotify()
  const { updateExpense } = useApi()
  
  try {
    for (const expenseId of selectedExpenses.value) {
      const expense = expenses.value.find(e => e.id === expenseId)
      if (expense && !expense.paid) {
        await updateExpense(expenseId, {
          paid: true,
          paid_date: new Date().toISOString().split('T')[0],
          billable: expense.billable,
          amount: expense.amount,
          type: expense.type,
          notes: expense.notes
        })
      }
    }
    
    await loadExpensesData()
    clearSelection()
    notifySuccess(`Marked ${selectedExpenses.value.length} expenses as paid`)
  } catch (error) {
    notifyError('Failed to update expenses')
  }
}

const bulkMarkUnpaid = async () => {
  const { notifySuccess, notifyError } = useNotify()
  const { updateExpense } = useApi()
  
  try {
    for (const expenseId of selectedExpenses.value) {
      const expense = expenses.value.find(e => e.id === expenseId)
      if (expense && expense.paid) {
        await updateExpense(expenseId, {
          paid: false,
          paid_date: null,
          billable: expense.billable,
          amount: expense.amount,
          type: expense.type,
          notes: expense.notes
        })
      }
    }
    
    await loadExpensesData()
    clearSelection()
    notifySuccess(`Marked ${selectedExpenses.value.length} expenses as unpaid`)
  } catch (error) {
    notifyError('Failed to update expenses')
  }
}

const bulkMarkBillable = async () => {
  const { notifySuccess, notifyError } = useNotify()
  const { updateExpense } = useApi()
  
  try {
    for (const expenseId of selectedExpenses.value) {
      const expense = expenses.value.find(e => e.id === expenseId)
      if (expense && !expense.billable) {
        await updateExpense(expenseId, {
          billable: true,
          paid: expense.paid,
          amount: expense.amount,
          type: expense.type,
          notes: expense.notes
        })
      }
    }
    
    await loadExpensesData()
    clearSelection()
    notifySuccess(`Marked ${selectedExpenses.value.length} expenses as billable`)
  } catch (error) {
    notifyError('Failed to update expenses')
  }
}

const bulkMarkNonBillable = async () => {
  const { notifySuccess, notifyError } = useNotify()
  const { updateExpense } = useApi()
  
  try {
    for (const expenseId of selectedExpenses.value) {
      const expense = expenses.value.find(e => e.id === expenseId)
      if (expense && expense.billable) {
        await updateExpense(expenseId, {
          billable: false,
          paid: expense.paid,
          amount: expense.amount,
          type: expense.type,
          notes: expense.notes
        })
      }
    }
    
    await loadExpensesData()
    clearSelection()
    notifySuccess(`Marked ${selectedExpenses.value.length} expenses as non-billable`)
  } catch (error) {
    notifyError('Failed to update expenses')
  }
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

const clearFilters = () => {
  filterYear.value = ''
  filterMonth.value = ''
  filterPartner.value = ''
  filterUnit.value = ''
  filterType.value = ''
  filterPaid.value = ''
  filterBillable.value = ''
  startDate.value = ''
  endDate.value = ''
  searchQuery.value = ''
  currentPage.value = 1
  loadExpensesData()
}

const applyFilters = () => {
  currentPage.value = 1
  loadExpensesData()
}

const debouncedSearch = () => {
  currentPage.value = 1
  loadExpensesData()
}

let searchTimeout: NodeJS.Timeout
const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(debouncedSearch, 300)
}

watch(() => filterPartner.value, () => {
  filterUnit.value = '' // Reset unit when partner changes
})

// Removed auto-apply watchers - now requires Apply button

// loadPartners and loadUnits are now provided by useGlobalCache()

onMounted(async () => {
  try {
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadExpensesData()
    ])
  } catch (error) {
  }
})
</script>
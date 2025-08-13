<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage booking payments and records</p>
      </div>
      <UButton to="/bookings/create" color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Add Booking
      </UButton>
    </div>

    <!-- Statistics Cards -->
    <AccountingBookingStatsCard :summary="bookingSummary" :loading="isLoading" />

    <!-- Table Section -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">All Bookings ({{ totalBookings }})</h3>
        </div>
      </template>
      
      <!-- Search and Filters -->
      <div class="mb-4 space-y-4">
        <div class="flex gap-4">
          <UInput 
            v-model="searchQuery" 
            placeholder="Search by guest name..."
            icon="i-heroicons-magnifying-glass"
            class="flex-1"
            @input="handleSearchInput"
          />
          <USelect 
            v-model="sortBy" 
            :options="sortOptions"
            @change="loadBookings"
          />
          <UButton 
            variant="outline" 
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            <UIcon name="i-heroicons-funnel" class="mr-2" />
            Filters
          </UButton>
        </div>
        
        <!-- Advanced Filters -->
        <div v-if="showAdvancedFilters" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UFormGroup label="Year">
              <USelect 
                v-model="filters.year" 
                :options="yearOptions"
                placeholder="All years"
              />
            </UFormGroup>
            
            <UFormGroup label="Month">
              <USelect 
                v-model="filters.month" 
                :options="monthOptions"
                placeholder="All months"
              />
            </UFormGroup>
            
            <UFormGroup label="Partner">
              <USelect 
                v-model="filters.partnerId" 
                :options="partnerOptions"
                placeholder="Select partner"
              />
            </UFormGroup>
            
            <UFormGroup label="Unit">
              <USelect 
                v-model="filters.unitId" 
                :options="unitOptions"
                placeholder="Select unit"
                :disabled="!filters.partnerId"
              />
            </UFormGroup>
            
            <UFormGroup label="Payment Status">
              <USelect 
                v-model="filters.paymentStatus" 
                :options="paymentStatusOptions"
                placeholder="Select status"
              />
            </UFormGroup>
            
            <UFormGroup label="Payment Received By">
              <USelect 
                v-model="filters.paymentReceivedBy" 
                :options="paymentReceivedByOptions"
                placeholder="Select recipient"
              />
            </UFormGroup>
            
            <UFormGroup label="Start Date">
              <UInput 
                v-model="filters.startDate" 
                type="date"
                placeholder="From date"
              />
            </UFormGroup>
            
            <UFormGroup label="End Date">
              <UInput 
                v-model="filters.endDate" 
                type="date"
                placeholder="To date"
              />
            </UFormGroup>
            
            <UFormGroup label="Booking Source">
              <USelect 
                v-model="filters.bookingSource" 
                :options="bookingSourceOptions"
                placeholder="Select source"
              />
            </UFormGroup>
            
            <UFormGroup label="Invoice Status">
              <USelect 
                v-model="filters.invoiced" 
                :options="invoicedOptions"
                placeholder="Select status"
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
        <div class="text-gray-500">Loading bookings...</div>
      </div>
      
      <AccountingGroupedBookingTable 
        v-else
        :bookings="bookings" 
        :partners="partners"
        :units="units"
        @edit="handleEdit" 
        @delete="handleDelete" 
      />
      
      <!-- Pagination -->
      <div v-if="pagination.total_pages > 1" class="mt-4 flex justify-center">
        <UPagination 
          v-model="currentPage" 
          :page-count="pagination.total_pages"
          :total="pagination.total_items"
          @update:model-value="loadBookings"
        />
      </div>
    </UCard>

    <!-- Edit Modal -->
    <AccountingEditBookingModal 
      v-model="showEditModal" 
      :booking="selectedBooking" 
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
const { handleSubmit } = useBookingForm()
const { deleteBooking } = useAccountingStore()
const { partners, units, loadPartners, loadUnits } = useDataManager()
const { getBookings, getBookingSources } = useApi()

const bookingSources = ref([])

const showEditModal = ref(false)
const selectedBooking = ref(null)
const bookings = ref([])
const bookingSummary = ref(null)
const currentPage = ref(1)
const searchQuery = ref('')
const sortBy = ref('created_at_desc')
const isLoading = ref(true)
const showAdvancedFilters = ref(false)
const filters = reactive({
  year: '',
  month: '',
  partnerId: '',
  unitId: '',
  startDate: '',
  endDate: '',
  paymentStatus: '',
  paymentReceivedBy: '',
  bookingSource: '',
  invoiced: ''
})
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  per_page: 15,
  has_next: false,
  has_prev: false
})

const sortOptions = [
  { label: 'Newest First', value: 'created_at_desc' },
  { label: 'Oldest First', value: 'created_at_asc' },
  { label: 'Guest Name A-Z', value: 'guest_name_asc' },
  { label: 'Guest Name Z-A', value: 'guest_name_desc' },
  { label: 'Amount High-Low', value: 'base_amount_desc' },
  { label: 'Amount Low-High', value: 'base_amount_asc' },
  { label: 'Booking Date Newest', value: 'booking_date_desc' },
  { label: 'Booking Date Oldest', value: 'booking_date_asc' }
]

const totalBookings = computed(() => pagination.value.total_items)

const statsFilters = computed(() => {
  let startDate = filters.startDate
  let endDate = filters.endDate
  
  if (filters.year || filters.month) {
    const year = filters.year || new Date().getFullYear()
    const month = filters.month || ''
    
    if (month) {
      const monthNum = parseInt(month)
      startDate = `${year}-${monthNum.toString().padStart(2, '0')}-01`
      const lastDay = new Date(year, monthNum, 0).getDate()
      endDate = `${year}-${monthNum.toString().padStart(2, '0')}-${lastDay}`
    } else {
      startDate = `${year}-01-01`
      endDate = `${year}-12-31`
    }
  }
  
  return {
    ...(filters.partnerId && { partner_id: filters.partnerId }),
    ...(filters.unitId && { unit_id: filters.unitId }),
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate })
  }
})

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return [{ label: 'All Partners', value: '' }, ...partners.value.map(p => ({ label: p.name, value: p.id }))]
})

const unitOptions = computed(() => {
  if (!Array.isArray(units.value)) return []
  const filteredUnits = filters.partnerId 
    ? units.value.filter(u => u.partner_id === filters.partnerId)
    : units.value
  return [{ label: 'All Units', value: '' }, ...filteredUnits.map(u => ({ label: u.name, value: u.id }))]
})

const paymentStatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Partial', value: 'partial' },
  { label: 'Fully Paid', value: 'fully_paid' }
]

const paymentReceivedByOptions = [
  { label: 'All Recipients', value: '' },
  { label: 'Partner', value: 'partner' },
  { label: 'MetroBNB', value: 'metrobnb' }
]

const invoicedOptions = [
  { label: 'All Status', value: '' },
  { label: 'Invoiced', value: 'true' },
  { label: 'Not Invoiced', value: 'false' }
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

const bookingSourceOptions = computed(() => {
  if (!Array.isArray(bookingSources.value)) return []
  return [{ label: 'All Sources', value: '' }, ...bookingSources.value.map(s => ({ label: s.name, value: s.id }))]
})

const handleEdit = (booking: any) => {
  selectedBooking.value = booking
  showEditModal.value = true
}

const handleDelete = async (id: string) => {
  const { notifySuccess, notifyError } = useNotify()
  
  try {
    await deleteBooking(id)
    await loadBookings()
    notifySuccess('Booking deleted successfully')
  } catch (error) {
    notifyError('Failed to delete booking')
  }
}

const handleUpdated = () => {
  selectedBooking.value = null
  loadBookings()
}

const loadBookings = async () => {
  const { notifyError, notifyInfo } = useNotify()
  
  try {
    // Parse sort field and order correctly
    const parts = sortBy.value.split('_')
    const sortOrder = parts[parts.length - 1] // Get last part (asc/desc)
    const sortFieldParts = parts.slice(0, -1) // Get all parts except last
    const sortField = sortFieldParts.join('_') // Rejoin field name
    
    // Convert year/month to start_date and end_date
    let startDate = filters.startDate
    let endDate = filters.endDate
    
    if (filters.year || filters.month) {
      const year = filters.year || new Date().getFullYear()
      const month = filters.month || ''
      
      if (month) {
        const monthNum = parseInt(month)
        startDate = `${year}-${monthNum.toString().padStart(2, '0')}-01`
        const lastDay = new Date(year, monthNum, 0).getDate()
        endDate = `${year}-${monthNum.toString().padStart(2, '0')}-${lastDay}`
      } else {
        startDate = `${year}-01-01`
        endDate = `${year}-12-31`
      }
    }
    
    const result = await getBookings({
      page: currentPage.value,
      limit: 15,
      search: searchQuery.value || undefined,
      sort_by: sortField,
      sort_order: sortOrder as 'asc' | 'desc',
      ...(filters.partnerId && { partner_id: filters.partnerId }),
      ...(filters.unitId && { unit_id: filters.unitId }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(filters.paymentStatus && { payment_status: filters.paymentStatus }),
      ...(filters.paymentReceivedBy && { payment_received_by: filters.paymentReceivedBy }),
      ...(filters.bookingSource && { booking_source_id: filters.bookingSource }),
      ...(filters.invoiced && { invoiced: filters.invoiced === 'true' })
    })
    
    if (result && typeof result === 'object' && 'data' in result) {
      bookings.value = result.data
      pagination.value = result.pagination
      bookingSummary.value = result.summary || null
      if (result.data.length === 0 && currentPage.value === 1) {
        notifyInfo('No bookings found')
      }
    } else {
      bookings.value = Array.isArray(result) ? result : []
      bookingSummary.value = null
      if (bookings.value.length === 0) {
        notifyInfo('No bookings found')
      }
    }
  } catch (error) {
    console.error('Failed to load bookings:', error)
    bookings.value = []
    notifyError('Failed to load bookings')
  }
}

const debouncedSearch = () => {
  currentPage.value = 1
  loadBookings()
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  searchQuery.value = ''
  currentPage.value = 1
  loadBookings()
}

const applyFilters = () => {
  currentPage.value = 1
  loadBookings()
}

watch(() => filters.partnerId, () => {
  filters.unitId = '' // Reset unit when partner changes
})

let searchTimeout: NodeJS.Timeout
const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(debouncedSearch, 300)
}

onMounted(async () => {
  try {
    isLoading.value = true
    const [, , sources] = await Promise.all([
      loadPartners(),
      loadUnits(),
      getBookingSources()
    ])
    
    bookingSources.value = sources || []
    
    console.log('Loaded partners:', partners.value?.length || 0)
    console.log('Loaded units:', units.value?.length || 0)
    console.log('Loaded booking sources:', bookingSources.value?.length || 0)
    
    await loadBookings()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load data:', error)
    isLoading.value = false
  }
})
</script>
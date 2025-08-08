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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      
      <AccountingBookingTable 
        v-else
        :bookings="bookings" 
        :partners="partners"
        :units="units"
        @edit="handleEdit" 
        @delete="handleDelete" 
      />
      
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-4 flex justify-center">
        <UPagination 
          v-model="currentPage" 
          :page-count="pagination.totalPages"
          :total="pagination.totalItems"
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
const { getBookings } = useApi()

const showEditModal = ref(false)
const selectedBooking = ref(null)
const bookings = ref([])
const currentPage = ref(1)
const searchQuery = ref('')
const sortBy = ref('created_at_desc')
const isLoading = ref(true)
const showAdvancedFilters = ref(false)
const filters = reactive({
  partnerId: '',
  unitId: '',
  startDate: '',
  endDate: '',
  paymentStatus: '',
  paymentReceivedBy: ''
})
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  perPage: 15,
  hasNext: false,
  hasPrev: false
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

const totalBookings = computed(() => pagination.value.totalItems)

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return [{ label: 'All Partners', value: '' }, ...partners.value.map(p => ({ label: p.name, value: p.id }))]
})

const unitOptions = computed(() => {
  if (!Array.isArray(units.value)) return []
  const filteredUnits = filters.partnerId 
    ? units.value.filter(u => u.partnerId === filters.partnerId)
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

const handleEdit = (booking: any) => {
  selectedBooking.value = booking
  showEditModal.value = true
}

const handleDelete = (id: string) => {
  deleteBooking(id)
  
  const toast = useToast()
  toast.add({
    title: 'Booking deleted',
    description: 'Payment record has been removed',
    color: 'orange'
  })
}

const handleUpdated = () => {
  selectedBooking.value = null
}

const loadBookings = async () => {
  try {
    // Parse sort field and order correctly
    const parts = sortBy.value.split('_')
    const sortOrder = parts[parts.length - 1] // Get last part (asc/desc)
    const sortFieldParts = parts.slice(0, -1) // Get all parts except last
    const sortField = sortFieldParts.join('_') // Rejoin field name
    
    const result = await getBookings({
      page: currentPage.value,
      limit: 15,
      search: searchQuery.value || undefined,
      sortBy: sortField,
      sortOrder: sortOrder as 'asc' | 'desc',
      ...(filters.partnerId && { partner_id: filters.partnerId }),
      ...(filters.unitId && { unit_id: filters.unitId }),
      ...(filters.startDate && { start_date: filters.startDate }),
      ...(filters.endDate && { end_date: filters.endDate }),
      ...(filters.paymentStatus && { payment_status: filters.paymentStatus }),
      ...(filters.paymentReceivedBy && { payment_received_by: filters.paymentReceivedBy })
    })
    
    console.log('Raw API result:', result)
    
    if (result && typeof result === 'object' && 'data' in result) {
      bookings.value = result.data
      pagination.value = result.pagination
      console.log('Transformed bookings:', result.data[0])
    } else {
      bookings.value = Array.isArray(result) ? result : []
      console.log('Non-paginated bookings:', result[0])
    }
  } catch (error) {
    console.error('Failed to load bookings:', error)
    bookings.value = []
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
    await Promise.all([
      loadPartners(),
      loadUnits()
    ])
    
    console.log('Loaded partners:', partners.value?.length || 0)
    console.log('Loaded units:', units.value?.length || 0)
    console.log('First partner:', partners.value?.[0])
    
    await loadBookings()
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load data:', error)
    isLoading.value = false
  }
})
</script>
<template>
  <div class="space-y-6">
    <!-- Form Section -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Add Booking Payment</h3>
      </template>
      <AccountingBookingForm @submit="handleSubmit" />
    </UCard>

    <!-- Table Section -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Recent Bookings</h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ totalBookings }} bookings
          </div>
        </div>
      </template>
      
      <!-- Search and Filters -->
      <div class="mb-4 flex gap-4">
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
      sortOrder: sortOrder as 'asc' | 'desc'
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
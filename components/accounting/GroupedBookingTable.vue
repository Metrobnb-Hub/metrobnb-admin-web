<template>
  <div class="space-y-6">
    <!-- Toggle between grouped and flat view -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4">
        <UButton 
          :variant="viewMode === 'grouped' ? 'solid' : 'outline'"
          @click="viewMode = 'grouped'"
        >
          <UIcon name="i-heroicons-squares-2x2" class="mr-2" />
          Grouped by Invoice Period
        </UButton>
        <UButton 
          :variant="viewMode === 'flat' ? 'solid' : 'outline'"
          @click="viewMode = 'flat'"
        >
          <UIcon name="i-heroicons-list-bullet" class="mr-2" />
          Flat List
        </UButton>
      </div>
      <div class="text-sm text-gray-500">
        Total: {{ bookings.length }} bookings
      </div>
    </div>

    <!-- Flat view (existing table) -->
    <div v-if="viewMode === 'flat'">
      <AccountingBookingTable 
        :bookings="bookings" 
        :partners="partners"
        :units="units"
        @edit="$emit('edit', $event)" 
        @delete="$emit('delete', $event)" 
      />
    </div>

    <!-- Grouped view -->
    <div v-else class="space-y-6">
      <div v-for="group in groupedBookings" :key="group.period" class="space-y-3">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ group.periodLabel }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ group.bookings.length }} bookings • Total: ₱{{ group.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </p>
          </div>
          <UButton 
            variant="outline" 
            size="sm"
            @click="toggleGroup(group.period)"
          >
            <UIcon 
              :name="group.collapsed ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'" 
              class="mr-2" 
            />
            {{ group.collapsed ? 'Expand' : 'Collapse' }}
          </UButton>
        </div>
        
        <div v-if="!group.collapsed">
          <AccountingBookingTable 
            :bookings="group.bookings" 
            :partners="partners"
            :units="units"
            @edit="$emit('edit', $event)" 
            @delete="$emit('delete', $event)" 
          />
        </div>
      </div>
      
      <div v-if="groupedBookings.length === 0" class="text-center py-8 text-gray-500">
        No bookings found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Booking {
  id: string
  guest_name: string
  start_date: string
  end_date: string
  base_amount: string
  addons?: Array<{type: string, amount: number}>
  [key: string]: any
}

const props = defineProps<{
  bookings: Booking[]
  partners?: any[]
  units?: any[]
}>()

const emit = defineEmits<{
  edit: [booking: Booking]
  delete: [id: string]
}>()

const viewMode = ref<'grouped' | 'flat'>('grouped')

const getBookingTotal = (booking: Booking) => {
  const baseAmount = parseFloat(booking.base_amount) || 0
  const addonsTotal = (booking.addons || []).reduce((sum, addon) => sum + (addon.amount || 0), 0)
  return baseAmount + addonsTotal
}

const collapsedGroups = ref(new Set<string>())

const groupedBookings = computed(() => {
  if (!props.bookings?.length) return []
  
  // Group bookings by month of start_date
  const groups = new Map<string, {
    period: string
    periodLabel: string
    bookings: Booking[]
    totalAmount: number
    collapsed: boolean
  }>()
  
  props.bookings.forEach(booking => {
    if (!booking.start_date) return
    
    const startDate = new Date(booking.start_date)
    const period = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`
    const periodLabel = startDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
    
    if (!groups.has(period)) {
      groups.set(period, {
        period,
        periodLabel,
        bookings: [],
        totalAmount: 0,
        collapsed: collapsedGroups.value.has(period)
      })
    }
    
    const group = groups.get(period)!
    group.bookings.push(booking)
    group.totalAmount += getBookingTotal(booking)
  })
  
  // Sort groups by period (newest first)
  return Array.from(groups.values()).sort((a, b) => b.period.localeCompare(a.period))
})

const toggleGroup = (period: string) => {
  if (collapsedGroups.value.has(period)) {
    collapsedGroups.value.delete(period)
  } else {
    collapsedGroups.value.add(period)
  }
}
</script>
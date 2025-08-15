<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Journal Entries</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage partner credits, debits, and corrections</p>
      </div>
      <UButton to="/journal-entries/create" color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        New Entry
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-plus-circle" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalCredits.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <UIcon name="i-heroicons-minus-circle" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Debits</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">₱{{ totalDebits.toLocaleString() }}</p>
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-scale" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</p>
            <p class="text-2xl font-bold" :class="netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              ₱{{ Math.abs(netBalance).toLocaleString() }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Journal Entries Table -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Recent Journal Entries</h3>
          <div class="flex space-x-2">
            <USelect v-model="selectedPartner" :options="partnerOptions" placeholder="All Partners" />
            <USelect v-model="selectedType" :options="typeOptions" placeholder="All Types" />
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="text-center py-8">
        <LoadingState message="Loading journal entries..." />
      </div>
      
      <div v-else-if="filteredEntries.length === 0" class="text-center py-8">
        <EmptyState
          title="No journal entries found"
          message="Create your first journal entry to track partner credits and debits."
          action-text="Create Entry"
          action-to="/journal-entries/create"
        />
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Partner</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="entry in filteredEntries" :key="entry.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ formatDate(entry.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ getPartnerName(entry.partner_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="entry.type === 'credit' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
                >
                  {{ entry.type === 'credit' ? 'Credit' : 'Debit' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                <div>{{ entry.description }}</div>
                <div v-if="entry.reference" class="text-xs text-gray-500 dark:text-gray-400">
                  Ref: {{ entry.reference }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium"
                  :class="entry.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ entry.type === 'credit' ? '+' : '-' }}₱{{ getAmountValue(entry.amount).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getActions(entry)">
                  <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="sm" />
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
    
    <!-- Edit Modal -->
    <JournalEntriesEditModal 
      v-model="showEditModal" 
      :entry="editingEntry" 
      @updated="loadData" 
    />
  </div>
</template>

<script setup lang="ts">
import type { JournalEntry } from '~/composables/api'

const { partners, loadPartners } = useDataManager()
const { getJournalEntries, deleteJournalEntry } = useApi()
const { notifySuccess, notifyError } = useNotify()

const loading = ref(true)
const entries = ref<JournalEntry[]>([])
const selectedPartner = ref('')
const selectedType = ref('')
const showEditModal = ref(false)
const editingEntry = ref<JournalEntry | null>(null)

const partnerOptions = computed(() => [
  { label: 'All Partners', value: '' },
  ...partners.value.map(p => ({ label: p.name, value: p.id }))
])

const typeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Credits', value: 'credit' },
  { label: 'Debits', value: 'debit' }
]

const filteredEntries = computed(() => {
  let filtered = entries.value
  
  if (selectedPartner.value) {
    filtered = filtered.filter(e => e.partner_id === selectedPartner.value)
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(e => e.type === selectedType.value)
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const totalCredits = computed(() => 
  entries.value.filter(e => e.type === 'credit').reduce((sum, e) => sum + getAmountValue(e.amount), 0)
)

const totalDebits = computed(() => 
  entries.value.filter(e => e.type === 'debit').reduce((sum, e) => sum + getAmountValue(e.amount), 0)
)

const netBalance = computed(() => totalCredits.value - totalDebits.value)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getPartnerName = (partnerId: string) => {
  if (!partnerId) return 'No Partner'
  const partner = partners.value.find(p => p.id === partnerId)
  return partner?.name || `Unknown Partner (${partnerId.slice(0, 8)}...)`
}

const getAmountValue = (amount: string | number) => {
  return typeof amount === 'string' ? parseFloat(amount) : amount
}

const editEntry = (entry: JournalEntry) => {
  editingEntry.value = entry
  showEditModal.value = true
}

const getActions = (entry: JournalEntry) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    click: () => editEntry(entry)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => deleteEntry(entry)
  }]
]

const deleteEntry = async (entry: JournalEntry) => {
  if (confirm(`Are you sure you want to delete this ${entry.type} entry?`)) {
    try {
      await deleteJournalEntry(entry.id)
      await loadData()
      notifySuccess('Journal entry deleted successfully')
    } catch (error) {
      notifyError('Failed to delete journal entry')
    }
  }
}

const loadData = async () => {
  try {
    loading.value = true
    
    // Load partners first, then entries
    await loadPartners()
    console.log('Loaded partners:', partners.value.map(p => ({ id: p.id, name: p.name })))
    
    const entriesResponse = await getJournalEntries()
    
    // Handle response structure
    if (entriesResponse && entriesResponse.data) {
      entries.value = Array.isArray(entriesResponse.data) ? entriesResponse.data : []
    } else {
      entries.value = []
    }
    
    console.log('Loaded entries:', entries.value.length)
    console.log('First entry full data:', entries.value[0])
    console.log('First entry partner_id:', entries.value[0]?.partner_id)
    console.log('Partner lookup result:', getPartnerName(entries.value[0]?.partner_id))
  } catch (error) {
    console.error('Failed to load journal entries:', error)
    notifyError('Failed to load journal entries')
    entries.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
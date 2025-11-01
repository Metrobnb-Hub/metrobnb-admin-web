<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Journal Entries</h3>
        <div class="text-sm text-gray-500">
          MetroBNB Perspective
        </div>
      </div>
    </template>

    <!-- Perspective Legend -->
    <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="text-sm font-medium mb-2">Display Legend (MetroBNB Perspective):</div>
      <div class="flex space-x-6 text-xs">
        <div class="flex items-center space-x-1">
          <div class="w-3 h-3 bg-green-500 rounded"></div>
          <span>DEBIT = +Money TO MetroBNB (Partner pays us)</span>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-3 h-3 bg-red-500 rounded"></div>
          <span>CREDIT = -Money FROM MetroBNB (We pay partner)</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      <div class="mt-2 text-gray-500">Loading entries...</div>
    </div>

    <div v-else-if="entries.length === 0" class="text-center py-8 text-gray-500">
      No journal entries found
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="entry in entries" 
        :key="entry.id"
        class="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <!-- Amount with MetroBNB perspective -->
              <div class="flex items-center space-x-2">
                <div :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  entry.type === 'debit' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]">
                  {{ entry.type === 'debit' ? '+' : '-' }}₱{{ parseFloat(entry.amount).toLocaleString() }}
                </div>
                
                <div class="text-xs text-gray-500">
                  {{ entry.type === 'debit' ? 'TO MetroBNB' : 'FROM MetroBNB' }}
                </div>
              </div>

              <!-- Status -->
              <UBadge 
                :color="entry.status === 'settled' ? 'green' : 'yellow'"
                size="sm"
              >
                {{ entry.status }}
              </UBadge>
            </div>

            <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {{ entry.description }}
            </div>

            <div class="text-xs text-gray-500 space-x-4">
              <span>{{ formatDate(entry.date) }}</span>
              <span v-if="entry.reference">Ref: {{ entry.reference }}</span>
              <span v-if="entry.settled_date">Settled: {{ formatDate(entry.settled_date) }}</span>
            </div>

            <div v-if="entry.notes" class="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {{ entry.notes }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <UButton 
              v-if="entry.status === 'pending'"
              @click="settleEntry(entry)"
              size="xs"
              color="green"
              variant="outline"
            >
              Settle
            </UButton>
            
            <UButton 
              @click="editEntry(entry)"
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil"
            />
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { JournalEntry } from '~/composables/api'

const props = defineProps<{
  partnerId?: string
}>()

const emit = defineEmits<{
  edit: [entry: JournalEntryResponse]
  settle: [entry: JournalEntryResponse]
}>()

// API
const { getJournalEntries } = useApi()

// State
const entries = ref<JournalEntryResponse[]>([])
const loading = ref(false)

// Load entries
const loadEntries = async () => {
  loading.value = true
  
  try {
    const filters = props.partnerId ? { partner_id: props.partnerId } : {}
    entries.value = await getJournalEntries(filters)
  } catch (error) {
    console.error('Failed to load journal entries:', error)
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Actions
const settleEntry = (entry: JournalEntryResponse) => {
  emit('settle', entry)
}

const editEntry = (entry: JournalEntryResponse) => {
  emit('edit', entry)
}

// Refresh entries
const refresh = () => {
  loadEntries()
}

// Load on mount and when partner changes
onMounted(loadEntries)
watch(() => props.partnerId, loadEntries)

// Expose refresh method
defineExpose({ refresh })
</script>

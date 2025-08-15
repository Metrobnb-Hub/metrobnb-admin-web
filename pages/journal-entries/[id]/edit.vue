<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Journal Entry</h1>
      <p class="text-gray-600 dark:text-gray-400">Update journal entry details</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <LoadingState message="Loading journal entry..." />
    </div>

    <div v-else-if="!entry" class="text-center py-8">
      <ErrorState 
        title="Entry not found"
        message="The journal entry you're looking for doesn't exist."
        :show-retry="false"
        @retry="loadEntry"
      />
    </div>

    <!-- Form -->
    <UCard v-else>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect v-model="state.partnerId" :options="partnerOptions" placeholder="Select partner" />
          </UFormGroup>
          
          <UFormGroup label="Entry Type" name="type" required>
            <USelect v-model="state.type" :options="typeOptions" />
          </UFormGroup>
          
          <UFormGroup label="Date" name="date" required>
            <UInput v-model="state.date" type="date" />
          </UFormGroup>
          
          <UFormGroup label="Amount" name="amount" required>
            <UInput v-model="state.amount" type="number" step="0.01" min="0" placeholder="0.00" />
          </UFormGroup>
          
          <UFormGroup label="Description" name="description" required>
            <UInput v-model="state.description" placeholder="Brief description of the entry" />
          </UFormGroup>
          
          <UFormGroup label="Reference" name="reference">
            <UInput v-model="state.reference" placeholder="Reference number or ID (optional)" />
          </UFormGroup>
          
          <UFormGroup label="Notes" name="notes">
            <UTextarea v-model="state.notes" placeholder="Additional notes (optional)" :rows="3" />
          </UFormGroup>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" to="/journal-entries">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">Update Entry</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { JournalEntry } from '~/types/journal-entry'

const { partners, loadPartners } = useDataManager()
const { getJournalEntries, updateJournalEntry } = useApi()
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()
const route = useRoute()

const entryId = route.params.id as string
const loading = ref(true)
const saving = ref(false)
const entry = ref<JournalEntry | null>(null)

const schema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  type: z.enum(['credit', 'debit']),
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  reference: z.string().optional(),
  notes: z.string().optional()
})

const state = reactive({
  partnerId: '',
  type: 'credit' as 'credit' | 'debit',
  date: '',
  amount: 0,
  description: '',
  reference: '',
  notes: ''
})

const partnerOptions = computed(() => 
  partners.value.map(p => ({ label: p.name, value: p.id }))
)

const typeOptions = [
  { label: 'Credit (+) - Money owed to partner', value: 'credit' },
  { label: 'Debit (-) - Money owed by partner', value: 'debit' }
]

const loadEntry = async () => {
  try {
    loading.value = true
    
    await loadPartners()
    
    const entriesResponse = await getJournalEntries()
    let entries = []
    
    if (entriesResponse && entriesResponse.data) {
      entries = Array.isArray(entriesResponse.data.items) ? entriesResponse.data.items : []
    } else {
      entries = Array.isArray(entriesResponse) ? entriesResponse : []
    }
    
    const foundEntry = entries.find((e: JournalEntry) => e.id === entryId)
    
    if (!foundEntry) {
      notifyError('Journal entry not found')
      return
    }
    
    entry.value = foundEntry
    
    state.partnerId = foundEntry.partner_id
    state.type = foundEntry.type
    state.date = foundEntry.date
    state.amount = parseFloat(foundEntry.amount)
    state.description = foundEntry.description
    state.reference = foundEntry.reference || ''
    state.notes = foundEntry.notes || ''
    
  } catch (error) {
    notifyError('Failed to load journal entry')
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  try {
    saving.value = true
    
    const updateData = {
      partner_id: state.partnerId,
      type: state.type,
      date: state.date,
      amount: state.amount,
      description: state.description,
      reference: state.reference || undefined,
      notes: state.notes || undefined
    }
    
    await updateJournalEntry(entryId, updateData)
    
    notifySuccess(`${state.type === 'credit' ? 'Credit' : 'Debit'} entry updated successfully`)
    router.push('/journal-entries')
  } catch (error) {
    notifyError('Failed to update journal entry')
  } finally {
    saving.value = false
  }
}

onMounted(loadEntry)
</script>
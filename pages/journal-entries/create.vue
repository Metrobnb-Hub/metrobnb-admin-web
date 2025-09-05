<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Journal Entry</h1>
      <p class="text-gray-600 dark:text-gray-400">Add a credit or debit entry for a partner</p>
    </div>

    <!-- Form -->
    <UCard>
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
        
        <!-- Preview -->
        <div v-if="state.partnerId && state.type && state.amount" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Preview</h4>
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Partner:</span>
              <span class="font-medium">{{ getPartnerName(state.partnerId) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Type:</span>
              <span 
                class="font-medium"
                :class="state.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              >
                {{ state.type === 'credit' ? 'Credit (+)' : 'Debit (-)' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Amount:</span>
              <span 
                class="font-bold text-lg"
                :class="state.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              >
                {{ state.type === 'credit' ? '+' : '-' }}₱{{ Number(state.amount || 0).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" to="/journal-entries">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="loading">Create Entry</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { CreateJournalEntryRequest } from '~/composables/api'

const { partners, loadPartners } = useGlobalCache()
const { createJournalEntry } = useApi()
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()

const loading = ref(false)

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
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  description: '',
  reference: '',
  notes: ''
})

const partnerOptions = computed(() => 
  partners.value.map(p => ({ label: p.name, value: p.id }))
)

const typeOptions = [
  { 
    label: 'Credit (+) - Partner gets money', 
    value: 'credit'
  },
  { 
    label: 'Debit (-) - Partner owes money', 
    value: 'debit'
  }
]

const getPartnerName = (partnerId: string) => {
  const partner = partners.value.find(p => p.id === partnerId)
  return partner?.name || ''
}

const onSubmit = async () => {
  try {
    loading.value = true
    
    const entryData = {
      partner_id: state.partnerId,
      type: state.type,
      date: state.date,
      amount: state.amount,
      description: state.description,
      reference: state.reference || undefined,
      notes: state.notes || undefined
    }
    
    await createJournalEntry(entryData)
    
    notifySuccess(`${state.type === 'credit' ? 'Credit' : 'Debit'} entry created successfully`)
    router.push('/journal-entries')
  } catch (error) {
    notifyError('Failed to create journal entry')
  } finally {
    loading.value = false
  }
}

onMounted(loadPartners)
</script>
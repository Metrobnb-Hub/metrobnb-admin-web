<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Create Journal Entry</h3>
    </template>
    
    <!-- Perspective Helper -->
    <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-start space-x-3">
        <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div class="text-sm">
          <div class="font-medium text-blue-900 dark:text-blue-100 mb-1">Entry Perspective Guide:</div>
          <div class="text-blue-700 dark:text-blue-300 space-y-1">
            <div><strong>CREDIT:</strong> Partner receives money (we pay them)</div>
            <div><strong>DEBIT:</strong> Partner owes money (they pay us)</div>
          </div>
        </div>
      </div>
    </div>

    <UForm :state="form" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="Partner" name="partner_id" required>
        <USelect 
          v-model="form.partner_id" 
          :options="partnerOptions"
          placeholder="Select partner"
        />
      </UFormGroup>

      <UFormGroup label="Date" name="date" required>
        <UInput v-model="form.date" type="date" />
      </UFormGroup>

      <UFormGroup label="Type" name="type" required>
        <USelect v-model="form.type" :options="typeOptions" />
        
        <!-- Dynamic helper based on selection -->
        <div v-if="form.type" class="mt-2 text-sm">
          <div v-if="form.type === 'credit'" class="text-green-700 dark:text-green-300">
            💰 <strong>CREDIT:</strong> Partner will receive this amount (MetroBNB pays partner)
          </div>
          <div v-else class="text-red-700 dark:text-red-300">
            💸 <strong>DEBIT:</strong> Partner owes this amount (Partner pays MetroBNB)
          </div>
        </div>
      </UFormGroup>

      <UFormGroup label="Amount" name="amount" required>
        <UInput 
          v-model.number="form.amount" 
          type="number" 
          step="0.01"
          min="0"
          placeholder="0.00"
        >
          <template #leading>
            <span class="text-gray-500">₱</span>
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup label="Description" name="description" required>
        <UInput 
          v-model="form.description" 
          placeholder="e.g., Commission adjustment, Expense reimbursement"
        />
      </UFormGroup>

      <UFormGroup label="Reference" name="reference">
        <UInput 
          v-model="form.reference" 
          placeholder="Invoice #, Receipt #, etc."
        />
      </UFormGroup>

      <UFormGroup label="Notes" name="notes">
        <UTextarea 
          v-model="form.notes" 
          rows="3"
          placeholder="Additional details..."
        />
      </UFormGroup>

      <div class="flex justify-end space-x-3 pt-4">
        <UButton color="gray" variant="ghost" @click="resetForm">
          Reset
        </UButton>
        <UButton type="submit" :loading="loading">
          Create Entry
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { JournalEntryCreate } from '~/types/generated-api'

const emit = defineEmits<{
  created: [entry: any]
}>()

// API and data
const { createJournalEntry } = useApi()
const { getPartners } = useApi()

// Form state
const form = ref<JournalEntryCreate>({
  partner_id: '',
  date: new Date().toISOString().split('T')[0],
  type: 'debit',
  amount: 0,
  description: '',
  reference: '',
  notes: ''
})

const loading = ref(false)
const partners = ref<any[]>([])

// Options
const typeOptions = [
  { 
    label: 'DEBIT - Partner owes MetroBNB', 
    value: 'debit',
    icon: 'i-heroicons-arrow-down-circle',
    color: 'red'
  },
  { 
    label: 'CREDIT - MetroBNB pays Partner', 
    value: 'credit',
    icon: 'i-heroicons-arrow-up-circle',
    color: 'green'
  }
]

const partnerOptions = computed(() => 
  partners.value.map(p => ({
    label: p.name,
    value: p.id
  }))
)

// Load partners
const loadPartners = async () => {
  partners.value = await getPartners()
}

// Submit form
const onSubmit = async () => {
  loading.value = true
  
  try {
    const response = await createJournalEntry(form.value)
    
    if (response?.success) {
      const toast = useToast()
      toast.add({
        title: 'Journal Entry Created',
        description: `${form.value.type.toUpperCase()} entry for ₱${form.value.amount}`,
        color: 'green'
      })
      
      emit('created', response.data)
      resetForm()
    }
  } catch (error: any) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    partner_id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'debit',
    amount: 0,
    description: '',
    reference: '',
    notes: ''
  }
}

// Load data on mount
onMounted(() => {
  loadPartners()
})
</script>

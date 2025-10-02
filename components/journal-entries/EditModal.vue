<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Edit Journal Entry</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect v-model="state.partnerId" :options="partnerOptions" placeholder="Select partner" />
          </UFormGroup>
          
          <UFormGroup label="Entry Type" name="type" required>
            <USelect v-model="state.type" :options="typeOptions" />
          </UFormGroup>
          
          <UFormGroup label="Date" name="date" required>
            <DateInput v-model="state.date" />
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
          <UButton color="gray" variant="ghost" @click="isOpen = false" :disabled="saving">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="saving">Update Entry</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { JournalEntry } from '~/composables/api'

const { partners } = useDataManager()
const { updateJournalEntry } = useApi()
const { notifySuccess, notifyError } = useNotify()

const isOpen = defineModel<boolean>()
const saving = ref(false)

interface Props {
  entry: JournalEntry | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: []
}>()

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

const populateForm = () => {
  if (props.entry) {
    state.partnerId = props.entry.partner_id
    state.type = props.entry.type
    state.date = props.entry.date
    state.amount = parseFloat(props.entry.amount)
    state.description = props.entry.description
    state.reference = props.entry.reference || ''
    state.notes = props.entry.notes || ''
  }
}

const onSubmit = async () => {
  if (!props.entry) return
  
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
    
    await updateJournalEntry(props.entry.id, updateData)
    
    notifySuccess(`${state.type === 'credit' ? 'Credit' : 'Debit'} entry updated successfully`)
    isOpen.value = false
    emit('updated')
  } catch (error) {
    notifyError('Failed to update journal entry')
  } finally {
    saving.value = false
  }
}

watch(() => props.entry, populateForm, { immediate: true })
watch(isOpen, (newValue) => {
  if (newValue) populateForm()
})
</script>
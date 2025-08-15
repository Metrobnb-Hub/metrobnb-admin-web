<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Import Airbnb Bookings</h3>
      </template>
      
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Partner" name="partnerId" required>
            <USelect 
              v-model="state.partnerId" 
              :options="partnerOptions" 
              placeholder="Select partner"
            />
          </UFormGroup>
          
          <UFormGroup label="Unit" name="unitId" required>
            <USelect 
              v-model="state.unitId" 
              :options="availableUnits" 
              :disabled="!state.partnerId"
              placeholder="Select unit"
            />
          </UFormGroup>
          
          <UFormGroup label="Airbnb CSV File" name="csvFile" required>
            <input 
              type="file" 
              accept=".csv"
              @change="handleFileChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="text-xs text-gray-500 mt-1">
              Upload your Airbnb transaction history CSV file
            </p>
          </UFormGroup>
          
          <div v-if="csvPreview" class="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs">
            <p class="font-medium mb-2">CSV Preview:</p>
            <pre class="whitespace-pre-wrap">{{ csvPreview }}</pre>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="isImporting" :disabled="isButtonDisabled">
            Import Bookings
          </UButton>
          <!-- Debug info -->
          <div class="text-xs text-gray-500 mt-2">
            Partner: {{ state.partnerId ? '✓' : '✗' }} | 
            Unit: {{ state.unitId ? '✓' : '✗' }} | 
            CSV: {{ csvData ? '✓' : '✗' }}
          </div>
        </div>
      </UForm>
      
      <!-- Results -->
      <div v-if="importResults" class="mt-6 p-4 border-t">
        <h4 class="font-medium mb-3">Import Results</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Imported:</span>
            <span class="font-medium text-green-600">{{ importResults.imported_count }} bookings</span>
          </div>
          <div class="flex justify-between">
            <span>Skipped:</span>
            <span class="font-medium text-yellow-600">{{ importResults.skipped_count }} rows</span>
          </div>
          <div v-if="importResults.errors?.length" class="mt-3">
            <p class="font-medium text-red-600 mb-1">Errors:</p>
            <ul class="text-red-600 text-xs space-y-1">
              <li v-for="error in importResults.errors" :key="error">• {{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'imported': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const schema = z.object({
  partnerId: z.string().min(1, 'Partner is required'),
  unitId: z.string().min(1, 'Unit is required'),
  csvFile: z.any().optional()
})

const state = reactive({
  partnerId: '',
  unitId: '',
  csvFile: null
})

const csvData = ref('')
const csvPreview = ref('')
const isImporting = ref(false)
const importResults = ref(null)

const { partners, units, loadPartners, loadUnits } = useDataManager()
const { importAirbnbBookings } = useApi()

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(p => ({ label: p.name, value: p.id }))
})

const availableUnits = computed(() => {
  if (!state.partnerId || !Array.isArray(units.value)) return []
  return units.value
    .filter(unit => unit && unit.partner_id === state.partnerId)
    .map(unit => ({ label: unit.name, value: unit.id }))
})

const isButtonDisabled = computed(() => {
  const disabled = !state.partnerId || !state.unitId || !csvData.value
  console.log('Button disabled:', disabled, {
    partnerId: state.partnerId,
    unitId: state.unitId,
    csvData: csvData.value ? 'has data' : 'no data'
  })
  return disabled
})

const handleFileChange = (event: any) => {
  console.log('File change event:', event)
  const input = event.target || event.currentTarget
  const file = input?.files?.[0]
  
  console.log('Selected file:', file)
  
  if (!file) {
    csvData.value = ''
    csvPreview.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    csvData.value = content
    console.log('CSV loaded, length:', content?.length)
    
    // Show first 3 lines as preview
    const lines = content.split('\n').slice(0, 3)
    csvPreview.value = lines.join('\n')
  }
  reader.onerror = (e) => {
    console.error('File read error:', e)
  }
  reader.readAsText(file)
}

const onSubmit = async () => {
  if (!csvData.value) return

  try {
    isImporting.value = true
    importResults.value = null

    const result = await importAirbnbBookings({
      partner_id: state.partnerId,
      unit_id: state.unitId,
      csv_data: csvData.value
    })

    importResults.value = result
    
    if (result.imported_count > 0) {
      const { notifySuccess } = useNotify()
      notifySuccess(`Successfully imported ${result.imported_count} bookings`)
      emit('imported')
      
      // Auto-close modal after 3 seconds on success
      setTimeout(() => {
        isOpen.value = false
      }, 3000)
    } else {
      const { notifyWarning } = useNotify()
      notifyWarning('No bookings were imported. Please check your CSV format.')
    }

  } catch (error) {
    console.error('Import error:', error)
    const { notifyError } = useNotify()
    notifyError(`Failed to import Airbnb bookings: ${error.message || error}`)
  } finally {
    isImporting.value = false
  }
}

watch(() => state.partnerId, () => {
  state.unitId = ''
})

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    await Promise.all([loadPartners(), loadUnits()])
    // Reset form
    state.partnerId = ''
    state.unitId = ''
    csvData.value = ''
    csvPreview.value = ''
    importResults.value = null
  }
})
</script>
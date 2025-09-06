<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
      Create Draft Invoice
    </h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Partner Selection -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Partner
        </label>
        <USelect
          v-model="form.partner_id"
          :options="partnerOptions"
          placeholder="Select Partner"
          required
        />
      </div>

      <!-- Year and Month Selection -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Year
          </label>
          <USelect
            v-model="form.year"
            :options="yearOptions"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Month
          </label>
          <USelect
            v-model="form.month"
            :options="monthOptions"
            required
          />
        </div>
      </div>
      
      <!-- Custom Date Range Toggle -->
      <div>
        <div class="flex items-center space-x-3">
          <UCheckbox v-model="form.useCustomDates" />
          <label class="text-sm text-gray-700 dark:text-gray-300">
            Use custom date range instead
          </label>
        </div>
      </div>
      
      <!-- Custom Date Range (when enabled) -->
      <div v-if="form.useCustomDates" class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <UInput
            v-model="form.start_date"
            type="date"
            :required="form.useCustomDates"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <UInput
            v-model="form.end_date"
            type="date"
            :required="form.useCustomDates"
          />
        </div>
      </div>

      <!-- Preview Info -->
      <div v-if="form.partner_id && (form.year && form.month || form.useCustomDates && form.start_date && form.end_date)" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Draft Invoice Preview
        </h4>
        <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <p><strong>Partner:</strong> {{ getPartnerName(form.partner_id) }}</p>
          <p><strong>Period:</strong> {{ getDisplayPeriod() }}</p>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">
            This will create a draft invoice that you can review and edit before finalizing.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4 pt-4">
        <UButton
          type="button"
          @click="$emit('close')"
          variant="ghost"
        >
          Cancel
        </UButton>
        
        <UButton
          type="submit"
          :loading="creating"
          color="primary"
        >
          {{ creating ? 'Creating Draft...' : 'Create Draft Invoice' }}
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
  created: [invoice: any]
}>()

const { createDraftInvoice } = useApi()
const { partners, loadPartners } = useGlobalCache()

const creating = ref(false)

// Get current month and year
const now = new Date()
const currentYear = now.getFullYear().toString()
const currentMonth = (now.getMonth() + 1).toString()

const form = ref({
  partner_id: '',
  year: currentYear,
  month: currentMonth,
  useCustomDates: false,
  start_date: '',
  end_date: ''
})

const partnerOptions = computed(() => {
  if (!Array.isArray(partners.value)) return []
  return partners.value.map(partner => ({
    label: partner.name,
    value: partner.id
  }))
})

const getPartnerName = (partnerId: string) => {
  if (!Array.isArray(partners.value)) return 'Unknown'
  const partner = partners.value.find(p => p.id === partnerId)
  return partner?.name || 'Unknown'
}

const yearOptions = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push({ label: i.toString(), value: i.toString() })
  }
  
  return years.reverse()
})

const monthOptions = computed(() => {
  const months = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ]
  
  return months
})

const getDisplayPeriod = () => {
  if (form.value.useCustomDates && form.value.start_date && form.value.end_date) {
    const start = new Date(form.value.start_date).toLocaleDateString()
    const end = new Date(form.value.end_date).toLocaleDateString()
    return `${start} - ${end}`
  } else if (form.value.year && form.value.month) {
    const monthName = monthOptions.value.find(m => m.value === form.value.month)?.label || ''
    return `${monthName} ${form.value.year}`
  }
  return ''
}

const handleSubmit = async () => {
  creating.value = true
  
  try {
    // Determine date range based on toggle
    let startDate, endDate
    if (form.value.useCustomDates) {
      startDate = form.value.start_date
      endDate = form.value.end_date
    } else {
      // Use year/month to create date range
      const year = parseInt(form.value.year)
      const month = parseInt(form.value.month)
      
      // Format dates manually to avoid timezone issues
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
    }
    
    const result = await createDraftInvoice(
      form.value.partner_id,
      startDate,
      endDate
    )
    
    
    // Extract the invoice data from the API response
    const invoiceData = result?.success ? result.data : result
    
    emit('created', invoiceData)
  } catch (error) {
    const { notifyError } = useNotify()
    notifyError('Failed to create draft invoice')
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  loadPartners()
})
</script>
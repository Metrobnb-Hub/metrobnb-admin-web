<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="text-gray-500 dark:text-gray-400">Loading...</div>
    </div>
    
    <div v-else-if="partner" class="space-y-6">
      <!-- Partner Header -->
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ partner.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">Partner Profile</p>
        </div>
        <div class="flex space-x-3">
          <UButton color="gray" variant="ghost" to="/partners">Back to Partners</UButton>
          <UButton @click="showInvoiceModal = true" color="gray" variant="outline">
            <UIcon name="i-heroicons-document-text" class="mr-2" />
            Generate Invoice
          </UButton>
          <UButton :to="`/partners/${partnerId}/add-unit`" color="primary">Add Unit</UButton>
        </div>
      </div>

      <!-- Partner Details -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Partner Information</h3>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
            <p class="text-gray-900 dark:text-white">{{ partner.name }}</p>
          </div>
          
          <div v-if="partner.email">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
            <p class="text-gray-900 dark:text-white">{{ partner.email }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Share Percentage</label>
            <p class="text-gray-900 dark:text-white">{{ partner.share_percentage }}%</p>
          </div>
          
          <div v-if="partner.services && partner.services.length">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Services</label>
            <div class="flex flex-wrap gap-2 mt-1">
              <span 
                v-for="service in partner.services" 
                :key="service.id || service"
                class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
              >
                {{ typeof service === 'string' ? service : service.name }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Invoices Section -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Recent Invoices</h3>
            <UButton to="/invoices" size="sm" color="gray" variant="outline">View All</UButton>
          </div>
        </template>
        
        <div v-if="partnerInvoices.length" class="space-y-4">
          <div 
            v-for="invoice in partnerInvoices.slice(0, 3)" 
            :key="invoice.id"
            class="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ invoice.invoice_number }}</h4>
                  <UBadge :color="getPartnerStatusColor(invoice.status)" size="xs">
                    {{ getPartnerStatusText(invoice.status) }}
                  </UBadge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ invoice.period }} • ₱{{ parseFloat(invoice.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {{ getPartnerStatusDescription(invoice.status) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <UButton 
                  v-if="invoice.status === 'sent'"
                  @click="viewInvoice(invoice)"
                  size="sm" 
                  color="primary"
                >
                  Review Now
                </UButton>
                <UButton 
                  v-else
                  @click="viewInvoice(invoice)"
                  size="sm" 
                  color="gray" 
                  variant="outline"
                >
                  View
                </UButton>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400 mb-4">No invoices generated yet</p>
          <p class="text-sm text-gray-400 dark:text-gray-500">Invoices will appear here once MetroBNB generates them</p>
        </div>
      </UCard>

      <!-- Units Section -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Units ({{ partnerUnits.length }})</h3>
            <UButton :to="`/partners/${partnerId}/add-unit`" size="sm" color="primary">Add Unit</UButton>
          </div>
        </template>
        
        <div v-if="partnerUnits.length" class="space-y-4">
          <div 
            v-for="unit in partnerUnits" 
            :key="unit.id"
            class="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ unit.name }}</h4>
                <p v-if="unit.location" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  📍 {{ unit.location }}
                </p>
                <p v-if="unit.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ unit.notes }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Added {{ formatDate(unit.createdAt) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <UButton @click="editUnit(unit)" size="sm" color="gray" variant="ghost">
                  <UIcon name="i-heroicons-pencil-square" />
                </UButton>
                <UButton @click="deleteUnitConfirm(unit)" size="sm" color="red" variant="ghost">
                  <UIcon name="i-heroicons-trash" />
                </UButton>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400 mb-4">No units added yet</p>
          <UButton :to="`/partners/${partnerId}/add-unit`" color="primary">Add First Unit</UButton>
        </div>
      </UCard>
    </div>
    
    <UCard v-else-if="!isLoading">
      <div class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Partner not found</p>
        <UButton to="/partners" class="mt-4">Back to Partners</UButton>
      </div>
    </UCard>

    <!-- Invoice Generator Modal -->
    <PartnersInvoiceGeneratorModal 
      v-model="showInvoiceModal" 
      :preselected-partner-id="partnerId"
    />
    
    <!-- Edit Unit Modal -->
    <UModal v-model="showEditModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Edit Unit</h3>
        </template>
        
        <UForm :state="editForm" @submit="updateUnit">
          <div class="space-y-4">
            <UFormGroup label="Unit Name" required>
              <UInput v-model="editForm.name" placeholder="Enter unit name" />
            </UFormGroup>
            
            <UFormGroup label="Location">
              <UTextarea v-model="editForm.location" placeholder="Enter unit location" />
            </UFormGroup>
            
            <UFormGroup label="Notes">
              <UTextarea v-model="editForm.notes" placeholder="Additional notes" />
            </UFormGroup>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <UButton color="gray" variant="ghost" @click="showEditModal = false">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="isUpdating">Update Unit</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const partnerId = route.params.id as string

const { partners, units, loadPartners, loadUnits } = useGlobalCache()
const { updateUnit: apiUpdateUnit, deleteUnit: apiDeleteUnit, getInvoices } = useApi()

const partnerInvoices = ref([])
const { notifySuccess, notifyError } = useNotify()

const isLoading = ref(true)
const showInvoiceModal = ref(false)
const showEditModal = ref(false)
const isUpdating = ref(false)
const editingUnit = ref(null)
const editForm = reactive({
  name: '',
  location: '',
  notes: ''
})
const partner = computed(() => {
  if (isLoading.value || !partnerId || !Array.isArray(partners.value)) return null
  const found = partners.value.find(p => p.id === partnerId) || null
  return found
})

const partnerUnits = computed(() => {
  if (isLoading.value || !partnerId || !Array.isArray(units.value)) return []
  return units.value.filter(u => (u.partnerId || u.partner_id) === partnerId) || []
})

const getPartnerStatusText = (status: string) => {
  // Always show partner perspective on partner dashboard - action-oriented
  const statusMap = {
    'draft': 'Being Prepared',
    'finalized': 'Almost Ready',
    'sent': 'For Your Review',
    'paid': 'All Done ✓'
  }
  return statusMap[status] || status
}

const getPartnerStatusColor = (status: string) => {
  const colorMap = {
    'draft': 'gray',
    'finalized': 'blue', 
    'sent': 'orange',
    'paid': 'green'
  }
  return colorMap[status] || 'gray'
}

const getPartnerStatusDescription = (status: string) => {
  // Partner-focused descriptions with clear actions
  const descriptionMap = {
    'draft': 'We\'re working on your invoice - sit tight!',
    'finalized': 'Your invoice is ready and being finalized',
    'sent': 'Please review your invoice and let us know if everything looks good',
    'paid': 'Thank you! This invoice is complete'
  }
  return descriptionMap[status] || 'Status unknown'
}

const viewInvoice = (invoice: any) => {
  navigateTo(`/invoices/${invoice.id}`)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}

const loadData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      loadPartners(),
      loadUnits(),
      loadPartnerInvoices()
    ])
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const loadPartnerInvoices = async () => {
  try {
    const result = await getInvoices({ partner_id: partnerId, limit: 5 })
    if (result && result.success && result.data) {
      partnerInvoices.value = result.data.items || result.data || []
    } else {
      partnerInvoices.value = []
    }
  } catch (error) {
    partnerInvoices.value = []
  }
}

const editUnit = (unit: any) => {
  editingUnit.value = unit
  editForm.name = unit.name
  editForm.location = unit.location || ''
  editForm.notes = unit.notes || ''
  showEditModal.value = true
}

const updateUnit = async () => {
  if (!editingUnit.value) return
  
  try {
    isUpdating.value = true
    await apiUpdateUnit(editingUnit.value.id, editForm)
    await loadUnits()
    showEditModal.value = false
    
    notifySuccess(`${editForm.name} has been updated successfully`)
  } catch (error) {
    notifyError('Failed to update unit')
  } finally {
    isUpdating.value = false
  }
}

const deleteUnitConfirm = async (unit: any) => {
  if (confirm(`Are you sure you want to delete "${unit.name}"?`)) {
    try {
      await apiDeleteUnit(unit.id)
      await loadUnits()
      
      notifySuccess(`${unit.name} has been deleted`)
    } catch (error) {
      notifyError('Failed to delete unit')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
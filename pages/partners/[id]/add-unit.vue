<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Unit</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Add a new unit for <span class="font-medium">{{ partner?.name }}</span>
      </p>
    </div>

    <div v-if="partner">
      <UnitForm
        :preselected-partner="partnerId"
        @close="handleClose"
        @saved="handleSaved"
      />
    </div>
    
    <UCard v-else>
      <div class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">Partner not found</p>
        <UButton to="/partners" class="mt-4">Back to Partners</UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const partnerId = route.params.id as string

const { getPartners } = useApi()
const partner = ref(null)

const handleClose = () => {
  router.push(`/partners/${partnerId}`)
}

const handleSaved = () => {
  const { notifySuccess } = useNotify()
  notifySuccess('Unit added successfully')
  router.push(`/partners/${partnerId}`)
}

const loadPartner = async () => {
  try {
    const partners = await getPartners()
    partner.value = partners.find(p => p.id === partnerId)
  } catch (error) {
    console.error('Error loading partner:', error)
  }
}

onMounted(() => {
  loadPartner()
})
</script>
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <p class="text-gray-600 dark:text-gray-400">Business intelligence and performance insights</p>
    </div>

    <!-- Analytics Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Overview Analytics -->
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/analytics/overview')">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Business Overview</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Complete financial overview of your entire business including own units and partner units
          </p>
          <UButton color="blue" variant="soft" block>
            View Overview
          </UButton>
        </div>
      </UCard>

      <!-- Own Units Analytics -->
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/analytics/own-units')">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-home-modern" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Own Units</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Performance analytics for units directly owned and managed by MetroBNB
          </p>
          <UButton color="green" variant="soft" block>
            View Own Units
          </UButton>
        </div>
      </UCard>

      <!-- Partners Analytics -->
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/analytics/partners')">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-users" class="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Partner Units</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Analytics for partner-managed units with revenue sharing insights
          </p>
          <UButton color="purple" variant="soft" block>
            View Partners
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Quick Stats Preview -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Quick Stats</h3>
      </template>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4">
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalUnits }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Units</p>
        </div>
        <div class="text-center p-4">
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ ownUnits }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Own Units</p>
        </div>
        <div class="text-center p-4">
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ partnerUnits }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Partner Units</p>
        </div>
        <div class="text-center p-4">
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ totalPartners }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Active Partners</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { partners, units, loadPartners, loadUnits } = useDataManager()

const totalUnits = computed(() => Array.isArray(units.value) ? units.value.length : 0)
const totalPartners = computed(() => Array.isArray(partners.value) ? partners.value.length : 0)

const metroBNBPartner = computed(() => {
  return Array.isArray(partners.value) ? partners.value.find(p => p.name.toLowerCase().includes('metrobnb')) : null
})

const ownUnits = computed(() => {
  if (!Array.isArray(units.value) || !metroBNBPartner.value) return 0
  return units.value.filter(unit => unit.partner_id === metroBNBPartner.value.id).length
})

const partnerUnits = computed(() => {
  if (!Array.isArray(units.value) || !metroBNBPartner.value) return units.value?.length || 0
  return units.value.filter(unit => unit.partner_id !== metroBNBPartner.value.id).length
})

onMounted(async () => {
  await Promise.all([
    loadPartners(),
    loadUnits()
  ])
})
</script>
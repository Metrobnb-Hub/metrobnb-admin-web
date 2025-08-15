<template>
  <div class="calendar-legend">
    <h3 class="text-sm font-medium text-gray-900 mb-3">Legend</h3>
    
    <div class="space-y-2">
      <div class="text-xs text-gray-600 font-medium mb-1">Booking Status</div>
      <div class="flex flex-wrap gap-3">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-green-500"></div>
          <span class="text-xs text-gray-700">Confirmed</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-red-500"></div>
          <span class="text-xs text-gray-700">Canceled</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-orange-500"></div>
          <span class="text-xs text-gray-700">Refunded</span>
        </div>
      </div>
    </div>

    <div class="space-y-2 mt-4">
      <div class="text-xs text-gray-600 font-medium mb-1">Payment Status (Border)</div>
      <div class="flex flex-wrap gap-3">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-gray-300 border-2 border-green-600"></div>
          <span class="text-xs text-gray-700">Paid</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-gray-300 border-2 border-orange-600"></div>
          <span class="text-xs text-gray-700">Partial</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-gray-300 border-2 border-red-600"></div>
          <span class="text-xs text-gray-700">Unpaid</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.calendar-legend {
  @apply bg-gray-50 rounded-lg p-4 border;
}
</style>
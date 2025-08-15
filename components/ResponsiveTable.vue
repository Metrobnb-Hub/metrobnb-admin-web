<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(row, index) in data" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
            >
              <slot :name="`${column.key}-data`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden">
      <div 
        v-for="(row, index) in data" 
        :key="index"
        class="border-b border-gray-200 dark:border-gray-700 p-4 space-y-3"
      >
        <div v-for="column in columns" :key="column.key" class="flex justify-between items-start">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ column.label }}:
          </span>
          <div class="text-sm text-gray-900 dark:text-gray-100 text-right flex-1 ml-4">
            <slot :name="`${column.key}-data`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </div>
        </div>
        
        <!-- Mobile Actions -->
        <div v-if="$slots.actions" class="pt-3 border-t border-gray-100 dark:border-gray-600">
          <slot name="actions" :row="row" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!data.length" class="text-center py-12">
      <slot name="empty">
        <div class="text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-inbox" class="mx-auto h-12 w-12 mb-4" />
          <p>No data available</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  data: any[]
}

defineProps<Props>()
defineSlots<{
  [key: `${string}-data`]: (props: { row: any; value: any }) => any
  actions: (props: { row: any }) => any
  empty: () => any
}>()
</script>
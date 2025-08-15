<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <div v-if="total" class="text-sm text-gray-500 dark:text-gray-400">
        Total: ₱{{ total.toLocaleString() }}
      </div>
    </div>
    
    <div class="space-y-3">
      <div v-for="item in chartData" :key="item.label" class="space-y-2">
        <div class="flex justify-between items-center text-sm">
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.label }}</span>
          <span class="text-gray-900 dark:text-white">₱{{ item.value.toLocaleString() }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            class="h-3 rounded-full transition-all duration-500 ease-out"
            :class="item.color || 'bg-blue-500'"
            :style="{ width: `${item.percentage}%` }"
          ></div>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ item.percentage.toFixed(1) }}% of total
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartItem {
  label: string
  value: number
  color?: string
}

interface Props {
  title: string
  data: ChartItem[]
}

const props = defineProps<Props>()

const total = computed(() => 
  props.data.reduce((sum, item) => sum + item.value, 0)
)

const chartData = computed(() => 
  props.data.map(item => ({
    ...item,
    percentage: total.value > 0 ? (item.value / total.value) * 100 : 0
  }))
)
</script>
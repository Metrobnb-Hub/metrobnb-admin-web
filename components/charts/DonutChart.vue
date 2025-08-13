<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    
    <div class="flex items-center justify-center">
      <div class="relative w-48 h-48">
        <!-- SVG Donut Chart -->
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            class="text-gray-200 dark:text-gray-700"
          />
          <circle
            v-for="(segment, index) in segments"
            :key="index"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            :stroke="segment.color"
            stroke-width="8"
            :stroke-dasharray="`${segment.length} ${circumference - segment.length}`"
            :stroke-dashoffset="-segment.offset"
            class="transition-all duration-500"
          />
        </svg>
        
        <!-- Center Text -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              ₱{{ total.toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="grid grid-cols-1 gap-2">
      <div v-for="item in data" :key="item.label" class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
        </div>
        <div class="text-sm font-medium text-gray-900 dark:text-white">
          ₱{{ item.value.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartItem {
  label: string
  value: number
  color: string
}

interface Props {
  title: string
  data: ChartItem[]
}

const props = defineProps<Props>()

const circumference = 2 * Math.PI * 40 // radius = 40

const total = computed(() => 
  props.data.reduce((sum, item) => sum + item.value, 0)
)

const segments = computed(() => {
  let offset = 0
  return props.data.map(item => {
    const percentage = total.value > 0 ? item.value / total.value : 0
    const length = percentage * circumference
    const segment = {
      ...item,
      length,
      offset,
      percentage: percentage * 100
    }
    offset += length
    return segment
  })
})
</script>
<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
    
    <div class="relative h-64 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <svg class="w-full h-full" viewBox="0 0 400 200">
        <!-- Grid lines -->
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" class="text-gray-300 dark:text-gray-600"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- Line path -->
        <path
          :d="linePath"
          fill="none"
          stroke="rgb(59, 130, 246)"
          stroke-width="2"
          class="transition-all duration-500"
        />
        
        <!-- Data points -->
        <circle
          v-for="(point, index) in points"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="rgb(59, 130, 246)"
          class="transition-all duration-500 hover:r-6"
        />
        
        <!-- Labels -->
        <text
          v-for="(item, index) in data"
          :key="index"
          :x="(index * (400 / (data.length - 1)))"
          y="190"
          text-anchor="middle"
          class="text-xs fill-current text-gray-600 dark:text-gray-400"
        >
          {{ item.label }}
        </text>
      </svg>
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Average</div>
        <div class="text-lg font-semibold text-gray-900 dark:text-white">
          ₱{{ average.toLocaleString() }}
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Highest</div>
        <div class="text-lg font-semibold text-green-600 dark:text-green-400">
          ₱{{ highest.toLocaleString() }}
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Lowest</div>
        <div class="text-lg font-semibold text-red-600 dark:text-red-400">
          ₱{{ lowest.toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChartItem {
  label: string
  value: number
}

interface Props {
  title: string
  data: ChartItem[]
}

const props = defineProps<Props>()

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))
const minValue = computed(() => Math.min(...props.data.map(d => d.value)))

const points = computed(() => {
  return props.data.map((item, index) => ({
    x: index * (400 / (props.data.length - 1)),
    y: 160 - ((item.value - minValue.value) / (maxValue.value - minValue.value)) * 140
  }))
})

const linePath = computed(() => {
  if (points.value.length === 0) return ''
  
  const path = points.value.reduce((acc, point, index) => {
    return acc + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
  }, '')
  
  return path
})

const average = computed(() => {
  const sum = props.data.reduce((acc, item) => acc + item.value, 0)
  return props.data.length > 0 ? sum / props.data.length : 0
})

const highest = computed(() => maxValue.value)
const lowest = computed(() => minValue.value)
</script>
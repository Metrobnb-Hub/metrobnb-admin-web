<template>
  <div class="relative">
    <UInput
      :model-value="displayValue"
      @click="showPicker = true"
      readonly
      placeholder="Select date"
      class="cursor-pointer"
    >
      <template #trailing>
        <UIcon name="i-heroicons-calendar" class="text-gray-400" />
      </template>
    </UInput>
    
    <input
      ref="dateInput"
      type="date"
      :value="modelValue"
      @input="handleInput"
      class="absolute inset-0 opacity-0 cursor-pointer"
      :max="max"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  max?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const dateInput = ref<HTMLInputElement>()
const showPicker = ref(false)

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue + 'T00:00:00')
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  })
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

watch(showPicker, (show) => {
  if (show && dateInput.value) {
    dateInput.value.showPicker?.()
    showPicker.value = false
  }
})
</script>

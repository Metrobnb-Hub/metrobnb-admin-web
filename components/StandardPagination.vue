<template>
  <div v-if="pagination && pagination.total_pages > 1" class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div class="text-sm text-gray-600 dark:text-gray-400">
      Showing {{ startItem }} to {{ endItem }} of {{ pagination.total_items }} results
    </div>
    <UPagination 
      :model-value="pagination.current_page" 
      :page-count="pagination.total_pages"
      :total="pagination.total_items"
      @update:model-value="$emit('page-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
interface PaginationData {
  current_page: number
  total_pages: number
  total_items: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

const props = defineProps<{
  pagination: PaginationData | null
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const startItem = computed(() => {
  if (!props.pagination) return 0
  return ((props.pagination.current_page - 1) * props.pagination.per_page) + 1
})

const endItem = computed(() => {
  if (!props.pagination) return 0
  return Math.min(props.pagination.current_page * props.pagination.per_page, props.pagination.total_items)
})
</script>
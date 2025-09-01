<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="$slots.fallback">
    <slot name="fallback" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  roles?: string[]
  permission?: string
  partnerId?: string
}

const props = defineProps<Props>()
const { user, hasPermission, canAccessPartner } = useAuth()

const hasAccess = computed(() => {
  if (!user.value) return false
  
  // Check role access
  if (props.roles && !props.roles.includes(user.value.role)) {
    return false
  }
  
  // Check specific permission
  if (props.permission && !hasPermission(props.permission)) {
    return false
  }
  
  // Check partner access
  if (props.partnerId && !canAccessPartner(props.partnerId)) {
    return false
  }
  
  return true
})
</script>
export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth()
  
  if (!user.value || user.value.role === 'partner') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied - Admin Only'
    })
  }
})
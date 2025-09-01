export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getCurrentUser, user } = useAuth()
  
  // Skip auth check for login/register pages
  if (to.path === '/login' || to.path === '/register') {
    return
  }
  
  // Check if user is authenticated
  if (!user.value) {
    await getCurrentUser()
  }
  
  // If still no user, redirect to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
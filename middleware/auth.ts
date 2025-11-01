export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchUser, user } = useAuth()
  
  // Skip auth check for login/register pages
  if (to.path === '/login' || to.path === '/register') {
    return
  }
  
  // Check if user is authenticated
  if (!user.value) {
    await fetchUser()
  }
  
  // If still no user, redirect to login
  if (!user.value) {
    return navigateTo('/login?expired=1')
  }
})
export default defineNuxtRouteMiddleware(async (to) => {
  const { getCurrentUser, user } = useAuth()

  // Skip auth check for login/register pages
  if (to.path === '/login' || to.path === '/register') {
    return
  }

  // Check if user is authenticated
  if (!user.value) {
    const userData = await getCurrentUser()

    // If getCurrentUser returns null, user is not authenticated
    if (!userData) {
      return navigateTo('/login?expired=1')
    }
  }

  // Additional check: if still no user after fetch, redirect
  if (!user.value) {
    return navigateTo('/login?expired=1')
  }
})
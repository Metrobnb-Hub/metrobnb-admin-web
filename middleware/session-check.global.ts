export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server side and for login/register/password pages
  if (process.server || to.path === '/login' || to.path === '/register' || to.path === '/change-password' || to.path === '/set-password' || to.path === '/reset-password') {
    return
  }

  const tokenCookie = useCookie('auth_token')
  const userCookie = useCookie('user_data')

  // If we have a token and user data, test if the session is still valid
  if (tokenCookie.value && userCookie.value) {
    try {
      const config = useRuntimeConfig()
      await $fetch('/api/auth/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`
        },
        timeout: 5000
      })
    } catch (error) {
      // Session is invalid, use centralized handler
      const { handleSessionExpiry } = useSessionManager()
      return handleSessionExpiry(true)
    }
  }
})
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server side and for login/register/password pages and invoice pages
  if (process.server || 
      to.path === '/login' || 
      to.path === '/register' || 
      to.path === '/change-password' || 
      to.path === '/set-password' || 
      to.path === '/reset-password' || 
      to.path === '/invoice' ||
      to.path.startsWith('/accounting/invoices')) {
    return
  }

  const tokenCookie = useCookie('auth_token')
  const userCookie = useCookie('user_data')
  
  // Cache session check for 5 minutes to align with API cache
  const lastCheck = useCookie('last_session_check', { maxAge: 300 })
  const now = Date.now()
  
  // If we have a token and user data, test if the session is still valid
  if (tokenCookie.value && userCookie.value) {
    // Skip check if we validated recently (5 minutes)
    if (lastCheck.value && (now - parseInt(lastCheck.value)) < 300000) {
      return
    }
    
    try {
      const config = useRuntimeConfig()
      await $fetch('/api/auth/me', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`
        },
        timeout: 5000,
        keepalive: true
      })
      lastCheck.value = now.toString()
    } catch (error) {
      // Session is invalid, use centralized handler
      const { handleSessionExpiry } = useSessionManager()
      return handleSessionExpiry(true)
    }
  }
})
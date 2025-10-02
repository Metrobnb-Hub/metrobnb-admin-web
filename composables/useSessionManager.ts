export const useSessionManager = () => {
  const handleSessionExpiry = (fromMiddleware = false) => {
    console.log('Session expired - clearing all auth data')
    
    // Clear all auth data
    const tokenCookie = useCookie('auth_token')
    const refreshCookie = useCookie('refresh_token')
    const userCookie = useCookie('user_data')
    const orgCookie = useCookie('org_data')
    
    tokenCookie.value = null
    refreshCookie.value = null
    userCookie.value = null
    orgCookie.value = null
    
    // Different redirect methods for middleware vs client
    if (fromMiddleware) {
      // In middleware, use navigateTo
      return navigateTo('/login?expired=1')
    } else if (process.client) {
      // In client, use window.location
      window.location.href = '/login?expired=1'
    }
  }
  
  return {
    handleSessionExpiry
  }
}
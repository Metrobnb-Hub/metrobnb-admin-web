let isRefreshing = false
let refreshPromise: Promise<any> | null = null

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      const tokenCookie = useCookie('auth_token')
      
      if (tokenCookie.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenCookie.value}`
        }
      }
    },
    async onRequestError({ error }) {
      // Handle network errors (CORS, connection issues)
      if (process.client && error.message?.includes('fetch')) {
        const tokenCookie = useCookie('auth_token')
        
        // If we have a token but getting network errors, likely session expired
        if (tokenCookie.value) {
          const toast = useToast()
          toast.add({
            title: 'Session Expired',
            description: 'Your session has expired. Redirecting to login...',
            color: 'yellow',
            timeout: 3000,
            icon: 'i-heroicons-exclamation-triangle'
          })
          
          // Clear all auth data
          tokenCookie.value = null
          const refreshCookie = useCookie('refresh_token')
          const userCookie = useCookie('user_data')
          const orgCookie = useCookie('org_data')
          refreshCookie.value = null
          userCookie.value = null
          orgCookie.value = null
          
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        }
      }
    },
    async onResponseError({ response, options }) {
      const errorData = response?._data || {}
      const errorCode = errorData.error?.code
      const errorMessage = errorData.error?.message
      
      // Handle 403 Forbidden - Permission denied
      if (response?.status === 403) {
        if (process.client) {
          const toast = useToast()
          let title = 'Access Denied'
          let description = 'You do not have permission to perform this action.'
          
          if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
            description = 'You lack the required permissions for this action.'
          } else if (errorCode === 'INSUFFICIENT_ROLE') {
            description = 'Your role is not authorized for this action.'
          } else if (errorMessage) {
            description = errorMessage
          }
          
          toast.add({
            title,
            description,
            color: 'red',
            timeout: 4000,
            icon: 'i-heroicons-shield-exclamation'
          })
        }
        return // Don't clear tokens, just show error
      }
      
      // Handle 401 Unauthorized - Session expired
      if (response?.status === 401) {
        const refreshCookie = useCookie('refresh_token')
        const tokenCookie = useCookie('auth_token')
        
        // Skip refresh for auth endpoints
        if (options.url?.includes('/api/auth/')) {
          return
        }
        
        // Only try refresh if we have a refresh token
        if (refreshCookie.value && !isRefreshing) {
          // Prevent multiple simultaneous refresh attempts
          if (!refreshPromise) {
            isRefreshing = true
            refreshPromise = $fetch('/api/auth/refresh', {
              method: 'POST',
              baseURL: config.public.apiBaseUrl,
              body: { refresh_token: refreshCookie.value },
              headers: { 'Content-Type': 'application/json' }
            })
          }
          
          try {
            const refreshResponse = await refreshPromise
            
            if (refreshResponse.success && refreshResponse.data?.access_token) {
              // Update tokens
              tokenCookie.value = refreshResponse.data.access_token
              refreshCookie.value = refreshResponse.data.refresh_token
              
              // Retry original request
              return $fetch(response.url, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${refreshResponse.data.access_token}`
                }
              })
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            refreshCookie.value = null
          } finally {
            isRefreshing = false
            refreshPromise = null
          }
        }
        
        // Use centralized session expiry handler
        if (process.client) {
          const { handleSessionExpiry } = useSessionManager()
          handleSessionExpiry()
        }
      }
    }
  })
  
  return { provide: { api } }
})
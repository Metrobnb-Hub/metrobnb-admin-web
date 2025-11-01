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
      // Handle CORS/network errors
      if (process.client && (error.message?.includes('fetch') || error.message?.includes('CORS'))) {
        console.error('Network/CORS error:', error)
        
        const toast = useToast()
        toast.add({
          title: 'Connection Issue',
          description: 'API server may be sleeping. Retrying...',
          color: 'yellow',
          timeout: 3000
        })
      }
    },
    async onResponseError({ response, options }) {
      const errorData = response?._data || {}
      const errorCode = errorData.error?.code
      const errorMessage = errorData.error?.message
      
      // Handle 403 Forbidden - Permission denied
      if (response.status === 403) {
        if (process.client) {
          const toast = useToast()
          let description = 'You do not have permission to perform this action.'
          
          if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
            description = 'You lack the required permissions for this action.'
          } else if (errorCode === 'INSUFFICIENT_ROLE') {
            description = 'Your role is not authorized for this action.'
          } else if (errorMessage) {
            description = errorMessage
          }
          
          toast.add({
            title: 'Access Denied',
            description,
            color: 'red',
            timeout: 4000,
            icon: 'i-heroicons-shield-exclamation'
          })
        }
        return
      }

      // Handle 401 Unauthorized - Token expired or invalid
      if (response.status === 401) {
        const tokenCookie = useCookie('auth_token')
        const refreshCookie = useCookie('refresh_token')
        
        // Skip refresh for login/register endpoints
        if (options.url?.includes('/login') || options.url?.includes('/register')) {
          return
        }
        
        // Try to refresh token if we have a refresh token and not already refreshing
        if (refreshCookie.value && !isRefreshing) {
          isRefreshing = true
          
          try {
            refreshPromise = $fetch('/api/auth/refresh', {
              method: 'POST',
              baseURL: config.public.apiBaseUrl,
              body: { refresh_token: refreshCookie.value },
              headers: { 'Content-Type': 'application/json' }
            })
            
            const refreshResponse = await refreshPromise
            
            if (refreshResponse.success && refreshResponse.data) {
              // Update tokens
              tokenCookie.value = refreshResponse.data.access_token
              refreshCookie.value = refreshResponse.data.refresh_token
              
              // Retry the original request with new token
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${refreshResponse.data.access_token}`
              }
              
              isRefreshing = false
              refreshPromise = null
              
              // Return to retry the request
              return
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
          }
          
          isRefreshing = false
          refreshPromise = null
        }
        
        // If refresh failed or no refresh token, logout
        if (process.client) {
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
          refreshCookie.value = null
          const userCookie = useCookie('user_data')
          const orgCookie = useCookie('org_data')
          userCookie.value = null
          orgCookie.value = null
          
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        }
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})

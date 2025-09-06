export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ options }) {
      // Get fresh token cookie on each request
      const tokenCookie = useCookie('auth_token')
      
      if (tokenCookie.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenCookie.value}`
        }
      }
    },
    async onResponseError({ response, options }) {
      if (response.status === 401) {
        const refreshCookie = useCookie('refresh_token')
        
        if (refreshCookie.value) {
          try {
            const refreshResponse = await $fetch('/api/auth/refresh', {
              method: 'POST',
              baseURL: config.public.apiBaseUrl,
              body: { refresh_token: refreshCookie.value }
            })
            
            if (refreshResponse.success) {
              const tokenCookie = useCookie('auth_token')
              tokenCookie.value = refreshResponse.data.access_token
              refreshCookie.value = refreshResponse.data.refresh_token
              
              // Retry original request with new token
              return $fetch(response.url, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${refreshResponse.data.access_token}`
                }
              })
            }
          } catch (error) {
          }
        }
        
        // Clear tokens and redirect to login
        const tokenCookie = useCookie('auth_token')
        tokenCookie.value = null
        refreshCookie.value = null
        
        try {
          navigateTo('/login')
        } catch (error) {
          if (process.client) {
            window.location.href = '/login'
          }
        }
      }
    }
  })
  
  return { provide: { api } }
})
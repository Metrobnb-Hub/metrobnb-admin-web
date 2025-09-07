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
    async onResponseError({ response, options, error }) {
      // Handle CORS errors that might indicate token expiry
      if (!response && error && (error.message?.includes('CORS') || error.message?.includes('fetch'))) {
        const tokenCookie = useCookie('auth_token')
        const refreshCookie = useCookie('refresh_token')
        
        // If we have tokens but getting CORS errors, likely token expired
        if (tokenCookie.value) {
          if (process.client) {
            const toast = useToast()
            toast.add({
              title: 'Connection Issue',
              description: 'Session may have expired. Please log in again to continue.',
              color: 'yellow',
              timeout: 5000,
              icon: 'i-heroicons-exclamation-triangle'
            })
          }
          
          // Clear tokens
          tokenCookie.value = null
          refreshCookie.value = null
          const userCookie = useCookie('user_data')
          const orgCookie = useCookie('org_data')
          userCookie.value = null
          orgCookie.value = null
          
          setTimeout(() => {
            try {
              navigateTo('/login')
            } catch (error) {
              if (process.client) {
                window.location.href = '/login'
              }
            }
          }, 1000)
          return
        }
      }
      
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
        
        // Handle session expiry with immediate logout
        if (process.client) {
          const toast = useToast()
          toast.add({
            title: 'Session Expired',
            description: 'Redirecting to login page...',
            color: 'red',
            timeout: 3000,
            icon: 'i-heroicons-exclamation-triangle'
          })
          
          // Force logout and redirect immediately
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        }
        
        // Clear tokens and redirect to login
        const tokenCookie = useCookie('auth_token')
        const userCookie = useCookie('user_data')
        const orgCookie = useCookie('org_data')
        
        tokenCookie.value = null
        refreshCookie.value = null
        userCookie.value = null
        orgCookie.value = null
        
        // Delay redirect slightly to show the toast
        setTimeout(() => {
          try {
            navigateTo('/login')
          } catch (error) {
            if (process.client) {
              window.location.href = '/login'
            }
          }
        }, 1000)
      }
    }
  })
  
  return { provide: { api } }
})
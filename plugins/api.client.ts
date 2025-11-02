let isRefreshing = false
let refreshPromise: Promise<any> | null = null

/**
 * Exponential backoff retry utility
 * Retries failed requests with increasing delay between attempts
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    shouldRetry?: (error: any, attempt: number) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error: any) => {
      // Retry on network errors or 5xx server errors
      const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network')
      const is5xxError = error.response?.status >= 500 && error.response?.status < 600
      return isNetworkError || is5xxError
    }
  } = options

  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry if this is the last attempt or if error is not retryable
      if (attempt === maxRetries - 1 || !shouldRetry(error, attempt)) {
        throw error
      }

      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = Math.min(
        initialDelay * Math.pow(2, attempt),
        maxDelay
      )
      const jitter = Math.random() * 0.3 * exponentialDelay
      const delay = exponentialDelay + jitter

      // Log retry attempt in development
      if (process.dev) {
        console.log(`[API] Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${Math.round(delay)}ms`, error.message)
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Request deduplication map to prevent duplicate concurrent requests
 */
const pendingRequests = new Map<string, Promise<any>>()

/**
 * API request logger
 */
const logApiRequest = (method: string, url: string, options?: any) => {
  if (process.dev) {
    const timestamp = new Date().toISOString()
    console.log(`[API Request] ${timestamp} ${method} ${url}`, options?.body ? { body: options.body } : '')
  }
}

const logApiResponse = (method: string, url: string, status: number, duration: number) => {
  if (process.dev) {
    const timestamp = new Date().toISOString()
    const statusColor = status >= 200 && status < 300 ? '✓' : '✗'
    console.log(`[API Response] ${timestamp} ${statusColor} ${method} ${url} - ${status} (${duration}ms)`)
  }
}

const logApiError = (method: string, url: string, error: any, duration: number) => {
  if (process.dev) {
    const timestamp = new Date().toISOString()
    console.error(`[API Error] ${timestamp} ✗ ${method} ${url} - ${error.message || 'Unknown error'} (${duration}ms)`)
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 30000,
    redirect: 'follow', // Automatically follow redirects (307, 308, etc.)

    onRequest({ request, options }) {
      const tokenCookie = useCookie('auth_token')
      const startTime = Date.now()

      // Store start time for duration calculation
      ;(options as any)._startTime = startTime

      // Log request
      logApiRequest(options.method as string || 'GET', request as string, options)

      if (tokenCookie.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenCookie.value}`
        }
      }
    },

    onResponse({ request, response, options }) {
      const duration = Date.now() - ((options as any)._startTime || Date.now())
      logApiResponse(options.method as string || 'GET', request as string, response.status, duration)
    },
    async onRequestError({ request, options, error }) {
      const duration = Date.now() - ((options as any)._startTime || Date.now())
      logApiError(options.method as string || 'GET', request as string, error, duration)

      // Handle CORS/network errors
      if (process.client && (error.message?.includes('fetch') || error.message?.includes('CORS'))) {
        console.error('Network/CORS error:', error)

        const toast = useToast()

        // Check if this might be a Render cold start (timeout on first request)
        const isRender = config.public.apiBaseUrl?.includes('render.com')
        const isPossibleColdStart = isRender && error.message?.includes('timeout')

        if (isPossibleColdStart) {
          toast.add({
            title: 'API Starting Up',
            description: 'The API server is waking up. This may take 30-60 seconds. Please wait...',
            color: 'amber',
            timeout: 5000
          })
        } else {
          toast.add({
            title: 'Connection Issue',
            description: 'Unable to reach the server. Please check your connection.',
            color: 'yellow',
            timeout: 3000
          })
        }
      }
    },
    async onResponseError({ response, options }) {
      const errorData = response?._data || {}
      const errorCode = errorData.error?.code
      const errorMessage = errorData.error?.message

      // Handle 307 Temporary Redirect (should be handled automatically, but log for debugging)
      if (response.status === 307 || response.status === 308) {
        if (process.dev) {
          console.warn('[API] Redirect detected:', {
            status: response.status,
            location: response.headers.get('location'),
            originalUrl: options.url
          })
        }
        // $fetch should handle this automatically with redirect: 'follow'
        return
      }

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

  /**
   * Wrapper with retry logic and request deduplication
   */
  const apiWithRetry = async <T = any>(
    url: string,
    options?: any
  ): Promise<T> => {
    const method = options?.method || 'GET'
    const requestKey = `${method}:${url}:${JSON.stringify(options?.body || {})}`

    // Check for pending request (deduplication)
    if (pendingRequests.has(requestKey)) {
      if (process.dev) {
        console.log(`[API] Using cached pending request for ${method} ${url}`)
      }
      return pendingRequests.get(requestKey) as Promise<T>
    }

    // Create request with retry logic
    const requestPromise = retryWithBackoff(
      () => api<T>(url, options),
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        shouldRetry: (error: any, attempt: number) => {
          // Don't retry on 4xx client errors (except 408 timeout and 429 rate limit)
          if (error.response?.status >= 400 && error.response?.status < 500) {
            return error.response.status === 408 || error.response.status === 429
          }

          // Retry on network errors and 5xx server errors
          const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network')
          const is5xxError = error.response?.status >= 500

          return isNetworkError || is5xxError
        }
      }
    ).finally(() => {
      // Remove from pending requests when complete
      pendingRequests.delete(requestKey)
    })

    // Store pending request
    pendingRequests.set(requestKey, requestPromise)

    return requestPromise
  }

  return {
    provide: {
      api,
      apiWithRetry
    }
  }
})

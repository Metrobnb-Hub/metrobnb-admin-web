/**
 * Shared API client for all domain-specific API composables
 * Handles authentication, error handling, and response unwrapping
 */
export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const nuxtApp = useNuxtApp()
  const tokenCookie = useCookie('auth_token')

  const url = endpoint

  try {
    const response = await nuxtApp.$api(url, {
      ...options,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...(tokenCookie.value && { 'Authorization': `Bearer ${tokenCookie.value}` }),
        ...options.headers
      }
    })

    // Handle wrapped API responses - but preserve full structure for paginated endpoints and invoices
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      // For paginated responses (bookings, expenses, etc.), preserve full structure
      if (response.data && typeof response.data === 'object' && ('items' in response.data || 'pagination' in response.data)) {
        return response as T
      }
      // For invoice endpoints, preserve full response structure
      if (endpoint.includes('/invoices/') && !endpoint.includes('/invoices?')) {
        return response as T
      }
      // For simple array responses, extract data
      return response.data as T
    }

    return response as T
  } catch (error: any) {
    // Handle any error that might indicate session expiry
    const tokenCookie = useCookie('auth_token')
    const isNetworkError = error.message?.includes('fetch') ||
                          error.name === 'TypeError' ||
                          error.message?.includes('CORS') ||
                          error.message?.includes('ERR_FAILED')

    if (tokenCookie.value && process.client && isNetworkError) {
      const { handleSessionExpiry } = useSessionManager()
      handleSessionExpiry()
      return
    }

    // For dashboard endpoint, return mock data to prevent UI breaks
    if (endpoint.includes('dashboard')) {
      return {
        success: false,
        data: {
          metrobnb_revenue: '0',
          partner_revenue: '0',
          metrobnb_expenses: '0',
          net_profit: '0',
          partner_count: 0,
          revenue_by_partner: [],
          expense_breakdown: [],
          monthly_trend: [],
          recent_bookings: [],
          recent_expenses: []
        }
      } as T
    }

    // Re-throw the error for proper handling
    throw error
  }
}

/**
 * Invoice API with CORS workaround
 *
 * Temporary solution until backend CORS is fixed for /api/invoices/
 */

export const useInvoiceApi = () => {
  const config = useRuntimeConfig()

  const getInvoices = async (params?: { page?: number; limit?: number }) => {
    try {
      const { $api } = useNuxtApp()

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())

      const url = `/api/invoices/${queryParams.toString() ? '?' + queryParams.toString() : ''}`

      console.log('Fetching invoices from:', url)

      // Try with regular API first
      const response = await $api(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      return response
    } catch (error: any) {
      console.error('Invoice API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?._data
      })

      // If CORS error, show helpful message
      if (error.message?.includes('CORS') || error.message?.includes('fetch')) {
        const { notifyError } = useNotify()
        notifyError(
          'The invoice endpoint has CORS issues. Please check backend CORS configuration for /api/invoices/'
        )
      }

      throw error
    }
  }

  return {
    getInvoices
  }
}

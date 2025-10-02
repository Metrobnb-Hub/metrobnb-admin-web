import type { Partner, Unit, Booking, Expense, BookingSource, Service, ApiFilters, PaginatedResponse } from '~/types/api'

export interface JournalEntry {
  id: string
  partner_id: string
  date: string
  type: 'credit' | 'debit'
  amount: string
  description: string
  reference: string | null
  notes: string | null
  status: 'pending' | 'settled'
  settled_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CreateJournalEntryRequest {
  partner_id: string
  date: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  reference?: string
  notes?: string
  created_by?: string
}

const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const nuxtApp = useNuxtApp()
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${endpoint}${separator}_t=${Date.now()}`
  
  try {
    const response = await nuxtApp.$api(url, {
      ...options,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
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

export const useApi = () => {
  return {
    // Services
    getServices: async (): Promise<Service[]> => {
      return await apiClient<Service[]>('/api/services')
    },
    
    createService: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
      return await apiClient<Service>('/api/services', {
        method: 'POST',
        body: JSON.stringify(service)
      })
    },
    
    updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
      return await apiClient<Service>(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(service)
      })
    },
    
    deleteService: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/services/${id}`, { method: 'DELETE' })
    },
    
    // Partners
    getPartners: async (): Promise<Partner[]> => {
      return await apiClient<Partner[]>('/api/partners')
    },
    
    getPartnerById: async (id: string): Promise<Partner> => {
      return await apiClient<Partner>(`/api/partners/${id}`)
    },
    
    createPartner: async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'> & { service_ids: string[] }): Promise<Partner> => {
      const result = await apiClient<Partner>('/api/partners', {
        method: 'POST',
        body: JSON.stringify(partner)
      })
      const { invalidate } = useCache()
      invalidate('/api/partners')
      return result
    },
    
    updatePartner: async (id: string, partner: Partial<Partner> & { service_ids?: string[] }): Promise<Partner> => {
      const result = await apiClient<Partner>(`/api/partners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(partner)
      })
      const { invalidate } = useCache()
      invalidate('/api/partners')
      return result
    },
    
    deletePartner: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/partners/${id}`, { method: 'DELETE' })
    },
    
    // Units
    getUnits: async (): Promise<Unit[]> => {
      return await apiClient<Unit[]>('/api/units')
    },
    
    getUnitsByPartner: async (partnerId: string): Promise<Unit[]> => {
      return await apiClient<Unit[]>(`/api/partners/${partnerId}/units`)
    },
    
    createUnit: async (unit: Omit<Unit, 'id' | 'created_at' | 'updated_at'>): Promise<Unit> => {
      const result = await apiClient<Unit>('/api/units', {
        method: 'POST',
        body: JSON.stringify(unit)
      })
      const { invalidate } = useCache()
      invalidate('/api/units')
      return result
    },
    
    updateUnit: async (id: string, unit: Partial<Unit>): Promise<Unit> => {
      return await apiClient<Unit>(`/api/units/${id}`, {
        method: 'PUT',
        body: JSON.stringify(unit)
      })
    },
    
    deleteUnit: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/units/${id}`, { method: 'DELETE' })
    },
    
    // Booking Sources
    getBookingSources: async (): Promise<BookingSource[]> => {
      return await apiClient<BookingSource[]>('/api/booking-sources')
    },
    
    createBookingSource: async (source: Omit<BookingSource, 'id' | 'created_at' | 'updated_at'>): Promise<BookingSource> => {
      return await apiClient<BookingSource>('/api/booking-sources', {
        method: 'POST',
        body: JSON.stringify(source)
      })
    },
    
    updateBookingSource: async (id: string, source: Partial<BookingSource>): Promise<BookingSource> => {
      return await apiClient<BookingSource>(`/api/booking-sources/${id}`, {
        method: 'PUT',
        body: JSON.stringify(source)
      })
    },
    
    deleteBookingSource: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/booking-sources/${id}`, { method: 'DELETE' })
    },
    
    // Payment Methods
    getPaymentMethods: async () => {
      return await apiClient<Array<{
        id: string
        name: string
        is_active: boolean
        created_at: string
        updated_at: string
      }>>('/api/payment-methods')
    },
    
    // Bookings
    getBookings: async (filters: ApiFilters = {}): Promise<any> => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.unit_id) params.append('unit_id', filters.unit_id)
      if (filters.month) params.append('month', filters.month)
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      if (filters.payment_status) params.append('payment_status', filters.payment_status)
      if (filters.payment_received_by) params.append('payment_received_by', filters.payment_received_by)
      if (filters.booking_source_id) params.append('booking_source_id', filters.booking_source_id)
      if (filters.invoiced !== undefined) params.append('invoiced', filters.invoiced.toString())
      
      const query = params.toString()
      return await apiClient<any>(`/api/bookings${query ? `?${query}` : ''}`)
    },
    
    createBooking: async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
      const result = await apiClient<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(booking)
      })
      const { invalidate } = useCache()
      invalidate('/api/bookings')
      invalidate('/api/analytics')
      return result
    },
    
    updateBooking: async (id: string, booking: Partial<Booking>): Promise<Booking> => {
      return await apiClient<Booking>(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(booking)
      })
    },
    
    deleteBooking: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/bookings/${id}`, { method: 'DELETE' })
    },
    
    // Expenses
    getExpenses: async (filters: any = {}): Promise<any> => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.unit_id) params.append('unit_id', filters.unit_id)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.paid_by) params.append('paid_by', filters.paid_by)
      if (filters.paid !== undefined) params.append('paid', filters.paid.toString())
      if (filters.billable !== undefined) params.append('billable', filters.billable.toString())
      if (filters.needs_review !== undefined) params.append('needs_review', filters.needs_review.toString())
      if (filters.month) params.append('month', filters.month)
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      if (filters.amount_min) params.append('amount_min', filters.amount_min.toString())
      if (filters.amount_max) params.append('amount_max', filters.amount_max.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      if (filters.start_date) params.append('date_from', filters.start_date)
      if (filters.end_date) params.append('date_to', filters.end_date)
      
      const query = params.toString()
      return await apiClient<any>(`/api/expenses${query ? `?${query}` : ''}`)
    },
    
    getDraftExpenses: async () => {
      return await apiClient<any>('/api/expenses/drafts')
    },
    
    quickCaptureExpense: async (receiptData: any) => {
      return await apiClient<any>('/api/expenses/quick-capture', {
        method: 'POST',
        body: JSON.stringify(receiptData)
      })
    },
    
    completeExpense: async (id: string, expenseData: any) => {
      return await apiClient<any>(`/api/expenses/${id}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(expenseData)
      })
    },
    
    createExpense: async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
      return await apiClient<Expense>('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
      })
    },
    
    updateExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
      return await apiClient<Expense>(`/api/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expense)
      })
    },
    
    deleteExpense: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/expenses/${id}`, { method: 'DELETE' })
    },
    
    // Analytics
    getPartnerEarnings: async (partnerId: string): Promise<number> => {
      const result = await apiClient<{ total_earnings: number }>(`/api/analytics/partner-earnings/${partnerId}`)
      return result.total_earnings
    },
    
    getPartnerExpenses: async (partnerId: string): Promise<number> => {
      const result = await apiClient<{ total_expenses: number }>(`/api/analytics/partner-expenses/${partnerId}`)
      return result.total_expenses
    },
    
    getDashboardMetrics: async (filters: { partner_id?: string, start_date?: string, end_date?: string } = {}) => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      
      const query = params.toString()
      return await apiClient<any>(`/api/analytics/dashboard${query ? `?${query}` : ''}`)
    },
    
    // Invoices - New Workflow
    // Admin only: Create draft invoice
    createDraftInvoice: async (partnerId: string, startDate: string, endDate: string) => {
      return await apiClient<any>('/api/invoices/draft', {
        method: 'POST',
        body: JSON.stringify({
          partner_id: partnerId,
          start_date: startDate,
          end_date: endDate
        })
      })
    },
    
    // Admin only: Refresh draft data
    refreshInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/refresh`, { method: 'PUT' })
    },
    
    // Partner only: Approve draft invoice
    approveInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/approve`, { method: 'PATCH' })
    },
    
    // Partner only: Reject draft invoice with notes
    rejectInvoice: async (invoiceId: string, notes: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ notes })
      })
    },
    
    // Admin only: Finalize invoice (bypass partner approval)
    finalizeInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/finalize`, { method: 'PUT' })
    },
    
    // Admin only: Send invoice
    sendInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/send`, { method: 'PUT' })
    },
    
    getInvoices: async (filters: any = {}) => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.status) params.append('status', filters.status)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      
      const query = params.toString()
      return await apiClient<any>(`/api/invoices${query ? `?${query}` : ''}`)
    },
    
    getArchivedInvoices: async (filters: any = {}) => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.status) params.append('status', filters.status)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      
      const query = params.toString()
      return await apiClient<any>(`/api/invoices/archive${query ? `?${query}` : ''}`)
    },
    
    getInvoiceById: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}`)
    },
    
    // Admin only: Mark as paid
    settleInvoice: async (invoiceId: string, paidDate: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/settle`, {
        method: 'PATCH',
        body: JSON.stringify({ paid_date: paidDate })
      })
    },
    
    deleteInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}`, { method: 'DELETE' })
    },
    
    cancelInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/cancel`, { method: 'PATCH' })
    },
    
    updateInvoice: async (invoiceId: string, data: any) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    
    // Journal Entries
    getJournalEntries: async (filters: any = {}): Promise<any> => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)
      
      const query = params.toString()
      return await apiClient<any>(`/api/journal-entries${query ? `?${query}` : ''}`)
    },
    
    createJournalEntry: async (data: any): Promise<any> => {
      return await apiClient<any>('/api/journal-entries', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    
    updateJournalEntry: async (id: string, data: any): Promise<any> => {
      return await apiClient<any>(`/api/journal-entries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
    
    settleJournalEntry: async (id: string, data: any): Promise<any> => {
      return await apiClient<any>(`/api/journal-entries/${id}/settle`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
    },
    
    deleteJournalEntry: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/journal-entries/${id}`, { method: 'DELETE' })
    },
    
    // Booking Stats
    getBookingStats: async (filters: {
      partner_id?: string
      unit_id?: string
      start_date?: string
      end_date?: string
    } = {}) => {
      const params = new URLSearchParams()
      if (filters.partner_id) params.append('partner_id', filters.partner_id)
      if (filters.unit_id) params.append('unit_id', filters.unit_id)
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      
      const query = params.toString()
      return await apiClient<any>(`/api/bookings/stats/summary${query ? `?${query}` : ''}`)
    },
    
    // Airbnb Import
    importAirbnbBookings: async (data: {
      partner_id: string
      unit_id: string
      csv_data: string
    }) => {
      const result = await apiClient<any>('/api/airbnb/import', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      const { invalidate } = useCache()
      invalidate('/api/bookings')
      invalidate('/api/analytics')
      return result
    },
    
    // File Upload
    uploadFile: async (file: File, folder: string = 'receipts') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      return await apiClient<{
        file_id: string
        public_url: string
        size: number
        provider: string
      }>('/api/files/upload', {
        method: 'POST',
        body: formData
      })
    },
    
    // Receipt Management
    quickCaptureReceipt: async (data: {
      receipt_url: string
      receipt_public_id: string
      notes?: string
    }) => {
      return await apiClient<any>('/api/expenses/quick-capture', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    
    completeExpenseReceipt: async (expenseId: string, details: {
      partner_id: string
      unit_id: string
      amount: string
      type: string
      paid_by?: string
    }) => {
      return await apiClient<any>(`/api/expenses/${expenseId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(details)
      })
    },
    
    // Users
    getUserList: async () => {
      return await apiClient<any>('/api/users/list')
    },
    
    createUser: async (userData: {
      email: string
      name: string
      role: string
      accessible_partners?: string[]
    }) => {
      return await apiClient<any>('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      })
    },
    
    regeneratePassword: async (userId: string) => {
      return await apiClient<any>(`/api/users/${userId}/regenerate-password`, { method: 'POST' })
    },
    
    deleteUser: async (userId: string) => {
      return await apiClient<any>(`/api/users/${userId}`, { method: 'DELETE' })
    },
    
    // Helpers
    getBookingTotal: (booking: Booking): number => {
      if (!booking) return 0
      const baseAmount = parseFloat(booking.base_amount) || 0
      const addonsTotal = booking.addons?.reduce((sum, addon) => sum + (addon.amount || 0), 0) || 0
      return baseAmount + addonsTotal
    }
  }
}
import type { Partner, Unit, Booking, Expense, BookingSource, Service, ApiFilters, PaginatedResponse } from '~/types/api'

export interface JournalEntry {
  id: string
  partner_id: string
  date: string              // YYYY-MM-DD
  type: 'credit' | 'debit'
  amount: string            // "500.00"
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

const getApiBaseUrl = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl
  console.log('🔗 API Base URL:', baseUrl)
  return baseUrl
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const { $api } = useNuxtApp()
    const separator = endpoint.includes('?') ? '&' : '?'
    const url = `${endpoint}${separator}_t=${Date.now()}`
    console.log('🌐 Making API request to:', url)
    
    const response = await $api(url, {
      ...options,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers
      }
    })
    
    console.log('📊 API Response:', response)
    return response.success ? response.data : [] as T
  } catch (error) {
    console.log('❌ API Error:', error)
    return (endpoint.includes('dashboard') ? { metrobnb_revenue: '0', partner_revenue: '0', metrobnb_expenses: '0', net_profit: '0', partner_count: 0, revenue_by_partner: [], expense_breakdown: [], monthly_trend: [], recent_bookings: [], recent_expenses: [] } : []) as T
  }
}

export const useApi = () => {
  // Services API
  const getServices = async (): Promise<Service[]> => {
    return await apiClient<Service[]>('/api/services')
  }

  const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
    return await apiClient<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(service)
    })
  }

  const updateService = async (id: string, service: Partial<Service>): Promise<Service> => {
    return await apiClient<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service)
    })
  }

  const deleteService = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/services/${id}`, { method: 'DELETE' })
  }

  // Partners API
  const getPartners = async (): Promise<Partner[]> => {
    return await apiClient<Partner[]>('/api/partners')
  }

  const getPartnerById = async (id: string): Promise<Partner> => {
    return await apiClient<Partner>(`/api/partners/${id}`)
  }

  const createPartner = async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'> & { service_ids: string[] }): Promise<Partner> => {
    const result = await apiClient<Partner>('/api/partners', {
      method: 'POST',
      body: JSON.stringify(partner)
    })
    // Invalidate partners cache
    const { invalidate } = useCache()
    invalidate('/api/partners')
    return result
  }

  const updatePartner = async (id: string, partner: Partial<Partner> & { service_ids?: string[] }): Promise<Partner> => {
    const result = await apiClient<Partner>(`/api/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner)
    })
    // Invalidate partners cache
    const { invalidate } = useCache()
    invalidate('/api/partners')
    return result
  }

  const deletePartner = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/partners/${id}`, { method: 'DELETE' })
  }

  // Units API
  const getUnits = async (): Promise<Unit[]> => {
    return await apiClient<Unit[]>('/api/units')
  }

  const getUnitsByPartner = async (partnerId: string): Promise<Unit[]> => {
    return await apiClient<Unit[]>(`/api/partners/${partnerId}/units`)
  }

  const createUnit = async (unit: Omit<Unit, 'id' | 'created_at' | 'updated_at'>): Promise<Unit> => {
    const result = await apiClient<Unit>('/api/units', {
      method: 'POST',
      body: JSON.stringify(unit)
    })
    // Invalidate units cache
    const { invalidate } = useCache()
    invalidate('/api/units')
    return result
  }

  const updateUnit = async (id: string, unit: Partial<Unit>): Promise<Unit> => {
    return await apiClient<Unit>(`/api/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(unit)
    })
  }

  const deleteUnit = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/units/${id}`, { method: 'DELETE' })
  }

  // Booking Sources API
  const getBookingSources = async (): Promise<BookingSource[]> => {
    return await apiClient<BookingSource[]>('/api/booking-sources')
  }

  const createBookingSource = async (source: Omit<BookingSource, 'id' | 'created_at' | 'updated_at'>): Promise<BookingSource> => {
    return await apiClient<BookingSource>('/api/booking-sources', {
      method: 'POST',
      body: JSON.stringify(source)
    })
  }

  const updateBookingSource = async (id: string, source: Partial<BookingSource>): Promise<BookingSource> => {
    return await apiClient<BookingSource>(`/api/booking-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(source)
    })
  }

  const deleteBookingSource = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/booking-sources/${id}`, { method: 'DELETE' })
  }

  // Payment Methods API
  const getPaymentMethods = async () => {
    return await apiClient<Array<{
      id: string
      name: string
      is_active: boolean
      created_at: string
      updated_at: string
    }>>('/api/payment-methods')
  }

  // Bookings API
  const getBookings = async (filters: ApiFilters = {}): Promise<Booking[] | PaginatedResponse<Booking> & { summary?: any }> => {
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
    if (filters.invoiced !== undefined) params.append('invoiced', filters.invoiced.toString())
    
    const query = params.toString()
    const result = await apiClient<any>(`/api/bookings${query ? `?${query}` : ''}`)
    
    // If pagination params are provided, return paginated response with summary
    if (filters.page || filters.limit) {
      return {
        data: result.items || result,
        pagination: result.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: Array.isArray(result) ? result.length : 0,
          per_page: filters.limit || 10,
          has_next: false,
          has_prev: false
        },
        summary: result.summary || null
      } as PaginatedResponse<Booking> & { summary?: any }
    }
    
    // Otherwise return simple array for backward compatibility
    return Array.isArray(result) ? result : result.items || result || []
  }

  const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
    const result = await apiClient<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    })
    // Invalidate bookings cache (affects dashboard and booking lists)
    const { invalidate } = useCache()
    invalidate('/api/bookings')
    invalidate('/api/analytics')
    return result
  }

  const updateBooking = async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    return await apiClient<Booking>(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking)
    })
  }

  const deleteBooking = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/bookings/${id}`, { method: 'DELETE' })
  }

  // Expenses API
  const getExpenses = async (filters: ApiFilters = {}): Promise<Expense[] | PaginatedResponse<Expense>> => {
    const params = new URLSearchParams()
    if (filters.partner_id) params.append('partner_id', filters.partner_id)
    if (filters.unit_id) params.append('unit_id', filters.unit_id)
    if (filters.month) params.append('month', filters.month)
    if (filters.start_date) params.append('start_date', filters.start_date)
    if (filters.end_date) params.append('end_date', filters.end_date)
    if (filters.type) params.append('type', filters.type)
    if (filters.billable !== undefined) params.append('billable', filters.billable.toString())
    if (filters.paid !== undefined) params.append('paid', filters.paid.toString())
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.sort_by) params.append('sort_by', filters.sort_by)
    if (filters.sort_order) params.append('sort_order', filters.sort_order)
    
    const query = params.toString()
    const result = await apiClient<any>(`/api/expenses${query ? `?${query}` : ''}`)
    
    // If pagination params are provided, return paginated response
    if (filters.page || filters.limit) {
      return {
        data: result.items || result,
        pagination: result.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: Array.isArray(result) ? result.length : 0,
          per_page: filters.limit || 10,
          has_next: false,
          has_prev: false
        }
      } as PaginatedResponse<Expense>
    }
    
    // Otherwise return simple array for backward compatibility
    return Array.isArray(result) ? result : result.items || result || []
  }

  const createExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
    return await apiClient<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    })
  }

  const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    return await apiClient<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense)
    })
  }

  const deleteExpense = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/expenses/${id}`, { method: 'DELETE' })
  }

  // Analytics API
  const getPartnerEarnings = async (partnerId: string): Promise<number> => {
    const result = await apiClient<{ total_earnings: number }>(`/api/analytics/partner-earnings/${partnerId}`)
    return result.total_earnings
  }

  const getPartnerExpenses = async (partnerId: string): Promise<number> => {
    const result = await apiClient<{ total_expenses: number }>(`/api/analytics/partner-expenses/${partnerId}`)
    return result.total_expenses
  }

  const getDashboardMetrics = async (filters: { partner_id?: string, start_date?: string, end_date?: string } = {}) => {
    const params = new URLSearchParams()
    if (filters.partner_id) params.append('partner_id', filters.partner_id)
    if (filters.start_date) params.append('start_date', filters.start_date)
    if (filters.end_date) params.append('end_date', filters.end_date)
    
    const query = params.toString()
    return await apiClient<{
      metrobnb_revenue: string
      partner_revenue: string
      metrobnb_expenses: string
      net_profit: string
      partner_count: number
      revenue_by_partner: Array<{
        partner_id: string
        partner_name: string
        revenue: string
        metrobnb_share_percentage: string
        metrobnb_share_computed: string
        actual_invoice: string
      }>
      expense_breakdown: Array<{
        type: string
        amount: string
      }>
      monthly_trend: Array<{
        month: string
        metrobnb_revenue: string
      }>
      recent_bookings: Array<{
        id: string
        guest_name: string
        unit_name: string
        partner_name: string
        total_amount: string
        booking_date: string
        created_at: string
      }>
      recent_expenses: Array<{
        id: string
        type: string
        unit_name: string
        partner_name: string
        amount: string
        paid: boolean
        date: string
        created_at: string
      }>

    }>(`/api/analytics/dashboard${query ? `?${query}` : ''}`)
  }

  const generateInvoice = async (partnerId: string, startDate: string, endDate: string) => {
    return await apiClient<{
      id: string
      invoice_number: string
      partner_name: string
      share_percentage: number
      period: string
      status: 'pending' | 'paid' | 'cancelled'
      bookings: Array<{
        id: string
        date: string
        end_date: string
        guest_name: string
        unit_name: string
        booking_source_name: string
        base_amount: string
        addons_total: string
        total_amount: string
        payment_received_by: string
        booking_status: string
      }>
      expenses: Array<{
        id: string
        date: string
        unit_name: string
        type: string
        amount: string
        notes: string
        paid: boolean
      }>
      journal_entries: Array<{
        id: string
        date: string
        type: 'credit' | 'debit'
        description: string
        reference: string
        amount: string
      }>
      summary: {
        total_gross_earnings: string
        metrobnb_share: string
        total_expenses: string
        total_received_by_metrobnb: string
        net_journal_entries: string
        net_due: string
      }
    }>('/api/invoices/generate', {
      method: 'POST',
      body: JSON.stringify({
        partner_id: partnerId,
        start_date: startDate,
        end_date: endDate
      })
    })
  }

  // Journal Entries API (no transformation - keep snake_case)
  const getJournalEntries = async (filters: any = {}): Promise<any> => {
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
    
    try {
      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/api/journal-entries${query ? `?${query}` : ''}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'API request failed')
      }
      
      return result
    } catch (error) {
      console.error('Journal entries API error:', error)
      return { data: [] }
    }
  }

  const createJournalEntry = async (data: any): Promise<any> => {
    return await apiClient<any>('/api/journal-entries', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  const updateJournalEntry = async (id: string, data: any): Promise<any> => {
    return await apiClient<any>(`/api/journal-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  const settleJournalEntry = async (id: string, data: any): Promise<any> => {
    return await apiClient<any>(`/api/journal-entries/${id}/settle`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  const deleteJournalEntry = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/journal-entries/${id}`, { method: 'DELETE' })
  }

  // Booking Stats API
  const getBookingStats = async (filters: {
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
    return await apiClient<{
      total_bookings: number
      total_amount: string
      by_source: Array<{
        source_name: string
        count: number
        amount: string
      }>
      by_payment_receiver: {
        metrobnb: {
          count: number
          amount: string
        }
        partner: {
          count: number
          amount: string
        }
      }
    }>(`/api/bookings/stats/summary${query ? `?${query}` : ''}`)
  }

  // Airbnb Import API
  const importAirbnbBookings = async (data: {
    partner_id: string
    unit_id: string
    csv_data: string
  }) => {
    const result = await apiClient<{
      success: boolean
      imported_count: number
      skipped_count: number
      errors: string[]
      bookings_created: string[]
    }>('/api/airbnb/import', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    // Invalidate bookings cache after import
    const { invalidate } = useCache()
    invalidate('/api/bookings')
    invalidate('/api/analytics')
    return result
  }

  // Helper function for booking total (client-side calculation)
  const getBookingTotal = (booking: Booking): number => {
    if (!booking) return 0
    const baseAmount = parseFloat(booking.base_amount) || 0
    const addonsTotal = booking.addons?.reduce((sum, addon) => sum + (addon.amount || 0), 0) || 0
    return baseAmount + addonsTotal
  }

  return {
    // Services
    getServices,
    createService,
    updateService,
    deleteService,
    
    // Partners
    getPartners,
    getPartnerById,
    createPartner,
    updatePartner,
    deletePartner,
    
    // Units
    getUnits,
    getUnitsByPartner,
    createUnit,
    updateUnit,
    deleteUnit,
    
    // Booking Sources
    getBookingSources,
    createBookingSource,
    updateBookingSource,
    deleteBookingSource,
    
    // Payment Methods
    getPaymentMethods,
    
    // Bookings
    getBookings,
    getBookingStats,
    createBooking,
    updateBooking,
    deleteBooking,
    importAirbnbBookings,
    
    // Expenses
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    
    // Analytics
    getPartnerEarnings,
    getPartnerExpenses,
    getDashboardMetrics,
    
    // Journal Entries
    getJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    settleJournalEntry,
    deleteJournalEntry,
    
    // Invoices
    generateInvoice,
    getInvoices: async (partnerId?: string, status?: string) => {
      const params = new URLSearchParams()
      if (partnerId) params.append('partner_id', partnerId)
      if (status) params.append('status', status)
      return await apiClient<any[]>(`/api/invoices?${params}`)
    },
    getArchivedInvoices: async (partnerId?: string) => {
      const params = new URLSearchParams()
      if (partnerId) params.append('partner_id', partnerId)
      return await apiClient<any[]>(`/api/invoices/archive?${params}`)
    },
    getInvoiceById: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}`)
    },
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
    regenerateInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/regenerate`, { method: 'POST' })
    },
    updateInvoice: async (invoiceId: string, data: any) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
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
    
    getDraftExpenses: async () => {
      return await apiClient<any>('/api/expenses/drafts')
    },
    
    completeExpense: async (expenseId: string, details: {
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
    
    // Helpers
    getBookingTotal,
    getArchivedInvoices: async (partnerId?: string) => {
      const params = new URLSearchParams()
      if (partnerId) params.append('partner_id', partnerId)
      return await apiClient<any[]>(`/api/invoices/archive?${params}`)
    }
  }
}
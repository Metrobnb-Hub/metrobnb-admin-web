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
  return config.public.apiBaseUrl
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

// API client without transformations - keep snake_case
const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const result: ApiResponse<T> = await response.json()

  if (!result.success) {
    throw new Error(result.error?.message || 'API request failed')
  }

  return result.data as T
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
    const params = new URLSearchParams({
      partner_id: partnerId,
      start_date: startDate,
      end_date: endDate,
      paid: 'false' // Only include unpaid expenses in invoice
    })
    
    return await apiClient<{
      partner_name: string
      period: string
      share_percentage: number
      total_income: number
      metrobnb_share: number
      total_expenses: number
      metrobnb_payments: number
      net_due: number
      bookings: {
        metrobnb_received: any[]
        partner_received: any[]
      }
      expenses: any[]
    }>(`/api/analytics/invoices/generate?${params.toString()}`, { method: 'POST' })
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
    
    // Direct fetch without transformation
    const baseUrl = getApiBaseUrl()
    const response = await fetch(`${baseUrl}/api/journal-entries${query ? `?${query}` : ''}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error?.message || 'API request failed')
    }
    
    return result // Return raw response without transformation
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
    generateInvoice,
    
    // Journal Entries
    getJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    settleJournalEntry,
    deleteJournalEntry,
    
    // Helpers
    getBookingTotal
  }
}
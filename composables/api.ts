import type { Partner, Unit, Booking, Expense, BookingSource, Service, ApiFilters, PaginatedResponse } from '~/types/api'

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

// Transform snake_case to camelCase
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Transform camelCase to snake_case
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      result[snakeKey] = toSnakeCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// API client with error handling
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

  return toCamelCase(result.data) as T
}

export const useApi = () => {
  // Services API
  const getServices = async (): Promise<Service[]> => {
    return await apiClient<Service[]>('/api/services')
  }

  const createService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
    return await apiClient<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(toSnakeCase(service))
    })
  }

  const updateService = async (id: string, service: Partial<Service>): Promise<Service> => {
    return await apiClient<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnakeCase(service))
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

  const createPartner = async (partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'> & { serviceIds: string[] }): Promise<Partner> => {
    return await apiClient<Partner>('/api/partners', {
      method: 'POST',
      body: JSON.stringify({
        name: partner.name,
        email: partner.email,
        share_percentage: partner.sharePercentage,
        service_ids: partner.serviceIds
      })
    })
  }

  const updatePartner = async (id: string, partner: Partial<Partner> & { serviceIds?: string[] }): Promise<Partner> => {
    const payload: any = {}
    if (partner.name) payload.name = partner.name
    if (partner.email) payload.email = partner.email
    if (partner.sharePercentage) payload.share_percentage = partner.sharePercentage
    if (partner.serviceIds) payload.service_ids = partner.serviceIds
    
    return await apiClient<Partner>(`/api/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
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

  const createUnit = async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> => {
    return await apiClient<Unit>('/api/units', {
      method: 'POST',
      body: JSON.stringify(toSnakeCase(unit))
    })
  }

  const updateUnit = async (id: string, unit: Partial<Unit>): Promise<Unit> => {
    return await apiClient<Unit>(`/api/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnakeCase(unit))
    })
  }

  const deleteUnit = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/units/${id}`, { method: 'DELETE' })
  }

  // Booking Sources API
  const getBookingSources = async (): Promise<BookingSource[]> => {
    return await apiClient<BookingSource[]>('/api/booking-sources')
  }

  const createBookingSource = async (source: Omit<BookingSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookingSource> => {
    return await apiClient<BookingSource>('/api/booking-sources', {
      method: 'POST',
      body: JSON.stringify(toSnakeCase(source))
    })
  }

  const updateBookingSource = async (id: string, source: Partial<BookingSource>): Promise<BookingSource> => {
    return await apiClient<BookingSource>(`/api/booking-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnakeCase(source))
    })
  }

  const deleteBookingSource = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/booking-sources/${id}`, { method: 'DELETE' })
  }

  // Bookings API
  const getBookings = async (filters: ApiFilters = {}): Promise<Booking[] | PaginatedResponse<Booking>> => {
    const params = new URLSearchParams()
    if (filters.partnerId) params.append('partner_id', filters.partnerId)
    if (filters.unitId) params.append('unit_id', filters.unitId)
    if (filters.month) params.append('month', filters.month)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.sortBy) params.append('sort_by', filters.sortBy)
    if (filters.sortOrder) params.append('sort_order', filters.sortOrder)
    
    const query = params.toString()
    const result = await apiClient<any>(`/api/bookings${query ? `?${query}` : ''}`)
    
    // If pagination params are provided, return paginated response
    if (filters.page || filters.limit) {
      // The result is already transformed by toCamelCase in apiClient
      return {
        data: result.items || result,
        pagination: result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: Array.isArray(result) ? result.length : 0,
          perPage: filters.limit || 10,
          hasNext: false,
          hasPrev: false
        }
      } as PaginatedResponse<Booking>
    }
    
    // Otherwise return simple array for backward compatibility
    return Array.isArray(result) ? result : result.items || result || []
  }

  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    return await apiClient<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(toSnakeCase(booking))
    })
  }

  const updateBooking = async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    return await apiClient<Booking>(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnakeCase(booking))
    })
  }

  const deleteBooking = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/bookings/${id}`, { method: 'DELETE' })
  }

  // Expenses API
  const getExpenses = async (filters: ApiFilters = {}): Promise<Expense[]> => {
    const params = new URLSearchParams()
    if (filters.partnerId) params.append('partner_id', filters.partnerId)
    if (filters.unitId) params.append('unit_id', filters.unitId)
    if (filters.month) params.append('month', filters.month)
    
    const query = params.toString()
    return await apiClient<Expense[]>(`/api/expenses${query ? `?${query}` : ''}`)
  }

  const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    return await apiClient<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(toSnakeCase(expense))
    })
  }

  const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    return await apiClient<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toSnakeCase(expense))
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

  const getDashboardMetrics = async () => {
    return await apiClient<{
      total_partners: number
      total_bookings: number
      total_revenue: number
      total_expenses: number
      net_profit: number
    }>('/api/analytics/dashboard')
  }

  const generateInvoice = async (partnerId: string, startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      partner_id: partnerId,
      start_date: startDate,
      end_date: endDate
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

  // Helper function for booking total (client-side calculation)
  const getBookingTotal = (booking: Booking): number => {
    if (!booking) return 0
    const baseAmount = parseFloat(booking.baseAmount) || 0
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
    
    // Bookings
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    
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
    
    // Helpers
    getBookingTotal
  }
}
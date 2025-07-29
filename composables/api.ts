import type { Partner, Unit, Booking, Expense, BookingSource, ApiFilters } from '~/types/api'

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

  return result.data as T
}

export const useApi = () => {
  // Partners API
  const getPartners = async (): Promise<Partner[]> => {
    return await apiClient<Partner[]>('/api/partners')
  }

  const getPartnerById = async (id: string): Promise<Partner> => {
    return await apiClient<Partner>(`/api/partners/${id}`)
  }

  const createPartner = async (partner: Omit<Partner, 'id' | 'createdAt'>): Promise<Partner> => {
    return await apiClient<Partner>('/api/partners', {
      method: 'POST',
      body: JSON.stringify({
        name: partner.name,
        email: partner.email,
        share_percentage: partner.sharePercentage,
        services: partner.services
      })
    })
  }

  const updatePartner = async (id: string, partner: Partial<Partner>): Promise<Partner> => {
    return await apiClient<Partner>(`/api/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: partner.name,
        email: partner.email,
        share_percentage: partner.sharePercentage,
        services: partner.services
      })
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

  const createUnit = async (unit: Omit<Unit, 'id' | 'createdAt'>): Promise<Unit> => {
    return await apiClient<Unit>('/api/units', {
      method: 'POST',
      body: JSON.stringify({
        name: unit.name,
        partner_id: unit.partnerId,
        location: unit.location,
        notes: unit.notes
      })
    })
  }

  const updateUnit = async (id: string, unit: Partial<Unit>): Promise<Unit> => {
    return await apiClient<Unit>(`/api/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: unit.name,
        partner_id: unit.partnerId,
        location: unit.location,
        notes: unit.notes
      })
    })
  }

  const deleteUnit = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/units/${id}`, { method: 'DELETE' })
  }

  // Booking Sources API
  const getBookingSources = async (): Promise<BookingSource[]> => {
    const sources = await apiClient<BookingSource[]>('/api/booking-sources')
    return sources.map(source => ({
      ...source,
      commissionRate: source.commissionRate ? source.commissionRate * 100 : 0
    }))
  }

  const createBookingSource = async (source: Omit<BookingSource, 'id' | 'createdAt'>): Promise<BookingSource> => {
    const result = await apiClient<BookingSource>('/api/booking-sources', {
      method: 'POST',
      body: JSON.stringify({
        name: source.name,
        commission_rate: source.commissionRate ? source.commissionRate / 100 : 0,
        is_active: source.isActive
      })
    })
    return {
      ...result,
      commissionRate: result.commissionRate ? result.commissionRate * 100 : 0
    }
  }

  const updateBookingSource = async (id: string, source: Partial<BookingSource>): Promise<BookingSource> => {
    const result = await apiClient<BookingSource>(`/api/booking-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: source.name,
        commission_rate: source.commissionRate ? source.commissionRate / 100 : undefined,
        is_active: source.isActive
      })
    })
    return {
      ...result,
      commissionRate: result.commissionRate ? result.commissionRate * 100 : 0
    }
  }

  const deleteBookingSource = async (id: string): Promise<void> => {
    await apiClient<void>(`/api/booking-sources/${id}`, { method: 'DELETE' })
  }

  // Bookings API
  const getBookings = async (filters: ApiFilters = {}): Promise<Booking[]> => {
    const params = new URLSearchParams()
    if (filters.partnerId) params.append('partner_id', filters.partnerId)
    if (filters.unitId) params.append('unit_id', filters.unitId)
    if (filters.month) params.append('month', filters.month)
    
    const query = params.toString()
    return await apiClient<Booking[]>(`/api/bookings${query ? `?${query}` : ''}`)
  }

  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    return await apiClient<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        guest_name: booking.guestName,
        date: booking.date,
        base_amount: booking.baseAmount,
        addons: booking.addons,
        unit_id: booking.unitId,
        partner_id: booking.partnerId,
        payment_status: booking.paymentStatus,
        booking_status: booking.bookingStatus,
        amount_paid: booking.amountPaid,
        payment_method: booking.paymentMethod,
        payment_received_by: booking.paymentReceivedBy,
        booking_source_id: booking.bookingSourceId,
        notes: booking.notes
      })
    })
  }

  const updateBooking = async (id: string, booking: Partial<Booking>): Promise<Booking> => {
    return await apiClient<Booking>(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        guest_name: booking.guestName,
        date: booking.date,
        base_amount: booking.baseAmount,
        addons: booking.addons,
        unit_id: booking.unitId,
        partner_id: booking.partnerId,
        payment_status: booking.paymentStatus,
        booking_status: booking.bookingStatus,
        amount_paid: booking.amountPaid,
        payment_method: booking.paymentMethod,
        payment_received_by: booking.paymentReceivedBy,
        booking_source_id: booking.bookingSourceId,
        notes: booking.notes
      })
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

  const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    return await apiClient<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify({
        partner_id: expense.partnerId,
        unit_id: expense.unitId,
        date: expense.date,
        type: expense.type,
        amount: expense.amount,
        notes: expense.notes
      })
    })
  }

  const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    return await apiClient<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        partner_id: expense.partnerId,
        unit_id: expense.unitId,
        date: expense.date,
        type: expense.type,
        amount: expense.amount,
        notes: expense.notes
      })
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
    const addonsTotal = booking.addons.reduce((sum, addon) => sum + addon.amount, 0)
    return booking.baseAmount + addonsTotal
  }

  return {
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
import type {
  Partner,
  Unit,
  Booking,
  Expense,
  BookingSource,
  Service,
  ApiFilters,
  PaginatedResponse,
  BookingFilters,
  ExpenseFilters,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CreateBookingRequest,
  UpdateBookingRequest,
  CreatePartnerRequest,
  UpdatePartnerRequest
} from '~/types/api'
import { apiClient } from './api/apiClient'
import { usePartnerApi } from './api/usePartnerApi'
import { useBookingApi } from './api/useBookingApi'
import { useExpenseApi } from './api/useExpenseApi'

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
    
    // Partners - Now using usePartnerApi composable
    ...usePartnerApi(),
    
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
      const { invalidateCache } = useUnifiedCache()
      invalidateCache('units')
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
    
    // Bookings - Now using useBookingApi composable
    ...useBookingApi(),
    
    // Expenses - Now using useExpenseApi composable
    ...useExpenseApi(),
    
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
      return await apiClient<any>(`/api/invoices/${query ? `?${query}` : ''}`)
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

    regenerateInvoice: async (invoiceId: string) => {
      return await apiClient<any>(`/api/invoices/${invoiceId}/regenerate`, { method: 'POST' })
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
      const { invalidateCache } = useUnifiedCache()
      invalidateCache() // Clear all cache since bookings affect multiple resources
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
      return await apiClient<any>('/api/users/', {
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

    updateUser: async (userId: string, userData: {
      name?: string
      email?: string
      role?: string
      active?: boolean
      accessible_partners?: string[]
    }) => {
      return await apiClient<any>(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(userData)
      })
    },

    // Reports
    getEarningsSummary: async (startDate: string, endDate: string, organizationId?: string) => {
      const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
      if (organizationId) params.append('organization_id', organizationId)
      
      return await apiClient<any>(`/api/reports/earnings-summary?${params.toString()}`)
    },

    getCurrentMonthEarnings: async (organizationId?: string) => {
      const params = new URLSearchParams()
      if (organizationId) params.append('organization_id', organizationId)
      
      return await apiClient<any>(`/api/reports/earnings-summary/current-month${params.toString() ? `?${params.toString()}` : ''}`)
    },

    getLastMonthEarnings: async (organizationId?: string) => {
      const params = new URLSearchParams()
      if (organizationId) params.append('organization_id', organizationId)
      
      return await apiClient<any>(`/api/reports/earnings-summary/last-month${params.toString() ? `?${params.toString()}` : ''}`)
    },
  }
}
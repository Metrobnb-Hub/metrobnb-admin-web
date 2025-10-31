// Enhanced API composable using the typed client
import type {
  PartnerResponse,
  UnitResponse,
  BookingResponse,
  ExpenseResponse,
  ServiceResponse,
  PaymentMethodResponse,
  BookingSourceResponse,
  JournalEntryResponse,
  InvoiceWithItems,
  DashboardMetrics
} from '~/types/generated-api'

export const useTypedApiWrapper = () => {
  const typedClient = useTypedApi()
  const { handleApiError } = useErrorHandler()

  // Partners
  const getPartners = async () => {
    try {
      const response = await typedClient.getPartners()
      return response.success ? response.data : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const getPartnerById = async (id: string): Promise<PartnerResponse | null> => {
    try {
      const response = await typedClient.getPartner(id)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const createPartner = async (data: any): Promise<PartnerResponse | null> => {
    try {
      const response = await typedClient.createPartner(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const updatePartner = async (id: string, data: any): Promise<PartnerResponse | null> => {
    try {
      const response = await typedClient.updatePartner(id, data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const deletePartner = async (id: string): Promise<boolean> => {
    try {
      const response = await typedClient.deletePartner(id)
      return response.success
    } catch (error) {
      handleApiError(error)
      return false
    }
  }

  // Units
  const getUnits = async (): Promise<UnitResponse[]> => {
    try {
      const response = await typedClient.getUnits()
      return response.success ? (Array.isArray(response.data) ? response.data : response.data?.items || []) : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const createUnit = async (data: any): Promise<UnitResponse | null> => {
    try {
      const response = await typedClient.createUnit(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const updateUnit = async (id: string, data: any): Promise<UnitResponse | null> => {
    try {
      const response = await typedClient.updateUnit(id, data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const deleteUnit = async (id: string): Promise<boolean> => {
    try {
      const response = await typedClient.deleteUnit(id)
      return response.success
    } catch (error) {
      handleApiError(error)
      return false
    }
  }

  // Bookings
  const getBookings = async (filters?: any): Promise<BookingResponse[]> => {
    try {
      const response = await typedClient.getBookings(filters)
      return response.success ? (Array.isArray(response.data) ? response.data : response.data?.items || []) : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const createBooking = async (data: any): Promise<BookingResponse | null> => {
    try {
      const response = await typedClient.createBooking(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const updateBooking = async (id: string, data: any): Promise<BookingResponse | null> => {
    try {
      const response = await typedClient.updateBooking(id, data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const deleteBooking = async (id: string): Promise<boolean> => {
    try {
      const response = await typedClient.deleteBooking(id)
      return response.success
    } catch (error) {
      handleApiError(error)
      return false
    }
  }

  // Expenses
  const getExpenses = async (filters?: any): Promise<ExpenseResponse[]> => {
    try {
      const response = await typedClient.getExpenses(filters)
      return response.success ? (Array.isArray(response.data) ? response.data : response.data?.items || []) : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const createExpense = async (data: any): Promise<ExpenseResponse | null> => {
    try {
      const response = await typedClient.createExpense(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const updateExpense = async (id: string, data: any): Promise<ExpenseResponse | null> => {
    try {
      const response = await typedClient.updateExpense(id, data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      const response = await typedClient.deleteExpense(id)
      return response.success
    } catch (error) {
      handleApiError(error)
      return false
    }
  }

  // Services
  const getServices = async (): Promise<ServiceResponse[]> => {
    try {
      const response = await typedClient.getServices()
      return response.success ? response.data || [] : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Payment Methods
  const getPaymentMethods = async (): Promise<PaymentMethodResponse[]> => {
    try {
      const response = await typedClient.getPaymentMethods()
      return response.success ? response.data || [] : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Booking Sources
  const getBookingSources = async (): Promise<BookingSourceResponse[]> => {
    try {
      const response = await typedClient.getBookingSources()
      return response.success ? response.data || [] : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Journal Entries
  const getJournalEntries = async (filters?: any): Promise<JournalEntryResponse[]> => {
    try {
      const response = await typedClient.getJournalEntries(filters)
      return response.success ? (Array.isArray(response.data) ? response.data : response.data?.items || []) : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const createJournalEntry = async (data: any): Promise<JournalEntryResponse | null> => {
    try {
      const response = await typedClient.createJournalEntry(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  // Invoices
  const getInvoices = async (filters?: any) => {
    try {
      const response = await typedClient.getInvoices(filters)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const getInvoice = async (id: string): Promise<InvoiceWithItems | null> => {
    try {
      const response = await typedClient.getInvoice(id)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const generateInvoice = async (data: any): Promise<InvoiceWithItems | null> => {
    try {
      const response = await typedClient.generateInvoice(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  // Analytics
  const getDashboardMetrics = async (filters?: any): Promise<DashboardMetrics | null> => {
    try {
      const response = await typedClient.getDashboardMetrics(filters)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  const getPartnerInvoiceMetrics = async (partnerId: string, filters?: any) => {
    try {
      const response = await typedClient.getPartnerInvoiceMetrics(partnerId, filters)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  // Authentication
  const login = async (credentials: any) => {
    try {
      const response = await typedClient.login(credentials)
      return response
    } catch (error) {
      handleApiError(error)
      return { success: false, error: error.message }
    }
  }

  const register = async (data: any) => {
    try {
      const response = await typedClient.register(data)
      return response
    } catch (error) {
      handleApiError(error)
      return { success: false, error: error.message }
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await typedClient.getCurrentUser()
      return response
    } catch (error) {
      handleApiError(error)
      return { success: false, error: error.message }
    }
  }

  const refreshToken = async (token: string) => {
    try {
      const response = await typedClient.refreshToken(token)
      return response
    } catch (error) {
      handleApiError(error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      const response = await typedClient.logout()
      return response
    } catch (error) {
      handleApiError(error)
      return { success: false, error: error.message }
    }
  }

  // File Upload
  const uploadFile = async (file: File, folder?: string) => {
    try {
      const response = await typedClient.uploadFile(file, folder)
      return response
    } catch (error) {
      handleApiError(error)
      return { success: false, error: error.message }
    }
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
    createUnit,
    updateUnit,
    deleteUnit,
    
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
    
    // Services
    getServices,
    
    // Payment Methods
    getPaymentMethods,
    
    // Booking Sources
    getBookingSources,
    
    // Journal Entries
    getJournalEntries,
    createJournalEntry,
    
    // Invoices
    getInvoices,
    getInvoice,
    generateInvoice,
    
    // Analytics
    getDashboardMetrics,
    getPartnerInvoiceMetrics,
    
    // Authentication
    login,
    register,
    getCurrentUser,
    refreshToken,
    logout,
    
    // File Upload
    uploadFile,
    
    // Direct access to typed client
    client: typedClient
  }
}

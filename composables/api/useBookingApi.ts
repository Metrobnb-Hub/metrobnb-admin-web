import type {
  Booking,
  BookingFilters,
  CreateBookingRequest,
  UpdateBookingRequest,
  PaginatedResponse
} from '~/types/api'
import { apiClient } from './apiClient'

/**
 * Booking API composable
 * Handles all booking-related API operations
 */
export const useBookingApi = () => {
  return {
    /**
     * Get bookings with optional filters
     * @param filters - Optional filters for bookings
     * @returns Promise<PaginatedResponse<Booking> | Booking[]>
     */
    getBookings: async (filters: BookingFilters = {}): Promise<PaginatedResponse<Booking> | Booking[]> => {
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

    /**
     * Create a new booking
     * @param booking - Booking data
     * @returns Promise<Booking>
     */
    createBooking: async (booking: CreateBookingRequest): Promise<Booking> => {
      const result = await apiClient<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(booking)
      })
      const { invalidateCache } = useUnifiedCache()
      invalidateCache() // Clear all cache since bookings affect multiple resources
      return result
    },

    /**
     * Update an existing booking
     * @param id - Booking ID
     * @param booking - Partial booking data to update
     * @returns Promise<Booking>
     */
    updateBooking: async (id: string, booking: UpdateBookingRequest): Promise<Booking> => {
      return await apiClient<Booking>(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(booking)
      })
    },

    /**
     * Delete a booking
     * @param id - Booking ID
     * @returns Promise<void>
     */
    deleteBooking: async (id: string): Promise<void> => {
      await apiClient<void>(`/api/bookings/${id}`, { method: 'DELETE' })
    },

    /**
     * Get booking statistics
     * @param filters - Optional filters
     * @returns Promise<any>
     */
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

    /**
     * Calculate total amount for a booking including addons
     * @param booking - Booking object
     * @returns number - Total amount
     */
    getBookingTotal: (booking: Booking): number => {
      if (!booking) return 0
      const baseAmount = parseFloat(booking.base_amount) || 0
      const addonsTotal = booking.addons?.reduce((sum, addon) => sum + (addon.amount || 0), 0) || 0
      return baseAmount + addonsTotal
    }
  }
}

import type { Booking } from '~/types/api'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    booking: Booking
    unitName: string
    partnerName: string
  }
}

export const useCalendarEvents = () => {
  const { units, partners } = useDataManager()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981' // emerald-500
      case 'canceled': return '#ef4444'  // red-500
      case 'refunded': return '#f59e0b'  // amber-500
      default: return '#6b7280'          // gray-500
    }
  }

  const getPaymentBorderColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'fully_paid': return '#059669'  // emerald-600
      case 'partial': return '#d97706'     // amber-600
      case 'unpaid': return '#dc2626'      // red-600
      default: return '#6b7280'            // gray-500
    }
  }

  const getTextColor = (status: string) => {
    // Ensure good contrast for all status colors
    return '#ffffff' // white text for all colored backgrounds
  }

  const transformBookingsToEvents = async (bookings: Booking[]): Promise<CalendarEvent[]> => {
    return bookings.map(booking => {
      const unit = units.value.find(u => u.id === booking.unit_id)
      const partner = partners.value.find(p => p.id === booking.partner_id)
      
      return {
        id: booking.id,
        title: `${booking.guest_name} - ${unit?.name || 'Unknown Unit'}`,
        start: booking.start_date || booking.startDate,
        end: booking.end_date || booking.endDate,
        backgroundColor: getStatusColor(booking.booking_status),
        borderColor: getPaymentBorderColor(booking.payment_status),
        textColor: getTextColor(booking.booking_status),
        classNames: [`booking-${booking.booking_status}`, `payment-${booking.payment_status}`],
        extendedProps: {
          booking,
          unitName: unit?.name || 'Unknown Unit',
          partnerName: partner?.name || 'Unknown Partner',
          amount: booking.base_amount,
          paymentStatus: booking.payment_status
        }
      }
    })
  }

  return {
    transformBookingsToEvents,
    getStatusColor,
    getPaymentBorderColor,
    getTextColor
  }
}
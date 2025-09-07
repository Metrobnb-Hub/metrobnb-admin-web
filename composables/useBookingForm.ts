interface AddOn {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  amount: number
}

type BookingStatus = 'confirmed' | 'canceled' | 'refunded'
type PaymentStatus = 'unpaid' | 'partial' | 'fully_paid'

interface BookingFormData {
  guestName: string
  bookingDate: string
  startDate: string
  endDate: string
  amount: number
  paymentMethod: string
  partner: string
  unitId: string
  addons: AddOn[]
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  amountPaid: number
  paymentReceivedBy: 'partner' | 'metrobnb'
  payoutDate: string
  bookingSourceId: string
  notes: string
}

export const useBookingForm = () => {
  const { createBooking } = useApi()
  
  const handleSubmit = async (booking: BookingFormData) => {
    const bookingData = {
      guest_name: booking.guestName,
      booking_date: booking.bookingDate,
      start_date: booking.startDate,
      end_date: booking.endDate,
      base_amount: booking.amount,
      addons: booking.addons,
      unit_id: booking.unitId,
      partner_id: booking.partner,
      payment_status: booking.paymentStatus,
      booking_status: booking.bookingStatus,
      amount_paid: booking.amountPaid,
      payment_method_id: booking.paymentMethod,
      payment_received_by: booking.paymentReceivedBy,
      payout_date: booking.payoutDate || null,
      booking_source_id: booking.bookingSourceId,
      notes: booking.notes
    }
    
    await createBooking(bookingData)
  }
  
  return {
    handleSubmit
  }
}
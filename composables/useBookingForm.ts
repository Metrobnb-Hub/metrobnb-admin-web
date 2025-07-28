interface AddOn {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  amount: number
}

type BookingStatus = 'confirmed' | 'canceled' | 'refunded'
type PaymentStatus = 'unpaid' | 'partial' | 'fully_paid'

interface BookingFormData {
  guestName: string
  date: string
  amount: number
  paymentMethod: string
  partner: string
  unitId: string
  addons: AddOn[]
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  amountPaid: number
}

export const useBookingForm = () => {
  const { addBooking } = useAccountingStore()
  
  const handleSubmit = (booking: BookingFormData) => {
    try {
      const bookingWithId = {
        ...booking,
        id: Date.now().toString(),
        addons: booking.addons || [],
        unitId: booking.unitId || '',
        bookingStatus: booking.bookingStatus || 'confirmed',
        paymentStatus: booking.paymentStatus || 'unpaid',
        amountPaid: booking.amountPaid || 0,
        createdAt: new Date().toISOString()
      }
      
      addBooking(bookingWithId)
      
      const toast = useToast()
      toast.add({
        title: 'Booking saved',
        description: `Payment for ${booking.guestName} has been recorded`,
        color: 'green'
      })
    } catch (error) {
      const toast = useToast()
      toast.add({
        title: 'Error',
        description: 'Failed to save booking',
        color: 'red'
      })
    }
  }
  
  return {
    handleSubmit
  }
}
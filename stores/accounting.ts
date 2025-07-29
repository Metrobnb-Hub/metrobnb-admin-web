interface AddOn {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  amount: number
}

type BookingStatus = 'confirmed' | 'canceled' | 'refunded'
type PaymentStatus = 'unpaid' | 'partial' | 'fully_paid'

interface Booking {
  id: string
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
  createdAt: string
}

interface Partner {
  id: string
  name: string
  earnings: number
}

interface Unit {
  id: string
  name: string
  partnerId: string
}

export const useAccountingStore = defineStore('accounting', () => {
  const bookings = ref<Booking[]>([])
  const { getBookings, createBooking, updateBooking: apiUpdateBooking, deleteBooking: apiDeleteBooking, getBookingTotal } = useApi()
  const partnerEarnings = ref<Record<string, number>>({})
  
  const units = ref<Unit[]>([])
  
  const getBookingTotalLocal = (booking: Booking) => {
    if (!booking) return 0
    const addonsTotal = booking.addons?.reduce((sum, addon) => sum + (addon?.amount || 0), 0) || 0
    return Number(booking.amount || 0) + addonsTotal
  }
  
  const getRemainingBalance = (booking: Booking) => {
    return getBookingTotalLocal(booking) - Number(booking.amountPaid || 0)
  }
  
  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking = await createBooking({
      guestName: booking.guestName,
      date: booking.date,
      baseAmount: booking.amount,
      addons: booking.addons,
      unitId: booking.unitId,
      partnerId: booking.partner,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      amountPaid: booking.amountPaid,
      paymentMethod: booking.paymentMethod,
      paymentReceivedBy: 'partner',
      bookingSourceId: '1',
      notes: ''
    })
    
    const transformedBooking = {
      id: newBooking.id,
      guestName: newBooking.guestName,
      date: newBooking.date,
      amount: newBooking.baseAmount,
      paymentMethod: newBooking.paymentMethod,
      partner: newBooking.partnerId,
      unitId: newBooking.unitId,
      addons: newBooking.addons,
      bookingStatus: newBooking.bookingStatus,
      paymentStatus: newBooking.paymentStatus,
      amountPaid: newBooking.amountPaid,
      createdAt: newBooking.createdAt
    }
    
    bookings.value.push(transformedBooking)
    
    if (!partnerEarnings.value[transformedBooking.partner]) {
      partnerEarnings.value[transformedBooking.partner] = 0
    }
    partnerEarnings.value[transformedBooking.partner] += getBookingTotalLocal(transformedBooking)
  }
  
  const updateBooking = async (id: string, updatedBooking: Booking) => {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      const oldBooking = bookings.value[index]
      
      await apiUpdateBooking(id, {
        guestName: updatedBooking.guestName,
        date: updatedBooking.date,
        baseAmount: updatedBooking.amount,
        addons: updatedBooking.addons,
        unitId: updatedBooking.unitId,
        partnerId: updatedBooking.partner,
        paymentStatus: updatedBooking.paymentStatus,
        bookingStatus: updatedBooking.bookingStatus,
        amountPaid: updatedBooking.amountPaid,
        paymentMethod: updatedBooking.paymentMethod,
        paymentReceivedBy: 'partner',
        bookingSourceId: '1',
        notes: ''
      })
      
      if (partnerEarnings.value[oldBooking.partner]) {
        partnerEarnings.value[oldBooking.partner] -= getBookingTotalLocal(oldBooking)
      }
      if (!partnerEarnings.value[updatedBooking.partner]) {
        partnerEarnings.value[updatedBooking.partner] = 0
      }
      partnerEarnings.value[updatedBooking.partner] += getBookingTotalLocal(updatedBooking)
      
      bookings.value[index] = updatedBooking
    }
  }
  
  const deleteBooking = async (id: string) => {
    const booking = bookings.value.find(b => b.id === id)
    if (booking) {
      await apiDeleteBooking(id)
      
      if (partnerEarnings.value[booking.partner]) {
        partnerEarnings.value[booking.partner] -= getBookingTotalLocal(booking)
      }
      
      bookings.value = bookings.value.filter(b => b.id !== id)
    }
  }
  

  
  const loadFromStorage = async () => {
    try {
      const apiBookings = await getBookings()
      bookings.value = apiBookings.map(booking => ({
        id: booking.id,
        guestName: booking.guestName,
        date: booking.date,
        amount: booking.baseAmount,
        paymentMethod: booking.paymentMethod,
        partner: booking.partnerId,
        unitId: booking.unitId,
        addons: booking.addons,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        amountPaid: booking.amountPaid,
        createdAt: booking.createdAt
      }))
      
      const earnings: Record<string, number> = {}
      bookings.value.forEach(booking => {
        if (!earnings[booking.partner]) earnings[booking.partner] = 0
        earnings[booking.partner] += getBookingTotalLocal(booking)
      })
      partnerEarnings.value = earnings
    } catch (error) {
      console.error('Failed to load bookings:', error)
      bookings.value = []
      partnerEarnings.value = {}
    }
  }
  
  const totalEarnings = computed(() => 
    bookings.value.reduce((sum, booking) => sum + getBookingTotalLocal(booking), 0)
  )
  
  const totalAddonRevenue = computed(() => 
    bookings.value.reduce((sum, booking) => {
      const addonsTotal = booking.addons?.reduce((addonSum, addon) => addonSum + addon.amount, 0) || 0
      return sum + addonsTotal
    }, 0)
  )
  
  const getPartnerEarnings = (partnerId: string) => {
    return partnerEarnings.value[partnerId] || 0
  }
  
  return {
    bookings: readonly(bookings),
    units: readonly(units),
    partnerEarnings: readonly(partnerEarnings),
    addBooking,
    updateBooking,
    deleteBooking,
    loadFromStorage,
    totalEarnings,
    totalAddonRevenue,
    getBookingTotal: getBookingTotalLocal,
    getRemainingBalance,
    getPartnerEarnings
  }
})
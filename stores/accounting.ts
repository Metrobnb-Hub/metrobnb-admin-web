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
  const { getBookings, getBookingTotal } = useMockApi()
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
  
  const addBooking = (booking: Booking) => {
    bookings.value.push(booking)
    
    // Update partner earnings with total amount including add-ons
    if (!partnerEarnings.value[booking.partner]) {
      partnerEarnings.value[booking.partner] = 0
    }
    partnerEarnings.value[booking.partner] += getBookingTotalLocal(booking)
    
    persistData()
  }
  
  const updateBooking = (id: string, updatedBooking: Booking) => {
    const index = bookings.value.findIndex(b => b.id === id)
    if (index !== -1) {
      const oldBooking = bookings.value[index]
      
      // Update partner earnings with total amounts including add-ons
      if (partnerEarnings.value[oldBooking.partner]) {
        partnerEarnings.value[oldBooking.partner] -= getBookingTotalLocal(oldBooking)
      }
      if (!partnerEarnings.value[updatedBooking.partner]) {
        partnerEarnings.value[updatedBooking.partner] = 0
      }
      partnerEarnings.value[updatedBooking.partner] += getBookingTotalLocal(updatedBooking)
      
      bookings.value[index] = updatedBooking
      persistData()
    }
  }
  
  const deleteBooking = (id: string) => {
    const booking = bookings.value.find(b => b.id === id)
    if (booking) {
      if (partnerEarnings.value[booking.partner]) {
        partnerEarnings.value[booking.partner] -= getBookingTotalLocal(booking)
      }
      
      bookings.value = bookings.value.filter(b => b.id !== id)
      persistData()
    }
  }
  
  const persistData = () => {
    if (process.client) {
      localStorage.setItem('metrobnb-bookings', JSON.stringify(bookings.value))
      localStorage.setItem('metrobnb-partner-earnings', JSON.stringify(partnerEarnings.value))
    }
  }
  
  const loadFromStorage = async () => {
    try {
      const mockBookings = await getBookings()
      // Transform mock API data to accounting store format
      bookings.value = mockBookings.map(booking => ({
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
      
      // Calculate partner earnings from bookings
      const earnings: Record<string, number> = {}
      bookings.value.forEach(booking => {
        if (!earnings[booking.partner]) earnings[booking.partner] = 0
        earnings[booking.partner] += getBookingTotalLocal(booking)
      })
      partnerEarnings.value = earnings
    } catch (error) {
      console.error('Failed to load from mock API:', error)
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
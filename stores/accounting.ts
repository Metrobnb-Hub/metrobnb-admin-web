import type { Booking, Partner, Unit } from '~/types/api'

// Internal store interface for compatibility
interface StoreBooking {
  id: string
  guestName: string
  date: string
  amount: number
  paymentMethod: string
  partner: string
  unitId: string
  addons: { type: string; amount: number }[]
  bookingStatus: string
  paymentStatus: string
  amountPaid: number
  createdAt: string
}

export const useAccountingStore = defineStore('accounting', () => {
  const bookings = ref<StoreBooking[]>([])
  const { getBookings, createBooking, updateBooking: apiUpdateBooking, deleteBooking: apiDeleteBooking, getBookingTotal } = useApi()
  const partnerEarnings = ref<Record<string, number>>({})
  
  const units = ref<Unit[]>([])
  
  const getBookingTotalLocal = (booking: StoreBooking) => {
    if (!booking) return 0
    const baseAmount = typeof booking.amount === 'number' ? booking.amount : 0
    const addonsTotal = Array.isArray(booking.addons) 
      ? booking.addons.reduce((sum, addon) => sum + (typeof addon?.amount === 'number' ? addon.amount : 0), 0)
      : 0
    return baseAmount + addonsTotal
  }
  
  const getRemainingBalance = (booking: StoreBooking) => {
    if (!booking) return 0
    const total = getBookingTotalLocal(booking)
    const paid = typeof booking.amountPaid === 'number' ? booking.amountPaid : 0
    return total - paid
  }
  
  const addBooking = async (booking: Omit<StoreBooking, 'id' | 'createdAt'>) => {
    const newBooking = await createBooking({
      guestName: booking.guestName,
      date: booking.date,
      baseAmount: booking.amount,
      addons: booking.addons,
      unitId: booking.unitId,
      partnerId: booking.partner,
      paymentStatus: booking.paymentStatus as any,
      bookingStatus: booking.bookingStatus as any,
      amountPaid: booking.amountPaid,
      paymentMethod: booking.paymentMethod,
      paymentReceivedBy: 'partner',
      bookingSourceId: '1',
      notes: ''
    })
    
    const transformedBooking: StoreBooking = {
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
  
  const updateBooking = async (id: string, updatedBooking: StoreBooking) => {
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
        paymentStatus: updatedBooking.paymentStatus as any,
        bookingStatus: updatedBooking.bookingStatus as any,
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
  
  const totalEarnings = computed(() => {
    if (!Array.isArray(bookings.value)) return 0
    return bookings.value.reduce((sum, booking) => {
      const total = getBookingTotalLocal(booking)
      return sum + (typeof total === 'number' ? total : 0)
    }, 0)
  })
  
  const totalAddonRevenue = computed(() => {
    if (!Array.isArray(bookings.value)) return 0
    return bookings.value.reduce((sum, booking) => {
      if (!booking || !Array.isArray(booking.addons)) return sum
      const addonsTotal = booking.addons.reduce((addonSum, addon) => {
        return addonSum + (typeof addon?.amount === 'number' ? addon.amount : 0)
      }, 0)
      return sum + addonsTotal
    }, 0)
  })
  
  const getPartnerEarnings = (partnerId: string) => {
    return partnerEarnings.value[partnerId] || 0
  }
  
  return {
    bookings,
    units,
    partnerEarnings,
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
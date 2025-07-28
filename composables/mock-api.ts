import type { Partner, Unit, Booking, Expense, BookingSource, ApiFilters } from '~/types/api'

// Mock Data
const mockBookingSources: BookingSource[] = [
  {
    id: 'source-1',
    name: 'MetroBNB Website',
    commissionRate: 0,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'source-2',
    name: 'Airbnb',
    commissionRate: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'source-3',
    name: 'Instagram Ads',
    commissionRate: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'source-4',
    name: 'Facebook Ads',
    commissionRate: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'source-5',
    name: 'Google Ads',
    commissionRate: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'source-6',
    name: 'Referral',
    commissionRate: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
]

const mockPartners: Partner[] = [
  {
    id: 'partner-1',
    name: 'Casa Aurea Properties',
    sharePercentage: 15,
    services: ['Full Management', 'Cleaning'],
    email: 'contact@casaaurea.com',
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'partner-2',
    name: 'Azure Bahamas Resort',
    sharePercentage: 20,
    services: ['Cleaning', 'Maintenance'],
    email: 'admin@azurebahamas.com',
    createdAt: '2024-02-01T14:30:00.000Z'
  },
  {
    id: 'partner-3',
    name: 'Metro Condos Inc',
    sharePercentage: 12,
    services: ['Guest Communication'],
    email: 'info@metrocondos.com',
    createdAt: '2024-02-20T09:15:00.000Z'
  }
]

const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    name: 'Casa Aurea – Azure Bahamas 945',
    partnerId: 'partner-1',
    location: 'Makati City, Metro Manila',
    notes: 'Premium 2BR unit with city view',
    createdAt: '2024-01-15T11:00:00.000Z'
  },
  {
    id: 'unit-2',
    name: 'Azure Resort Villa 12',
    partnerId: 'partner-2',
    location: 'Boracay Island',
    notes: 'Beachfront villa with pool access',
    createdAt: '2024-02-01T15:00:00.000Z'
  },
  {
    id: 'unit-3',
    name: 'Metro Tower Unit 2501',
    partnerId: 'partner-3',
    location: 'BGC, Taguig City',
    notes: 'Modern high-rise unit',
    createdAt: '2024-02-20T10:00:00.000Z'
  }
]

const mockBookings: Booking[] = [
  // Partner 1 bookings (unit-1)
  {
    id: 'booking-1',
    guestName: 'John Smith',
    date: '2024-03-15',
    baseAmount: 5000,
    addons: [{ type: 'early_checkin', amount: 300 }],
    unitId: 'unit-1',
    partnerId: 'partner-1',
    paymentStatus: 'fully_paid',
    bookingStatus: 'confirmed',
    amountPaid: 5300,
    paymentMethod: 'credit_card',
    paymentReceivedBy: 'metrobnb',
    bookingSourceId: 'source-1',
    notes: 'Direct booking through website',
    createdAt: '2024-03-10T14:30:00.000Z'
  },
  {
    id: 'booking-2',
    guestName: 'Alice Johnson',
    date: '2024-03-22',
    baseAmount: 4500,
    addons: [{ type: 'parking', amount: 200 }],
    unitId: 'unit-1',
    partnerId: 'partner-1',
    paymentStatus: 'partial',
    bookingStatus: 'confirmed',
    amountPaid: 4700,
    paymentMethod: 'bank_transfer',
    paymentReceivedBy: 'partner',
    bookingSourceId: 'source-2',
    notes: 'Airbnb booking',
    createdAt: '2024-03-18T10:15:00.000Z'
  },
  {
    id: 'booking-3',
    guestName: 'Robert Wilson',
    date: '2024-04-02',
    baseAmount: 5200,
    addons: [],
    unitId: 'unit-1',
    partnerId: 'partner-1',
    paymentStatus: 'unpaid',
    bookingStatus: 'confirmed',
    amountPaid: 0,
    paymentMethod: 'cash',
    paymentReceivedBy: 'partner',
    bookingSourceId: 'source-6',
    notes: 'Referral from previous guest',
    createdAt: '2024-03-25T16:45:00.000Z'
  },
  // Partner 2 bookings (unit-2)
  {
    id: 'booking-4',
    guestName: 'Maria Garcia',
    date: '2024-03-18',
    baseAmount: 6000,
    addons: [{ type: 'late_checkout', amount: 300 }],
    unitId: 'unit-2',
    partnerId: 'partner-2',
    paymentStatus: 'fully_paid',
    bookingStatus: 'confirmed',
    amountPaid: 6300,
    paymentMethod: 'credit_card',
    paymentReceivedBy: 'metrobnb',
    bookingSourceId: 'source-3',
    notes: 'Instagram ad campaign',
    createdAt: '2024-03-12T09:15:00.000Z'
  },
  {
    id: 'booking-5',
    guestName: 'David Chen',
    date: '2024-03-28',
    baseAmount: 5800,
    addons: [{ type: 'early_checkin', amount: 300 }, { type: 'parking', amount: 200 }],
    unitId: 'unit-2',
    partnerId: 'partner-2',
    paymentStatus: 'partial',
    bookingStatus: 'confirmed',
    amountPaid: 4000,
    paymentMethod: 'bank_transfer',
    paymentReceivedBy: 'partner',
    bookingSourceId: 'source-2',
    createdAt: '2024-03-20T11:30:00.000Z'
  },
  {
    id: 'booking-6',
    guestName: 'Sarah Martinez',
    date: '2024-04-08',
    baseAmount: 6200,
    addons: [],
    unitId: 'unit-2',
    partnerId: 'partner-2',
    paymentStatus: 'fully_paid',
    bookingStatus: 'confirmed',
    amountPaid: 6200,
    paymentMethod: 'paypal',
    paymentReceivedBy: 'partner',
    bookingSourceId: 'source-4',
    notes: 'Facebook ad conversion',
    createdAt: '2024-03-30T14:20:00.000Z'
  },
  // Partner 3 bookings (unit-3)
  {
    id: 'booking-7',
    guestName: 'Michael Brown',
    date: '2024-03-20',
    baseAmount: 4800,
    addons: [{ type: 'parking', amount: 200 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentStatus: 'fully_paid',
    bookingStatus: 'confirmed',
    amountPaid: 5000,
    paymentMethod: 'credit_card',
    paymentReceivedBy: 'metrobnb',
    bookingSourceId: 'source-5',
    notes: 'Google Ads campaign',
    createdAt: '2024-03-15T13:10:00.000Z'
  },
  {
    id: 'booking-8',
    guestName: 'Jennifer Lee',
    date: '2024-03-30',
    baseAmount: 4600,
    addons: [{ type: 'late_checkout', amount: 300 }],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentStatus: 'unpaid',
    bookingStatus: 'confirmed',
    amountPaid: 0,
    paymentMethod: 'cash',
    paymentReceivedBy: 'partner',
    bookingSourceId: 'source-2',
    createdAt: '2024-03-22T15:45:00.000Z'
  },
  {
    id: 'booking-9',
    guestName: 'Thomas Anderson',
    date: '2024-04-12',
    baseAmount: 5000,
    addons: [],
    unitId: 'unit-3',
    partnerId: 'partner-3',
    paymentStatus: 'partial',
    bookingStatus: 'confirmed',
    amountPaid: 2500,
    paymentMethod: 'bank_transfer',
    paymentReceivedBy: 'partner',
    bookingSourceId: 'source-1',
    notes: 'Direct website booking',
    createdAt: '2024-04-01T12:00:00.000Z'
  }
]

const mockExpenses: Expense[] = [
  // Partner 1 expenses (unit-1)
  {
    id: 'expense-1',
    partnerId: 'partner-1',
    unitId: 'unit-1',
    date: '2024-03-10',
    type: 'cleaning',
    amount: 800,
    notes: 'Deep cleaning after checkout',
    createdAt: '2024-03-10T16:00:00.000Z'
  },
  {
    id: 'expense-2',
    partnerId: 'partner-1',
    unitId: 'unit-1',
    date: '2024-03-20',
    type: 'utilities',
    amount: 1200,
    notes: 'Electricity and water bill',
    createdAt: '2024-03-20T10:30:00.000Z'
  },
  {
    id: 'expense-3',
    partnerId: 'partner-1',
    unitId: 'unit-1',
    date: '2024-03-25',
    type: 'repair',
    amount: 1500,
    notes: 'Fixed air conditioning unit',
    createdAt: '2024-03-25T14:15:00.000Z'
  },
  // Partner 2 expenses (unit-2)
  {
    id: 'expense-4',
    partnerId: 'partner-2',
    unitId: 'unit-2',
    date: '2024-03-12',
    type: 'cleaning',
    amount: 900,
    notes: 'Weekly cleaning service',
    createdAt: '2024-03-12T11:20:00.000Z'
  },
  {
    id: 'expense-5',
    partnerId: 'partner-2',
    unitId: 'unit-2',
    date: '2024-03-22',
    type: 'laundry',
    amount: 450,
    notes: 'Towels and bed sheets',
    createdAt: '2024-03-22T09:45:00.000Z'
  },
  {
    id: 'expense-6',
    partnerId: 'partner-2',
    unitId: 'unit-2',
    date: '2024-03-28',
    type: 'misc',
    amount: 600,
    notes: 'Welcome amenities and supplies',
    createdAt: '2024-03-28T15:30:00.000Z'
  },
  // Partner 3 expenses (unit-3)
  {
    id: 'expense-7',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-03-15',
    type: 'utilities',
    amount: 1100,
    notes: 'Monthly utility bills',
    createdAt: '2024-03-15T12:00:00.000Z'
  },
  {
    id: 'expense-8',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-03-25',
    type: 'cleaning',
    amount: 750,
    notes: 'Post-checkout deep clean',
    createdAt: '2024-03-25T16:20:00.000Z'
  },
  {
    id: 'expense-9',
    partnerId: 'partner-3',
    unitId: 'unit-3',
    date: '2024-04-02',
    type: 'repair',
    amount: 2000,
    notes: 'Plumbing repair and maintenance',
    createdAt: '2024-04-02T10:15:00.000Z'
  }
]

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// API Functions
export const useMockApi = () => {
  const getPartners = async (): Promise<Partner[]> => {
    await delay()
    return [...mockPartners]
  }

  const getPartnerById = async (id: string): Promise<Partner | null> => {
    await delay()
    return mockPartners.find(p => p.id === id) || null
  }

  const getUnits = async (): Promise<Unit[]> => {
    await delay()
    return [...mockUnits]
  }

  const getUnitsByPartner = async (partnerId: string): Promise<Unit[]> => {
    await delay()
    return mockUnits.filter(u => u.partnerId === partnerId)
  }

  const getBookings = async (filters: ApiFilters = {}): Promise<Booking[]> => {
    await delay()
    let filtered = [...mockBookings]

    if (filters.partnerId) {
      filtered = filtered.filter(b => b.partnerId === filters.partnerId)
    }

    if (filters.unitId) {
      filtered = filtered.filter(b => b.unitId === filters.unitId)
    }

    if (filters.month) {
      filtered = filtered.filter(b => b.date.startsWith(filters.month))
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getExpenses = async (filters: ApiFilters = {}): Promise<Expense[]> => {
    await delay()
    let filtered = [...mockExpenses]

    if (filters.partnerId) {
      filtered = filtered.filter(e => e.partnerId === filters.partnerId)
    }

    if (filters.unitId) {
      filtered = filtered.filter(e => e.unitId === filters.unitId)
    }

    if (filters.month) {
      filtered = filtered.filter(e => e.date.startsWith(filters.month))
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getBookingTotal = (booking: Booking): number => {
    const addonsTotal = booking.addons.reduce((sum, addon) => sum + addon.amount, 0)
    return booking.baseAmount + addonsTotal
  }

  const getBookingSources = async (): Promise<BookingSource[]> => {
    await delay()
    return [...mockBookingSources]
  }

  const getPartnerEarnings = async (partnerId: string): Promise<number> => {
    const partnerBookings = await getBookings({ partnerId })
    return partnerBookings
      .filter(b => b.bookingStatus !== 'refunded')
      .reduce((sum, booking) => sum + getBookingTotal(booking), 0)
  }

  const getPartnerExpenses = async (partnerId: string): Promise<number> => {
    const partnerExpenses = await getExpenses({ partnerId })
    return partnerExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  return {
    getPartners,
    getPartnerById,
    getUnits,
    getUnitsByPartner,
    getBookings,
    getExpenses,
    getBookingSources,
    getBookingTotal,
    getPartnerEarnings,
    getPartnerExpenses
  }
}
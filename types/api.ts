export interface Partner {
  id: string
  name: string
  sharePercentage: number
  services?: string[]
  email?: string
  createdAt: string
}

export interface Unit {
  id: string
  name: string
  partnerId: string
  location?: string
  notes?: string
  createdAt: string
}

export interface AddOn {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  amount: number
}

export interface BookingSource {
  id: string
  name: string
  commissionRate?: number
  isActive: boolean
  createdAt: string
}

export interface Booking {
  id: string
  guestName: string
  date: string
  baseAmount: number
  addons: AddOn[]
  unitId: string
  partnerId: string
  paymentStatus: 'unpaid' | 'partial' | 'fully_paid'
  bookingStatus: 'confirmed' | 'canceled' | 'refunded'
  amountPaid: number
  paymentMethod: string
  paymentReceivedBy: 'partner' | 'metrobnb'
  bookingSourceId: string
  notes?: string
  createdAt: string
}

export interface Expense {
  id: string
  partnerId: string
  unitId: string
  date: string
  type: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
  amount: number
  notes?: string
  createdAt: string
}

export interface ApiFilters {
  partnerId?: string
  unitId?: string
  month?: string
}
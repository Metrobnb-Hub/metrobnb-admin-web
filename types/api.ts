export interface Service {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: string
  name: string
  sharePercentage: number
  services: Service[]
  email?: string
  createdAt: string
  updatedAt: string
}

export interface Unit {
  id: string
  name: string
  partnerId: string
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
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
  updatedAt: string
}

export interface PaymentMethod {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  guestName: string
  bookingDate: string
  startDate: string
  endDate: string
  baseAmount: string  // API returns as string "1200.00"
  addons: AddOn[]
  unitId: string
  partnerId: string
  paymentStatus: 'unpaid' | 'partial' | 'fully_paid'
  bookingStatus: 'confirmed' | 'canceled' | 'refunded'
  amountPaid: string  // API returns as string "1500.00"
  paymentMethod: PaymentMethod
  paymentMethodId: string
  paymentReceivedBy: 'partner' | 'metrobnb'
  bookingSourceId: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  partnerId: string
  unitId: string
  date: string
  type: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
  amount: string  // API returns as string "150.00"
  billable: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ApiFilters {
  partnerId?: string
  unitId?: string
  month?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}
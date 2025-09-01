export interface Service {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  share_percentage: number
  services: Service[]
  email?: string
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  name: string
  partner_id: string
  organization_id: string
  
  // Legacy fields
  location?: string
  notes?: string
  
  // Extended fields
  type?: string                    // "apartment", "house", "condo"
  description?: string
  capacity?: number               // Default: 2
  city?: string
  building?: string
  landmarks?: string[]            // ["Mall of Asia", "Airport"]
  base_price?: number
  extra_guest_fee?: number
  cleaning_fee?: number
  amenity_fee_rules?: string
  amenities?: string[]            // ["wifi", "parking", "pool"]
  special_features?: string
  check_in_time?: string          // "15:00:00"
  check_out_time?: string         // "11:00:00"
  pets_allowed?: boolean
  smoking_allowed?: boolean
  parties_allowed?: boolean
  remarks?: string
  status?: string                 // "active", "inactive", "maintenance"
  airbnb_url?: string
  airbnb_rating?: number          // 0.00 to 5.00
  bedrooms?: number
  beds?: number
  bathrooms?: number              // Can be decimal (1.5)
  
  created_at: string
  updated_at: string
  partner?: {
    id: string
    name: string
    email: string
  }
}

export interface AddOn {
  type: 'early_checkin' | 'late_checkout' | 'parking'
  amount: number
}

export interface BookingSource {
  id: string
  name: string
  commission_rate?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  guest_name: string
  booking_date: string
  start_date: string
  end_date: string
  base_amount: string  // API returns as string "1200.00"
  addons: AddOn[]
  unit_id: string
  partner_id: string
  payment_status: 'unpaid' | 'partial' | 'fully_paid'
  booking_status: 'confirmed' | 'canceled' | 'refunded'
  amount_paid: string  // API returns as string "1500.00"
  payment_method: PaymentMethod
  payment_method_id: string
  payment_received_by: 'partner' | 'metrobnb'
  booking_source?: BookingSource  // Full booking source object if included
  booking_source_id: string
  invoiced: boolean  // Invoice status
  invoice_date: string | null  // Invoice generation date
  notes?: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  partner_id: string
  unit_id: string
  date: string
  type: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
  amount: string  // API returns as string "150.00"
  billable: boolean
  paid: boolean  // Payment status
  paid_date: string | null  // Payment date
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiFilters {
  partner_id?: string
  unit_id?: string
  month?: string
  start_date?: string  // YYYY-MM-DD format
  end_date?: string    // YYYY-MM-DD format
  type?: string        // For expense type filtering
  billable?: boolean   // For expense filtering
  paid?: boolean       // For payment status filtering
  invoiced?: boolean   // For invoice status filtering
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginationMeta {
  current_page: number
  total_pages: number
  total_items: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}
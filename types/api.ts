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
  email?: string
  phone?: string
  org_share_percentage: number
  partner_code: string
  services: Service[]
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

// ============================================
// Specific Filter Types
// ============================================

export interface BookingFilters extends ApiFilters {
  booking_source_id?: string
  payment_status?: Booking['payment_status']
  booking_status?: Booking['booking_status']
  payment_received_by?: Booking['payment_received_by']
}

export interface ExpenseFilters extends ApiFilters {
  type?: Expense['type']
  status?: string
  paid_by?: string
  needs_review?: boolean
  date_from?: string
  date_to?: string
  amount_min?: number
  amount_max?: number
}

export interface InvoiceFilters extends ApiFilters {
  status?: string
}

export interface JournalEntryFilters extends ApiFilters {
  type?: 'credit' | 'debit'
  status?: 'pending' | 'settled'
}

// ============================================
// Request Types for Create/Update Operations
// ============================================

export interface CreatePartnerRequest {
  name: string
  email?: string
  phone?: string
  org_share_percentage: number
  partner_code: string
  service_ids: string[]
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {}

export interface CreateUnitRequest {
  name: string
  partner_id: string
  type?: string
  description?: string
  capacity?: number
  city?: string
  building?: string
  landmarks?: string[]
  base_price?: number
  extra_guest_fee?: number
  cleaning_fee?: number
  amenity_fee_rules?: string
  amenities?: string[]
  special_features?: string
  check_in_time?: string
  check_out_time?: string
  pets_allowed?: boolean
  smoking_allowed?: boolean
  parties_allowed?: boolean
  remarks?: string
  status?: string
  airbnb_url?: string
  airbnb_rating?: number
  bedrooms?: number
  beds?: number
  bathrooms?: number
}

export interface UpdateUnitRequest extends Partial<CreateUnitRequest> {}

export interface CreateBookingRequest {
  guest_name: string
  booking_date: string
  start_date: string
  end_date: string
  base_amount: number | string
  addons?: AddOn[]
  unit_id: string
  partner_id: string
  payment_status: Booking['payment_status']
  booking_status: Booking['booking_status']
  amount_paid: number | string
  payment_method_id: string
  payment_received_by: Booking['payment_received_by']
  booking_source_id: string
  notes?: string
}

export interface UpdateBookingRequest extends Partial<CreateBookingRequest> {}

export interface CreateExpenseRequest {
  partner_id: string
  unit_id: string
  date: string
  type: Expense['type']
  amount: number | string
  billable?: boolean
  paid?: boolean
  paid_date?: string | null
  notes?: string
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {}

export interface BulkUpdateExpensesRequest {
  ids: string[]
  updates: Partial<CreateExpenseRequest>
}

export interface CreateJournalEntryRequest {
  partner_id: string
  date: string
  type: 'credit' | 'debit'
  amount: number | string
  description: string
  reference?: string
  notes?: string
  created_by?: string
}

export interface UpdateJournalEntryRequest extends Partial<CreateJournalEntryRequest> {}

export interface CreateUserRequest {
  email: string
  name: string
  role: 'owner' | 'admin' | 'staff' | 'partner'
  accessible_partners?: string[]
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}
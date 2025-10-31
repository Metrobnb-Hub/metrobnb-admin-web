// Auto-generated from OpenAPI spec
export interface APIResponse_AirbnbImportResponse_ {
  success: boolean
  data?: AirbnbImportResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_BookingResponse_ {
  success: boolean
  data?: BookingResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_BookingSourceResponse_ {
  success: boolean
  data?: BookingSourceResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_DashboardMetrics_ {
  success: boolean
  data?: DashboardMetrics | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_Dict_str__Any__ {
  success: boolean
  data?: any | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_ExpenseResponse_ {
  success: boolean
  data?: ExpenseResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_InvoiceWithItems_ {
  success: boolean
  data?: InvoiceWithItems | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_Invoice_ {
  success: boolean
  data?: Invoice | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_JournalEntryResponse_ {
  success: boolean
  data?: JournalEntryResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_BookingResponse__ {
  success: boolean
  data?: BookingResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_BookingSourceResponse__ {
  success: boolean
  data?: BookingSourceResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_ExpenseResponse__ {
  success: boolean
  data?: ExpenseResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_JournalEntryResponse__ {
  success: boolean
  data?: JournalEntryResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_PartnerResponse__ {
  success: boolean
  data?: PartnerResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_PaymentMethodResponse__ {
  success: boolean
  data?: PaymentMethodResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_ServiceResponse__ {
  success: boolean
  data?: ServiceResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_List_UnitResponse__ {
  success: boolean
  data?: UnitResponse[] | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PaginatedData_ExpenseResponse__ {
  success: boolean
  data?: PaginatedData_ExpenseResponse_ | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PaginatedData_JournalEntryResponse__ {
  success: boolean
  data?: PaginatedData_JournalEntryResponse_ | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PaginatedData_PartnerResponse__ {
  success: boolean
  data?: PaginatedData_PartnerResponse_ | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PaginatedData_UnitResponse__ {
  success: boolean
  data?: PaginatedData_UnitResponse_ | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PartnerInvoiceMetrics_ {
  success: boolean
  data?: PartnerInvoiceMetrics | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PartnerResponse_ {
  success: boolean
  data?: PartnerResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_PaymentMethodResponse_ {
  success: boolean
  data?: PaymentMethodResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_ServiceResponse_ {
  success: boolean
  data?: ServiceResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_UnitResponse_ {
  success: boolean
  data?: UnitResponse | any
  message?: string | any
  error?: any | any
}

export interface APIResponse_dict_ {
  success: boolean
  data?: any | any
  message?: string | any
  error?: any | any
}

export interface AirbnbImportRequest {
  partner_id: string
  unit_id: string
  csv_data: string
}

export interface AirbnbImportResponse {
  success: boolean
  imported_count: number
  skipped_count: number
  errors: string[]
  bookings_created: string[]
}

export interface Body_create_expense_api_expenses_post {
  partner_id: string
  unit_id: string
  amount: number
  type: ExpenseType
  date: string
  notes?: string | any
  billable?: boolean
  paid_by?: any
  receipt_file?: string | any
}

export interface Body_simple_upload_api_simple_upload_post {
  file: string
}

export interface Body_upload_file_api_files_upload_post {
  file: string
}

export interface BookingCreate {
  guest_name: string
  booking_date: string
  start_date: string
  end_date: string
  base_amount: number | string
  addons?: any[] | any
  unit_id: string
  partner_id: string
  payment_status: PaymentStatus
  booking_status: BookingStatus
  amount_paid: number | string
  payment_method_id: string
  payment_received_by: PaymentReceivedBy
  booking_source_id: string
  notes?: string | any
  invoiced?: boolean
  invoice_date?: string | any
  payout_date?: string | any
  confirmation_code?: string | any
  service_fee?: number | string | any
  cleaning_fee?: number | string | any
  gross_earnings?: number | string | any
  nights?: number | any
  occupancy_taxes?: number | string | any
}

export interface BookingItem {
  id: string
  date: string
  end_date: string
  guest_name: string
  unit_name: string
  booking_source_name: string
  base_amount: string
  addons_total: string
  total_amount: string
  payment_received_by: string
  actual_amount_received: string
  booking_status: string
}

export interface BookingResponse {
  guest_name: string
  booking_date: string
  start_date: string
  end_date: string
  base_amount: string
  addons?: any[] | any
  unit_id: string
  partner_id: string
  payment_status: PaymentStatus
  booking_status: BookingStatus
  amount_paid: string
  payment_method_id: string
  payment_received_by: PaymentReceivedBy
  booking_source_id: string
  notes?: string | any
  invoiced?: boolean
  invoice_date?: string | any
  payout_date?: string | any
  confirmation_code?: string | any
  service_fee?: string | any
  cleaning_fee?: string | any
  gross_earnings?: string | any
  nights?: number | any
  occupancy_taxes?: string | any
  id: string
  payment_method: PaymentMethodResponse
  created_at: string
  updated_at: string
}

export type BookingSortBy = 'created_at' | 'guest_name' | 'base_amount' | 'booking_date'

export interface BookingSourceCreate {
  name: string
  commission_rate?: number | any
  is_active?: boolean
}

export interface BookingSourceResponse {
  name: string
  commission_rate?: number | any
  is_active?: boolean
  id: string
  created_at: string
  updated_at: string
}

export interface BookingSourceUpdate {
  name?: string | any
  commission_rate?: number | any
  is_active?: boolean | any
}

export type BookingStatus = 'confirmed' | 'canceled' | 'refunded'

export interface BookingUpdate {
  guest_name?: string | any
  booking_date?: string | any
  start_date?: string | any
  end_date?: string | any
  base_amount?: number | string | any
  addons?: any[] | any
  unit_id?: string | any
  partner_id?: string | any
  payment_status?: PaymentStatus | any
  booking_status?: BookingStatus | any
  amount_paid?: number | string | any
  payment_method_id?: string | any
  payment_received_by?: PaymentReceivedBy | any
  booking_source_id?: string | any
  notes?: string | any
  invoiced?: boolean | any
  invoice_date?: string | any
  payout_date?: string | any
  confirmation_code?: string | any
  service_fee?: number | string | any
  cleaning_fee?: number | string | any
  gross_earnings?: number | string | any
  nights?: number | any
  occupancy_taxes?: number | string | any
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface CreateUserRequest {
  email: string
  name: string
  role: string
  accessible_partners?: any[]
}

export interface DashboardMetrics {
  org_revenue: string
  partner_revenue: string
  org_expenses: string
  net_profit: string
  partner_count: number
  revenue_by_partner: RevenueByPartner[]
  expense_breakdown: ExpenseBreakdown[]
  monthly_trend: MonthlyTrend[]
  recent_bookings: RecentBooking[]
  recent_expenses: RecentExpense[]
}

export interface ExpenseBreakdown {
  type: string
  amount: string
}

export interface ExpenseItem {
  id: string
  date: string
  unit_name: string
  type: string
  amount: string
  notes: string | any
  billable: boolean
  paid: boolean
}

export interface ExpenseResponse {
  id: string
  partner_id: string | any
  unit_id: string | any
  date: string
  type: ExpenseType
  amount: string
  billable: boolean
  paid: boolean
  paid_date: string | any
  paid_by: PaidBy
  status: ExpenseStatus
  receipt_url: string | any
  receipt_full_url?: string | any
  receipt_public_id: string | any
  captured_at: string | any
  needs_review: boolean
  notes: string | any
  created_at: string
  updated_at: string
}

export type ExpenseStatus = 'draft' | 'completed' | 'invoiced'

export type ExpenseType = 'Supplies' | 'Wifi' | 'Electricity' | 'Repair' | 'Repairs' | 'Laundry' | 'Miscellaneous' | 'Cleaning'

export interface ExpenseUpdate {
  partner_id?: string | any
  unit_id?: string | any
  date?: string | any
  type?: ExpenseType | any
  amount?: number | string | any
  billable?: boolean | any
  paid?: boolean | any
  paid_date?: string | any
  paid_by?: PaidBy | any
  status?: ExpenseStatus | any
  receipt_url?: string | any
  notes?: string | any
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}

export interface InviteUserRequest {
  email: string
  name: string
  role: string
  partner_ids?: string[]
}

export interface Invoice {
  id: string
  partner_id: string
  invoice_number: string
  start_date: string
  end_date: string
  total_amount: string
  status: string
  generated_at: string
  finalized_at: string | any
  sent_at: string | any
  paid_at: string | any
  created_at: string
  updated_at: string
  partner_name?: string | any
  unit_names?: string | any
}

export interface InvoiceGenerate {
  partner_id: string
  start_date: string
  end_date: string
}

export interface InvoiceReject {
  notes: string
}

export interface InvoiceSettle {
  paid_date: string
}

export interface InvoiceSummary {
  total_gross_earnings: string
  metrobnb_share: string
  total_expenses: string
  total_received_by_metrobnb: string
  net_journal_entries: string
  net_due: string
}

export interface InvoiceWithItems {
  id: string
  partner_id: string
  invoice_number: string
  start_date: string
  end_date: string
  total_amount: string
  status: string
  generated_at: string
  finalized_at?: string | any
  sent_at?: string | any
  paid_at?: string | any
  created_at: string
  updated_at: string
  partner_name: string
  share_percentage: string
  period: string
  bookings: BookingItem[]
  expenses: ExpenseItem[]
  journal_entries: JournalEntryItem[]
  summary: InvoiceSummary
}

export interface JournalEntryCreate {
  partner_id: string
  date: string
  type: JournalEntryType
  amount: number | string
  description: string
  reference?: string | any
  notes?: string | any
  created_by?: string | any
}

export interface JournalEntryItem {
  id: string
  date: string
  type: string
  description: string
  reference: string | any
  amount: string
  notes: string | any
}

export interface JournalEntryResponse {
  id: string
  partner_id: string
  date: string
  type: JournalEntryType
  amount: string
  description: string
  reference: string | any
  notes: string | any
  status: JournalEntryStatus
  settled_date: string | any
  created_by: string | any
  created_at: string
  updated_at: string
}

export interface JournalEntrySettle {
  settled_date: string
  notes?: string | any
}

export type JournalEntryStatus = 'pending' | 'settled'

export type JournalEntryType = 'credit' | 'debit'

export interface JournalEntryUpdate {
  partner_id?: string | any
  date?: string | any
  type?: JournalEntryType | any
  amount?: number | string | any
  description?: string | any
  reference?: string | any
  notes?: string | any
}

export interface LoginRequest {
  email: string
  password: string
}

export interface MonthlyTrend {
  month: string
  org_revenue: string
}

export interface PaginatedData_ExpenseResponse_ {
  items: ExpenseResponse[]
  pagination: PaginationInfo
}

export interface PaginatedData_JournalEntryResponse_ {
  items: JournalEntryResponse[]
  pagination: PaginationInfo
}

export interface PaginatedData_PartnerResponse_ {
  items: PartnerResponse[]
  pagination: PaginationInfo
}

export interface PaginatedData_UnitResponse_ {
  items: UnitResponse[]
  pagination: PaginationInfo
}

export interface PaginationInfo {
  current_page: number
  total_pages: number
  total_items: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

export type PaidBy = 'metrobnb' | 'partner' | 'employee' | 'owner'

export interface PartnerCreate {
  name: string
  email?: string | any
  phone?: string | any
  org_share_percentage: number
  service_ids?: string[] | any
}

export interface PartnerInvoiceMetrics {
  partner_id: string
  partner_name: string
  share_percentage: string
  total_income: string
  org_share_amount: string
  partner_share_amount: string
  org_expenses: string
  journal_adjustments: string
  payments_received: string
  amount_due_to_org: string
}

export interface PartnerResponse {
  name: string
  email?: string | any
  phone?: string | any
  org_share_percentage: number
  id: string
  partner_code: string
  services?: ServiceResponse[]
  created_at: string
  updated_at: string
}

export interface PartnerUpdate {
  name?: string | any
  email?: string | any
  phone?: string | any
  org_share_percentage?: number | any
  service_ids?: string[] | any
}

export interface PaymentMethodCreate {
  name: string
  is_active?: boolean
}

export interface PaymentMethodResponse {
  name: string
  is_active?: boolean
  id: string
  created_at: string
  updated_at: string
}

export interface PaymentMethodUpdate {
  name?: string | any
  is_active?: boolean | any
}

export type PaymentReceivedBy = 'partner' | 'metrobnb'

export type PaymentStatus = 'unpaid' | 'partial' | 'fully_paid'

export interface QuickCaptureExpense {
  receipt_url: string
  receipt_public_id: string
  captured_at?: string | any
  notes?: string | any
}

export interface RecentBooking {
  id: string
  guest_name: string
  unit_name: string
  partner_name: string
  total_amount: string
  booking_date: string
  created_at: string
}

export interface RecentExpense {
  id: string
  type: string
  unit_name: string
  partner_name: string
  amount: string
  paid: boolean
  date: string
  created_at: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  organization_name: string
  role?: string
  plan?: string
}

export interface RevenueByPartner {
  partner_id: string
  partner_name: string
  revenue: string
  org_share_percentage: string
  org_share_computed: string
  actual_invoice: string
}

export interface ServiceCreate {
  name: string
  description?: string | any
}

export interface ServiceResponse {
  name: string
  description?: string | any
  id: string
  created_at: string
  updated_at: string
}

export interface ServiceUpdate {
  name?: string | any
  description?: string | any
}

export interface SetInitialPasswordRequest {
  email: string
  current_password: string
  new_password: string
}

export type SortOrder = 'asc' | 'desc'

export interface UnitCreate {
  name: string
  partner_id: string
  location?: string | any
  notes?: string | any
  type?: string | any
  description?: string | any
  capacity?: number | any
  city?: string | any
  building?: string | any
  landmarks?: string[] | any
  base_price?: number | string | any
  extra_guest_fee?: number | string | any
  cleaning_fee?: number | string | any
  amenity_fee_rules?: string | any
  amenities?: string[] | any
  special_features?: string | any
  check_in_time?: string | any
  check_out_time?: string | any
  pets_allowed?: boolean | any
  smoking_allowed?: boolean | any
  parties_allowed?: boolean | any
  remarks?: string | any
  status?: string | any
  airbnb_url?: string | any
  airbnb_rating?: number | string | any
  bedrooms?: number | any
  beds?: number | any
  bathrooms?: number | string | any
}

export interface UnitResponse {
  name: string
  partner_id: string
  location?: string | any
  notes?: string | any
  type?: string | any
  description?: string | any
  capacity?: number | any
  city?: string | any
  building?: string | any
  landmarks?: string[] | any
  base_price?: string | any
  extra_guest_fee?: string | any
  cleaning_fee?: string | any
  amenity_fee_rules?: string | any
  amenities?: string[] | any
  special_features?: string | any
  check_in_time?: string | any
  check_out_time?: string | any
  pets_allowed?: boolean | any
  smoking_allowed?: boolean | any
  parties_allowed?: boolean | any
  remarks?: string | any
  status?: string | any
  airbnb_url?: string | any
  airbnb_rating?: string | any
  bedrooms?: number | any
  beds?: number | any
  bathrooms?: string | any
  id: string
  created_at: string
  updated_at: string
}

export interface UnitUpdate {
  name?: string | any
  partner_id?: string | any
  location?: string | any
  notes?: string | any
  type?: string | any
  description?: string | any
  capacity?: number | any
  city?: string | any
  building?: string | any
  landmarks?: string[] | any
  base_price?: number | string | any
  extra_guest_fee?: number | string | any
  cleaning_fee?: number | string | any
  amenity_fee_rules?: string | any
  amenities?: string[] | any
  special_features?: string | any
  check_in_time?: string | any
  check_out_time?: string | any
  pets_allowed?: boolean | any
  smoking_allowed?: boolean | any
  parties_allowed?: boolean | any
  remarks?: string | any
  status?: string | any
  airbnb_url?: string | any
  airbnb_rating?: number | string | any
  bedrooms?: number | any
  beds?: number | any
  bathrooms?: number | string | any
}

export interface UpdateProfileRequest {
  name: string
  email: string
}

export interface ValidationError {
  loc: string | number[]
  msg: string
  type: string
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: any
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    per_page: number
    has_next: boolean
    has_prev: boolean
  }
}

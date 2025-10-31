// Auto-generated API client
import type { ApiResponse, PaginatedResponse } from './generated-api'

export class ApiClient {
  private baseURL: string
  private token: string | null = null
  
  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL
  }
  
  setToken(token: string) {
    this.token = token
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async register_api_auth_register_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/register'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async login_api_auth_login_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/login'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_user_profile_api_auth_me_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/me'`,
      { method: 'GET' }
    )
  }

  async refresh_token_api_auth_refresh_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/refresh'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async logout_api_auth_logout_post(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/logout'`,
      { method: 'POST' }
    )
  }

  async test_login_api_auth_test_login_post(email: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/test-login' + '?' + ${email !== undefined ? 'email=' + encodeURIComponent(email) + '&' : ''}.slice(0, -1)`,
      { method: 'POST' }
    )
  }

  async set_password_api_auth_set_password_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/set-password'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async change_password_api_auth_change_password_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/change-password'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async reset_password_api_auth_reset_password_post(email: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/reset-password' + '?' + ${email !== undefined ? 'email=' + encodeURIComponent(email) + '&' : ''}.slice(0, -1)`,
      { method: 'POST' }
    )
  }

  async get_organization_status_api_auth_organization_status_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/organization/status'`,
      { method: 'GET' }
    )
  }

  async invite_user_api_auth_invite_user_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/invite-user'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async test_db_api_auth_test_db_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/test-db'`,
      { method: 'GET' }
    )
  }

  async extend_trial_api_auth_organization_extend_trial_post(trial_days: number): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/auth/organization/extend-trial' + '?' + ${trial_days !== undefined ? 'trial_days=' + encodeURIComponent(trial_days) + '&' : ''}.slice(0, -1)`,
      { method: 'POST' }
    )
  }

  async list_users_api_users_list_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/list'`,
      { method: 'GET' }
    )
  }

  async create_user_api_users__post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_profile_api_users_profile_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/profile'`,
      { method: 'GET' }
    )
  }

  async update_profile_api_users_profile_patch(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/profile'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async change_password_api_users_change_password_post(data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/change-password'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async regenerate_password_api_users__user_id__regenerate_password_post(user_id: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/${user_id}/regenerate-password'`,
      { method: 'POST' }
    )
  }

  async get_user_activity_api_users_activity_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/activity'`,
      { method: 'GET' }
    )
  }

  async delete_user_api_users__user_id__delete(user_id: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/users/${user_id}'`,
      { method: 'DELETE' }
    )
  }

  async list_partners_api_partners_get(page?: number | any, limit?: number | any, search?: string | any, sort_by?: string, sort_order?: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/partners' + '?' + ${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${search !== undefined ? 'search=' + encodeURIComponent(search) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async create_partner_api_partners_post(data: any): Promise<APIResponse_PartnerResponse_> {
    return this.request<APIResponse_PartnerResponse_>(
      `'/api/partners'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_partner_api_partners__partner_id__get(partner_id: string): Promise<APIResponse_PartnerResponse_> {
    return this.request<APIResponse_PartnerResponse_>(
      `'/api/partners/${partner_id}'`,
      { method: 'GET' }
    )
  }

  async update_partner_api_partners__partner_id__put(partner_id: string, data: any): Promise<APIResponse_PartnerResponse_> {
    return this.request<APIResponse_PartnerResponse_>(
      `'/api/partners/${partner_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_partner_api_partners__partner_id__delete(partner_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/partners/${partner_id}'`,
      { method: 'DELETE' }
    )
  }

  async get_partner_units_api_partners__partner_id__units_get(partner_id: string): Promise<APIResponse_List_UnitResponse__> {
    return this.request<APIResponse_List_UnitResponse__>(
      `'/api/partners/${partner_id}/units'`,
      { method: 'GET' }
    )
  }

  async list_units_api_units_get(page?: number | any, limit?: number | any, search?: string | any, sort_by?: string, sort_order?: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/units' + '?' + ${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${search !== undefined ? 'search=' + encodeURIComponent(search) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async create_unit_api_units_post(data: any): Promise<APIResponse_UnitResponse_> {
    return this.request<APIResponse_UnitResponse_>(
      `'/api/units'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_unit_api_units__unit_id__get(unit_id: string): Promise<APIResponse_UnitResponse_> {
    return this.request<APIResponse_UnitResponse_>(
      `'/api/units/${unit_id}'`,
      { method: 'GET' }
    )
  }

  async update_unit_api_units__unit_id__put(unit_id: string, data: any): Promise<APIResponse_UnitResponse_> {
    return this.request<APIResponse_UnitResponse_>(
      `'/api/units/${unit_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_unit_api_units__unit_id__delete(unit_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/units/${unit_id}'`,
      { method: 'DELETE' }
    )
  }

  async list_booking_sources_api_booking_sources_get(): Promise<APIResponse_List_BookingSourceResponse__> {
    return this.request<APIResponse_List_BookingSourceResponse__>(
      `'/api/booking-sources'`,
      { method: 'GET' }
    )
  }

  async create_booking_source_api_booking_sources_post(data: any): Promise<APIResponse_BookingSourceResponse_> {
    return this.request<APIResponse_BookingSourceResponse_>(
      `'/api/booking-sources'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_booking_source_api_booking_sources__source_id__get(source_id: string): Promise<APIResponse_BookingSourceResponse_> {
    return this.request<APIResponse_BookingSourceResponse_>(
      `'/api/booking-sources/${source_id}'`,
      { method: 'GET' }
    )
  }

  async update_booking_source_api_booking_sources__source_id__put(source_id: string, data: any): Promise<APIResponse_BookingSourceResponse_> {
    return this.request<APIResponse_BookingSourceResponse_>(
      `'/api/booking-sources/${source_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_booking_source_api_booking_sources__source_id__delete(source_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/booking-sources/${source_id}'`,
      { method: 'DELETE' }
    )
  }

  async list_bookings_api_bookings_get(partner_id?: string | any, unit_id?: string | any, month?: string | any, start_date?: string | any, end_date?: string | any, payout_start_date?: string | any, payout_end_date?: string | any, payment_status?: PaymentStatus | any, payment_received_by?: PaymentReceivedBy | any, booking_source_id?: string | any, invoiced?: boolean | any, invoice_status?: string | any, page?: number | any, limit?: number | any, search?: string | any, sort_by?: any, sort_order?: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/bookings' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${unit_id !== undefined ? 'unit_id=' + encodeURIComponent(unit_id) + '&' : ''}${month !== undefined ? 'month=' + encodeURIComponent(month) + '&' : ''}${start_date !== undefined ? 'start_date=' + encodeURIComponent(start_date) + '&' : ''}${end_date !== undefined ? 'end_date=' + encodeURIComponent(end_date) + '&' : ''}${payout_start_date !== undefined ? 'payout_start_date=' + encodeURIComponent(payout_start_date) + '&' : ''}${payout_end_date !== undefined ? 'payout_end_date=' + encodeURIComponent(payout_end_date) + '&' : ''}${payment_status !== undefined ? 'payment_status=' + encodeURIComponent(payment_status) + '&' : ''}${payment_received_by !== undefined ? 'payment_received_by=' + encodeURIComponent(payment_received_by) + '&' : ''}${booking_source_id !== undefined ? 'booking_source_id=' + encodeURIComponent(booking_source_id) + '&' : ''}${invoiced !== undefined ? 'invoiced=' + encodeURIComponent(invoiced) + '&' : ''}${invoice_status !== undefined ? 'invoice_status=' + encodeURIComponent(invoice_status) + '&' : ''}${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${search !== undefined ? 'search=' + encodeURIComponent(search) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async create_booking_api_bookings_post(data: any): Promise<APIResponse_BookingResponse_> {
    return this.request<APIResponse_BookingResponse_>(
      `'/api/bookings'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_booking_api_bookings__booking_id__get(booking_id: string): Promise<APIResponse_BookingResponse_> {
    return this.request<APIResponse_BookingResponse_>(
      `'/api/bookings/${booking_id}'`,
      { method: 'GET' }
    )
  }

  async update_booking_api_bookings__booking_id__put(booking_id: string, data: any): Promise<APIResponse_BookingResponse_> {
    return this.request<APIResponse_BookingResponse_>(
      `'/api/bookings/${booking_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_booking_api_bookings__booking_id__delete(booking_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/bookings/${booking_id}'`,
      { method: 'DELETE' }
    )
  }

  async list_expenses_api_expenses_get(partner_id?: string | any, unit_id?: string | any, month?: string | any, type?: ExpenseType | any, status?: ExpenseStatus | any, paid_by?: PaidBy | any, paid?: boolean | any, billable?: boolean | any, needs_review?: boolean | any, date_from?: string | any, date_to?: string | any, amount_min?: number | any, amount_max?: number | any, page?: number | any, limit?: number | any, search?: string | any, sort_by?: string, sort_order?: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/expenses' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${unit_id !== undefined ? 'unit_id=' + encodeURIComponent(unit_id) + '&' : ''}${month !== undefined ? 'month=' + encodeURIComponent(month) + '&' : ''}${type !== undefined ? 'type=' + encodeURIComponent(type) + '&' : ''}${status !== undefined ? 'status=' + encodeURIComponent(status) + '&' : ''}${paid_by !== undefined ? 'paid_by=' + encodeURIComponent(paid_by) + '&' : ''}${paid !== undefined ? 'paid=' + encodeURIComponent(paid) + '&' : ''}${billable !== undefined ? 'billable=' + encodeURIComponent(billable) + '&' : ''}${needs_review !== undefined ? 'needs_review=' + encodeURIComponent(needs_review) + '&' : ''}${date_from !== undefined ? 'date_from=' + encodeURIComponent(date_from) + '&' : ''}${date_to !== undefined ? 'date_to=' + encodeURIComponent(date_to) + '&' : ''}${amount_min !== undefined ? 'amount_min=' + encodeURIComponent(amount_min) + '&' : ''}${amount_max !== undefined ? 'amount_max=' + encodeURIComponent(amount_max) + '&' : ''}${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${search !== undefined ? 'search=' + encodeURIComponent(search) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async create_expense_api_expenses_post(data: any): Promise<APIResponse_ExpenseResponse_> {
    return this.request<APIResponse_ExpenseResponse_>(
      `'/api/expenses'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_expense_api_expenses__expense_id__get(expense_id: string): Promise<APIResponse_ExpenseResponse_> {
    return this.request<APIResponse_ExpenseResponse_>(
      `'/api/expenses/${expense_id}'`,
      { method: 'GET' }
    )
  }

  async update_expense_api_expenses__expense_id__put(expense_id: string, data: any): Promise<APIResponse_ExpenseResponse_> {
    return this.request<APIResponse_ExpenseResponse_>(
      `'/api/expenses/${expense_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_expense_api_expenses__expense_id__delete(expense_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/expenses/${expense_id}'`,
      { method: 'DELETE' }
    )
  }

  async quick_capture_receipt_api_expenses_quick_capture_post(data: any): Promise<APIResponse_ExpenseResponse_> {
    return this.request<APIResponse_ExpenseResponse_>(
      `'/api/expenses/quick-capture'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_draft_expenses_api_expenses_drafts_get(): Promise<APIResponse_List_ExpenseResponse__> {
    return this.request<APIResponse_List_ExpenseResponse__>(
      `'/api/expenses/drafts'`,
      { method: 'GET' }
    )
  }

  async update_ocr_results_api_expenses__expense_id__ocr_results_patch(expense_id: string, data: any): Promise<APIResponse_ExpenseResponse_> {
    return this.request<APIResponse_ExpenseResponse_>(
      `'/api/expenses/${expense_id}/ocr-results'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async complete_expense_api_expenses__expense_id__complete_patch(expense_id: string, data: any): Promise<APIResponse_ExpenseResponse_> {
    return this.request<APIResponse_ExpenseResponse_>(
      `'/api/expenses/${expense_id}/complete'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async bulk_update_expenses_api_expenses_bulk_update_patch(data: any): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/expenses/bulk-update'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async bulk_mark_paid_api_expenses_bulk_mark_paid_patch(paid_date?: string | any, data: any): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/expenses/bulk-mark-paid' + '?' + ${paid_date !== undefined ? 'paid_date=' + encodeURIComponent(paid_date) + '&' : ''}.slice(0, -1)`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async bulk_assign_partner_api_expenses_bulk_assign_partner_patch(partner_id: string, data: any): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/expenses/bulk-assign-partner' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}.slice(0, -1)`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async bulk_set_billable_api_expenses_bulk_set_billable_patch(billable: boolean, data: any): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/expenses/bulk-set-billable' + '?' + ${billable !== undefined ? 'billable=' + encodeURIComponent(billable) + '&' : ''}.slice(0, -1)`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async bulk_delete_expenses_api_expenses_bulk_delete_delete(data: any): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/expenses/bulk-delete'`,
      { method: 'DELETE', body: JSON.stringify(data) }
    )
  }

  async list_journal_entries_api_journal_entries_get(partner_id?: string | any, type?: JournalEntryType | any, status?: JournalEntryStatus | any, start_date?: string | any, end_date?: string | any, page?: number | any, limit?: number | any, sort_by?: string, sort_order?: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/journal-entries' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${type !== undefined ? 'type=' + encodeURIComponent(type) + '&' : ''}${status !== undefined ? 'status=' + encodeURIComponent(status) + '&' : ''}${start_date !== undefined ? 'start_date=' + encodeURIComponent(start_date) + '&' : ''}${end_date !== undefined ? 'end_date=' + encodeURIComponent(end_date) + '&' : ''}${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async create_journal_entry_api_journal_entries_post(data: any): Promise<APIResponse_JournalEntryResponse_> {
    return this.request<APIResponse_JournalEntryResponse_>(
      `'/api/journal-entries'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_journal_entry_api_journal_entries__entry_id__get(entry_id: string): Promise<APIResponse_JournalEntryResponse_> {
    return this.request<APIResponse_JournalEntryResponse_>(
      `'/api/journal-entries/${entry_id}'`,
      { method: 'GET' }
    )
  }

  async update_journal_entry_api_journal_entries__entry_id__put(entry_id: string, data: any): Promise<APIResponse_JournalEntryResponse_> {
    return this.request<APIResponse_JournalEntryResponse_>(
      `'/api/journal-entries/${entry_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_journal_entry_api_journal_entries__entry_id__delete(entry_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/journal-entries/${entry_id}'`,
      { method: 'DELETE' }
    )
  }

  async settle_journal_entry_api_journal_entries__entry_id__settle_patch(entry_id: string, data: any): Promise<APIResponse_JournalEntryResponse_> {
    return this.request<APIResponse_JournalEntryResponse_>(
      `'/api/journal-entries/${entry_id}/settle'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async list_services_api_services_get(): Promise<APIResponse_List_ServiceResponse__> {
    return this.request<APIResponse_List_ServiceResponse__>(
      `'/api/services'`,
      { method: 'GET' }
    )
  }

  async create_service_api_services_post(data: any): Promise<APIResponse_ServiceResponse_> {
    return this.request<APIResponse_ServiceResponse_>(
      `'/api/services'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_service_api_services__service_id__get(service_id: string): Promise<APIResponse_ServiceResponse_> {
    return this.request<APIResponse_ServiceResponse_>(
      `'/api/services/${service_id}'`,
      { method: 'GET' }
    )
  }

  async update_service_api_services__service_id__put(service_id: string, data: any): Promise<APIResponse_ServiceResponse_> {
    return this.request<APIResponse_ServiceResponse_>(
      `'/api/services/${service_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_service_api_services__service_id__delete(service_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/services/${service_id}'`,
      { method: 'DELETE' }
    )
  }

  async list_payment_methods_api_payment_methods_get(): Promise<APIResponse_List_PaymentMethodResponse__> {
    return this.request<APIResponse_List_PaymentMethodResponse__>(
      `'/api/payment-methods'`,
      { method: 'GET' }
    )
  }

  async create_payment_method_api_payment_methods_post(data: any): Promise<APIResponse_PaymentMethodResponse_> {
    return this.request<APIResponse_PaymentMethodResponse_>(
      `'/api/payment-methods'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_payment_method_api_payment_methods__method_id__get(method_id: string): Promise<APIResponse_PaymentMethodResponse_> {
    return this.request<APIResponse_PaymentMethodResponse_>(
      `'/api/payment-methods/${method_id}'`,
      { method: 'GET' }
    )
  }

  async update_payment_method_api_payment_methods__method_id__put(method_id: string, data: any): Promise<APIResponse_PaymentMethodResponse_> {
    return this.request<APIResponse_PaymentMethodResponse_>(
      `'/api/payment-methods/${method_id}'`,
      { method: 'PUT', body: JSON.stringify(data) }
    )
  }

  async delete_payment_method_api_payment_methods__method_id__delete(method_id: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/payment-methods/${method_id}'`,
      { method: 'DELETE' }
    )
  }

  async get_dashboard_metrics_api_analytics_dashboard_get(partner_id?: string | any, start_date?: string | any, end_date?: string | any): Promise<APIResponse_DashboardMetrics_> {
    return this.request<APIResponse_DashboardMetrics_>(
      `'/api/analytics/dashboard' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${start_date !== undefined ? 'start_date=' + encodeURIComponent(start_date) + '&' : ''}${end_date !== undefined ? 'end_date=' + encodeURIComponent(end_date) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async get_partner_invoice_metrics_api_analytics_partner_invoice__partner_id__get(partner_id: string, start_date?: string | any, end_date?: string | any): Promise<APIResponse_PartnerInvoiceMetrics_> {
    return this.request<APIResponse_PartnerInvoiceMetrics_>(
      `'/api/analytics/partner-invoice/${partner_id}' + '?' + ${start_date !== undefined ? 'start_date=' + encodeURIComponent(start_date) + '&' : ''}${end_date !== undefined ? 'end_date=' + encodeURIComponent(end_date) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async generate_partner_invoice_api_analytics_invoices_generate_post(partner_id: string, start_date: string, end_date: string): Promise<APIResponse_PartnerInvoiceMetrics_> {
    return this.request<APIResponse_PartnerInvoiceMetrics_>(
      `'/api/analytics/invoices/generate' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${start_date !== undefined ? 'start_date=' + encodeURIComponent(start_date) + '&' : ''}${end_date !== undefined ? 'end_date=' + encodeURIComponent(end_date) + '&' : ''}.slice(0, -1)`,
      { method: 'POST' }
    )
  }

  async import_airbnb_csv_api_airbnb_import_post(data: any): Promise<APIResponse_AirbnbImportResponse_> {
    return this.request<APIResponse_AirbnbImportResponse_>(
      `'/api/airbnb/import'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async create_draft_invoice_api_invoices_draft_post(data: any): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/draft'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async refresh_invoice_data_api_invoices__invoice_id__refresh_put(invoice_id: string): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}/refresh'`,
      { method: 'PUT' }
    )
  }

  async approve_invoice_api_invoices__invoice_id__approve_patch(invoice_id: string): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}/approve'`,
      { method: 'PATCH' }
    )
  }

  async reject_invoice_api_invoices__invoice_id__reject_patch(invoice_id: string, data: any): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}/reject'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async finalize_invoice_api_invoices__invoice_id__finalize_put(invoice_id: string): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}/finalize'`,
      { method: 'PUT' }
    )
  }

  async send_invoice_api_invoices__invoice_id__send_put(invoice_id: string): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}/send'`,
      { method: 'PUT' }
    )
  }

  async generate_invoice_api_invoices_generate_post(data: any): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/generate'`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async settle_invoice_api_invoices__invoice_id__settle_patch(invoice_id: string, data: any): Promise<APIResponse_Invoice_> {
    return this.request<APIResponse_Invoice_>(
      `'/api/invoices/${invoice_id}/settle'`,
      { method: 'PATCH', body: JSON.stringify(data) }
    )
  }

  async list_archived_invoices_api_invoices_archive_get(partner_id?: string, page?: number, limit?: number, search?: string, sort_by?: string, sort_order?: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/invoices/archive' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${search !== undefined ? 'search=' + encodeURIComponent(search) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async list_invoices_api_invoices__get(partner_id?: string, status?: string, page?: number, limit?: number, search?: string, sort_by?: string, sort_order?: string): Promise<APIResponse_dict_> {
    return this.request<APIResponse_dict_>(
      `'/api/invoices/' + '?' + ${partner_id !== undefined ? 'partner_id=' + encodeURIComponent(partner_id) + '&' : ''}${status !== undefined ? 'status=' + encodeURIComponent(status) + '&' : ''}${page !== undefined ? 'page=' + encodeURIComponent(page) + '&' : ''}${limit !== undefined ? 'limit=' + encodeURIComponent(limit) + '&' : ''}${search !== undefined ? 'search=' + encodeURIComponent(search) + '&' : ''}${sort_by !== undefined ? 'sort_by=' + encodeURIComponent(sort_by) + '&' : ''}${sort_order !== undefined ? 'sort_order=' + encodeURIComponent(sort_order) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async get_invoice_api_invoices__invoice_id__get(invoice_id: string): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}'`,
      { method: 'GET' }
    )
  }

  async delete_invoice_api_invoices__invoice_id__delete(invoice_id: string): Promise<APIResponse_Invoice_> {
    return this.request<APIResponse_Invoice_>(
      `'/api/invoices/${invoice_id}'`,
      { method: 'DELETE' }
    )
  }

  async cancel_invoice_api_invoices__invoice_id__cancel_patch(invoice_id: string): Promise<APIResponse_Invoice_> {
    return this.request<APIResponse_Invoice_>(
      `'/api/invoices/${invoice_id}/cancel'`,
      { method: 'PATCH' }
    )
  }

  async regenerate_invoice_api_invoices__invoice_id__regenerate_post(invoice_id: string): Promise<APIResponse_InvoiceWithItems_> {
    return this.request<APIResponse_InvoiceWithItems_>(
      `'/api/invoices/${invoice_id}/regenerate'`,
      { method: 'POST' }
    )
  }

  async get_upload_url_api_files_upload_url_post(folder: string, filename: string, content_type?: string | any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/files/upload-url' + '?' + ${folder !== undefined ? 'folder=' + encodeURIComponent(folder) + '&' : ''}${filename !== undefined ? 'filename=' + encodeURIComponent(filename) + '&' : ''}${content_type !== undefined ? 'content_type=' + encodeURIComponent(content_type) + '&' : ''}.slice(0, -1)`,
      { method: 'POST' }
    )
  }

  async upload_file_api_files_upload_post(folder?: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/files/upload' + '?' + ${folder !== undefined ? 'folder=' + encodeURIComponent(folder) + '&' : ''}.slice(0, -1)`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_file_url_api_files__file_id__url_get(file_id: string, expires_in?: number): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/files/${file_id}/url' + '?' + ${expires_in !== undefined ? 'expires_in=' + encodeURIComponent(expires_in) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async delete_file_api_files__file_id__delete(file_id: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/files/${file_id}'`,
      { method: 'DELETE' }
    )
  }

  async simple_upload_api_simple_upload_post(folder?: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/simple/upload' + '?' + ${folder !== undefined ? 'folder=' + encodeURIComponent(folder) + '&' : ''}.slice(0, -1)`,
      { method: 'POST', body: JSON.stringify(data) }
    )
  }

  async get_earnings_summary_api_reports_earnings_summary_get(start_date: string, end_date: string, organization_id?: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/reports/earnings-summary' + '?' + ${start_date !== undefined ? 'start_date=' + encodeURIComponent(start_date) + '&' : ''}${end_date !== undefined ? 'end_date=' + encodeURIComponent(end_date) + '&' : ''}${organization_id !== undefined ? 'organization_id=' + encodeURIComponent(organization_id) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async get_current_month_earnings_api_reports_earnings_summary_current_month_get(organization_id?: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/reports/earnings-summary/current-month' + '?' + ${organization_id !== undefined ? 'organization_id=' + encodeURIComponent(organization_id) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async get_last_month_earnings_api_reports_earnings_summary_last_month_get(organization_id?: string): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/api/reports/earnings-summary/last-month' + '?' + ${organization_id !== undefined ? 'organization_id=' + encodeURIComponent(organization_id) + '&' : ''}.slice(0, -1)`,
      { method: 'GET' }
    )
  }

  async read_root__get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/'`,
      { method: 'GET' }
    )
  }

  async health_check_health_get(): Promise<ApiResponse<any>> {
    return this.request<any>(
      `'/health'`,
      { method: 'GET' }
    )
  }
}

// Composable for using the typed API client
export const useTypedApi = () => {
  const config = useRuntimeConfig()
  const client = new TypedApiClient(config.public.apiBaseUrl)
  
  // Auto-set token from cookie if available
  try {
    const tokenCookie = useCookie('auth_token')
    if (tokenCookie.value) {
      client.setToken(tokenCookie.value)
    }
  } catch (error) {
    // Ignore cookie errors during initialization
  }
  
  return client
}

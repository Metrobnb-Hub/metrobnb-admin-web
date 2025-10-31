// Migration helper to gradually adopt typed API
// This allows you to use both old and new API methods during transition

import type { 
  PartnerResponse as TypedPartner,
  UnitResponse as TypedUnit,
  BookingResponse as TypedBooking,
  ExpenseResponse as TypedExpense
} from '~/types/generated-api'

import type { 
  Partner as LegacyPartner,
  Unit as LegacyUnit,
  Booking as LegacyBooking,
  Expense as LegacyExpense
} from '~/types/api'

// Type converters for gradual migration
export const convertPartner = (typed: TypedPartner): LegacyPartner => ({
  id: typed.id,
  name: typed.name,
  share_percentage: typed.share_percentage,
  services: typed.services.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description || '',
    created_at: s.created_at,
    updated_at: s.updated_at
  })),
  email: typed.email,
  created_at: typed.created_at,
  updated_at: typed.updated_at
})

export const convertUnit = (typed: TypedUnit): LegacyUnit => ({
  id: typed.id,
  name: typed.name,
  partner_id: typed.partner_id,
  organization_id: '', // Not in new API
  location: typed.location,
  notes: typed.notes,
  type: typed.type,
  description: typed.description,
  capacity: typed.capacity,
  city: typed.city,
  building: typed.building,
  landmarks: typed.landmarks,
  base_price: typeof typed.base_price === 'string' ? parseFloat(typed.base_price) : typed.base_price,
  extra_guest_fee: typeof typed.extra_guest_fee === 'string' ? parseFloat(typed.extra_guest_fee || '0') : typed.extra_guest_fee,
  cleaning_fee: typeof typed.cleaning_fee === 'string' ? parseFloat(typed.cleaning_fee || '0') : typed.cleaning_fee,
  amenity_fee_rules: typed.amenity_fee_rules,
  amenities: typed.amenities,
  special_features: typed.special_features,
  check_in_time: typed.check_in_time,
  check_out_time: typed.check_out_time,
  pets_allowed: typed.pets_allowed,
  smoking_allowed: typed.smoking_allowed,
  parties_allowed: typed.parties_allowed,
  remarks: typed.remarks,
  status: typed.status,
  airbnb_url: typed.airbnb_url,
  airbnb_rating: typeof typed.airbnb_rating === 'string' ? parseFloat(typed.airbnb_rating || '0') : typed.airbnb_rating,
  bedrooms: typed.bedrooms,
  beds: typed.beds,
  bathrooms: typeof typed.bathrooms === 'string' ? parseFloat(typed.bathrooms || '0') : typed.bathrooms,
  created_at: typed.created_at,
  updated_at: typed.updated_at
})

export const convertBooking = (typed: TypedBooking): LegacyBooking => ({
  id: typed.id,
  guest_name: typed.guest_name,
  booking_date: typed.booking_date,
  start_date: typed.start_date,
  end_date: typed.end_date,
  base_amount: typed.base_amount,
  addons: typed.addons || [],
  unit_id: typed.unit_id,
  partner_id: typed.partner_id,
  payment_status: typed.payment_status,
  booking_status: typed.booking_status,
  amount_paid: typed.amount_paid,
  payment_method: typed.payment_method,
  payment_method_id: typed.payment_method_id,
  payment_received_by: typed.payment_received_by,
  booking_source_id: typed.booking_source_id,
  invoiced: typed.invoiced,
  invoice_date: typed.invoice_date,
  notes: typed.notes,
  created_at: typed.created_at,
  updated_at: typed.updated_at
})

export const convertExpense = (typed: TypedExpense): LegacyExpense => ({
  id: typed.id,
  partner_id: typed.partner_id || '',
  unit_id: typed.unit_id || '',
  date: typed.date,
  type: typed.type as any, // Type mapping needed
  amount: typed.amount,
  billable: typed.billable,
  paid: typed.paid,
  paid_date: typed.paid_date,
  notes: typed.notes,
  created_at: typed.created_at,
  updated_at: typed.updated_at
})

// Hybrid API composable that uses typed client but returns legacy format
export const useHybridApi = () => {
  const typedApi = useTypedApi()
  const { handleApiError } = useErrorHandler()

  // Partners - returns legacy format but uses typed client
  const getPartners = async (): Promise<LegacyPartner[]> => {
    try {
      const response = await typedApi.getPartners()
      if (response.success) {
        const partners = Array.isArray(response.data) ? response.data : response.data?.items || []
        return partners.map(convertPartner)
      }
      return []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const getPartnerById = async (id: string): Promise<LegacyPartner | null> => {
    try {
      const response = await typedApi.getPartner(id)
      return response.success && response.data ? convertPartner(response.data) : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  // Units - returns legacy format but uses typed client
  const getUnits = async (): Promise<LegacyUnit[]> => {
    try {
      const response = await typedApi.getUnits()
      if (response.success) {
        const units = Array.isArray(response.data) ? response.data : response.data?.items || []
        return units.map(convertUnit)
      }
      return []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Bookings - returns legacy format but uses typed client
  const getBookings = async (filters?: any): Promise<LegacyBooking[]> => {
    try {
      const response = await typedApi.getBookings(filters)
      if (response.success) {
        const bookings = Array.isArray(response.data) ? response.data : response.data?.items || []
        return bookings.map(convertBooking)
      }
      return []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Expenses - returns legacy format but uses typed client
  const getExpenses = async (filters?: any): Promise<LegacyExpense[]> => {
    try {
      const response = await typedApi.getExpenses(filters)
      if (response.success) {
        const expenses = Array.isArray(response.data) ? response.data : response.data?.items || []
        return expenses.map(convertExpense)
      }
      return []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Services - already compatible
  const getServices = async () => {
    try {
      const response = await typedApi.getServices()
      return response.success ? response.data || [] : []
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Return both legacy-compatible methods and direct typed access
  return {
    // Legacy-compatible methods
    getPartners,
    getPartnerById,
    getUnits,
    getBookings,
    getExpenses,
    getServices,
    
    // Direct typed client access for new code
    typed: typedApi,
    
    // Converters for manual migration
    converters: {
      convertPartner,
      convertUnit,
      convertBooking,
      convertExpense
    }
  }
}

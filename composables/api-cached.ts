/**
 * Cached API composable with standardized error handling
 *
 * @deprecated Use useUnifiedCache directly for better consistency
 */
import type { ApiResult } from './useApiResult'
import type { Partner, Unit, Service, Booking } from '~/types/api'

export const useCachedApi = () => {
  const cache = useApiCache()
  const { wrapApiCall } = useApiResult

  // Partners with caching and standardized error handling
  const getPartners = async (force = false): Promise<ApiResult<Partner[]>> => {
    return wrapApiCall(
      () => cache.getCachedPartners(force),
      {
        errorMessage: 'Failed to load partners',
        showToast: true
      }
    )
  }

  const createPartner = async (data: any): Promise<ApiResult<Partner>> => {
    return wrapApiCall(
      async () => {
        const response = await cache.createPartner(data)
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to create partner')
        }
        return response.data
      },
      {
        errorMessage: 'Failed to create partner',
        showToast: true
      }
    )
  }

  // Units with caching and standardized error handling
  const getUnits = async (force = false): Promise<ApiResult<Unit[]>> => {
    return wrapApiCall(
      () => cache.getCachedUnits(force),
      {
        errorMessage: 'Failed to load units',
        showToast: true
      }
    )
  }

  // Bookings with caching and standardized error handling
  const getBookings = async (filters?: any, force = false): Promise<ApiResult<Booking[]>> => {
    return wrapApiCall(
      () => cache.getCachedBookings(filters, force),
      {
        errorMessage: 'Failed to load bookings',
        showToast: true
      }
    )
  }

  const createBooking = async (data: any): Promise<ApiResult<Booking>> => {
    return wrapApiCall(
      async () => {
        const response = await cache.createBooking(data)
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to create booking')
        }
        return response.data
      },
      {
        errorMessage: 'Failed to create booking',
        showToast: true
      }
    )
  }

  // Services with caching and standardized error handling
  const getServices = async (force = false): Promise<ApiResult<Service[]>> => {
    return wrapApiCall(
      () => cache.getCachedServices(force),
      {
        errorMessage: 'Failed to load services',
        showToast: true
      }
    )
  }

  // Cache management
  const refreshCache = (pattern?: string) => {
    cache.invalidateCache(pattern)
  }

  return {
    // Cached API methods (now return ApiResult<T>)
    getPartners,
    getUnits,
    getBookings,
    getServices,

    // Create/Update methods (now return ApiResult<T>)
    createPartner,
    createBooking,

    // Cache control
    refreshCache,
    refreshAll: () => refreshCache(),

    // Direct access to cache and API
    cache,
    api: cache.api
  }
}

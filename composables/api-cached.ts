// Main API composable with smart caching
export const useCachedApi = () => {
  const cache = useApiCache()
  const { handleApiError } = useErrorHandler()

  // Partners with caching
  const getPartners = async (force = false) => {
    try {
      return await cache.getCachedPartners(force)
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const createPartner = async (data: any) => {
    try {
      const response = await cache.createPartner(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  // Units with caching
  const getUnits = async (force = false) => {
    try {
      return await cache.getCachedUnits(force)
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Bookings with caching
  const getBookings = async (filters?: any, force = false) => {
    try {
      return await cache.getCachedBookings(filters, force)
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  const createBooking = async (data: any) => {
    try {
      const response = await cache.createBooking(data)
      return response.success ? response.data : null
    } catch (error) {
      handleApiError(error)
      return null
    }
  }

  // Services with caching
  const getServices = async (force = false) => {
    try {
      return await cache.getCachedServices(force)
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  // Cache management
  const refreshCache = (pattern?: string) => {
    cache.invalidateCache(pattern)
  }

  return {
    // Cached API methods
    getPartners,
    getUnits, 
    getBookings,
    getServices,
    
    // Create/Update methods
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

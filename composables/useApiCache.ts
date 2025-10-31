// Smart API caching - cache data but refresh when needed
interface CacheEntry<T> {
  data: T
  timestamp: number
  key: string
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    })
  }

  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const maxAge = ttl || this.defaultTTL
    const isExpired = Date.now() - entry.timestamp > maxAge

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null
  }
}

const apiCache = new ApiCache()

export const useApiCache = () => {
  const typedApi = useTypedApi()

  // Cached API methods
  const getCachedPartners = async (force = false) => {
    const cacheKey = 'partners'
    
    if (!force) {
      const cached = apiCache.get(cacheKey)
      if (cached) return cached
    }

    const response = await typedApi.getPartners()
    if (response.success) {
      const data = Array.isArray(response.data) ? response.data : response.data?.items || []
      apiCache.set(cacheKey, data)
      return data
    }
    return []
  }

  const getCachedUnits = async (force = false) => {
    const cacheKey = 'units'
    
    if (!force) {
      const cached = apiCache.get(cacheKey)
      if (cached) return cached
    }

    const response = await typedApi.getUnits()
    if (response.success) {
      const data = Array.isArray(response.data) ? response.data : response.data?.items || []
      apiCache.set(cacheKey, data)
      return data
    }
    return []
  }

  const getCachedBookings = async (filters?: any, force = false) => {
    const cacheKey = `bookings-${JSON.stringify(filters || {})}`
    
    if (!force) {
      const cached = apiCache.get(cacheKey, 2 * 60 * 1000) // 2 min for bookings
      if (cached) return cached
    }

    const response = await typedApi.getBookings(filters)
    if (response.success) {
      const data = Array.isArray(response.data) ? response.data : response.data?.items || []
      apiCache.set(cacheKey, data)
      return data
    }
    return []
  }

  const getCachedServices = async (force = false) => {
    const cacheKey = 'services'
    
    if (!force) {
      const cached = apiCache.get(cacheKey, 30 * 60 * 1000) // 30 min for services
      if (cached) return cached
    }

    const response = await typedApi.getServices()
    if (response.success) {
      apiCache.set(cacheKey, response.data || [])
      return response.data || []
    }
    return []
  }

  // Invalidate cache when data changes
  const invalidateCache = (pattern?: string) => {
    apiCache.invalidate(pattern)
  }

  // Create/Update operations that invalidate cache
  const createPartner = async (data: any) => {
    const response = await typedApi.createPartner(data)
    if (response.success) {
      invalidateCache('partners') // Refresh partners cache
    }
    return response
  }

  const updatePartner = async (id: string, data: any) => {
    const response = await typedApi.updatePartner(id, data)
    if (response.success) {
      invalidateCache('partners')
    }
    return response
  }

  const createBooking = async (data: any) => {
    const response = await typedApi.createBooking(data)
    if (response.success) {
      invalidateCache('bookings') // Refresh all booking caches
    }
    return response
  }

  return {
    // Cached getters
    getCachedPartners,
    getCachedUnits,
    getCachedBookings,
    getCachedServices,
    
    // Cache management
    invalidateCache,
    refreshAll: () => invalidateCache(),
    
    // Create/Update with cache invalidation
    createPartner,
    updatePartner,
    createBooking,
    
    // Direct API access
    api: typedApi,
    
    // Cache status
    isCached: (key: string) => apiCache.has(key)
  }
}

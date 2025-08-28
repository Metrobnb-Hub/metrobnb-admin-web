interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 15 * 60 * 1000 // 15 minutes - more aggressive caching

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
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
    return this.get(key) !== null
  }
}

const globalCache = new ApiCache()

export const useCache = () => {
  const getCacheKey = (endpoint: string, params?: Record<string, any>): string => {
    if (!params) return endpoint
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          result[key] = params[key]
        }
        return result
      }, {} as Record<string, any>)
    
    return `${endpoint}?${new URLSearchParams(sortedParams).toString()}`
  }

  const cachedFetch = async <T>(
    endpoint: string, 
    params?: Record<string, any>,
    options?: { ttl?: number; skipCache?: boolean }
  ): Promise<T> => {
    const cacheKey = getCacheKey(endpoint, params)
    
    // Return cached data if available and not skipping cache
    if (!options?.skipCache) {
      const cached = globalCache.get<T>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Fetch fresh data
    console.log('🌐 cachedFetch making API call to:', endpoint)
    const { useApi } = await import('./api')
    const api = useApi()
    
    let result: T
    if (endpoint === '/api/partners') {
      console.log('📞 Calling api.getPartners()')
      result = await api.getPartners() as T
    } else if (endpoint === '/api/units') {
      result = await api.getUnits() as T
    } else if (endpoint === '/api/booking-sources') {
      result = await api.getBookingSources() as T
    } else if (endpoint === '/api/payment-methods') {
      result = await api.getPaymentMethods() as T
    } else if (endpoint === '/api/services') {
      result = await api.getServices() as T
    } else {
      throw new Error(`Unsupported cached endpoint: ${endpoint}`)
    }
    
    console.log('📊 cachedFetch result:', result)

    // Cache the result
    globalCache.set(cacheKey, result, options?.ttl)
    return result
  }

  return {
    get: globalCache.get.bind(globalCache),
    set: globalCache.set.bind(globalCache),
    invalidate: globalCache.invalidate.bind(globalCache),
    has: globalCache.has.bind(globalCache),
    cachedFetch,
    getCacheKey
  }
}
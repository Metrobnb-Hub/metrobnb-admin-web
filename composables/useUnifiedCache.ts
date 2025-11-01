/**
 * Unified API Cache System
 *
 * Consolidates all caching logic into a single, comprehensive system with:
 * - LRU cache with size limits
 * - TTL-based expiration
 * - Request deduplication
 * - Loading state management
 * - Pattern-based invalidation
 * - AbortController support for cancellation
 */

import type { Partner, Unit, Service, Expense, BookingSource, PaymentMethod } from '~/types/api'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface LoadingState {
  partners: boolean
  units: boolean
  expenses: boolean
  services: boolean
  bookingSources: boolean
  paymentMethods: boolean
}

interface DataCache {
  partners: Partner[]
  units: Unit[]
  expenses: Expense[]
  services: Service[]
  bookingSources: BookingSource[]
  paymentMethods: PaymentMethod[]
}

// LRU Cache implementation with size limits
class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize = 200 // Limit cache entries
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set(key: string, data: T, ttl?: number): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)

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

  size(): number {
    return this.cache.size
  }

  clear(): void {
    this.cache.clear()
  }
}

// Global instances
const lruCache = new LRUCache<any>()

// Global reactive data cache for commonly accessed resources
const globalDataCache = reactive<DataCache>({
  partners: [],
  units: [],
  expenses: [],
  services: [],
  bookingSources: [],
  paymentMethods: []
})

const globalLoadingState = reactive<LoadingState>({
  partners: false,
  units: false,
  expenses: false,
  services: false,
  bookingSources: false,
  paymentMethods: false
})

const globalLastLoaded = reactive<Record<keyof DataCache, number>>({
  partners: 0,
  units: 0,
  expenses: 0,
  services: 0,
  bookingSources: 0,
  paymentMethods: 0
})

// Track pending requests to prevent duplicates
const pendingRequests = new Map<string, Promise<any>>()

// AbortControllers for request cancellation
const abortControllers = new Map<string, AbortController>()

// Cache TTL configurations (in milliseconds)
const CACHE_TTL = {
  partners: 10 * 60 * 1000,      // 10 minutes
  units: 10 * 60 * 1000,         // 10 minutes
  services: 30 * 60 * 1000,      // 30 minutes (rarely change)
  bookingSources: 30 * 60 * 1000,// 30 minutes
  paymentMethods: 30 * 60 * 1000,// 30 minutes
  expenses: 5 * 60 * 1000,       // 5 minutes (more volatile)
  bookings: 2 * 60 * 1000,       // 2 minutes (very volatile)
  analytics: 5 * 60 * 1000       // 5 minutes
} as const

export const useUnifiedCache = () => {
  const api = useApi()

  /**
   * Generate consistent cache key from endpoint and params
   */
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

    return `${endpoint}:${JSON.stringify(sortedParams)}`
  }

  /**
   * Check if global cache is valid for a resource
   */
  const isGlobalCacheValid = (key: keyof DataCache): boolean => {
    const ttl = CACHE_TTL[key] || CACHE_TTL.expenses
    return (
      globalDataCache[key].length > 0 &&
      Date.now() - globalLastLoaded[key] < ttl
    )
  }

  /**
   * Generic cached request with deduplication and cancellation support
   */
  const cachedRequest = async <T>(
    key: string,
    fetcher: (signal?: AbortSignal) => Promise<T>,
    options?: {
      ttl?: number
      force?: boolean
      signal?: AbortSignal
    }
  ): Promise<T> => {
    // Check cache first (unless force refresh)
    if (!options?.force) {
      const cached = lruCache.get<T>(key)
      if (cached) return cached
    }

    // Check for pending request
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key) as Promise<T>
    }

    // Create AbortController for this request
    const controller = new AbortController()
    abortControllers.set(key, controller)

    // Chain with parent signal if provided
    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort())
    }

    // Create the promise
    const promise = fetcher(controller.signal)
      .then((data) => {
        // Cache the result
        lruCache.set(key, data, options?.ttl)
        return data
      })
      .finally(() => {
        // Cleanup
        pendingRequests.delete(key)
        abortControllers.delete(key)
      })

    // Store pending request
    pendingRequests.set(key, promise)

    return promise
  }

  /**
   * Load partners with global cache
   */
  const loadPartners = async (force = false): Promise<Partner[]> => {
    // Check global cache first
    if (!force && isGlobalCacheValid('partners')) {
      return globalDataCache.partners
    }

    // Wait if already loading
    if (globalLoadingState.partners) {
      while (globalLoadingState.partners) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.partners
    }

    try {
      globalLoadingState.partners = true

      const data = await cachedRequest<Partner[]>(
        'global:partners',
        async () => {
          const response = await api.getPartners()
          return Array.isArray(response) ? response : []
        },
        { ttl: CACHE_TTL.partners, force }
      )

      globalDataCache.partners = data
      globalLastLoaded.partners = Date.now()
      return data
    } finally {
      globalLoadingState.partners = false
    }
  }

  /**
   * Load units with global cache
   */
  const loadUnits = async (force = false): Promise<Unit[]> => {
    if (!force && isGlobalCacheValid('units')) {
      return globalDataCache.units
    }

    if (globalLoadingState.units) {
      while (globalLoadingState.units) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.units
    }

    try {
      globalLoadingState.units = true

      const data = await cachedRequest<Unit[]>(
        'global:units',
        async () => {
          const response = await api.getUnits()
          return Array.isArray(response) ? response : []
        },
        { ttl: CACHE_TTL.units, force }
      )

      globalDataCache.units = data
      globalLastLoaded.units = Date.now()
      return data
    } finally {
      globalLoadingState.units = false
    }
  }

  /**
   * Load services with global cache
   */
  const loadServices = async (force = false): Promise<Service[]> => {
    if (!force && isGlobalCacheValid('services')) {
      return globalDataCache.services
    }

    if (globalLoadingState.services) {
      while (globalLoadingState.services) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.services
    }

    try {
      globalLoadingState.services = true

      const data = await cachedRequest<Service[]>(
        'global:services',
        async () => {
          const response = await api.getServices()
          return Array.isArray(response) ? response : []
        },
        { ttl: CACHE_TTL.services, force }
      )

      globalDataCache.services = data
      globalLastLoaded.services = Date.now()
      return data
    } finally {
      globalLoadingState.services = false
    }
  }

  /**
   * Load expenses with global cache
   */
  const loadExpenses = async (force = false): Promise<Expense[]> => {
    if (!force && isGlobalCacheValid('expenses')) {
      return globalDataCache.expenses
    }

    if (globalLoadingState.expenses) {
      while (globalLoadingState.expenses) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.expenses
    }

    try {
      globalLoadingState.expenses = true

      const data = await cachedRequest<Expense[]>(
        'global:expenses',
        async () => {
          const response = await api.getExpenses()
          return Array.isArray(response) ? response : []
        },
        { ttl: CACHE_TTL.expenses, force }
      )

      globalDataCache.expenses = data
      globalLastLoaded.expenses = Date.now()
      return data
    } finally {
      globalLoadingState.expenses = false
    }
  }

  /**
   * Load booking sources with global cache
   */
  const loadBookingSources = async (force = false): Promise<BookingSource[]> => {
    if (!force && isGlobalCacheValid('bookingSources')) {
      return globalDataCache.bookingSources
    }

    if (globalLoadingState.bookingSources) {
      while (globalLoadingState.bookingSources) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.bookingSources
    }

    try {
      globalLoadingState.bookingSources = true

      const data = await cachedRequest<BookingSource[]>(
        'global:bookingSources',
        async () => {
          const response = await api.getBookingSources()
          return Array.isArray(response) ? response : []
        },
        { ttl: CACHE_TTL.bookingSources, force }
      )

      globalDataCache.bookingSources = data
      globalLastLoaded.bookingSources = Date.now()
      return data
    } finally {
      globalLoadingState.bookingSources = false
    }
  }

  /**
   * Load payment methods with global cache
   */
  const loadPaymentMethods = async (force = false): Promise<PaymentMethod[]> => {
    if (!force && isGlobalCacheValid('paymentMethods')) {
      return globalDataCache.paymentMethods
    }

    if (globalLoadingState.paymentMethods) {
      while (globalLoadingState.paymentMethods) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.paymentMethods
    }

    try {
      globalLoadingState.paymentMethods = true

      const data = await cachedRequest<PaymentMethod[]>(
        'global:paymentMethods',
        async () => {
          const response = await api.getPaymentMethods()
          return Array.isArray(response) ? response : []
        },
        { ttl: CACHE_TTL.paymentMethods, force }
      )

      globalDataCache.paymentMethods = data
      globalLastLoaded.paymentMethods = Date.now()
      return data
    } finally {
      globalLoadingState.paymentMethods = false
    }
  }

  /**
   * Load all resources in parallel
   */
  const loadAll = async (force = false) => {
    const [partners, units, expenses, services, bookingSources, paymentMethods] = await Promise.all([
      loadPartners(force),
      loadUnits(force),
      loadExpenses(force),
      loadServices(force),
      loadBookingSources(force),
      loadPaymentMethods(force)
    ])

    return { partners, units, expenses, services, bookingSources, paymentMethods }
  }

  /**
   * Invalidate cache by pattern or specific key
   */
  const invalidateCache = (pattern?: string | keyof DataCache) => {
    if (!pattern) {
      // Invalidate everything
      lruCache.clear()
      Object.keys(globalLastLoaded).forEach(k => {
        const key = k as keyof DataCache
        globalLastLoaded[key] = 0
        globalDataCache[key] = [] as any
      })
      return
    }

    // Invalidate specific global cache
    if (pattern in globalLastLoaded) {
      const key = pattern as keyof DataCache
      globalLastLoaded[key] = 0
      globalDataCache[key] = [] as any
    }

    // Invalidate LRU cache by pattern
    lruCache.invalidate(pattern)
  }

  /**
   * Refresh specific resource or all
   */
  const refreshData = async (key?: keyof DataCache) => {
    if (key) {
      switch (key) {
        case 'partners': return await loadPartners(true)
        case 'units': return await loadUnits(true)
        case 'expenses': return await loadExpenses(true)
        case 'services': return await loadServices(true)
        case 'bookingSources': return await loadBookingSources(true)
        case 'paymentMethods': return await loadPaymentMethods(true)
      }
    } else {
      return await loadAll(true)
    }
  }

  /**
   * Cancel all pending requests
   */
  const cancelAllRequests = () => {
    abortControllers.forEach(controller => controller.abort())
    abortControllers.clear()
    pendingRequests.clear()
  }

  /**
   * Cancel specific request by key
   */
  const cancelRequest = (key: string) => {
    const controller = abortControllers.get(key)
    if (controller) {
      controller.abort()
      abortControllers.delete(key)
      pendingRequests.delete(key)
    }
  }

  /**
   * Get cache statistics
   */
  const getCacheStats = () => {
    return {
      lruSize: lruCache.size(),
      pendingRequests: pendingRequests.size,
      activeControllers: abortControllers.size,
      globalCache: {
        partners: globalDataCache.partners.length,
        units: globalDataCache.units.length,
        expenses: globalDataCache.expenses.length,
        services: globalDataCache.services.length,
        bookingSources: globalDataCache.bookingSources.length,
        paymentMethods: globalDataCache.paymentMethods.length
      },
      lastLoaded: { ...globalLastLoaded }
    }
  }

  return {
    // Data (readonly reactive refs)
    partners: readonly(toRef(globalDataCache, 'partners')),
    units: readonly(toRef(globalDataCache, 'units')),
    expenses: readonly(toRef(globalDataCache, 'expenses')),
    services: readonly(toRef(globalDataCache, 'services')),
    bookingSources: readonly(toRef(globalDataCache, 'bookingSources')),
    paymentMethods: readonly(toRef(globalDataCache, 'paymentMethods')),

    // Loading states (readonly)
    isLoading: readonly(globalLoadingState),

    // Load methods
    loadPartners,
    loadUnits,
    loadExpenses,
    loadServices,
    loadBookingSources,
    loadPaymentMethods,
    loadAll,

    // Cache management
    invalidateCache,
    refreshData,
    getCacheKey,
    cachedRequest,

    // Request cancellation
    cancelAllRequests,
    cancelRequest,

    // Low-level cache operations
    lruCache: {
      get: lruCache.get.bind(lruCache),
      set: lruCache.set.bind(lruCache),
      has: lruCache.has.bind(lruCache),
      invalidate: lruCache.invalidate.bind(lruCache)
    },

    // Diagnostics
    getCacheStats
  }
}

// Cleanup on component unmount
if (process.client) {
  const { cancelAllRequests } = useUnifiedCache()

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      cancelAllRequests()
    })
  }
}

interface DataCache {
  partners: any[]
  units: any[]
  expenses: any[]
  services: any[]
  bookingSources: any[]
  paymentMethods: any[]
}

interface LoadingState {
  partners: boolean
  units: boolean
  expenses: boolean
  services: boolean
  bookingSources: boolean
  paymentMethods: boolean
}

// Global cache that persists across navigation
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

export const useDataManager = () => {
  const { cachedFetch, invalidate } = useCache()
  const { 
    getPartners, 
    getUnits, 
    getExpenses, 
    getServices, 
    getBookingSources,
    getPaymentMethods
  } = useApi()

  const CACHE_DURATION = parseInt(process.env.CACHE_DURATION_MINUTES || '5') * 60 * 1000

  const isCacheValid = (key: keyof DataCache) => {
    return Date.now() - globalLastLoaded[key] < CACHE_DURATION
  }

  const loadPartners = async (force = false) => {
    console.log('🔍 loadPartners - force:', force, 'cache length:', globalDataCache.partners.length, 'cache valid:', isCacheValid('partners'))
    if (!force && globalDataCache.partners.length > 0 && isCacheValid('partners')) {
      console.log('✅ Using cached partners')
      return globalDataCache.partners
    }
    
    // If cache is valid but empty, invalidate it
    if (globalDataCache.partners.length === 0 && isCacheValid('partners')) {
      console.log('🗑️ Cache valid but empty - invalidating')
      globalLastLoaded.partners = 0
    }
    console.log('🌐 Fetching fresh partners from API')

    if (globalLoadingState.partners) {
      while (globalLoadingState.partners) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return globalDataCache.partners
    }

    try {
      globalLoadingState.partners = true
      const data = await cachedFetch('/api/partners', undefined, { 
        skipCache: force,
        ttl: 10 * 60 * 1000
      })
      console.log('📊 Raw API response:', data)
      console.log('📊 Is array?', Array.isArray(data))
      globalDataCache.partners = Array.isArray(data) ? data : []
      console.log('💾 Cached partners count:', globalDataCache.partners.length)
      globalLastLoaded.partners = Date.now()
      return globalDataCache.partners
    } finally {
      globalLoadingState.partners = false
    }
  }

  const loadUnits = async (force = false) => {
    if (!force && globalDataCache.units.length > 0 && isCacheValid('units')) {
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
      const data = await cachedFetch('/api/units', undefined, { 
        skipCache: force,
        ttl: 10 * 60 * 1000
      })
      globalDataCache.units = Array.isArray(data) ? data : []
      globalLastLoaded.units = Date.now()
      return globalDataCache.units
    } finally {
      globalLoadingState.units = false
    }
  }

  const loadExpenses = async (force = false) => {
    if (!force && dataCache.expenses.length > 0 && isCacheValid('expenses')) {
      return dataCache.expenses
    }

    if (loadingState.expenses) {
      while (loadingState.expenses) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return dataCache.expenses
    }

    try {
      loadingState.expenses = true
      const data = await getExpenses()
      dataCache.expenses = Array.isArray(data) ? data : []
      lastLoaded.expenses = Date.now()
      return dataCache.expenses
    } finally {
      loadingState.expenses = false
    }
  }

  const loadServices = async (force = false) => {
    if (!force && dataCache.services.length > 0 && isCacheValid('services')) {
      return dataCache.services
    }

    if (loadingState.services) {
      while (loadingState.services) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return dataCache.services
    }

    try {
      loadingState.services = true
      const data = await cachedFetch('/api/services', undefined, { 
        skipCache: force,
        ttl: 15 * 60 * 1000 // 15 minutes
      })
      dataCache.services = Array.isArray(data) ? data : []
      lastLoaded.services = Date.now()
      return dataCache.services
    } finally {
      loadingState.services = false
    }
  }

  const loadBookingSources = async (force = false) => {
    if (!force && dataCache.bookingSources.length > 0 && isCacheValid('bookingSources')) {
      return dataCache.bookingSources
    }

    if (loadingState.bookingSources) {
      while (loadingState.bookingSources) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return dataCache.bookingSources
    }

    try {
      loadingState.bookingSources = true
      const data = await cachedFetch('/api/booking-sources', undefined, { 
        skipCache: force,
        ttl: 15 * 60 * 1000 // 15 minutes
      })
      dataCache.bookingSources = Array.isArray(data) ? data : []
      lastLoaded.bookingSources = Date.now()
      return dataCache.bookingSources
    } finally {
      loadingState.bookingSources = false
    }
  }

  const loadPaymentMethods = async (force = false) => {
    if (!force && dataCache.paymentMethods.length > 0 && isCacheValid('paymentMethods')) {
      return dataCache.paymentMethods
    }

    if (loadingState.paymentMethods) {
      while (loadingState.paymentMethods) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return dataCache.paymentMethods
    }

    try {
      loadingState.paymentMethods = true
      const data = await cachedFetch('/api/payment-methods', undefined, { 
        skipCache: force,
        ttl: 15 * 60 * 1000 // 15 minutes
      })
      dataCache.paymentMethods = Array.isArray(data) ? data : []
      lastLoaded.paymentMethods = Date.now()
      return dataCache.paymentMethods
    } finally {
      loadingState.paymentMethods = false
    }
  }

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

  const invalidateCache = (key?: keyof DataCache) => {
    if (key) {
      lastLoaded[key] = 0
      dataCache[key] = []
    } else {
      // Invalidate all
      Object.keys(lastLoaded).forEach(k => {
        const key = k as keyof DataCache
        lastLoaded[key] = 0
        dataCache[key] = []
      })
    }
  }

  const refreshData = async (key?: keyof DataCache) => {
    if (key) {
      switch (key) {
        case 'partners': return await loadPartners(true)
        case 'units': return await loadUnits(true)
        case 'expenses': return await loadExpenses(true)
        case 'services': return await loadServices(true)
      }
    } else {
      return await loadAll(true)
    }
  }

  return {
    // Data
    partners: readonly(toRef(globalDataCache, 'partners')),
    units: readonly(toRef(globalDataCache, 'units')),
    expenses: readonly(toRef(globalDataCache, 'expenses')),
    services: readonly(toRef(globalDataCache, 'services')),
    bookingSources: readonly(toRef(globalDataCache, 'bookingSources')),
    paymentMethods: readonly(toRef(globalDataCache, 'paymentMethods')),
    
    // Loading states
    isLoading: readonly(globalLoadingState),
    
    // Methods
    loadPartners,
    loadUnits,
    loadExpenses,
    loadServices,
    loadBookingSources,
    loadPaymentMethods,
    loadAll,
    refreshData,
    invalidateCache
  }
}
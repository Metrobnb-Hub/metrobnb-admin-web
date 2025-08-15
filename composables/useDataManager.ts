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

const dataCache = reactive<DataCache>({
  partners: [],
  units: [],
  expenses: [],
  services: [],
  bookingSources: [],
  paymentMethods: []
})

const loadingState = reactive<LoadingState>({
  partners: false,
  units: false,
  expenses: false,
  services: false,
  bookingSources: false,
  paymentMethods: false
})

const lastLoaded = reactive<Record<keyof DataCache, number>>({
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

  const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes - increased for better performance

  const isCacheValid = (key: keyof DataCache) => {
    return Date.now() - lastLoaded[key] < CACHE_DURATION
  }

  const loadPartners = async (force = false) => {
    if (!force && dataCache.partners.length > 0 && isCacheValid('partners')) {
      return dataCache.partners
    }

    if (loadingState.partners) {
      // Wait for existing request
      while (loadingState.partners) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return dataCache.partners
    }

    try {
      loadingState.partners = true
      const data = await cachedFetch('/api/partners', undefined, { 
        skipCache: force,
        ttl: 10 * 60 * 1000 // 10 minutes
      })
      dataCache.partners = Array.isArray(data) ? data : []
      lastLoaded.partners = Date.now()
      return dataCache.partners
    } finally {
      loadingState.partners = false
    }
  }

  const loadUnits = async (force = false) => {
    if (!force && dataCache.units.length > 0 && isCacheValid('units')) {
      return dataCache.units
    }

    if (loadingState.units) {
      while (loadingState.units) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return dataCache.units
    }

    try {
      loadingState.units = true
      const data = await cachedFetch('/api/units', undefined, { 
        skipCache: force,
        ttl: 10 * 60 * 1000 // 10 minutes
      })
      dataCache.units = Array.isArray(data) ? data : []
      lastLoaded.units = Date.now()
      return dataCache.units
    } finally {
      loadingState.units = false
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
    partners: readonly(toRef(dataCache, 'partners')),
    units: readonly(toRef(dataCache, 'units')),
    expenses: readonly(toRef(dataCache, 'expenses')),
    services: readonly(toRef(dataCache, 'services')),
    bookingSources: readonly(toRef(dataCache, 'bookingSources')),
    paymentMethods: readonly(toRef(dataCache, 'paymentMethods')),
    
    // Loading states
    isLoading: readonly(loadingState),
    
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
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
  const { 
    getPartners, 
    getUnits, 
    getExpenses, 
    getServices, 
    getBookingSources 
  } = useApi()

  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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
      const data = await getPartners()
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
      const data = await getUnits()
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
      const data = await getServices()
      dataCache.services = Array.isArray(data) ? data : []
      lastLoaded.services = Date.now()
      return dataCache.services
    } finally {
      loadingState.services = false
    }
  }

  const loadAll = async (force = false) => {
    const [partners, units, expenses, services] = await Promise.all([
      loadPartners(force),
      loadUnits(force),
      loadExpenses(force),
      loadServices(force)
    ])

    return { partners, units, expenses, services }
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
    
    // Loading states
    isLoading: readonly(loadingState),
    
    // Methods
    loadPartners,
    loadUnits,
    loadExpenses,
    loadServices,
    loadAll,
    refreshData,
    invalidateCache
  }
}
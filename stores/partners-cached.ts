// Updated partner store with smart caching
import type { Partner } from '~/types/api'

export const useCachedPartnerStore = defineStore('cachedPartners', () => {
  const partners = ref<PartnerResponse[]>([])
  const services = ref<any[]>([])
  const loading = ref(false)
  
  const { getPartners, getServices, createPartner, cache } = useApi()
  
  // Load partners with caching
  const loadPartners = async (force = false) => {
    loading.value = true
    try {
      partners.value = await getPartners(force)
    } finally {
      loading.value = false
    }
  }
  
  // Load services with caching  
  const loadServices = async (force = false) => {
    try {
      services.value = await getServices(force)
    } catch (error) {
      services.value = []
    }
  }
  
  // Add partner and refresh cache
  const addPartner = async (partnerData: any) => {
    const newPartner = await createPartner(partnerData)
    if (newPartner) {
      partners.value.push(newPartner)
      return newPartner.id
    }
    return null
  }
  
  // Get partner by ID (from cache)
  const getPartnerById = (id: string) => {
    return partners.value.find(p => p.id === id)
  }
  
  // Initialize - load from cache first
  const initialize = async () => {
    await Promise.all([
      loadPartners(), // Uses cache
      loadServices()  // Uses cache
    ])
  }
  
  return {
    // State
    partners: readonly(partners),
    services: readonly(services),
    loading: readonly(loading),
    
    // Actions
    loadPartners,
    loadServices,
    addPartner,
    getPartnerById,
    initialize,
    
    // Cache control
    refresh: () => loadPartners(true),
    refreshAll: () => cache.refreshAll()
  }
})

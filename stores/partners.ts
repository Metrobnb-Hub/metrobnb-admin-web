interface Partner {
  id: string
  name: string
  email?: string
  sharePercentage: number
  services: string[]
  createdAt: string
}

export const usePartnerStore = defineStore('partners', () => {
  const partners = ref<Partner[]>([])
  const { getPartners, getPartnerById } = useMockApi()
  
  const addPartner = (partner: Omit<Partner, 'id' | 'createdAt'>) => {
    const newPartner: Partner = {
      ...partner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    partners.value.push(newPartner)
    persistData()
    return newPartner.id
  }
  
  const getPartnerByIdSync = (id: string) => {
    return partners.value.find(p => p.id === id)
  }
  
  const persistData = () => {
    if (process.client) {
      localStorage.setItem('metrobnb-partners', JSON.stringify(partners.value))
    }
  }
  
  const loadFromStorage = async () => {
    try {
      const mockPartners = await getPartners()
      partners.value = mockPartners
    } catch (error) {
      console.error('Failed to load partners:', error)
    }
  }
  
  return {
    partners: readonly(partners),
    addPartner,
    getPartnerByIdSync,
    getPartnerById,
    loadFromStorage
  }
})
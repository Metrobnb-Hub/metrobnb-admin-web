import type { Partner, Service } from '~/types/api'

interface CreatePartnerData {
  name: string
  email?: string
  sharePercentage: number
  serviceIds: string[]
}

export const usePartnerStore = defineStore('partners', () => {
  const partners = ref<Partner[]>([])
  const services = ref<Service[]>([])
  const { getPartners, getPartnerById, createPartner, updatePartner, deletePartner, getServices } = useApi()
  
  const addPartner = async (partnerData: CreatePartnerData) => {
    const newPartner = await createPartner(partnerData)
    partners.value.push(newPartner)
    return newPartner.id
  }
  
  const getPartnerByIdSync = (id: string) => {
    return partners.value.find(p => p.id === id)
  }
  
  const getServicesByIds = (serviceIds: string[]) => {
    return services.value.filter(s => serviceIds.includes(s.id))
  }
  

  
  const loadFromStorage = async () => {
    try {
      const [partnersData, servicesData] = await Promise.all([
        getPartners(),
        getServices()
      ])
      partners.value = Array.isArray(partnersData) ? partnersData : []
      services.value = Array.isArray(servicesData) ? servicesData : []
    } catch (error) {
      partners.value = []
      services.value = []
    }
  }
  
  const updatePartnerStore = async (id: string, partnerData: Partial<Partner> & { serviceIds?: string[] }) => {
    const updated = await updatePartner(id, partnerData)
    const index = partners.value.findIndex(p => p.id === id)
    if (index !== -1) {
      partners.value[index] = updated
    }
    return updated
  }
  
  const deletePartnerStore = async (id: string) => {
    await deletePartner(id)
    partners.value = partners.value.filter(p => p.id !== id)
  }
  
  return {
    partners,
    services,
    addPartner,
    getPartnerByIdSync,
    getPartnerById,
    getServicesByIds,
    updatePartner: updatePartnerStore,
    deletePartner: deletePartnerStore,
    loadFromStorage
  }
})
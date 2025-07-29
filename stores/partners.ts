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
  const { getPartners, getPartnerById, createPartner, updatePartner, deletePartner } = useApi()
  
  const addPartner = async (partner: Omit<Partner, 'id' | 'createdAt'>) => {
    const newPartner = await createPartner(partner)
    partners.value.push(newPartner)
    return newPartner.id
  }
  
  const getPartnerByIdSync = (id: string) => {
    return partners.value.find(p => p.id === id)
  }
  

  
  const loadFromStorage = async () => {
    try {
      partners.value = await getPartners()
    } catch (error) {
      console.error('Failed to load partners:', error)
    }
  }
  
  const updatePartnerStore = async (id: string, partner: Partial<Partner>) => {
    const updated = await updatePartner(id, partner)
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
    partners: readonly(partners),
    addPartner,
    getPartnerByIdSync,
    getPartnerById,
    updatePartner: updatePartnerStore,
    deletePartner: deletePartnerStore,
    loadFromStorage
  }
})
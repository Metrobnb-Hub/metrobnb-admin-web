interface Unit {
  id: string
  name: string
  location?: string
  partnerId: string
  notes?: string
  createdAt: string
}

export const useUnitStore = defineStore('units', () => {
  const units = ref<Unit[]>([])
  const { getUnits, getUnitsByPartner } = useMockApi()
  
  const addUnit = (unit: Omit<Unit, 'id' | 'createdAt'>) => {
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    units.value.push(newUnit)
    persistData()
    return newUnit.id
  }
  
  const getUnitsByPartnerId = (partnerId: string) => {
    if (!partnerId || !units.value) return []
    return units.value.filter(u => u && u.partnerId === partnerId)
  }
  
  const persistData = () => {
    if (process.client) {
      localStorage.setItem('metrobnb-units', JSON.stringify(units.value))
    }
  }
  
  const loadFromStorage = async () => {
    try {
      const mockUnits = await getUnits()
      units.value = mockUnits
    } catch (error) {
      console.error('Failed to load units:', error)
    }
  }
  
  return {
    units: readonly(units),
    addUnit,
    getUnitsByPartnerId,
    getUnitsByPartner,
    loadFromStorage
  }
})
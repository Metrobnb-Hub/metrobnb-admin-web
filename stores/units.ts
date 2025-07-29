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
  const { getUnits, getUnitsByPartner, createUnit, updateUnit, deleteUnit } = useApi()
  
  const addUnit = async (unit: Omit<Unit, 'id' | 'createdAt'>) => {
    const apiUnit = await createUnit(unit)
    // Transform API response to match frontend interface
    const newUnit = {
      id: apiUnit.id,
      name: apiUnit.name,
      location: apiUnit.location,
      partnerId: apiUnit.partner_id || apiUnit.partnerId,
      notes: apiUnit.notes,
      createdAt: apiUnit.createdAt || apiUnit.created_at
    }
    units.value.push(newUnit)
    return newUnit.id
  }
  
  const getUnitsByPartnerId = (partnerId: string) => {
    if (!partnerId || !units.value) return []
    console.log('Getting units for partner:', partnerId, 'Total units:', units.value.length)
    const filtered = units.value.filter(u => u && u.partnerId === partnerId)
    console.log('Filtered units:', filtered)
    return filtered
  }
  

  
  const loadFromStorage = async () => {
    try {
      const apiUnits = await getUnits()
      // Transform API response to match frontend interface
      units.value = apiUnits.map(unit => ({
        id: unit.id,
        name: unit.name,
        location: unit.location,
        partnerId: unit.partner_id || unit.partnerId, // Handle both field names
        notes: unit.notes,
        createdAt: unit.createdAt || unit.created_at // Handle both field names
      }))
    } catch (error) {
      console.error('Failed to load units:', error)
    }
  }
  
  const updateUnitStore = async (id: string, unit: Partial<Unit>) => {
    const updated = await updateUnit(id, unit)
    const index = units.value.findIndex(u => u.id === id)
    if (index !== -1) {
      units.value[index] = updated
    }
    return updated
  }
  
  const deleteUnitStore = async (id: string) => {
    await deleteUnit(id)
    units.value = units.value.filter(u => u.id !== id)
  }
  
  return {
    units: readonly(units),
    addUnit,
    getUnitsByPartnerId,
    getUnitsByPartner,
    updateUnit: updateUnitStore,
    deleteUnit: deleteUnitStore,
    loadFromStorage
  }
})
import type { Unit } from '~/types/api'

export const useUnitStore = defineStore('units', () => {
  const units = ref<Unit[]>([])
  const { getUnits, getUnitsByPartner, createUnit, updateUnit, deleteUnit } = useApi()
  
  const addUnit = async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUnit = await createUnit(unit)
    units.value.push(newUnit)
    return newUnit.id
  }
  
  const getUnitsByPartnerSync = (partnerId: string) => {
    return units.value.filter(u => u.partnerId === partnerId)
  }
  
  const getUnitByIdSync = (id: string) => {
    return units.value.find(u => u.id === id)
  }
  
  const loadFromStorage = async () => {
    try {
      const unitsData = await getUnits()
      units.value = Array.isArray(unitsData) ? unitsData : []
    } catch (error) {
      console.error('Failed to load units:', error)
      units.value = []
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
    units,
    addUnit,
    getUnitsByPartnerSync,
    getUnitByIdSync,
    getUnitsByPartner,
    updateUnit: updateUnitStore,
    deleteUnit: deleteUnitStore,
    loadFromStorage
  }
})
interface Expense {
  id: string
  partnerId: string
  unitId: string
  date: string
  type: 'cleaning' | 'laundry' | 'utilities' | 'repair' | 'misc'
  amount: number
  notes?: string
  createdAt: string
}

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const { getExpenses } = useMockApi()
  
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    expenses.value.push(newExpense)
    persistData()
    return newExpense.id
  }
  
  const updateExpense = (id: string, updatedExpense: Expense) => {
    const index = expenses.value.findIndex(e => e.id === id)
    if (index !== -1) {
      expenses.value[index] = updatedExpense
      persistData()
    }
  }
  
  const deleteExpense = (id: string) => {
    expenses.value = expenses.value.filter(e => e.id !== id)
    persistData()
  }
  
  const getExpensesByPartner = (partnerId: string) => {
    return expenses.value.filter(e => e.partnerId === partnerId)
  }
  
  const totalExpenses = computed(() => 
    expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  )
  
  const persistData = () => {
    if (process.client) {
      localStorage.setItem('metrobnb-expenses', JSON.stringify(expenses.value))
    }
  }
  
  const loadFromStorage = async () => {
    try {
      const mockExpenses = await getExpenses()
      expenses.value = mockExpenses
    } catch (error) {
      console.error('Failed to load expenses:', error)
    }
  }
  
  return {
    expenses: readonly(expenses),
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByPartner,
    totalExpenses,
    loadFromStorage
  }
})
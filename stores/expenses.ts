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
  const { getExpenses, createExpense, updateExpense: apiUpdateExpense, deleteExpense: apiDeleteExpense } = useApi()
  
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense = await createExpense(expense)
    expenses.value.push(newExpense)
    return newExpense.id
  }
  
  const updateExpense = async (id: string, updatedExpense: Expense) => {
    const index = expenses.value.findIndex(e => e.id === id)
    if (index !== -1) {
      await apiUpdateExpense(id, updatedExpense)
      expenses.value[index] = updatedExpense
    }
  }
  
  const deleteExpense = async (id: string) => {
    await apiDeleteExpense(id)
    expenses.value = expenses.value.filter(e => e.id !== id)
  }
  
  const getExpensesByPartner = (partnerId: string) => {
    return expenses.value.filter(e => e.partnerId === partnerId)
  }
  
  const totalExpenses = computed(() => 
    expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  )
  

  
  const loadFromStorage = async () => {
    try {
      expenses.value = await getExpenses()
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
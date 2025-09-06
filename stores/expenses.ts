import type { Expense } from '~/types/api'

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const { getExpenses, createExpense, updateExpense: apiUpdateExpense, deleteExpense: apiDeleteExpense } = useApi()
  
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense = await createExpense(expense)
    expenses.value.push(newExpense)
    return newExpense.id
  }
  
  const updateExpenseStore = async (id: string, updatedExpense: Partial<Expense>) => {
    const updated = await apiUpdateExpense(id, updatedExpense)
    const index = expenses.value.findIndex(e => e.id === id)
    if (index !== -1) {
      expenses.value[index] = updated
    }
    return updated
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
      const expensesData = await getExpenses()
      expenses.value = Array.isArray(expensesData) ? expensesData : []
    } catch (error) {
      expenses.value = []
    }
  }
  
  return {
    expenses,
    addExpense,
    updateExpense: updateExpenseStore,
    deleteExpense,
    getExpensesByPartner,
    totalExpenses,
    loadFromStorage
  }
})
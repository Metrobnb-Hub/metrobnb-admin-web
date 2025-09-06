/**
 * Composable for refreshing data without page reloads
 */
export const useRefresh = () => {
  const refreshKey = ref(0)
  
  const refresh = () => {
    refreshKey.value++
  }
  
  const refreshData = async (dataLoader: () => Promise<void>) => {
    try {
      await dataLoader()
    } catch (error) {
    }
  }
  
  return {
    refreshKey: readonly(refreshKey),
    refresh,
    refreshData
  }
}
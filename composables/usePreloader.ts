export const usePreloader = () => {
  const { loadAll } = useDataManager()

  const preloadEssentialData = async () => {
    // Preload all essential data in parallel
    try {
      await loadAll()
      console.log('✅ Essential data preloaded successfully')
    } catch (error) {
      console.warn('⚠️ Failed to preload some data:', error)
    }
  }

  return {
    preloadEssentialData
  }
}
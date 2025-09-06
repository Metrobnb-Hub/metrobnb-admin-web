export const usePreloader = () => {
  const { loadAll } = useDataManager()

  const preloadEssentialData = async () => {
    // Preload all essential data in parallel
    try {
      await loadAll()
    } catch (error) {
    }
  }

  return {
    preloadEssentialData
  }
}
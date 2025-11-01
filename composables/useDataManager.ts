/**
 * Data Manager - Backward compatible wrapper for useUnifiedCache
 *
 * This composable now delegates to the unified cache system while
 * maintaining the same API for existing code.
 *
 * @deprecated Use useUnifiedCache directly for new code
 */

export const useDataManager = () => {
  // Delegate to unified cache system
  const unifiedCache = useUnifiedCache()

  return {
    // Data (same reactive refs)
    partners: unifiedCache.partners,
    units: unifiedCache.units,
    expenses: unifiedCache.expenses,
    services: unifiedCache.services,
    bookingSources: unifiedCache.bookingSources,
    paymentMethods: unifiedCache.paymentMethods,

    // Loading states
    isLoading: unifiedCache.isLoading,

    // Methods (proxied to unified cache)
    loadPartners: unifiedCache.loadPartners,
    loadUnits: unifiedCache.loadUnits,
    loadExpenses: unifiedCache.loadExpenses,
    loadServices: unifiedCache.loadServices,
    loadBookingSources: unifiedCache.loadBookingSources,
    loadPaymentMethods: unifiedCache.loadPaymentMethods,
    loadAll: unifiedCache.loadAll,
    refreshData: unifiedCache.refreshData,
    invalidateCache: unifiedCache.invalidateCache
  }
}
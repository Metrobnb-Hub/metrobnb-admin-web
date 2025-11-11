/**
 * API Performance Plugin
 *
 * Automatically keeps Render API warm and provides diagnostics
 */

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const { startWarmup, stopWarmup } = useApiWarmup()

  // Start API warmup to prevent cold starts
  if (config.public.apiBaseUrl?.includes('render.com')) {
    startWarmup()

    if (process.dev) {
      console.log('🔥 API warmup started - Render cold starts prevention active')
    }

    // Cleanup on app unmount
    nuxtApp.hook('app:beforeUnmount', () => {
      stopWarmup()
    })
  }

  // Log helpful info in development
  if (process.dev) {
    console.log(`
🚀 API Performance Tools Active

📍 API Base URL: ${config.public.apiBaseUrl}
🔥 Warmup: ${config.public.apiBaseUrl?.includes('render.com') ? 'Active' : 'Disabled'}

Keyboard Shortcuts:
  Ctrl+Shift+D - Run API diagnostics test
  Ctrl+Shift+S - Show API statistics

Available Composables:
  useApiWarmup() - Keep API warm
  useApiDiagnostics() - Performance testing
  useUnifiedCache() - Smart caching
    `)
  }

  // Add keyboard shortcut for stats (Ctrl+Shift+S)
  if (process.client && process.dev) {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        const { analyzeCurrentPerformance, getSuggestions } = useApiDiagnostics()
        const { getCacheStats } = useUnifiedCache()

        console.clear()
        console.log('📊 API Performance Report')

        const stats = analyzeCurrentPerformance()
        const cacheStats = getCacheStats()

        console.log('\n💾 Cache Statistics:')
        console.table([
          { metric: 'LRU Cache Size', value: cacheStats.lruSize },
          { metric: 'Pending Requests', value: cacheStats.pendingRequests },
          { metric: 'Active Controllers', value: cacheStats.activeControllers }
        ])

        console.log('\n📦 Cached Resources:')
        console.table(cacheStats.globalCache)

        const suggestions = getSuggestions(stats)
        if (suggestions.length > 0) {
          console.log('\n💡 Suggestions:')
          suggestions.forEach(s => console.log(s))
        }
      }
    })
  }
})

/**
 * API Warmup - Keeps Render service awake
 *
 * Pings the API every X minutes to prevent cold starts
 * Configurable via environment variables
 */

export const useApiWarmup = () => {
  let warmupInterval: NodeJS.Timeout | null = null
  const config = useRuntimeConfig()

  const pingApi = async () => {
    try {
      await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        timeout: config.public.warmupTimeout || 60000, // Default 60s for Render cold starts
        retry: 0
      })

      if (process.dev) {
        console.log('[API Warmup] Ping successful', new Date().toISOString())
      }
    } catch (error) {
      // Silently fail - don't spam console with expected cold start timeouts
      if (process.dev && !error.message?.includes('timeout')) {
        console.warn('[API Warmup] Ping failed', error.message)
      }
    }
  }

  const startWarmup = () => {
    if (warmupInterval || !config.public.warmupEnabled) return

    const intervalMinutes = config.public.warmupInterval || 10
    const initialDelay = config.public.warmupInitialDelay || 5000

    // Initial ping after delay
    setTimeout(pingApi, initialDelay)

    // Ping every X minutes
    warmupInterval = setInterval(pingApi, intervalMinutes * 60 * 1000)

    if (process.dev) {
      console.log(`[API Warmup] Started - pinging every ${intervalMinutes} minutes`)
    }
  }

  const stopWarmup = () => {
    if (warmupInterval) {
      clearInterval(warmupInterval)
      warmupInterval = null

      if (process.dev) {
        console.log('[API Warmup] Stopped')
      }
    }
  }

  return {
    startWarmup,
    stopWarmup,
    pingApi
  }
}

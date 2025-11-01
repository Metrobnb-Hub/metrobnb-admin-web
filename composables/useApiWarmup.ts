/**
 * API Warmup - Keeps Render service awake
 *
 * Pings the API every 10 minutes to prevent cold starts
 */

export const useApiWarmup = () => {
  let warmupInterval: NodeJS.Timeout | null = null
  const config = useRuntimeConfig()

  const pingApi = async () => {
    try {
      // Use a lightweight endpoint for health check
      // Note: /health endpoint doesn't have /api prefix
      await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        timeout: 5000,
        retry: 0
      })

      if (process.dev) {
        console.log('[API Warmup] Ping successful', new Date().toISOString())
      }
    } catch (error) {
      if (process.dev) {
        console.warn('[API Warmup] Ping failed', error)
      }
    }
  }

  const startWarmup = () => {
    if (warmupInterval) return

    // Initial ping
    pingApi()

    // Ping every 10 minutes (Render spins down after 15 min of inactivity)
    warmupInterval = setInterval(pingApi, 10 * 60 * 1000)

    if (process.dev) {
      console.log('[API Warmup] Started - pinging every 10 minutes')
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

  // Auto-start on client
  if (process.client) {
    onMounted(() => startWarmup())
    onUnmounted(() => stopWarmup())
  }

  return {
    startWarmup,
    stopWarmup,
    pingApi
  }
}

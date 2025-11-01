/**
 * API Performance Diagnostics
 *
 * Helps identify why API calls are slow in production
 */

interface RequestMetrics {
  url: string
  method: string
  startTime: number
  endTime?: number
  duration?: number
  status?: number
  error?: any
  wasRetried?: boolean
  cacheHit?: boolean
}

class ApiDiagnostics {
  private metrics: RequestMetrics[] = []
  private maxMetrics = 100

  recordRequest(url: string, method: string = 'GET'): number {
    const metric: RequestMetrics = {
      url,
      method,
      startTime: Date.now()
    }

    this.metrics.push(metric)

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    return this.metrics.length - 1
  }

  recordResponse(index: number, status: number, cacheHit = false) {
    const metric = this.metrics[index]
    if (metric) {
      metric.endTime = Date.now()
      metric.duration = metric.endTime - metric.startTime
      metric.status = status
      metric.cacheHit = cacheHit
    }
  }

  recordError(index: number, error: any) {
    const metric = this.metrics[index]
    if (metric) {
      metric.endTime = Date.now()
      metric.duration = metric.endTime - metric.startTime
      metric.error = error
    }
  }

  recordRetry(index: number) {
    const metric = this.metrics[index]
    if (metric) {
      metric.wasRetried = true
    }
  }

  getStats() {
    const completed = this.metrics.filter(m => m.duration !== undefined)

    if (completed.length === 0) {
      return {
        totalRequests: 0,
        avgDuration: 0,
        slowestRequest: null,
        fastestRequest: null,
        errorRate: 0,
        cacheHitRate: 0
      }
    }

    const durations = completed.map(m => m.duration!)
    const errors = completed.filter(m => m.error || (m.status && m.status >= 400))
    const cacheHits = completed.filter(m => m.cacheHit)

    const sorted = [...durations].sort((a, b) => a - b)
    const slowest = completed.reduce((prev, curr) =>
      (prev.duration || 0) > (curr.duration || 0) ? prev : curr
    )
    const fastest = completed.reduce((prev, curr) =>
      (prev.duration || 0) < (curr.duration || 0) ? prev : curr
    )

    return {
      totalRequests: completed.length,
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      medianDuration: Math.round(sorted[Math.floor(sorted.length / 2)]),
      slowestRequest: {
        url: slowest.url,
        duration: slowest.duration,
        status: slowest.status
      },
      fastestRequest: {
        url: fastest.url,
        duration: fastest.duration,
        status: fastest.status
      },
      errorRate: Math.round((errors.length / completed.length) * 100),
      cacheHitRate: Math.round((cacheHits.length / completed.length) * 100),
      retriedRequests: completed.filter(m => m.wasRetried).length
    }
  }

  getSlowRequests(threshold = 1000) {
    return this.metrics
      .filter(m => m.duration && m.duration > threshold)
      .map(m => ({
        url: m.url,
        duration: m.duration,
        status: m.status,
        error: m.error
      }))
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
  }

  clear() {
    this.metrics = []
  }

  getRecentMetrics(count = 10) {
    return this.metrics.slice(-count)
  }
}

const diagnostics = new ApiDiagnostics()

export const useApiDiagnostics = () => {
  const testApiPerformance = async () => {
    const config = useRuntimeConfig()
    const results: any[] = []

    console.log('🔍 Starting API Performance Test...')

    // Test 1: Check if API is awake (cold start detection)
    console.log('\n1️⃣ Testing cold start...')
    const coldStartIndex = diagnostics.recordRequest('/health', 'GET')
    try {
      const start = Date.now()
      await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        timeout: 60000 // Allow time for cold start
      }).catch(() => {
        // If /health doesn't exist, try another endpoint
        return $fetch('/api/partners', {
          baseURL: config.public.apiBaseUrl,
          timeout: 60000
        })
      })
      const duration = Date.now() - start

      diagnostics.recordResponse(coldStartIndex, 200)

      results.push({
        test: 'Cold Start Check',
        duration: `${duration}ms`,
        status: duration > 10000 ? '⚠️ SLOW (Render cold start)' : '✅ FAST'
      })

      if (duration > 10000) {
        console.warn(`⚠️ API took ${duration}ms - likely a cold start!`)
        console.log('💡 Tip: Use useApiWarmup() to keep the API awake')
      }
    } catch (error: any) {
      diagnostics.recordError(coldStartIndex, error)
      results.push({
        test: 'Cold Start Check',
        status: '❌ FAILED',
        error: error.message
      })
    }

    // Test 2: Check CORS/Preflight
    console.log('\n2️⃣ Testing CORS overhead...')
    const corsIndex = diagnostics.recordRequest('/api/partners', 'GET')
    try {
      const start = Date.now()
      await $fetch('/api/partners', {
        baseURL: config.public.apiBaseUrl,
        timeout: 10000
      })
      const duration = Date.now() - start

      diagnostics.recordResponse(corsIndex, 200)

      results.push({
        test: 'CORS/Preflight Overhead',
        duration: `${duration}ms`,
        status: duration > 2000 ? '⚠️ HIGH' : '✅ NORMAL'
      })
    } catch (error: any) {
      diagnostics.recordError(corsIndex, error)
      results.push({
        test: 'CORS/Preflight',
        status: '❌ FAILED',
        error: error.message
      })
    }

    // Test 3: Multiple concurrent requests
    console.log('\n3️⃣ Testing concurrent requests...')
    try {
      const start = Date.now()
      await Promise.all([
        $fetch('/api/partners', { baseURL: config.public.apiBaseUrl }),
        $fetch('/api/units', { baseURL: config.public.apiBaseUrl }),
        $fetch('/api/services', { baseURL: config.public.apiBaseUrl })
      ])
      const duration = Date.now() - start

      results.push({
        test: 'Concurrent Requests (3)',
        duration: `${duration}ms`,
        status: duration < 3000 ? '✅ GOOD' : '⚠️ SLOW'
      })
    } catch (error: any) {
      results.push({
        test: 'Concurrent Requests',
        status: '❌ FAILED',
        error: error.message
      })
    }

    // Test 4: Check network latency
    console.log('\n4️⃣ Measuring network latency...')
    const latencies: number[] = []
    for (let i = 0; i < 3; i++) {
      try {
        const start = Date.now()
        await $fetch('/api/partners', {
          baseURL: config.public.apiBaseUrl,
          timeout: 10000
        })
        latencies.push(Date.now() - start)
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait between requests
      } catch (error) {
        // Ignore errors
      }
    }

    if (latencies.length > 0) {
      const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      results.push({
        test: 'Average Network Latency',
        duration: `${avgLatency}ms`,
        status: avgLatency < 500 ? '✅ EXCELLENT' :
                avgLatency < 1000 ? '✅ GOOD' :
                avgLatency < 2000 ? '⚠️ FAIR' : '⚠️ POOR'
      })
    }

    console.log('\n📊 Test Results:')
    console.table(results)

    return results
  }

  const analyzeCurrentPerformance = () => {
    const stats = diagnostics.getStats()

    console.log('\n📈 Current API Performance:')
    console.table([
      { metric: 'Total Requests', value: stats.totalRequests },
      { metric: 'Average Duration', value: `${stats.avgDuration}ms` },
      { metric: 'Median Duration', value: `${stats.medianDuration}ms` },
      { metric: 'Error Rate', value: `${stats.errorRate}%` },
      { metric: 'Cache Hit Rate', value: `${stats.cacheHitRate}%` },
      { metric: 'Retried Requests', value: stats.retriedRequests }
    ])

    if (stats.slowestRequest) {
      console.log('\n🐌 Slowest Request:')
      console.table([stats.slowestRequest])
    }

    const slowRequests = diagnostics.getSlowRequests(1000)
    if (slowRequests.length > 0) {
      console.log('\n⚠️ Slow Requests (>1s):')
      console.table(slowRequests)
    }

    return stats
  }

  const getSuggestions = (stats: any) => {
    const suggestions: string[] = []

    if (stats.avgDuration > 2000) {
      suggestions.push('⚠️ High average response time. Check if API is on Render free tier (cold starts)')
      suggestions.push('💡 Consider using useApiWarmup() to prevent cold starts')
    }

    if (stats.cacheHitRate < 50 && stats.totalRequests > 10) {
      suggestions.push('⚠️ Low cache hit rate. Consider increasing cache TTLs')
      suggestions.push('💡 Use useUnifiedCache() for better caching')
    }

    if (stats.errorRate > 10) {
      suggestions.push('⚠️ High error rate. Check network connection and API status')
    }

    if (stats.retriedRequests > stats.totalRequests * 0.2) {
      suggestions.push('⚠️ Many requests are being retried. Check API reliability')
    }

    return suggestions
  }

  return {
    diagnostics,
    testApiPerformance,
    analyzeCurrentPerformance,
    getSuggestions,
    recordRequest: diagnostics.recordRequest.bind(diagnostics),
    recordResponse: diagnostics.recordResponse.bind(diagnostics),
    recordError: diagnostics.recordError.bind(diagnostics),
    getStats: diagnostics.getStats.bind(diagnostics),
    getSlowRequests: diagnostics.getSlowRequests.bind(diagnostics),
    clear: diagnostics.clear.bind(diagnostics)
  }
}

// Global keyboard shortcut to run diagnostics (Ctrl+Shift+D)
if (process.client && process.dev) {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      const { testApiPerformance, analyzeCurrentPerformance } = useApiDiagnostics()
      console.clear()
      console.log('🔍 Running API Diagnostics...')
      testApiPerformance().then(() => {
        analyzeCurrentPerformance()
      })
    }
  })

  console.log('💡 Press Ctrl+Shift+D to run API diagnostics')
}

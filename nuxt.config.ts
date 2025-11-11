import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  tailwindcss: {
    configPath: './tailwind.config.js'
  },
  experimental: {
    warnOnPageNotFound: false
  },
  typescript: {
    strict: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://metrobnb-api.onrender.com', // Default to production API
      dev: process.env.NODE_ENV === 'development',
      devMode: false, // Will be set by NUXT_PUBLIC_DEV_MODE
      warmupEnabled: process.env.NUXT_PUBLIC_WARMUP_ENABLED !== 'false', // Default enabled
      warmupTimeout: parseInt(process.env.NUXT_PUBLIC_WARMUP_TIMEOUT || '60000'), // 60s default
      warmupInterval: parseInt(process.env.NUXT_PUBLIC_WARMUP_INTERVAL || '10'), // 10 minutes default
      warmupInitialDelay: parseInt(process.env.NUXT_PUBLIC_WARMUP_INITIAL_DELAY || '5000'), // 5s default
    }
  },
  nitro: {
    preset: 'vercel',
  },
  ssr: false,
  app: {
    keepalive: true // Enable keepalive globally
  },
  $fetch: {
    timeout: 90000, // 90 seconds to handle Render cold starts
    retry: 2,
    retryDelay: 1000
  }
})
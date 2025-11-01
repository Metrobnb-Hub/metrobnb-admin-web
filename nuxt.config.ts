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
      testCredentials: {
        admin: { 
          email: '', // Will be set by NUXT_PUBLIC_TEST_ADMIN_EMAIL
          password: '' 
        },
        staff: { 
          email: '', 
          password: '' 
        },
        partner: { 
          email: '', 
          password: '' 
        }
      }
    }
  },
  nitro: {
    preset: 'vercel',
    routeRules: {
      '/.well-known/**': { headers: { 'Access-Control-Allow-Origin': '*' } }
    }
  },
  ssr: true,
  app: {
    keepalive: true // Enable keepalive globally
  },
  $fetch: {
    timeout: 30000,
    retry: 1,
    retryDelay: 1000
  }
})
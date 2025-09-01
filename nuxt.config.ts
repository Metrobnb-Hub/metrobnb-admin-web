import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  experimental: {
    warnOnPageNotFound: false
  },
  typescript: {
    strict: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000', // For compatibility with docs
      dev: process.env.NODE_ENV === 'development'
    }
  },
  nitro: {
    preset: 'vercel',
    routeRules: {
      '/.well-known/**': { headers: { 'Access-Control-Allow-Origin': '*' } }
    }
  },
  ssr: false
})
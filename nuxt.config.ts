import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  typescript: {
    strict: true
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://metrobnb-api.onrender.com'
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
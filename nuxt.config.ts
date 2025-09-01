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
      apiBaseUrl: process.env.API_BASE_URL || 'https://metrobnb-api.onrender.com',
      dev: process.env.NODE_ENV === 'development',
      devMode: process.env.DEV_MODE === 'true',
      testCredentials: {
        admin: { 
          email: process.env.DEV_ADMIN_EMAIL || '', 
          password: process.env.DEV_ADMIN_PASSWORD || '' 
        },
        staff: { 
          email: process.env.DEV_STAFF_EMAIL || '', 
          password: process.env.DEV_STAFF_PASSWORD || '' 
        },
        partner: { 
          email: process.env.DEV_PARTNER_EMAIL || '', 
          password: process.env.DEV_PARTNER_PASSWORD || '' 
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
  ssr: false
})
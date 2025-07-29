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
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  },
  nitro: {
    routeRules: {
      '/.well-known/**': { headers: { 'Access-Control-Allow-Origin': '*' } }
    }
  }
})
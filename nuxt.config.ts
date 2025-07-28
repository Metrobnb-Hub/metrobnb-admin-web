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
  nitro: {
    routeRules: {
      '/.well-known/**': { headers: { 'Access-Control-Allow-Origin': '*' } }
    }
  }
})
const shrinkRay = require('shrink-ray-current')

const cities = require('./api/cities.json')

process.env.WEATHER_API = process.env.WEATHER_API || 'https://www.metaweather.com/'

module.exports = {
  render: {
    http2: {
      push: true
    },
    compressor: shrinkRay() // brotli compression
  },
  modern: true,
  router: {
    middleware: 'check-renderer'
  },
  head: {
    titleTemplate: '%s - Nuxt Weather',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'application-name', content: 'MetaWeather' },
      { name: 'apple-mobile-web-app-title', content: 'MetaWeather' },
      { name: 'theme-color', content: '#000000' },
      { hid: 'description', name: 'description', content: 'Nuxt Weather, just yet another Nuxt.js project' }
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', sizes: '192x192', href: '/icon/icon-192.png' },
      { rel: 'apple-touch-icon', href: '/icon/icon-152.png' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  },
  loading: { color: '#3B8070' },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap'
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': process.env.WEATHER_API
  },
  sitemap: {
    gzip: true,
    hostname: 'https://nuxt-weather.pennec.io',
    routes: cities.map(city => `/weather/${city.toLowerCase()}`),
    xmlNs: 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    filter: ({ routes }) =>
      routes.map(route => {
        if (route.url.startsWith('/weather/')) {
          route.changefreq = 'daily'
        }
        return route
      })
  },
  build: {
    // analyze: true,
    // profile: true,
    optimizeCSS: true,
    parallel: true,
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: [
    '~plugins/filters',
    { src: '~plugins/persistedstate.js', ssr: false }
  ]
}

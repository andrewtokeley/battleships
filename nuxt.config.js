export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'battleships',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  ssr: false,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@assets/css/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  rules: {
    'no-console': 'off'
  },

  env: {
    appTitle: process.env.appTile || 'Battleships - DEV',
    apiKey: process.env.apiKey || 'AIzaSyB74_0nXLcHxDc8-fMjrcd-JxDjhS-cXMQ',
    authDomain: process.env.authDomain || 'battleships-dev.firebaseapp.com',
    projectId: process.env.projectId || 'battleships-dev',
    storageBucket: process.env.storageBucket || 'battleships-dev.appspot.com',
    messagingSenderId: process.env.messagingSenderId || '355250706871',
    appId: process.env.appId || '1:355250706871:web:c36a7571b70becf62af032',
    measurementId: process.env.measurementId || 'G-59141CHXT2'
  }

}

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@nuxt/image",
    "@nuxt/content",
    "@nuxthq/studio",
    "@vueuse/nuxt",

    // quasar
    'nuxt-quasar-ui',
    '@formkit/auto-animate',

  ],
  quasar: { 
    config: {
      brand: {
        primary: 'red',
        secondary: '#26a69a',
        accent: '#9c27b0',

        dark: '#1d1d1d',

        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037'
      }
    },
 },  

  ui: {
    icons: ["heroicons", "lucide"],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "fr",
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased bg-gray-50 dark:bg-black min-h-screen",
      },
    },
  },
  content: {
    highlight: {
      theme: "github-dark",
    },
  },
  googleFonts: {
    display: "swap",
    families: {
      Inter: [400, 500, 600, 700, 800, 900],
    },
  },

  // problem to solve : componant module vue tags input not working on server side

// in nuxt 3, all plugins are automatically loaded from folder /plugins
  plugins: [
    { src: '@/plugins/vue3-tags-input.ts', mode: 'client' },
    // '@/plugins/vue3-tags-input.ts',
],
 build : {
  transpile: [
    '@sipec/vue3-tags-input'
  ]

}
  
});

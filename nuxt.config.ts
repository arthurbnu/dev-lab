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
  'nuxt-quasar-ui',
  '@formkit/auto-animate/nuxt',
  "@morev/vue-transitions/nuxt",
  'nuxt3-leaflet',

 ],

 quasar: { 
   config: {
     brand: {
       primary: 'teal',
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
 },

 content: {
   highlight: {
     theme: "github-dark",
     langs : [
      'sparql',
     ]
   },
 },

 googleFonts: {
   display: "swap",
   families: {
     Inter: [400, 500, 600, 700, 800, 900],
   },
 },

 compatibilityDate: "2024-12-17",
});
<template>
  <NuxtLoadingIndicator color="#14b8a6" />
  <AppNavbar />
  <div class="h-28 max-h-[10vh]"></div>
  <UContainer>
    <NuxtPage />
  </UContainer>
  <div class="h-32"></div>
  <AppFooter />
  
  <UNotifications />

</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
</style>


<script setup lang="ts">
useHead({
  title: 'Portfolio Dev',
  meta: [
    { name: 'description', content: 'Portfolio Dev incroyable...' },
    { name : 'theme-color', content : 'teal'},
    { name : 'robots', content : 'index, follow'},
    { name : 'author', content : 'A B'},
    { name : 'og:image', content : 'https://dev-lab-one.vercel.app/sparql/sparql-vuejs-personnes-wikipedia.png'},
    { name : 'og:url', content : 'https://dev-lab-one.vercel.app/'},
    { name : 'og:type', content : 'website'},
    { name : 'og:title', content : 'Portfolio Dev'},
    { name : 'og:description', content : 'Portfolio Dev'},
    { name : 'google-site-verification', content : 'PHAJkMWsS9my1gW-Q8KTd-WvO2UHfAoMBNZGr7e1L10'} // google search console
  ],
  bodyAttrs: {
    class: "antialiased bg-gray-50 dark:bg-black min-h-screen",
  },
  htmlAttrs: {
    lang: "fr",
    class : 'dark h-full'
  },
  // script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
})
</script>
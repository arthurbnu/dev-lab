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
  title: 'WiQuizz - Quizz dynamiques wikidata et sparql',
  meta: [
    { name: 'description', content: 'Expérimentations et projets de développement sur les données - sparql - wikidata' },
    { name : 'theme-color', content : 'teal'},
    { name : 'robots', content : 'index, follow'},
    { name : 'author', content : 'A B'},
    { property : 'og:image', content : 'https://dev-lab-one.vercel.app/sparql/sparql-vuejs-personnes-wikipedia.png'},
    { property : 'og:url', content : 'https://dev-lab-one.vercel.app/'},
    { property : 'og:type', content : 'website'},
    { property : 'og:title', content : 'WiQuizz - Quizz dynamiques wikidata et sparql'},
    { property : 'og:description', content : 'Expériences et projets de développement sur les données'},
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
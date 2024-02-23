<template>
  <main class="min-h-screen">
    <AppHeader class="mb-6 text-center" :title="quizzContent.title" :description="quizzContent.description" />
    <QuizzRandomSparql 
      :quizz = "quizzContent"
      :data-name = "name"
      :sparqlQuery="sparqlRequest" />
  </main>
</template>

<script setup>

const route = useRoute()
const { name } = route.params
const { data: quizzContent } = await useAsyncData("quizzContent", () =>
  queryContent("/quizz/" + name).findOne()
);
const sparqlRequest = quizzContent.value.body.children[0].props.code
const baseUrl = "https://dev-lab-one.vercel.app" + route.fullPath.split(name)[0]
const img =  quizzContent.value.image ?? "quizz-sparql.png" 
const title = quizzContent.value.title + " - Quizz dynamique wikidata"
const description = "Quizz dynamique généré avec Wikidata et sparql sur le thème : " + quizzContent.value.title

useSeoMeta({
  title: title,
  description: description,
  author: "arthur.brody@bnu.fr",

  ogImage: baseUrl + img,
  ogUrl: baseUrl + name,
  ogTitle: title,
  ogDescription: description,
});

</script>

<style lang="scss" >

[data-name="swift"], [data-name="beatles"]  {

  li:has(img) div {
    background: aliceblue;
  }

}

</style>
<template>
  <main class="min-h-screen">
    <AppHeader class="mb-6 text-center" :title="quizzContent.title" :description="quizzContent.description" />
    <QuizzRandomSparql 
      :quizz = "quizzContent"
      :data-name = "name"
      :nbPics="quizzContent.nbPics" 
      :quizzTemplate="quizzContent.quizzTemplate"
      :sparqlQuery="sparqlRequest" 
      :imageLabel = "quizzContent.imageLabel" 
      :answerLabel="quizzContent.answerLabel"/>
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
const defaultDescription = "Quizz dynamique généré avec Wikidata"
console.log("img",baseUrl  + img, 'url', baseUrl + name)

useSeoMeta({
  title: quizzContent.title, 
  description: quizzContent.description ?? defaultDescription,

  ogImage: baseUrl + img,
  ogUrl: baseUrl + name,
  ogTitle: quizzContent.title,
  ogDescription: quizzContent.description,
});


</script>

<style lang="scss" >

[data-name="swift"], [data-name="beatles"]  {

  li:has(img) div {
    background: aliceblue;
  }

}

</style>
<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />
    <QuizzDrag :picsInit="picsInit"/> 
  </main>
</template>

<script setup>

const title = "Test quizz";
const description = "Sparql | Langage de requête pour les données liées rdf." +
  " Les données de la requête sont issues de wikidata, et complétées par des données de dbpedia et l'api wikipedia.";

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

const picsInit = [
  { src: 'art1.png', answer: 'Arthur', found: false },
  { src: 'art2.png', answer: 'Christophe', found: false },
  { src: 'art3.png', answer: 'Madeleine', found: false },
  { src: 'art4.png', answer: 'Ferdi', found: false },
  { src: 'art5.png', answer: 'Elisa', found: false },
  { src: 'art6.png', answer: 'Kevin', found: false },
  { src: 'art7.png', answer: 'Maël', found: false },
  { src: 'art8.png', answer: 'François', found: false },
  { src: 'art9.png', answer: 'Jimmy', found: false },
  { src: 'art10.png', answer: 'Mathilde', found: false },
]

</script>
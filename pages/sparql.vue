<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />

    <div class="space-y-4 text-center">
      <span v-for="(tag, id) in tags" :key="id" 
      class = "bg-teal-600 text-white px-1 mr-1 inline-block hover:bg-teal-800 transition-all" >
        {{ tag }}
      </span>
    </div>

    <OctantView />
  </main>
</template>

<script setup>
import OctantView from '~/components/App/OctantView.vue';

const description = "Sparql | Langage de requête pour les données liées rdf." +
" Les données de la requête sont issues de wikidata, et complétées par des données de dbpedia et l'api wikipedia.";
const title  = "Recherche sparql wikidata avec VueJs";

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

const tags = [
  "vuejs",
  "sparql",
  "wikipedia",
  "rdf",
  "dbpedia",
  "wikidata", 
  "api",
  "sparql query",
];


</script>

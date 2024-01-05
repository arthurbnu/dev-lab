<template>
  <main class="min-h-screen">
    <AppHeader class="mb-2 text-center" :title="title" :description="description" />

    <div class="space-y-4">
      <AppTag v-for="(tag, id) in tags" :key="id" :tag="tag" />
    </div>

    <OctantView />
  </main>
</template>

<script setup>
import OctantView from '~/components/App/OctantView.vue';

const description = "Sparql | Langage de requête pour les données liées rdf." +
" Les données de la requête sont issues de wikidata, et complétées par des données de dbpedia et l'api wikidata.";
const title  = "Recherche sparql wikidata avec VueJs";

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

const tags = [
  "vuejs",
  "sparql",
  "wikidata",
  "rdf",
  "dbpedia",
  "wikidata api",
  "sparql query",
  "sparql query wikidata",
  "sparql query dbpedia",
  "sparql query wikidata api",
  "sparql query vuejs",
];


</script>

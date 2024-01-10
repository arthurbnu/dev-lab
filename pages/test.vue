<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />

    <div class="space-y-4 text-center">
      <span v-for="(tag, id) in tags" :key="id" 
      class = "bg-teal-800 text-white px-1 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950" >
        {{ tag }}
      </span>
    </div>
    <button v-if="!ready" @click="ready = true">Click to lazy load Octant component</button>
    <LazyAppOctantView v-if="ready"/>
<ul >
  <transition-fade group>
    <li
      v-for="item in items"
      :key="item"
      @click="removeItem(item)"
    >

      {{ item }}
    </li>
  </transition-fade>
  </ul>
  </main>
</template>

<script setup>

import { ref, watchEffect, onMounted } from 'vue'

// test v auto animate
const items = ref(["😏","😐","😑","😒","😕" ])
function removeItem(toRemove) {
  items.value = items.value.filter((item) => item !== toRemove)
}

const ready= ref(false)
const mounted= ref(false)

watchEffect(() => {
  if (process.client && mounted.value) {
    console.log('client')
    ready.value = true
  }
})

    onMounted(async() => {
        await nextTick()
mounted.value=true
    });

const title  = "Recherche sparql avec VueJs";
const description = "Sparql | Langage de requête pour les données liées rdf." +
" Les données de la requête sont issues de wikidata, et complétées par des données de dbpedia et l'api wikipedia.";

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

const tags = [
  "sparql",
  "wikipedia",
  "dbpedia",
  "wikidata", 
  "rdf",
  "api",
  "vuejs",
  "nuxt",
];


</script>
<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" >
      <transition-fade :duration="500">
        <p class = "m-4 opacity-70 text-justify" v-if = "ready">
          <i>
            Les données de la requête <a href="https://fr.wikipedia.org/wiki/SPARQL" v-bind="linkParams">sparql</a>
              (personnes célèbres ayant une page wikipedia en français)
            sont issues de <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" v-bind="linkParams" >wikidata</a>
            , puis complétées par <a href="https://fr.dbpedia.org/" v-bind="linkParams">dbpedia</a> (images) 
            et <a href="https://fr.wikipedia.org/" v-bind="linkParams">wikipedia</a> (infobox).
          </i>
        </p>
      </transition-fade>
    </AppHeader>
      <transition-scale group tag = "div" class = "space-y-4 text-center"  :delay="200">
        <span v-for="(tag, id) in shownTags" :key="id"  
        class = "bg-teal-800 text-white px-3 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950" >
        {{ tag }}
      </span>
    </transition-scale>
    <AppOctantView v-if = "show"/>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'

const ready = ref(false)
const show = ref(false)
const title  = "Recherche wikidata avec sparql";
const description = "Exemple d'interrogation de la base Wikidata à l'aide du langage sparql";

const linkParams = {
  target: "_blank",
  class: "text-teal-500"
}

onMounted(() => {
  ready.value = true
  for (let i = 0; i < tags.length; i++) {
    setTimeout(() => {
      shownTags.value.push(tags[i])
    }, 50 * i);
  }
  setTimeout(() => {
    show.value = true
  }, 50 * tags.length);
})

useSeoMeta({
  title: title,
  description,
  author: "A B",
  ogImage: "https://dev-lab-one.vercel.app/sparql/sparql-vuejs-personnes-wikipedia.png",
  ogUrl: "https://dev-lab-one.vercel.app/sparql",
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});

const tags = ['sparql',
  "wikipedia",
  "dbpedia",
  "wikidata", 
  "rdf",
  "api",
  "vuejs",
];

const shownTags = ref([])

</script>